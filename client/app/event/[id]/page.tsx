'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, MapPin, Users, Loader2, ArrowLeft, QrCode, CheckCircle, AlertTriangle } from 'lucide-react';
import { eventService, passService, ticketService } from '@/lib/api-services';
import { useAuth } from '@/components/auth-provider';
import QRCodeGenerator from '@/components/qr-code-generator';
import type { Event, Pass } from '@/types';

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  // You would need to fetch all events at build time
  // For now, returning an empty array to prevent build errors
  // In production, you'd fetch from your API
  try {
    // const events = await fetch('your-api-url/getEvents').then(res => res.json());
    // return events.data.events.map((event: Event) => ({
    //   id: event._id,
    // }));
    return [];
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { isAuthenticated, user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [userPass, setUserPass] = useState<Pass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPass, setIsLoadingPass] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await eventService.getEventById(eventId);
        setEvent(eventData);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        setError('Failed to load event details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    const checkUserPass = async () => {
      if (!isAuthenticated || !eventId) {
        return;
      }

      setIsLoadingPass(true);
      try {
        const passResponse = await passService.getPassForEvent(eventId);
        if (passResponse.success && passResponse.data.passes.length > 0) {
          // Get the first active pass
          const activePass = passResponse.data.passes.find(pass => pass.passStatus === 'active');
          if (activePass) {
            setUserPass(activePass);
          }
        }
      } catch (error) {
        console.error('Failed to check user pass:', error);
        // Don't show error for pass check as it's optional
      } finally {
        setIsLoadingPass(false);
      }
    };

    checkUserPass();
  }, [isAuthenticated, eventId]);

  const handleBookTicket = async () => {
    if (!eventId) {
      setError('Event ID is required');
      return;
    }

    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    const availableSeats = event ? (event.availableSeats || event.totalSeats - event.registrationCount) : 0;
    if (availableSeats <= 0) {
      setError('Sorry, this event is fully booked');
      return;
    }

    setIsBooking(true);
    setError(null);

    try {
      const response = await ticketService.bookTicket({ eventId });
      
      if (response.success) {
        // Update the userPass state with the new pass
        const newPass = {
          passId: response.data.passId,
          userId: user?.id || '',
          eventId: response.data.eventId,
          passStatus: response.data.passStatus,
          isScanned: false,
          timeScanned: null,
          createdAt: response.data.createdAt,
          userEmail: user?.email || ''
        };
        setUserPass(newPass);

        // Update event registration count
        if (event) {
          setEvent({
            ...event,
            registrationCount: event.registrationCount + 1
          });
        }
        
        // Automatically show QR code after successful booking
        setShowQRCode(true);
      }
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginAlert(false);
    router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Event not found'}</p>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const availableSeats = event.availableSeats || event.totalSeats - event.registrationCount;

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        {/* Event Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              event.isLive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {event.isLive ? 'Live Event' : 'Upcoming Event'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 capitalize">
              {event.mode} Event
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {event.name}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {event.eventDescription}
          </p>
        </div>

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

        {/* User Pass Status */}
        {isAuthenticated && (
          <div className="mb-8">
            {isLoadingPass ? (
              <Alert className="border-blue-500 bg-blue-500/10">
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription className="text-blue-400">
                  Checking your pass status...
                </AlertDescription>
              </Alert>
            ) : userPass ? (
              <Alert className="border-green-500 bg-green-500/10">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-400">
                  <div className="flex items-center justify-between">
                    <span>You have an active pass for this event!</span>
                    <Button
                      onClick={() => setShowQRCode(!showQRCode)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 ml-4"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-yellow-500 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-yellow-400">
                  You don't have a pass for this event yet. Book your ticket to get access!
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* QR Code Display */}
        {showQRCode && userPass && (
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-green-900/50 to-blue-900/50 border-green-500/50">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  Booking Confirmed!
                </CardTitle>
                <p className="text-green-200">Your ticket has been successfully booked</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <QRCodeGenerator 
                    data={userPass.passId} 
                    size={250}
                    className="mb-4"
                  />
                  <div className="space-y-2">
                    <p className="text-white font-medium text-lg">Your Event Pass</p>
                    <div className="bg-black/20 rounded-lg p-3 inline-block">
                      <p className="text-green-400 font-mono text-sm">Pass ID: {userPass.passId}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className="text-green-400 font-medium capitalize">{userPass.passStatus}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Check-in</p>
                    <p className={`font-medium ${userPass.isScanned ? 'text-green-400' : 'text-yellow-400'}`}>
                      {userPass.isScanned ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Booked</p>
                    <p className="text-blue-200 font-medium">
                      {new Date(userPass.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <QrCode className="h-5 w-5 text-blue-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-200 font-medium mb-1">How to use your QR code:</h4>
                      <ul className="text-blue-200/80 text-sm space-y-1">
                        <li>• Save this page or take a screenshot</li>
                        <li>• Show the QR code at the event entrance</li>
                        <li>• Event staff will scan your code for quick entry</li>
                        <li>• Keep your phone charged for the event day</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-navy-900/50 border-navy-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">
                        {new Date(event.startTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-gray-400 text-sm">Event Date</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">
                        {new Date(event.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-gray-400 text-sm">Start Time</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">{event.location}</div>
                      <div className="text-gray-400 text-sm">Venue</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-6 w-6 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-white font-medium">
                        {availableSeats} / {event.totalSeats}
                      </div>
                      <div className="text-gray-400 text-sm">Available Seats</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-2">Event Highlights</h3>
                  <ul className="text-sm text-blue-200 space-y-1">
                    <li>• Free entry for all registered students</li>
                    <li>• {event.slots} different activity slots</li>
                    <li>• Interactive sessions and networking opportunities</li>
                    <li>• Refreshments and giveaways included</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="bg-navy-900/50 border-navy-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-2">What to Bring</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Valid Student ID Card</li>
                    <li>• Your event pass (QR code on phone or printed)</li>
                    <li>• Comfortable clothing appropriate for the venue</li>
                    <li>• Positive attitude and enthusiasm!</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-2">Event Guidelines</h4>
                  <ul className="text-gray-300 space-y-1 text-sm">
                    <li>• Arrive 15 minutes before the start time</li>
                    <li>• Have your QR code ready for quick check-in</li>
                    <li>• Follow all safety protocols and guidelines</li>
                    <li>• Respect fellow attendees and organizers</li>
                    <li>• Photography and social media sharing encouraged</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="bg-navy-900/50 border-navy-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  {userPass ? 'Your Pass' : 'Book Your Spot'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert className="border-red-500 bg-red-500/10">
                    <AlertDescription className="text-red-400">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {userPass ? (
                  <div className="text-center space-y-4">
                    <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                      <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <p className="text-green-400 font-medium">Pass Confirmed!</p>
                      <p className="text-gray-300 text-sm mt-1">You're all set for this event</p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pass Status:</span>
                        <span className="text-green-400 capitalize">{userPass.passStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Check-in Status:</span>
                        <span className={userPass.isScanned ? 'text-green-400' : 'text-yellow-400'}>
                          {userPass.isScanned ? 'Checked In' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">FREE</div>
                      <div className="text-gray-400 text-sm">No cost for students</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Capacity:</span>
                        <span className="text-white">{event.totalSeats}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Registered:</span>
                        <span className="text-white">{event.registrationCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Available:</span>
                        <span className="text-green-400 font-medium">{availableSeats}</span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(event.registrationCount / event.totalSeats) * 100}%` 
                        }}
                      ></div>
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
                      disabled={isBooking || availableSeats <= 0}
                    >
                      {isBooking ? (
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

                    <div className="text-center">
                      <p className="text-xs text-gray-400">
                        You'll receive a pass with QR code after booking
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
