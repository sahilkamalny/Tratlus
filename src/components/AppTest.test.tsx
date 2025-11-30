import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";

describe("Basic test setup", () => {
	it("should pass a simple test", () => {
		expect(true).toBe(true);
	});

	it("should render text correctly", () => {
		render(<div>Hello Testing</div>);
		expect(screen.getByText("Hello Testing")).toBeInTheDocument();
	});
});
