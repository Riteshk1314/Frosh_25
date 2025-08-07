'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Download, Share2, Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Event, User } from '@/types';

interface TicketData {
  ticketId: string;
  eventId: string;
  userId: string;
  bookingDate: string;
  qrCode?: string;
  event?: Event;
  user?: User;
}

export default function ConfirmationPage() {
  const router = useRouter();
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get ticket data from sessionStorage
    const storedTicketData = sessionStorage.getItem('ticketData');
    
    if (storedTicketData) {
      try {
        const parsedTicket = JSON.parse(storedTicketData);
        setTicketData(parsedTicket);
      } catch (error) {
        console.error('Error parsing ticket data:', error);
        router.push('/tickets');
      }
    } else {
      // No ticket data found, redirect to booking
      router.push('/tickets');
    }
    
    setIsLoading(false);
  }, [router]);

  const handleDownloadTicket = () => {
    if (!ticketData) return;

    const ticketText = `
THAPAR UNIVERSITY EVENT TICKET
================================

Ticket ID: ${ticketData.ticketId}
Event: ${ticketData.event?.name || 'Event'}
Name: ${ticketData.user?.name || 'Student'}
Email: ${ticketData.user?.email || ''}
Phone: ${ticketData.user?.phoneNumber || ''}

Event Details:
Date: ${ticketData.event ? new Date(ticketData.event.startTime).toLocaleDateString() : ''}
Time: ${ticketData.event ? new Date(ticketData.event.startTime).toLocaleTimeString() : ''}
Venue: ${ticketData.event?.location || ''}

Booking Date: ${new Date(ticketData.bookingDate).toLocaleDateString()}

Please bring this ticket (digital or printed) to the event.
    `;

    const blob = new Blob([ticketText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Ticket-${ticketData.ticketId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareTicket = async () => {
    if (!ticketData) return;

    const shareData = {
      title: `${ticketData.event?.name || 'Event'} - Ticket Confirmed!`,
      text: `I've booked my ticket for ${ticketData.event?.name || 'the event'} at Thapar University! Ticket ID: ${ticketData.ticketId}`,
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const textToCopy = `${shareData.text} - ${shareData.url}`;
      navigator.clipboard.writeText(textToCopy);
      alert('Ticket details copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">No ticket found</h1>
          <Button asChild>
            <Link href="/tickets">Book a Ticket</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-300">
            Your ticket has been successfully booked. See you at the event!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ticket Details */}
          <Card className="bg-navy-900/50 border-navy-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl flex items-center">
                <CheckCircle className="h-6 w-6 text-green-400 mr-2" />
                Your Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    {ticketData.ticketId}
                  </div>
                  <div className="text-sm text-gray-400">Ticket ID</div>
                </div>
                
                {/* QR Code Placeholder */}
                {ticketData.qrCode && (
                  <div className="flex justify-center mb-4">
                    <div className="bg-white p-4 rounded-lg">
                      <img 
                        src={ticketData.qrCode || "/placeholder.svg"} 
                        alt="Ticket QR Code" 
                        className="w-32 h-32"
                      />
                    </div>
                  </div>
                )}
                
                <div className="text-center text-sm text-gray-400">
                  Show this ticket at the event entrance
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{ticketData.user?.name || 'Student'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{ticketData.user?.email || ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white">{ticketData.user?.phoneNumber || ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Booking Date:</span>
                  <span className="text-white">{new Date(ticketData.bookingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-400 capitalize">Active</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleDownloadTicket}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={handleShareTicket}
                  variant="outline"
                  className="flex-1 border-navy-600 text-white hover:bg-navy-800"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Event Information */}
          <Card className="bg-navy-900/50 border-navy-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">
                      {ticketData.event ? new Date(ticketData.event.startTime).toLocaleDateString() : 'TBD'}
                    </div>
                    <div className="text-gray-400 text-sm">Event Date</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">
                      {ticketData.event ? new Date(ticketData.event.startTime).toLocaleTimeString() : 'TBD'}
                    </div>
                    <div className="text-gray-400 text-sm">Start Time</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">{ticketData.event?.location || 'TBD'}</div>
                    <div className="text-gray-400 text-sm">Venue</div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Important Reminders</h3>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>• Bring your student ID card</li>
                  <li>• Arrive 15 minutes early for check-in</li>
                  <li>• Keep your ticket handy (digital or printed)</li>
                  <li>• Follow all event guidelines</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href="/events">
                    View All Events
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-navy-600 text-white hover:bg-navy-800">
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="bg-navy-900/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              What's Next?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              You're all set for the event! Keep an eye on your email for any updates. 
              We can't wait to see you there and make it an unforgettable experience!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Link href="mailto:support@thapar.edu">
                  Contact Support
                </Link>
              </Button>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/events">
                  Explore More Events
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
