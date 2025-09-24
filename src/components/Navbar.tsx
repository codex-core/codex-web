"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { useTheme } from "next-themes";

const navigation = [
	{ name: "Solutions", href: "/solutions" },
	{ name: "About", href: "/about" },
	{ name: "Insights", href: "/insights" },
	{ name: "Consultants", href: "/consultants" },
	{ name: "Jobs", href: "/jobs" },
	{ name: "Contact", href: "/contact" },
];

export default function Navbar() {
	const [isOpen, setIsOpen] = React.useState(false);
	const { theme, systemTheme } = useTheme();
	const resolvedTheme = theme === "system" ? systemTheme : theme;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between m-auto">
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-2xl font-bold">
						CODEX{" "}
						<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
							STUDIOS
						</span>
					</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-8">
					{navigation.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className="text-sm font-medium transition-colors hover:text-primary"
						>
							{item.name}
						</Link>
					))}
				</nav>

				{/* Desktop CTA Buttons */}
				<div className="hidden md:flex items-center space-x-4">
					<ThemeToggle />
					<Button variant="outline" size="sm" asChild>
						<Link href="/contact">Contact Us</Link>
					</Button>
					<Link href="/contact">
						<Button size="sm">Schedule Consultation</Button>
					</Link>
				</div>

				{/* Mobile Navigation */}
				<div className="flex items-center space-x-2 md:hidden">
					<ThemeToggle />
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="sm">
								<Menu className="h-6 w-6" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[400px] px-4">
							<div className="flex flex-col space-y-4 mt-8">
								{navigation.map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className="text-lg font-medium transition-colors hover:text-primary"
										onClick={() => setIsOpen(false)}
									>
										{item.name}
									</Link>
								))}
								<div className="flex flex-col space-y-2 pt-4">
									<Button
										variant="outline"
										asChild
									>
										<Link href="/contact" onClick={() => setIsOpen(false)}>
											Contact Us
										</Link>
									</Button>
									<Link href="/contact">
										<Button onClick={() => setIsOpen(false)}>
											Schedule Consultation
										</Button>
									</Link>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
