import * as ProgressPrimitive from "@radix-ui/react-progress";
import type * as React from "react";

import { useDelegatedComponentEventHandler } from "@/sdk/core/internal/creao-shell";

import { cn } from "@/lib/utils";

function Progress({
	className,
	value,
	id,
	onAnimationStart,
	onAnimationEnd,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
	id?: string;
}) {
	const handleAnimationStart = useDelegatedComponentEventHandler(
		onAnimationStart,
		() => ({
			componentType: "progress",
			eventType: "animation-start",
			componentInfo: {
				id,
				value,
			},
		}),
	);

	const handleAnimationEnd = useDelegatedComponentEventHandler(
		onAnimationEnd,
		() => ({
			componentType: "progress",
			eventType: "animation-end",
			componentInfo: {
				id,
				value,
			},
		}),
	);
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			id={id}
			onAnimationStart={handleAnimationStart}
			onAnimationEnd={handleAnimationEnd}
			className={cn(
				"bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className="bg-primary h-full w-full flex-1 transition-all"
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress };
