import Link from "next/link";
import { Button } from "@/components/ui/button";
import CountdownTimer from "./countdown-timer";

export default function HeroSection() {
	// Use a default upcoming date for the countdown
	const eventDate = "2024-09-15T18:00:00";

	return (
		<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-navy-900 to-navy-800">
			<div className="absolute inset-0 bg-black/20"></div>

			<div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
						FROSH
						<span className="block text-3xl md:text-5xl text-blue-400 font-light">
							2025
						</span>
					</h1>
					{/* <p className="text-xl md:text-2xl text-gray-300 mb-2">
						The Ultimate Freshers Experience
					</p>
					<p className="text-lg text-gray-400">
						Join us for unforgettable experiences and networking
						opportunities
					</p> */}
				</div>

				{/* <div className="mb-12">
					<h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
						Next Event Starts In
					</h2>
					<CountdownTimer targetDate={eventDate} />
				</div> */}

				{/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Button
						asChild
						size="lg"
						className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
					>
						<Link href="/tickets">Book Your Ticket</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						size="lg"
						className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg"
					>
						<Link href="/events">View All Events</Link>
					</Button>
				</div> */}

				{/* <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
					<div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
						<h3 className="text-2xl font-bold text-blue-400 mb-2">
							Multiple
						</h3>
						<p className="text-gray-300">Exciting Events</p>
					</div>
					<div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
						<h3 className="text-2xl font-bold text-blue-400 mb-2">
							Free
						</h3>
						<p className="text-gray-300">Entry for Students</p>
					</div>
					<div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
						<h3 className="text-2xl font-bold text-blue-400 mb-2">
							Amazing
						</h3>
						<p className="text-gray-300">Experiences Await</p>
					</div>
				</div> */}
			</div>
		</section>
	);
}
