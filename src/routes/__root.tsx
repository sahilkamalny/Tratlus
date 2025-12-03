import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SoundProvider } from "@/contexts/SoundContext";

export const Route = createRootRoute({
	component: Root,
});

function Root() {
	return (
		<ThemeProvider>
			<SoundProvider>
				<div className="flex flex-col h-screen overflow-hidden" style={{ touchAction: 'none' }}>
					<ErrorBoundary tagName="main" className="flex-1 overflow-hidden">
						<Outlet />
					</ErrorBoundary>
				</div>
			</SoundProvider>
		</ThemeProvider>
	);
}
