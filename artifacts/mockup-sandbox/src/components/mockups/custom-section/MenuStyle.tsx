import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronRight } from 'lucide-react';

const services = [
  {
    name: 'Website Refresh or Update',
    tagline: 'Breathe new life into your existing digital presence.',
  },
  {
    name: 'Build a Website',
    tagline: 'From scratch, tailored specifically to your brand identity.',
  },
  {
    name: 'Landing Page or Lead Capture',
    tagline: 'High-converting single pages designed for your next campaign.',
  },
  {
    name: 'Add Platforms or Posts to Package',
    tagline: 'Expand your reach with additional social channels and content.',
  },
  {
    name: 'Customize Email Campaigns',
    tagline: 'Bespoke newsletter templates and automated sequences.',
  },
  {
    name: 'À La Carte Services',
    tagline: 'Specific, one-off deliverables for your unique requirements.',
  },
];

export function MenuStyle() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="w-full min-h-screen py-24 px-6 md:px-12 flex flex-col items-center" style={{ backgroundColor: '#1F3D2C', color: '#F5F2EA', fontFamily: '"Inter", sans-serif' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter:wght@300;400;500;600&display=swap');
        .font-serif {
          font-family: 'Fraunces', serif;
        }
      `}} />

      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm tracking-[0.2em] uppercase mb-4" style={{ color: '#EBC99B' }}>Beyond The Packages</h2>
          <h1 className="text-5xl md:text-7xl font-serif font-light mb-6">Custom Services</h1>
          <p className="max-w-xl mx-auto text-lg opacity-80" style={{ color: '#F5F2EA' }}>
            Bespoke solutions and one-off projects, crafted with the same attention to detail as our core offerings.
          </p>
        </div>

        <div className="flex flex-col mb-16">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col py-8 border-b border-[#F5F2EA]/20 group hover:border-[#EBC99B]/50 transition-colors">
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2 gap-2 md:gap-4">
                <h3 className="text-3xl md:text-4xl font-serif font-light">{service.name}</h3>
                <span className="text-sm tracking-widest uppercase whitespace-nowrap" style={{ color: '#EBC99B' }}>Custom Quote</span>
              </div>
              <p className="italic opacity-70 font-light text-lg" style={{ color: '#F5F2EA' }}>{service.tagline}</p>
            </div>
          ))}
        </div>

        {!showForm ? (
          <div className="flex justify-center mt-12 mb-24">
            <button 
              onClick={() => setShowForm(true)}
              className="px-10 py-5 border border-[#F5F2EA] hover:bg-[#F5F2EA] hover:text-[#1F3D2C] transition-all duration-500 font-medium tracking-widest uppercase text-sm"
            >
              Request Custom Services
            </button>
          </div>
        ) : (
          <div className="mt-12 p-8 md:p-16 border border-[#F5F2EA]/20 bg-[#1A3324]" style={{ backgroundColor: '#1A3324' }}>
            <div className="mb-12 text-center">
              <h3 className="text-4xl font-serif font-light mb-4 text-[#F5F2EA]">Tell us what you need</h3>
              <p className="text-[#EBC99B] italic text-lg opacity-90">We'll get back to you with a custom quote within 48 hours.</p>
            </div>
            
            <form className="space-y-8 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[#EBC99B] uppercase tracking-widest text-xs font-semibold">Name</Label>
                  <Input id="name" className="bg-transparent border-0 border-b border-[#F5F2EA]/30 focus-visible:ring-0 focus-visible:border-[#EBC99B] text-[#F5F2EA] rounded-none px-0 h-12 text-lg shadow-none" placeholder="Your name" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="business" className="text-[#EBC99B] uppercase tracking-widest text-xs font-semibold">Business</Label>
                  <Input id="business" className="bg-transparent border-0 border-b border-[#F5F2EA]/30 focus-visible:ring-0 focus-visible:border-[#EBC99B] text-[#F5F2EA] rounded-none px-0 h-12 text-lg shadow-none" placeholder="Company name" />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[#EBC99B] uppercase tracking-widest text-xs font-semibold">Email</Label>
                <Input id="email" type="email" className="bg-transparent border-0 border-b border-[#F5F2EA]/30 focus-visible:ring-0 focus-visible:border-[#EBC99B] text-[#F5F2EA] rounded-none px-0 h-12 text-lg shadow-none" placeholder="hello@example.com" />
              </div>

              <div className="space-y-3 pt-4">
                <Label htmlFor="needs" className="text-[#EBC99B] uppercase tracking-widest text-xs font-semibold">Tell us what you need</Label>
                <Textarea id="needs" className="bg-transparent border border-[#F5F2EA]/30 focus-visible:ring-0 focus-visible:border-[#EBC99B] text-[#F5F2EA] rounded-none min-h-[150px] p-4 text-lg shadow-none resize-none mt-2" placeholder="Describe your project, timeline, and goals..." />
              </div>

              <div className="pt-10 flex flex-col items-center gap-8">
                <button 
                  type="submit"
                  className="w-full md:w-auto px-12 py-5 bg-[#EBC99B] text-[#1F3D2C] hover:bg-[#F5F2EA] transition-all duration-500 font-semibold tracking-widest uppercase text-sm"
                >
                  Send Request
                </button>
                
                <a href="#book-call" className="text-[#F5F2EA] hover:text-[#EBC99B] transition-colors text-lg tracking-wide flex items-center gap-2 italic font-serif">
                  or Book a Call <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default MenuStyle;
