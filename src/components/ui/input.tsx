import type * as React from "react";
import { useRef } from "react";

import { useDelegatedComponentEventHandler } from "@/sdk/core/internal/creao-shell";

import { cn } from "@/lib/utils";

function Input({
	className,
	type,
	onChange,
	onBlur,
	onFocus,
	onKeyDown,
	onKeyUp,
	...props
}: React.ComponentProps<"input">) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = useDelegatedComponentEventHandler(
		onChange,
		() => ({
			componentType: "input",
			eventType: "change",
			componentInfo: {
				id: props.id,
				name: props.name,
				type,
				value: inputRef.current?.value,
			},
		}),
		inputRef.current,
	);

	const handleBlur = useDelegatedComponentEventHandler(
		onBlur,
		() => ({
			componentType: "input",
			eventType: "blur",
			componentInfo: {
				id: props.id,
				name: props.name,
				type,
				value: inputRef.current?.value,
			},
		}),
		inputRef.current,
	);

	const handleFocus = useDelegatedComponentEventHandler(
		onFocus,
		() => ({
			componentType: "input",
			eventType: "focus",
			componentInfo: {
				id: props.id,
				name: props.name,
				type,
				value: inputRef.current?.value,
			},
		}),
		inputRef.current,
	);

	const handleKeyDown = useDelegatedComponentEventHandler(
		onKeyDown,
		() => ({
			componentType: "input",
			eventType: "keydown",
			componentInfo: {
				id: props.id,
				name: props.name,
				type,
				key: inputRef.current?.value,
				value: inputRef.current?.value,
			},
		}),
		inputRef.current,
	);

	const handleKeyUp = useDelegatedComponentEventHandler(
		onKeyUp,
		() => ({
			componentType: "input",
			eventType: "keyup",
			componentInfo: {
				id: props.id,
				name: props.name,
				type,
				key: inputRef.current?.value,
				value: inputRef.current?.value,
			},
		}),
		inputRef.current,
	);

	return (
		<input
			ref={inputRef}
			type={type}
			data-slot="input"
			onChange={handleChange}
			onBlur={handleBlur}
			onFocus={handleFocus}
			onKeyDown={handleKeyDown}
			onKeyUp={handleKeyUp}
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
				"aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
