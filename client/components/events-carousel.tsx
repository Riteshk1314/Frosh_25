'use client';
import PixelCard from './PixelCard';

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
          <Link href="/events"></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative bg-transparent">
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {events.map((event) => {
            const availableSeats = event.availableSeats || event.totalSeats - event.registrationCount;
            
            return (
              <div key={event._id} className="h-[100vh] flex gap-10 flex-col md:flex-row items-center justify-center relative  w-full flex-shrink-0 px-4">
<div className='flex flex-col gap-10 px-2 py-0 justify-center items-center md:w-[40vw] md:h-[70vh] w-screen h-screen bg-black'>
        <div className='text-white text-[5vw] md:text-[1.5vw] text-center px-10 flex items-center w-[100%] border-2 border-blue-500 rounded-2xl h-[65%]'>
            {event.eventDescription}
        </div>
        <div className='w-[100%] text-white font-medium flex items-center justify-center text-[2vw] h-[25%] border-2 border-blue-500 rounded-2xl'>
Date: {event.startTime} <br />
Venue: {event.location} <br />
        </div>
    
    </div>


<div className='flex w-screen md:w-[25vw] h-[110%] md:h-[70vh] items-center justify-center px-2 py-2 bg-black' >
<div className='w-[100%] rounded-2xl h-[100%] flex border-2 items-center justify-center border-blue-500 relative'>

                <PixelCard variant='blue' className=" max-w-4xl mx-auto bg-[#230579]">
                  <CardHeader className='absolute'>
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
                     
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                 
                </PixelCard>
                </div>
                            </div>
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full transition-colors z-10"
            aria-label="Previous event"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full transition-colors z-10"
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
