import type * as React from "react";
import { useCallback } from "react";

import { cn } from "@/lib/utils";
import { useDelegatedComponentEventHandler } from "@/sdk/core/internal/creao-shell";

function Table({
	className,
	id,
	onClick,
	...props
}: React.ComponentProps<"table"> & { id?: string }) {
	const handleClick = useDelegatedComponentEventHandler(onClick, () => ({
		componentType: "table",
		eventType: "click",
		componentInfo: {
			id,
		},
	}));
	return (
		<div
			data-slot="table-container"
			className="relative w-full overflow-x-auto"
		>
			<table
				id={id}
				data-slot="table"
				className={cn("w-full caption-bottom text-sm", className)}
				onClick={handleClick}
				{...props}
			/>
		</div>
	);
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
	return (
		<thead
			data-slot="table-header"
			className={cn("[&_tr]:border-b", className)}
			{...props}
		/>
	);
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
	return (
		<tbody
			data-slot="table-body"
			className={cn("[&_tr:last-child]:border-0", className)}
			{...props}
		/>
	);
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
	return (
		<tfoot
			data-slot="table-footer"
			className={cn(
				"bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
				className,
			)}
			{...props}
		/>
	);
}

function TableRow({
	className,
	id,
	onClick,
	...props
}: React.ComponentProps<"tr"> & { id?: string }) {
	const handleClick = useDelegatedComponentEventHandler(onClick, () => ({
		componentType: "table-row",
		eventType: "click",
		componentInfo: {
			id,
		},
	}));
	return (
		<tr
			id={id}
			data-slot="table-row"
			className={cn(
				"hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
				className,
			)}
			onClick={handleClick}
			{...props}
		/>
	);
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
	return (
		<th
			data-slot="table-head"
			className={cn(
				"text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className,
			)}
			{...props}
		/>
	);
}

function TableCell({
	className,
	id,
	onClick,
	...props
}: React.ComponentProps<"td"> & { id?: string }) {
	const handleClick = useDelegatedComponentEventHandler(onClick, () => ({
		componentType: "table-cell",
		eventType: "click",
		componentInfo: {
			id,
		},
	}));
	return (
		<td
			id={id}
			data-slot="table-cell"
			className={cn(
				"p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
				className,
			)}
			onClick={handleClick}
			{...props}
		/>
	);
}

function TableCaption({
	className,
	...props
}: React.ComponentProps<"caption">) {
	return (
		<caption
			data-slot="table-caption"
			className={cn("text-muted-foreground mt-4 text-sm", className)}
			{...props}
		/>
	);
}

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
};
