import { getAuthTokenAsync } from "./auth";
import { reportToParentWindow } from "./internal/creao-shell";

const API_BASE_PATH = import.meta.env.VITE_MCP_API_BASE_PATH;

/**
 * a simple wrapper for `fetch` with authentication token and error handling
 */
export async function platformRequest(
	url: string | URL | Request,
	options: RequestInit = {},
): Promise<Response> {
	const token = await getAuthTokenAsync();
	const method = options.method || "GET";

	const headers = new Headers(options.headers);
	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}
	if (typeof url === 'object' && url && 'headers' in url) {
		url.headers?.forEach?.((value, key) => {
			headers.set(key, value);
		});
	}
	if (!headers.has("Content-Type") && method !== "GET") {
		headers.set("Content-Type", "application/json");
	}

	const realUrl = typeof url === "string" ? new URL(url, API_BASE_PATH) : url;
	const response = await fetch(realUrl, {
		...options,
		headers,
	});

	// TODO: check response status and throw error if not 200
	reportToParentWindow({
		type: "platform-request",
		timestamp: new Date().toISOString(),
		url: response.url,
		method,
		status: response.status,
		responseHeaders: Object.fromEntries(response.headers.entries()),
	})

	return response;
}

/**
 * simpler wrapper for `platformRequest` with common methods
 *
 * eg: `platformApi.get("/api/users").then(r=>r.json())`
 */
export const platformApi = {
	get: async (url: string, options?: RequestInit) => {
		return platformRequest(url, { ...options, method: "GET" });
	},

	post: async (url: string, data?: unknown, options?: RequestInit) => {
		return platformRequest(url, {
			...options,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	put: async (url: string, data?: unknown, options?: RequestInit) => {
		return platformRequest(url, {
			...options,
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
			body: data ? JSON.stringify(data) : undefined,
		});
	},

	delete: async (url: string, options?: RequestInit) => {
		return platformRequest(url, { ...options, method: "DELETE" });
	},
};
