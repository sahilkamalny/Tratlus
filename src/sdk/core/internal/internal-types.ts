/**
 * defines all messages from iframe to parent window
 */

export type IFrameMessage =
	| IFrameErrorMessage //
	| IFrameMCPMessage //
	| IFramePlatformRequestMessage //
	| IFrameUIEventMessage;

/** a error */
export interface IFrameErrorMessage {
	type: "error";
	timestamp: string; // new Date().toISOString()

	error: IFrameError;
	source?: IFrameSource;

	mcpRequest?: IFrameMCPRequest;
	componentType?: string; // eg: "Button"
	componentInfo?: Record<string, unknown>;
	eventType?: string; // eg: "click"
}

/** a successful mcp request */
export interface IFrameMCPMessage {
	type: "mcp";
	// timestamp: string; // new Date().toISOString()

	// mcpRequest: IFrameMCPRequest;
	// mcpResponse: Record<string, unknown>;

	[key: string]: unknown; // FIXME: unused - clean existing code later!
}

/** a platform request */
export interface IFramePlatformRequestMessage {
	type: "platform-request";
	timestamp: string; // new Date().toISOString()

	url: string;
	method: string;
	status: number;
	responseHeaders: Record<string, string>;
}

/** a ui event */
export interface IFrameUIEventMessage {
	type: "ui-event";
	timestamp: string; // new Date().toISOString()

	componentType?: string; // eg: "Button"
	eventType?: string; // eg: "click"
	source?: IFrameSource;
}

type IFrameError = {
	message: string;
	stack?: string;
};

type IFrameMCPRequest = {
	serverUrl: string;
	method: string;
	url: string;
	transportType: string;
	params?: unknown;
};

type IFrameSource = {
	filePath: string; // eg: "/src/foo.tsx"
	line?: number; // eg: 10
	column?: number; // eg: 12
};
