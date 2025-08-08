'use client';

import HeroSection from '@/components/hero-section';
import EventsCarousel from '@/components/events-carousel';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Music, Trophy, Camera } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Events Carousel Section */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover amazing events happening at FROSH 2025. Login and book your tickets now!
            </p>
          </div>

          <EventsCarousel />

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <Link href="/events">
                View All Events
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      {/* <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What to Expect at Our Events
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join us for unforgettable experiences filled with entertainment, networking, and memories that will last a lifetime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-navy-900/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-navy-900/60 transition-colors">
              <Music className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Live Performances</h3>
              <p className="text-gray-300">
                Enjoy amazing live music performances by talented student artists and special guest performers.
              </p>
            </div>

            <div className="bg-navy-900/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-navy-900/60 transition-colors">
              <Trophy className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Competitions</h3>
              <p className="text-gray-300">
                Participate in exciting competitions and win amazing prizes. Show off your talents and skills!
              </p>
            </div>

            <div className="bg-navy-900/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-navy-900/60 transition-colors">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Networking</h3>
              <p className="text-gray-300">
                Meet fellow students, make new friends, and build connections that will last throughout your college journey.
              </p>
            </div>

            <div className="bg-navy-900/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-navy-900/60 transition-colors">
              <Camera className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Photo Opportunities</h3>
              <p className="text-gray-300">
                Capture memories with our professional photo setups. Perfect for social media and keepsakes!
              </p>
            </div>

            <div className="bg-navy-900/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-navy-900/60 transition-colors">
              <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Welcome Sessions</h3>
              <p className="text-gray-300">
                Official welcome ceremonies and orientation sessions with faculty and senior students.
              </p>
            </div>

            <div className="bg-navy-900/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-navy-900/60 transition-colors">
              <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Campus Tours</h3>
              <p className="text-gray-300">
                Guided campus tours to help you get familiar with all the important locations and facilities.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join the Fun?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't miss out on FROSH 2025's amazing events. Login and book your tickets now!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              <Link href="/login">
                Login to Book Tickets
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white hover:text-white hover:bg-blue-600 text-blue-600 px-8 py-3 text-lg">
              <Link href="/events">
                Explore All Events
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
