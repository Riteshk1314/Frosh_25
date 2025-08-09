import Link from "next/link";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./countdown-timer";
import Dither from '@/components/Dither';

export default function HeroSection() {
	// Use a default upcoming date for the countdown
	const eventDate = "2025-09-15T18:00:00";

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0">

<div style={{ width: '100%', height: '100%', position: 'fixed' }} className="-z-50">
  <Dither
    waveColor={[0, 0, 1]}
    disableAnimation={false}
    enableMouseInteraction={false}
    mouseRadius={0.3}
    colorNum={40}
    waveAmplitude={0.4}
    waveFrequency={3}
    waveSpeed={0.05}
  />
</div>
			</div>
			
			<div className="absolute inset-0 bg-black/40"></div>

			<div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
				{/* FROSH Logo */}
				<div className="mb-8 flex justify-center">
					<img 
						src="/frosh.png" 
						alt="FROSH 2025 - Navigating Through Timeless Trails" 
						className="h-56 md:h-96 w-auto filter drop-shadow-2xl"
					/>
				</div>

				{/* Description */}
				<div className="mb-12">
					<p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
					</p>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
					
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
