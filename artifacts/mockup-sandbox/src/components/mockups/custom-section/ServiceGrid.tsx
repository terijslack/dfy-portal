import React, { useState, useRef } from 'react';
import { 
  RefreshCw, 
  Monitor, 
  LayoutTemplate, 
  Share2, 
  Mail, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const COLORS = {
  cream: '#F5F2EA',
  primaryGreen: '#2D6B4F',
  forest: '#1F3D2C',
  rust: '#7D2A03',
  tan: '#EBC99B',
  slate: '#6B756B',
};

const SERVICES = [
  {
    title: 'Website Refresh or Update',
    description: 'Breathe new life into your existing site with modernized design, improved flow, and updated content.',
    icon: RefreshCw,
  },
  {
    title: 'Build a Website',
    description: 'Start fresh with a fully custom, responsive website tailored to your brand and business goals.',
    icon: Monitor,
  },
  {
    title: 'Landing Page or Lead Capture',
    description: 'High-converting, focused single pages designed specifically to capture leads or sell a single product.',
    icon: LayoutTemplate,
  },
  {
    title: 'Add Platforms or Posts to Package',
    description: 'Expand your reach by adding new social channels or increasing your posting frequency.',
    icon: Share2,
  },
  {
    title: 'Customize Email Campaigns',
    description: 'Engaging, beautifully designed email sequences that nurture your audience and drive sales.',
    icon: Mail,
  },
  {
    title: 'À La Carte Services',
    description: 'Need something specific? We offer flexible, one-off design and marketing tasks on demand.',
    icon: Sparkles,
  },
];

export default function ServiceGrid() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleShowForm = () => {
    setIsFormVisible(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="w-full relative" style={{ backgroundColor: COLORS.cream, fontFamily: '"Inter", sans-serif' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@400;500;600&display=swap');
          
          .heading-font {
            font-family: 'Fraunces', serif;
          }
          
          .service-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          
          .service-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -10px rgba(31, 61, 44, 0.15);
          }
        `}
      </style>

      {/* Main Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="heading-font text-4xl md:text-5xl font-semibold mb-4" style={{ color: COLORS.forest }}>
            Custom Services
          </h2>
          <p className="text-lg md:text-xl" style={{ color: COLORS.slate }}>
            Beyond our standard packages, we offer bespoke solutions to elevate your brand. What do you need built?
          </p>
        </div>

        {/* 2x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div 
                key={idx} 
                className="service-card bg-white rounded-2xl p-8 border border-opacity-20 flex flex-col items-start"
                style={{ borderColor: COLORS.tan }}
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: COLORS.tan + '40', color: COLORS.primaryGreen }}
                >
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="heading-font text-xl font-semibold mb-3" style={{ color: COLORS.forest }}>
                  {service.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: COLORS.slate }}>
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-width CTA Block */}
      <div className="w-full py-20 px-6 relative overflow-hidden" style={{ backgroundColor: COLORS.forest }}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" style={{ backgroundColor: COLORS.tan }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" style={{ backgroundColor: COLORS.rust }} />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="heading-font text-3xl md:text-4xl font-semibold text-white mb-6">
            Ready to start a custom project?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Tell us about your goals and we'll put together a tailored proposal specifically for your brand.
          </p>
          
          {!isFormVisible && (
            <button
              onClick={handleShowForm}
              className="px-8 py-4 rounded-full text-white font-medium text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
              style={{ backgroundColor: COLORS.rust }}
            >
              Request Custom Services
              <ArrowRight size={20} />
            </button>
          )}

          {/* Expandable Form */}
          <div 
            ref={formRef}
            className={\`mt-12 text-left bg-white rounded-3xl p-8 md:p-12 shadow-2xl transition-all duration-700 ease-in-out origin-top \${isFormVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 h-0 overflow-hidden py-0 mt-0'}\`}
          >
            <div className="mb-8 border-b pb-6" style={{ borderColor: COLORS.tan + '40' }}>
              <h3 className="heading-font text-2xl font-semibold" style={{ color: COLORS.forest }}>
                Project Request
              </h3>
              <p className="mt-2" style={{ color: COLORS.slate }}>
                Fill out the details below and our team will get back to you within 24 hours.
              </p>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.forest }}>Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-shadow"
                    style={{ borderColor: COLORS.slate + '40', outlineColor: COLORS.primaryGreen }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: COLORS.forest }}>Business Name</label>
                  <input 
                    type="text" 
                    placeholder="Jane's Bakery"
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-shadow"
                    style={{ borderColor: COLORS.slate + '40', outlineColor: COLORS.primaryGreen }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.forest }}>Email</label>
                <input 
                  type="email" 
                  placeholder="jane@example.com"
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-shadow"
                  style={{ borderColor: COLORS.slate + '40', outlineColor: COLORS.primaryGreen }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: COLORS.forest }}>Tell us what you need</label>
                <textarea 
                  rows={4}
                  placeholder="I'm looking to build a new landing page for an upcoming product launch..."
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-shadow resize-none"
                  style={{ borderColor: COLORS.slate + '40', outlineColor: COLORS.primaryGreen }}
                ></textarea>
              </div>

              <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 rounded-full text-white font-medium text-lg transition-transform hover:scale-105 active:scale-95 shadow-md"
                  style={{ backgroundColor: COLORS.primaryGreen }}
                >
                  Send Request
                </button>
                <span className="text-sm font-medium" style={{ color: COLORS.slate }}>or</span>
                <button
                  type="button"
                  className="w-full md:w-auto px-6 py-4 rounded-full font-medium text-lg hover:underline decoration-2 underline-offset-4 flex items-center justify-center gap-2"
                  style={{ color: COLORS.rust }}
                >
                  Book a Call <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
