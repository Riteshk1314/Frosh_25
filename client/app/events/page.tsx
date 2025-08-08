'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Users, Loader2 } from 'lucide-react';
import { eventService } from '@/lib/api-services';
import type { Event } from '@/types';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents(1, 20);
        setEvents(response.data.events);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to load events. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All Events
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover all the exciting events happening at FROSH 2025. Book your tickets now!
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No events available at the moment.</p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <Card key={event._id} className="bg-navy-900/50 border-navy-700 hover:bg-navy-900/70 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white text-xl">{event.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.isLive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {event.isLive ? 'Live' : 'Upcoming'}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                      {event.mode}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300 line-clamp-3">{event.eventDescription}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{new Date(event.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{new Date(event.startTime).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>
                        {event.availableSeats || event.totalSeats - event.registrationCount} / {event.totalSeats} seats available
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                      <Link href={`/event/${event._id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-navy-600 text-white hover:bg-navy-800">
                      <Link href="/tickets">
                        Book Ticket
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
