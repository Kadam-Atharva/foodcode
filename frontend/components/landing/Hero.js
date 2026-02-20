import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 opacity-10">
        <div className="w-96 h-96 bg-orange-500 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 opacity-10">
        <div className="w-64 h-64 bg-yellow-500 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-medium text-sm mb-8 animate-fade-in-up">
            <Heart size={16} className="fill-current" />
            <span>Join 10,000+ Food Heroes</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
            Share Food, <br/>
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Feed Hope.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with your community to share surplus food and help end hunger. One meal at a time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/donate" 
              className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              Donate Food
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/find-food" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 hover:border-orange-500 hover:text-orange-500 rounded-full font-bold text-lg transition-all"
            >
              Find Food
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-gray-100 pt-12">
            <div>
              <p className="text-3xl font-bold text-gray-900">50k+</p>
              <p className="text-gray-500">Meals Shared</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">12k+</p>
              <p className="text-gray-500">Active Donors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-gray-500">NGO Partners</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">20T</p>
              <p className="text-gray-500">CO2 Saved</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
