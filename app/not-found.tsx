import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Compass, Ghost, Home } from "lucide-react";

export default function NotFoundPage() {
	return (
		<div className="flex w-full items-center justify-center">
			<div className="flex h-screen items-center border-x">
				<div>
					<div className="absolute inset-x-0 h-px bg-border" />
					<Empty>
						<EmptyHeader className="items-center">
							<Ghost className="mb-2 h-10 w-10 text-muted-foreground" />
							<EmptyTitle className="font-black font-mono text-6xl">404</EmptyTitle>
							<EmptyDescription className="text-center">
								The page you're looking for might have been removed or never existed.
							</EmptyDescription>
						</EmptyHeader>
						<EmptyContent>
							<div className="flex gap-2">
								<Button asChild>
									<a href="/">
										<Home /> Go Home
									</a>
								</Button>
								<Button asChild variant="outline">
									<a href="/courses">
										<Compass /> Explore
									</a>
								</Button>
							</div>
						</EmptyContent>
					</Empty>
					<div className="absolute inset-x-0 h-px bg-border" />
				</div>
			</div>
		</div>
	);
}
