import Link from 'next/link';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

export default function LiveFeed() {
  const mockListings = [
    {
      id: 1,
      title: "10 Veg Meals",
      donor: "Community Kitchen",
      distance: "2.5 km away",
      time: "Expires in 2 hours",
      type: "Veg",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=300&h=200"
    },
    {
      id: 2,
      title: "Bakery Surplus",
      donor: "Sweet Treats Bakery",
      distance: "1.2 km away",
      time: "Expires in 4 hours",
      type: "Veg",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300&h=200"
    },
    {
      id: 3,
      title: "Fruit Parcels",
      donor: "Local Market",
      distance: "3.8 km away",
      time: "Expires in 6 hours",
      type: "Veg",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300&h=200"
    }
  ];

  return (
    <section id="live-feed" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Live Food Listings
            </h2>
            <p className="text-gray-600">
              See what's available right now in your area.
            </p>
          </div>
          <Link 
            href="/find-food" 
            className="hidden md:flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors"
          >
            View all listings <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockListings.map((item) => (
            <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-600 uppercase tracking-wide">
                  {item.type}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.donor}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-orange-500" />
                    {item.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-orange-500" />
                    {item.time}
                  </div>
                </div>

                <button className="w-full py-3 border border-orange-500 text-orange-500 font-medium rounded-xl hover:bg-orange-50 transition-colors">
                  Claim Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/find-food" 
            className="inline-flex items-center gap-2 text-orange-500 font-medium hover:text-orange-600 transition-colors"
          >
            View all listings <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
