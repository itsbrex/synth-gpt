import { Handler } from "aws-lambda";
import UserMessageProcessor from "@services/UserMessageProcessor";

export const main: Handler = async (event) => {
	console.time("processUserMessage");

	try {
		const userMessageProcessor = new UserMessageProcessor();
		await userMessageProcessor.process(event);

	} catch (error) {
		console.log(error, { level: "error" });
	}
	finally {
		console.timeEnd("processUserMessage");
	}
};
