import { throttle } from "lodash";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type {
	IFrameErrorMessage,
	IFrameMessage,
	IFrameUIEventMessage,
} from "./internal-types";

const REACT_SOURCE_KEY = Symbol.for("react.source");

function getSourceFromElement(
	element: HTMLElement | null | undefined,
): IFrameErrorMessage["source"] {
	// biome-ignore lint/suspicious/noExplicitAny: hard to type
	let el: any = element;
	let source:
		| { fileName: string; lineNumber: number; columnNumber: number }
		| undefined;
	for (; !source && el; el = el.parentElement) {
		const reactPropsKey = Object.keys(el).find((key) =>
			key.startsWith("__reactProps$"),
		);
		if (!reactPropsKey) continue;
		const sourceFn = el[reactPropsKey]?.[REACT_SOURCE_KEY];
		if (typeof sourceFn === "function") source = sourceFn();
		if (source?.fileName.includes("/components/ui/")) source = undefined; // skip shadcn
	}
	if (!source || !el) return;

	let filePath = source.fileName;
	const splitSince = filePath.indexOf("/src/");
	if (splitSince !== -1) {
		filePath = filePath.slice(splitSince);
	}

	return {
		filePath,
		line: source.lineNumber,
		column: source.columnNumber,
	};
}

/**
 * @example
 * const handleClick = useDelegatedComponentEventHandler(
 *   props.onClick, // original callback, can be null or undefined
 *   () => ({
 *   	componentType: "button",
 *   	eventType: "click",
 *   	componentInfo: {
 *   		variant,
 *   		componentProps: { variant, className, size, disabled: !!disabled },
 *   	},
 *   }),
 *   // third argument "element" is optional. only if the event handler is not accepting a { currentTarget: HTMLElement }
 * );
 */
export function useDelegatedComponentEventHandler<T extends unknown[]>(
	callback: ((...args: T) => void) | null | undefined,
	infoGetter: (
		...args: T
	) => Pick<
		IFrameErrorMessage,
		"componentInfo" | "componentType" | "eventType"
	>,
	element?: HTMLElement | null,
) {
	const lastInfoGetter = useRef(infoGetter);
	lastInfoGetter.current = infoGetter;

	const lastCallback = useRef(callback);
	lastCallback.current = callback;

	const lastElement = useRef(element);
	lastElement.current = element;

	const delegatedCallback = useCallback((...args: T) => {
		if (typeof lastCallback.current !== "function") return;

		const event = args[0];
		let element =
			typeof event === "object" && event !== null && "currentTarget" in event
				? (event.currentTarget as HTMLElement)
				: null;
		if (!element || !(element instanceof HTMLElement))
			element = lastElement.current || null;
		if (!element || !(element instanceof HTMLElement))
			element = window.event?.target as HTMLElement;
		if (!(element instanceof HTMLElement)) element = null;

		const info = lastInfoGetter.current(...args);

		const reportErrorAndRethrow = (error: unknown) => {
			reportElementError(element, error, info);
			throw error;
		};

		try {
			reportUIElementEvent(element, info);

			// biome-ignore lint/suspicious/noExplicitAny: hard to type
			const ans = lastCallback.current(...args) as any;
			if (ans instanceof Promise) ans.catch(reportErrorAndRethrow);
		} catch (error) {
			reportErrorAndRethrow(error);
		}
	}, []);

	return delegatedCallback;
}

function reportUIElementEvent(
	element: HTMLElement | null,
	info: Partial<IFrameUIEventMessage>,
) {
	const report: IFrameUIEventMessage = {
		type: "ui-event",
		timestamp: Date.now().toString(),
		...info,
		source: getSourceFromElement(element),
	};

	reportToParentWindow(report);
}

/**
 * Report UI element error to parent window
 */
export function reportElementError(
	element: HTMLElement | null,
	error: unknown,
	info?: Partial<IFrameErrorMessage>,
) {
	// Get error details
	const errorObj = error instanceof Error ? error : new Error(String(error));

	const errorReport: IFrameErrorMessage = {
		type: "error",
		timestamp: Date.now().toString(),
		error: {
			message: String(error),
			stack: errorObj.stack,
		},
		source: getSourceFromElement(element),
		...info,
	};

	// Send report to parent window
	reportToParentWindow(errorReport);
	console.log("Element error, reporting to parent:", errorReport);

	return errorReport;
}

export function reportError(
	error: unknown,
	info?: Partial<IFrameErrorMessage>,
) {
	const errorObj = error instanceof Error ? error : new Error(String(error));
	const errorReport: IFrameErrorMessage = {
		type: "error",
		timestamp: Date.now().toString(),
		error: {
			message: String(error),
			stack: errorObj.stack,
		},
		...info,
	};

	reportToParentWindow(errorReport);
	console.log("Error, reporting to parent:", errorReport);
	return errorReport;
}

window.addEventListener("unhandledrejection", (event) => {
	reportError(event.reason, { eventType: "window.unhandledrejection" });
});

window.addEventListener("error", (event) => {
	reportError(event.error, { eventType: "window.error" });
});

/**
 * Hook for reporting messages to parent window
 * @returns Object with report function to send messages to parent window
 */
export function useReportToParentWindow() {
	const messageQueue = useRef<IFrameMessage[]>([]);
	const throttledReport = useMemo(
		() =>
			throttle(() => {
				const parentWindow = window.parent;
				if (parentWindow === window || messageQueue.current.length === 0) {
					return;
				}
				for (const message of messageQueue.current) {
					parentWindow.postMessage(
						{
							...message,
							timestamp: Date.now(),
						},
						"*",
					);
				}
				messageQueue.current = [];
			}, 200),
		[],
	);

	// Queue a message to be sent to parent window
	const reportParent = useCallback(
		(message: IFrameMessage) => {
			messageQueue.current.push(message);
			throttledReport();
		},
		[throttledReport],
	);

	useEffect(() => {
		return () => {
			throttledReport.flush();
		};
	}, [throttledReport]);

	return { reportParent };
}

/**
 * Utility function to directly send a message to parent window
 * @param message Message to send to parent window
 */
export function reportToParentWindow(message: IFrameMessage): void {
	const parentWindow = window.parent;
	if (parentWindow === window) {
		return;
	}

	parentWindow.postMessage(
		{
			...message,
			timestamp: Date.now(),
		},
		"*",
	);
}
