'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, AlertTriangle, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { eventService, ticketService } from '@/lib/api-services';
import { useAuth } from '@/components/auth-provider';
import type { Event } from '@/types';

export default function TicketsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents();
        setEvents(response.data.events);
        
        // Check if eventId is provided in URL params
        const preSelectedEventId = searchParams.get('eventId');
        if (preSelectedEventId && response.data.events.some(event => event._id === preSelectedEventId)) {
          setSelectedEventId(preSelectedEventId);
        } else {
          // Auto-select FROSH event if available, otherwise first event
          const froshEvent = response.data.events.find(event => 
            event.name.toLowerCase().includes('frosh')
          );
          if (froshEvent) {
            setSelectedEventId(froshEvent._id);
          } else if (response.data.events.length > 0) {
            setSelectedEventId(response.data.events[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to load events. Please try again.');
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [searchParams]);

  const selectedEvent = events.find(event => event._id === selectedEventId);
  const availableSeats = selectedEvent ? 
    (selectedEvent.availableSeats || selectedEvent.totalSeats - selectedEvent.registrationCount) : 0;

  const handleBookTicket = async () => {
    if (!selectedEventId) {
      setError('Please select an event');
      return;
    }

    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    if (availableSeats <= 0) {
      setError('Sorry, this event is fully booked');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await ticketService.bookTicket({ eventId: selectedEventId });
      
      if (response.success) {
        // Store ticket data for confirmation page
        sessionStorage.setItem('ticketData', JSON.stringify({
          ...response.data,
          event: selectedEvent,
          user: user
        }));
        
        router.push('/confirmation');
      }
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginAlert(false);
    router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  };

  if (isLoadingEvents) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      {/* Login Alert Modal */}
      {showLoginAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              <h3 className="text-xl font-semibold text-white">Login Required</h3>
            </div>
            <p className="text-gray-300 mb-6">
              You need to login to book tickets for events. Please sign in to continue with your booking.
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={handleLoginRedirect}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Login Now
              </Button>
              <Button 
                onClick={() => setShowLoginAlert(false)}
                variant="outline"
                className="flex-1 border-navy-600 text-white hover:bg-navy-800"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Book Your Ticket
          </h1>
          <p className="text-xl text-gray-300">
            Select an event and book your free ticket now!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="bg-navy-900/50 border-navy-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Event Booking</CardTitle>
                <CardDescription className="text-gray-300">
                  Choose your event and confirm your booking. All events are free for students!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert className="border-red-500 bg-red-500/10">
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {!isAuthenticated && (
                  <Alert className="border-yellow-500 bg-yellow-500/10">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-400">
                      You need to login to book a ticket. Click "Book Now" to sign in.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <label className="text-white font-medium">Select Event *</label>
                  <Select
                    value={selectedEventId}
                    onValueChange={setSelectedEventId}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="bg-black/50 border-navy-600 text-white">
                      <SelectValue placeholder="Choose an event" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-800 border-navy-600">
                      {events.map((event) => {
                        const eventAvailableSeats = event.availableSeats || event.totalSeats - event.registrationCount;
                        return (
                          <SelectItem 
                            key={event._id} 
                            value={event._id} 
                            className="text-white hover:bg-navy-700"
                            disabled={eventAvailableSeats <= 0}
                          >
                            {event.name} - {new Date(event.startTime).toLocaleDateString()}
                            {eventAvailableSeats <= 0 && ' (Fully Booked)'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {isAuthenticated && user && (
                  <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Booking Details</h4>
                    <div className="text-sm space-y-1">
                      <p className="text-blue-200">Name: {user.name}</p>
                      <p className="text-blue-200">Email: {user.email}</p>
                      <p className="text-blue-200">Phone: {user.phoneNumber}</p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleBookTicket}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  disabled={isLoading || !selectedEventId || availableSeats <= 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Booking Ticket...
                    </>
                  ) : availableSeats <= 0 ? (
                    'Event Fully Booked'
                  ) : (
                    'Book Now'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Event Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedEvent && (
              <Card className="bg-navy-900/50 border-navy-700 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedEvent.name}</h3>
                    <p className="text-gray-300 text-sm line-clamp-3">{selectedEvent.eventDescription}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-400" />
                      <span className="text-white text-sm">
                        {new Date(selectedEvent.startTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-white text-sm">
                        {new Date(selectedEvent.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="text-white text-sm">{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-white text-sm">
                        {availableSeats} seats available
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Registered:</span>
                      <span className="text-white">{selectedEvent.registrationCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Capacity:</span>
                      <span className="text-white">{selectedEvent.totalSeats}</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((selectedEvent.registrationCount / selectedEvent.totalSeats) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-green-400 font-medium">Free Entry</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
