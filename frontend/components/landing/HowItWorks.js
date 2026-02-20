import { ListPlus, Users, Activity } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <ListPlus size={32} className="text-orange-500" />,
      title: "List Surplus Food",
      description: "Donors (individuals or restaurants) list available food with details like quantity and expiry time."
    },
    {
      icon: <Users size={32} className="text-orange-500" />,
      title: "Connect",
      description: "NGOs and individuals in need can browse listings and request food nearby."
    },
    {
      icon: <Activity size={32} className="text-orange-500" />,
      title: "Track Impact",
      description: "Donors and recipients can track the amount of food saved and people fed."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How FoodConnect Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy to share food and help those in need in just three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-gray-200 group-hover:text-orange-100 transition-colors">
                0{index + 1}
              </div>
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
