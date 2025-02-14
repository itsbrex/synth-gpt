import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import Attach from "./Attach";
import ChatLog from "./ChatLog";
import HeroSection from "../../../components/HeroSection";
import SpeechToText from "./SpeechToText";
import TypingIndicator from "../../../components/TypingIndicator";
import useAudioPlayer from "../hooks/useAudioPlayer";
import useAuth from "../../auth/hooks/useAuth";
import useWebSocket from "../hooks/useWebSocket";
import { addOrUpdateMessage } from "../chatSlice";
import { useCreateWsTokenMutation } from "../../auth/authApi";
import { RootStateType } from "../../../store";

const Chat = () => {
	const dispatch = useDispatch();
	const { userId, accessToken } = useAuth();
	const { queueAudio } = useAudioPlayer();

	const { chatId, attachments, messages } = useSelector(
		(state: RootStateType) => state.chat
	);
	const [isAwaitingAudio, setIsAwaitingAudio] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const [createWsToken, { data: createWsTokenResponse }] =
		useCreateWsTokenMutation();

	useEffect(() => {
		if (userId && accessToken) {
			createWsToken({ userId, accessToken });
		}
	}, [userId, accessToken]);

	useEffect(() => {
		const tokenId = createWsTokenResponse?.tokenId;
		if (tokenId) {
			connect(tokenId);
		}
		return () => {
			disconnect();
		};
	}, [createWsTokenResponse]);

	useEffect(() => {
		scrollTo(scrollToTargetRef.current);
	}, [messages]);

	const onTranscriptionEnded = (transcript: string) => {
		const message = buildMessage(transcript, attachments);
		setIsAwaitingAudio(true);
		dispatch(addOrUpdateMessage({ message }));
		send({
			type: "userMessage" as const,
			payload: {
				userId,
				chatId,
				message,
			} as MessagePayload,
		});
	};

	const buildMessage = (transcript: string, attachments: Attachment[]): ChatMessage => {
		return {
			id: uuidv4(),
			role: "user",
			attachments,
			content: {
				type: "text",
				value: transcript,
			},
			timestamp: Date.now(),
		};
	};

	const onMessageReceived = ({ type, payload }: WebSocketMessage) => {
		switch (type) {
			case "assistantMessageSegment":
				processMessageSegmentPayload(payload as MessageSegmentPayload);
				break;

			case "assistantAudioSegment":
				processAudioSegmentPayload(payload as AudioSegmentPayload);
				break;
		}
	};

	const onConnectionClosed = (event: CloseEvent) => {
		const normalClosureCode = 1000;
		if (event.code !== normalClosureCode) {
			if (userId && accessToken) {
				createWsToken({ userId, accessToken });
			}
		}
	};

	const processMessageSegmentPayload = (payload: MessageSegmentPayload) => {
		const { message, isLastSegment } = payload;

		setIsTyping(false);
		if (typingIndicatorTimerRef.current) {
			clearTimeout(typingIndicatorTimerRef.current);
		}

		if (!isLastSegment) {
			typingIndicatorTimerRef.current = setTimeout(() => {
				setIsTyping(true);
			}, 1500);
		}
		dispatch(
			addOrUpdateMessage({
				message,
			})
		);
	};

	const processAudioSegmentPayload = (payload: AudioSegmentPayload) => {
		setIsAwaitingAudio(false);
		queueAudio(payload.audioSegment);
	};

	const scrollTo = (target: HTMLDivElement | null) => {
		target?.scrollIntoView({
			behavior: "smooth",
			block: "end",
			inline: "nearest",
		});
	};

	const typingIndicatorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);

	const scrollToTargetRef = useRef<HTMLDivElement>(null);

	const { connect, send, disconnect } = useWebSocket({
		onMessageReceived,
		onConnectionClosed,
	});

	return (
		<>
			{messages.length === 0 && attachments.length === 0 && <HeroSection />}

			<div className="flex flex-col w-full mb-[100px]">
				<ChatLog />
				{isTyping && <TypingIndicator className="flex ml-6 -mt-8" />}
			</div>

			<div ref={scrollToTargetRef} data-testid="scroll-target"></div>

			<div className="fixed sm:left-[256px] bottom-0 w-full sm:w-[calc(100vw-256px)] overflow-y-hidden">
				<div className="flex flex-col left-0 items-center mb-4">
					{isAwaitingAudio ? (
						<div className="relative bg-slate-900 rounded-full p-2">
							<div className="loader w-[70px] h-[70px] rounded-full z-50"></div>
						</div>
					) : (
						<>
							<SpeechToText onTranscriptionEnded={onTranscriptionEnded} />
							<Attach />
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Chat;
