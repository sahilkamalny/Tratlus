import { reportError } from "@/sdk/core/internal/creao-shell";
import { AlertTriangle } from "lucide-react";
import React, { useReducer, type JSX } from "react";
import { ScrollArea } from "./ui/scroll-area";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
	errorInfo?: React.ErrorInfo;
}

type ErrorBoundaryProps = JSX.IntrinsicElements["div"] & {
	tagName: "div" | "main";
	children: React.ReactNode;
};

// using singleton. maybe not cool but works IF ONLY ONE ERROR BOUNDARY IS USED AT A TIME
let normalContainer: HTMLDivElement | null = null;
let clonedStage: HTMLDivElement | null = null;

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error) {
		clonedStage = normalContainer?.cloneNode(true) as HTMLDivElement;
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		this.setState({ hasError: true, error, errorInfo });
	}

	applyClonedContent = (target: HTMLDivElement | null) => {
		if (!clonedStage || !target) return;
		for (const node of clonedStage.childNodes) target.appendChild(node);
		reportError(this.state.error, {});
	};

	render() {
		const { tagName: Container, children, ...props } = this.props;

		if (this.state.hasError) {
			return (
				<>
					<Container
						{...props}
						ref={this.applyClonedContent}
						className={`filter-[grayscale(0.8)] ${props.className || ""}`}
					/>
					<ErrorMask
						error={this.state.error}
						errorInfo={this.state.errorInfo}
					/>
				</>
			);
		}
		return (
			<Container
				{...props}
				ref={(e) => {
					normalContainer = e;
				}}
			>
				{children}
			</Container>
		);
	}
}

function ErrorMask(props: {
	error: Error | undefined;
	errorInfo: React.ErrorInfo | undefined;
}) {
	const [isCollapsed, toggleCollapsed] = useReducer((state) => !state, false);

	return (
		<>
			<div
				className={`fixed z-10000 inset-0 flex items-center justify-center p-8 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 transition-opacity ${!isCollapsed ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
			>
				<div className="text-white text-center flex flex-col gap-4 p-4 max-w-lg rounded-lg bg-black/70">
					<AlertTriangle className="w-10 h-10 mx-auto" />
					<h1 className="text-2xl font-bold">Something went wrong</h1>

					<div className="text-sm whitespace-pre-wrap">
						{props.error?.message}
					</div>

					<ScrollArea className="h-40 w-full">
						<pre className="text-sm whitespace-pre-wrap text-red-500 text-left">
							{props.errorInfo?.componentStack || props.error?.stack}
						</pre>
					</ScrollArea>

					<div className="flex items-center gap-2 mx-auto">
						<button
							className="bg-white text-black px-4 py-2 rounded-md"
							type="button"
							onClick={() => {
								window.location.reload();
							}}
						>
							Reload
						</button>
						<button
							className="bg-white text-black px-4 py-2 rounded-md"
							type="button"
							onClick={toggleCollapsed}
						>
							Close
						</button>
					</div>
				</div>
			</div>

			<div
				className={`fixed left-0 top-0 w-full flex items-center gap-4 flex-wrap bg-black/70 p-4 ${isCollapsed ? "translate-y-0" : "translate-y-[-100%]"} transition-all duration-200`}
			>
				<div className="text-yellow-300 font-bold flex items-center gap-2">
					<AlertTriangle className="w-6 h-6" />
					Page is not working
				</div>
				<div className="text-white"> {props.error?.message} </div>
				<button
					className="ml-auto bg-white text-black px-4 py-2 rounded-md"
					type="button"
					onClick={toggleCollapsed}
				>
					Details
				</button>
			</div>
		</>
	);
}
