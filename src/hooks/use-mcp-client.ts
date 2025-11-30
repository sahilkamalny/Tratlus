// this file is just for backward compatibility
// use { callMCPTool, listMCPTools } from "@/sdk/core/mcp-client" instead

import { callMCPTool, listMCPTools } from "@/sdk/core/mcp-client";
export type {
	MCPRequest,
	MCPResponse,
	MCPToolResponse,
} from "@/sdk/core/mcp-client";

export function useMCPClient() {
	return {
		callTool: callMCPTool,
		listTools: listMCPTools,
	};
}
