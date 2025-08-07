'use client';

import { useEffect, useState } from 'react';
import HeroSection from '@/components/hero-section';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Music, Trophy, Camera } from 'lucide-react';
import { eventService } from '@/lib/api-services';
import type { Event } from '@/types';

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents(1, 5);
        setEvents(response.data.events);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const mainEvent = events.find(event => event.name.toLowerCase().includes('frosh')) || events[0];

  return (
    <div className="min-h-screen">
      <HeroSection event={mainEvent} />
      
      {/* Features Section */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              What to Expect at FROSH 2024
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join us for an unforgettable evening filled with entertainment, networking, and memories that will last a lifetime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-black/60 transition-colors">
              <Music className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Live Performances</h3>
              <p className="text-gray-300">
                Enjoy amazing live music performances by talented student artists and special guest performers.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-black/60 transition-colors">
              <Trophy className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Competitions</h3>
              <p className="text-gray-300">
                Participate in exciting competitions and win amazing prizes. Show off your talents and skills!
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-black/60 transition-colors">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Networking</h3>
              <p className="text-gray-300">
                Meet fellow students, make new friends, and build connections that will last throughout your college journey.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-black/60 transition-colors">
              <Camera className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Photo Booth</h3>
              <p className="text-gray-300">
                Capture memories with our professional photo booth setup. Perfect for social media and keepsakes!
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-black/60 transition-colors">
              <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Welcome Ceremony</h3>
              <p className="text-gray-300">
                Official welcome ceremony for all freshers with speeches from faculty and senior students.
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8 text-center hover:bg-black/60 transition-colors">
              <MapPin className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Campus Tour</h3>
              <p className="text-gray-300">
                Guided campus tour to help you get familiar with all the important locations and facilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      {events.length > 0 && (
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Upcoming Events</h2>
              <p className="text-xl text-gray-300">
                Don't miss out on these exciting events at Thapar University
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.slice(0, 3).map((event) => (
                <div key={event._id} className="bg-navy-900/50 rounded-lg p-6 hover:bg-navy-900/70 transition-colors">
                  <h3 className="text-xl font-semibold text-white mb-3">{event.name}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">{event.eventDescription}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.startTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      {event.availableSeats || event.totalSeats - event.registrationCount} seats available
                    </div>
                  </div>

                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link href={`/event/${event._id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join the Fun?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't miss out on Thapar University's biggest freshers event. Login and book your ticket now!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              <Link href="/tickets">
                Book Your Ticket
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
              <Link href="/events">
                View All Events
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
