import Link from "next/link";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./countdown-timer";

export default function HeroSection() {
	// Use a default upcoming date for the countdown
	const eventDate = "2025-09-15T18:00:00";

	return (
		<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-navy-950 to-navy-900 overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
			</div>
			
			<div className="absolute inset-0 bg-black/40"></div>

			<div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
				{/* FROSH Logo */}
				<div className="mb-8 flex justify-center">
					<img 
						src="/frosh.svg" 
						alt="FROSH 2025 - Navigating Through Timeless Trails" 
						className="h-48 md:h-64 w-auto filter drop-shadow-2xl"
					/>
				</div>

				{/* Description */}
				<div className="mb-12">
					<p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
						Join us for the ultimate freshers experience with unforgettable events, 
						amazing networking opportunities, and memories that last a lifetime.
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
					<Button
						asChild
						size="lg"
						className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
					>
						<Link href="/events">Explore Events</Link>
					</Button>
					{/* <Button
						asChild
						variant="outline"
						size="lg"
						className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
					>
						<Link href="/events">View All Events</Link>
					</Button> */}
				</div>

				{/* Feature Cards */}
				{/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
					<div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50 hover:border-blue-500/50 transition-all duration-300">
						<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-white font-bold text-xl">∞</span>
						</div>
						<h3 className="text-xl font-bold text-blue-400 mb-2">
							Multiple Events
						</h3>
						<p className="text-gray-300">Diverse activities for every interest</p>
					</div>
					<div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50 hover:border-blue-500/50 transition-all duration-300">
						<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-white font-bold text-xl">₹0</span>
						</div>
						<h3 className="text-xl font-bold text-green-400 mb-2">
							Free Entry
						</h3>
						<p className="text-gray-300">No cost for all students</p>
					</div>
					<div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-navy-700/50 hover:border-blue-500/50 transition-all duration-300">
						<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-white font-bold text-xl">★</span>
						</div>
						<h3 className="text-xl font-bold text-purple-400 mb-2">
							Amazing Experience
						</h3>
						<p className="text-gray-300">Memories that last forever</p>
					</div>
				</div> */}
			</div>
		</section>
	);
}
