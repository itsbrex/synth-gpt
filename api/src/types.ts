export interface Chat {
	chatId: string;
	title: string;
	userId: string;
	messages: ChatMessage[];
	createdTime: number;
	updatedTime: number;
}

export type ChatWithoutMessages = Omit<Chat, "messages">;

export type RoleType = "system" | "user" | "assistant" | "function";

export interface MessageSegment {
	message: ChatMessage;
	isLastSegment: boolean;
}

export interface ChatMessage {
	id: string;
	role: RoleType;
	attachments: Attachment[],
	content: Content,
	timestamp: number;
}

type AttachmentType = "File" | "CodeSnippet";

export interface Attachment {
	id: string;
	type: AttachmentType;
}

export interface FileAttachment extends Attachment {
	file: AttachedFile;
}

export interface CodeAttachment extends Attachment {
	content: CodeSnippet;
}

export interface AttachedFile {
	name: string;
	contentType: string;
	contents: string;
	extension: string;
	size: number;
}

export interface CodeSnippet {
	language: string;
	code: string;
}

export type ContentType = "text" | "webActivity" | "functionResult";

export interface Content {
	type: ContentType;
	value: string | WebActivity | FunctionResult;
}

export type WebBrowsingStateType = "searching" | "readingResults" | "finished";

export interface WebActivity {
	searchTerm: string;
	currentState: WebBrowsingStateType;
	actions: BaseWebBrowsingAction[];
}

export interface BaseWebBrowsingAction {
	type: WebBrowsingStateType;
}

export interface SearchingWebAction extends BaseWebBrowsingAction {
	type: "searching";
	searchTerm: string;
}

export interface ReadingWebSearchResultsAction extends BaseWebBrowsingAction {
	type: "readingResults";
	results: WebSearchResult[];
}

export interface WebSearchResult {
	name: string;
	url: string;
	isFamilyFriendly: boolean;
	snippet: string;
}

export interface FunctionResult {
	name: string;
	result: string;
}

export interface WebSocketToken {
	tokenId: string;
	userId: string;
	connectionId?: string;
	createdTime: number;
	expiryTime: number;
	claimedTime?: number;
	timeToLive: number;
}

export type WebSocketMessageType = "assistantMessageSegment" | "assistantAudioSegment";

export interface WebSocketMessage {
	type: WebSocketMessageType;
	payload: BaseWebSocketMessagePayload;
}

export interface BaseWebSocketMessagePayload {
	chatId: string;
}

