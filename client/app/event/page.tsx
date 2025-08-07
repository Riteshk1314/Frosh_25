import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EventPage() {
  const schedule = [
    {
      time: '6:00 PM',
      activity: 'Registration & Welcome',
      description: 'Check-in and welcome refreshments'
    },
    {
      time: '6:30 PM',
      activity: 'Opening Ceremony',
      description: 'Welcome address by the Dean and Student Council'
    },
    {
      time: '7:00 PM',
      activity: 'Ice Breaking Activities',
      description: 'Fun games to help freshers mingle and make friends'
    },
    {
      time: '7:45 PM',
      activity: 'Cultural Performances',
      description: 'Dance and music performances by senior students'
    },
    {
      time: '8:30 PM',
      activity: 'Talent Show',
      description: 'Freshers showcase their talents - singing, dancing, comedy'
    },
    {
      time: '9:15 PM',
      activity: 'Prize Distribution',
      description: 'Awards for best performances and competition winners'
    },
    {
      time: '9:45 PM',
      activity: 'Group Photo & Networking',
      description: 'Official group photo and informal networking session'
    },
    {
      time: '10:00 PM',
      activity: 'Event Conclusion',
      description: 'Closing remarks and farewell'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-navy-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Event Details
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to know about FROSH 2024 - Thapar University's most anticipated freshers event.
            </p>
          </div>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 text-center">
              <Calendar className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Date</h3>
              <p className="text-gray-300">September 15, 2024</p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 text-center">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Time</h3>
              <p className="text-gray-300">6:00 PM - 10:00 PM</p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 text-center">
              <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Venue</h3>
              <p className="text-gray-300">Main Auditorium</p>
            </div>

            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Capacity</h3>
              <p className="text-gray-300">500 Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Schedule */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Event Schedule</h2>
            <p className="text-xl text-gray-300">
              A detailed timeline of all the exciting activities planned for the evening.
            </p>
          </div>

          <div className="space-y-6">
            {schedule.map((item, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm rounded-lg p-6 hover:bg-black/60 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-4">
                        {item.time}
                      </div>
                      <h3 className="text-xl font-semibold text-white">{item.activity}</h3>
                    </div>
                    <p className="text-gray-300 md:ml-20">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Information */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Important Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-navy-900/50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">What to Bring</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Valid Student ID Card</li>
                <li>• Registration Confirmation (Digital/Print)</li>
                <li>• Comfortable clothing and shoes</li>
                <li>• Positive energy and enthusiasm!</li>
              </ul>
            </div>

            <div className="bg-navy-900/50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Event Guidelines</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Entry is free for all registered students</li>
                <li>• Doors open at 5:45 PM</li>
                <li>• Photography and videography allowed</li>
                <li>• Refreshments will be provided</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              <Link href="/tickets">
                Register Now - It's Free!
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
