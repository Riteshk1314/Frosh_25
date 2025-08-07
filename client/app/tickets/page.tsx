'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, LogIn } from 'lucide-react';
import { eventService, ticketService } from '@/lib/api-services';
import { useAuth } from '@/components/auth-provider';
import LoginForm from '@/components/login-form';
import type { Event } from '@/types';

export default function TicketsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents();
        setEvents(response.data.events);
        
        // Auto-select FROSH event if available
        const froshEvent = response.data.events.find(event => 
          event.name.toLowerCase().includes('frosh')
        );
        if (froshEvent) {
          setSelectedEventId(froshEvent._id);
        } else if (response.data.events.length > 0) {
          setSelectedEventId(response.data.events[0]._id);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to load events. Please try again.');
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const selectedEvent = events.find(event => event._id === selectedEventId);

  const handleBookTicket = async () => {
    if (!selectedEventId) {
      setError('Please select an event');
      return;
    }

    if (!isAuthenticated) {
      setShowLogin(true);
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

  const handleLoginSuccess = () => {
    setShowLogin(false);
    // Automatically proceed with booking after login
    setTimeout(() => {
      handleBookTicket();
    }, 500);
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

  if (showLogin) {
    return (
      <div className="min-h-screen bg-black py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginForm onSuccess={handleLoginSuccess} />
          <div className="text-center mt-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowLogin(false)}
              className="text-gray-400 hover:text-white"
            >
              Back to Booking
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Book Your Ticket
          </h1>
          <p className="text-xl text-gray-300">
            Select an event and book your free ticket now!
          </p>
        </div>

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
              <Alert className="border-blue-500 bg-blue-500/10">
                <LogIn className="h-4 w-4" />
                <AlertDescription className="text-blue-400">
                  You need to login to book a ticket. Click "Book Ticket" to sign in.
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
                  {events.map((event) => (
                    <SelectItem 
                      key={event._id} 
                      value={event._id} 
                      className="text-white hover:bg-navy-700"
                    >
                      {event.name} - {new Date(event.startTime).toLocaleDateString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedEvent && (
              <div className="bg-black/30 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">{selectedEvent.name}</h3>
                <p className="text-gray-300">{selectedEvent.eventDescription}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white">{new Date(selectedEvent.startTime).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Time:</span>
                    <p className="text-white">{new Date(selectedEvent.startTime).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Location:</span>
                    <p className="text-white">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Available Seats:</span>
                    <p className="text-white">
                      {selectedEvent.availableSeats || selectedEvent.totalSeats - selectedEvent.registrationCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-green-400 font-medium">Free Entry</span>
                </div>
              </div>
            )}

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
              disabled={isLoading || !selectedEventId}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Booking Ticket...
                </>
              ) : !isAuthenticated ? (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Login & Book Ticket
                </>
              ) : (
                'Book Free Ticket'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
