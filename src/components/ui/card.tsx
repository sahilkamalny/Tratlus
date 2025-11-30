import { useDelegatedComponentEventHandler } from "@/sdk/core/internal/creao-shell";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Card({
	className,
	id,
	name,
	onClick,
	...props
}: React.ComponentProps<"div"> & {
	id?: string;
	name?: string;
}) {
	const handleClick = useDelegatedComponentEventHandler(onClick, () => ({
		componentType: "card",
		eventType: "click",
		componentInfo: {
			id,
			name,
		},
	}));

	return (
		<div
			data-slot="card"
			id={id}
			data-name={name}
			onClick={handleClick}
			className={cn(
				"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({
	className,
	id,
	name,
	onClick,
	...props
}: React.ComponentProps<"div"> & {
	id?: string;
	name?: string;
}) {
	const handleClick = useDelegatedComponentEventHandler(onClick, () => ({
		componentType: "card-header",
		eventType: "click",
		componentInfo: {
			id,
			name,
		},
	}));
	return (
		<div
			data-slot="card-header"
			id={id}
			data-name={name}
			onClick={handleClick}
			className={cn(
				"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({
	className,
	id,
	name,
	onClick,
	...props
}: React.ComponentProps<"div"> & {
	id?: string;
	name?: string;
}) {
	const handleClick = useDelegatedComponentEventHandler(onClick, () => ({
		componentType: "card-title",
		eventType: "click",
		componentInfo: {
			id,
			name,
		},
	}));
	return (
		<div
			data-slot="card-title"
			id={id}
			data-name={name}
			onClick={handleClick}
			className={cn("leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function CardDescription({
	className,
	id,
	name,
	onClick,
	...props
}: React.ComponentProps<"div"> & {
	id?: string;
	name?: string;
}) {
	const handleClick = useDelegatedComponentEventHandler(onClick, () => ({
		componentType: "card-description",
		eventType: "click",
		componentInfo: {
			id,
			name,
		},
	}));
	return (
		<div
			data-slot="card-description"
			id={id}
			data-name={name}
			onClick={handleClick}
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function CardAction({
	className,
	id,
	name,
	onClick,
	...props
}: React.ComponentProps<"div"> & {
	id?: string;
	name?: string;
}) {
	const handleClick = useDelegatedComponentEventHandler(onClick, () => ({
		componentType: "card-action",
		eventType: "click",
		componentInfo: {
			id,
			name,
		},
	}));
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			onClick={handleClick}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-6", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};
