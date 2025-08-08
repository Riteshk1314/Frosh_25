'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { eventService } from '@/lib/api-services';
import { useAuth } from './auth-provider';
import type { Event } from '@/types';

export default function EventsCarousel() {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents(1, 10);
        setEvents(response.data.events);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error || events.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg mb-4">
          {error || 'No events available at the moment.'}
        </p>
        <Button asChild>
          <Link href="/events">View All Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {events.map((event) => {
            const availableSeats = event.availableSeats || event.totalSeats - event.registrationCount;
            
            return (
              <div key={event._id} className="w-full flex-shrink-0 px-4">
                <Card className="bg-navy-900/50 border-navy-700 hover:bg-navy-900/70 transition-colors max-w-4xl mx-auto">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            event.isLive 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {event.isLive ? 'Live' : 'Upcoming'}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 capitalize">
                            {event.mode}
                          </span>
                        </div>
                        <CardTitle className="text-white text-2xl md:text-3xl mb-2">
                          {event.name}
                        </CardTitle>
                        <p className="text-gray-300 line-clamp-2 mb-4">
                          {event.eventDescription}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-400">
                            {availableSeats}
                          </div>
                          <div className="text-sm text-gray-400">seats left</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <div className="text-white font-medium">
                            {new Date(event.startTime).toLocaleDateString()}
                          </div>
                          <div className="text-gray-400 text-sm">Event Date</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <div className="text-white font-medium">
                            {new Date(event.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div className="text-gray-400 text-sm">Start Time</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <div className="text-white font-medium truncate">
                            {event.location}
                          </div>
                          <div className="text-gray-400 text-sm">Venue</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-400" />
                        <span className="text-white">
                          {event.registrationCount} / {event.totalSeats} registered
                        </span>
                      </div>
                      
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${Math.min((event.registrationCount / event.totalSeats) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button asChild className="bg-blue-600 hover:bg-blue-700 px-8">
                        <Link href={`/event/${event._id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      {events.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Previous event"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Next event"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {events.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-blue-400' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-advance indicator */}
      <div className="text-center mt-4">
        <p className="text-gray-400 text-sm">
          Showing {currentIndex + 1} of {events.length} events
        </p>
      </div>
    </div>
  );
}
