import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import * as React from "react";
import { useCallback } from "react";
import {
	type DayButton,
	DayPicker,
	getDefaultClassNames,
} from "react-day-picker";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	reportElementError,
	useDelegatedComponentEventHandler,
} from "@/sdk/core/internal/creao-shell";

/**
 * Calendar component using react-day-picker
 *
 * IMPORTANT: When using date-fns format() with this component:
 * - Use 'DDD' for day of year (1-366), NOT 'D' (which is deprecated)
 * - Use 'd' for day of month (1-31)
 * - Use 'w' for week of year
 * - Common patterns:
 *   - "EEEE, MMMM do, yyyy" → "Monday, January 1st, 2024"
 *   - "DDD" → Day of year (1-366)
 *   - "d" → Day of month (1-31)
 *   - "w" → Week of year (1-53)
 *
 * See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 */

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	captionLayout = "label",
	buttonVariant = "ghost",
	formatters,
	components,
	onMonthChange,
	onDayClick,
	id,
	...props
}: React.ComponentProps<typeof DayPicker> & {
	buttonVariant?: React.ComponentProps<typeof Button>["variant"];
	id?: string;
}) {
	const defaultClassNames = getDefaultClassNames();

	// Wrap month change handler with error reporting
	const handleMonthChange = useDelegatedComponentEventHandler(
		onMonthChange,
		(evt) => ({
			componentType: "calendar",
			eventType: "month-change",
			componentInfo: {
				month: evt.toISOString(),
			},
		}),
	);

	// Wrap day click handler with error reporting
	const handleDayClick = useDelegatedComponentEventHandler(
		onDayClick,
		(day, modifiers) => ({
			componentType: "calendar",
			eventType: "day-click",
			componentInfo: {
				day: day.toISOString(),
				modifiers,
			},
		}),
	);

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn(
				"bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
				String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
				String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
				className,
			)}
			captionLayout={captionLayout}
			onMonthChange={handleMonthChange}
			onDayClick={handleDayClick}
			id={id}
			formatters={{
				formatMonthDropdown: (date) =>
					date.toLocaleString("default", { month: "short" }),
				...formatters,
			}}
			classNames={{
				root: cn("w-fit", defaultClassNames.root),
				months: cn(
					"flex gap-4 flex-col md:flex-row relative",
					defaultClassNames.months,
				),
				month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
				nav: cn(
					"flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between",
					defaultClassNames.nav,
				),
				button_previous: cn(
					buttonVariants({ variant: buttonVariant }),
					"size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
					defaultClassNames.button_previous,
				),
				button_next: cn(
					buttonVariants({ variant: buttonVariant }),
					"size-(--cell-size) aria-disabled:opacity-50 p-0 select-none",
					defaultClassNames.button_next,
				),
				month_caption: cn(
					"flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)",
					defaultClassNames.month_caption,
				),
				dropdowns: cn(
					"w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5",
					defaultClassNames.dropdowns,
				),
				dropdown_root: cn(
					"relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md",
					defaultClassNames.dropdown_root,
				),
				dropdown: cn(
					"absolute bg-popover inset-0 opacity-0",
					defaultClassNames.dropdown,
				),
				caption_label: cn(
					"select-none font-medium",
					captionLayout === "label"
						? "text-sm"
						: "rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5",
					defaultClassNames.caption_label,
				),
				table: "w-full border-collapse",
				weekdays: cn("flex", defaultClassNames.weekdays),
				weekday: cn(
					"text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none",
					defaultClassNames.weekday,
				),
				week: cn("flex w-full mt-2", defaultClassNames.week),
				week_number_header: cn(
					"select-none w-(--cell-size)",
					defaultClassNames.week_number_header,
				),
				week_number: cn(
					"text-[0.8rem] select-none text-muted-foreground",
					defaultClassNames.week_number,
				),
				day: cn(
					"relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
					defaultClassNames.day,
				),
				range_start: cn(
					"rounded-l-md bg-accent",
					defaultClassNames.range_start,
				),
				range_middle: cn("rounded-none", defaultClassNames.range_middle),
				range_end: cn("rounded-r-md bg-accent", defaultClassNames.range_end),
				today: cn(
					"bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
					defaultClassNames.today,
				),
				outside: cn(
					"text-muted-foreground aria-selected:text-muted-foreground",
					defaultClassNames.outside,
				),
				disabled: cn(
					"text-muted-foreground opacity-50",
					defaultClassNames.disabled,
				),
				hidden: cn("invisible", defaultClassNames.hidden),
				...classNames,
			}}
			components={{
				Root: ({ className, rootRef, ...props }) => {
					return (
						<div
							data-slot="calendar"
							ref={rootRef}
							className={cn(className)}
							{...props}
						/>
					);
				},
				Chevron: ({ className, orientation, ...props }) => {
					if (orientation === "left") {
						return (
							<ChevronLeftIcon className={cn("size-4", className)} {...props} />
						);
					}

					if (orientation === "right") {
						return (
							<ChevronRightIcon
								className={cn("size-4", className)}
								{...props}
							/>
						);
					}

					return (
						<ChevronDownIcon className={cn("size-4", className)} {...props} />
					);
				},
				DayButton: CalendarDayButton,
				WeekNumber: ({ children, ...props }) => {
					return (
						<td {...props}>
							<div className="flex size-(--cell-size) items-center justify-center text-center">
								{children}
							</div>
						</td>
					);
				},
				...components,
			}}
			{...props}
		/>
	);
}

function CalendarDayButton({
	className,
	day,
	modifiers,
	onClick,
	...props
}: React.ComponentProps<typeof DayButton>) {
	const defaultClassNames = getDefaultClassNames();

	const ref = React.useRef<HTMLButtonElement>(null);
	React.useEffect(() => {
		if (modifiers.focused) ref.current?.focus();
	}, [modifiers.focused]);

	// Handle click with error reporting
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			try {
				// Call the original onClick handler if provided
				if (onClick) {
					// @ts-ignore - Button accepts onClick
					onClick(event);
				}
			} catch (error) {
				// Report error using the abstracted utility function
				reportElementError(event.currentTarget as HTMLButtonElement, error, {
					componentType: "calendar-day-button",
					eventType: "click",
					componentInfo: {
						day: day.date.toISOString(),
						modifiers,
					},
				});
				throw error;
			}
		},
		[onClick, day.date, modifiers],
	);

	return (
		<Button
			ref={ref}
			variant="ghost"
			size="icon"
			onClick={handleClick}
			data-day={day.date.toLocaleDateString()}
			data-selected-single={
				modifiers.selected &&
				!modifiers.range_start &&
				!modifiers.range_end &&
				!modifiers.range_middle
			}
			data-range-start={modifiers.range_start}
			data-range-end={modifiers.range_end}
			data-range-middle={modifiers.range_middle}
			className={cn(
				"data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70",
				defaultClassNames.day,
				className,
			)}
			{...props}
		/>
	);
}

export { Calendar, CalendarDayButton };
