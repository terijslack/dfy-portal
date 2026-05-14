import React, { useState, useRef, useEffect } from "react";
import { Check, ArrowRight, CheckCircle2, Circle } from "lucide-react";

export default function InteractiveChecklist() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const services = [
    "Website Refresh or Update",
    "Build a Website",
    "Landing Page or Lead Capture",
    "Add Platforms or Posts to Package",
    "Customize Email Campaigns",
    "À La Carte Services",
  ];

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleRequestClick = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const defaultMessage = selectedServices.length > 0 
    ? `I'm interested in the following custom services:\n${selectedServices.map(s => `- ${s}`).join('\n')}\n\nPlease let me know the next steps.`
    : "";

  return (
    <section 
      className="py-24 px-6 md:px-12 w-full font-sans text-[#1F3D2C] relative"
      style={{ backgroundColor: "#F5F2EA" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 md:text-center max-w-2xl md:mx-auto">
          <h2 
            className="text-4xl md:text-5xl font-serif mb-4" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Build Your Custom Package
          </h2>
          <p className="text-lg text-[#6B756B] leading-relaxed">
            Need something specific outside our standard plans? Select the services you need below, and we'll put together a bespoke proposal just for you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          {/* Left Column: Checklist */}
          <div className="flex-1 w-full flex flex-col gap-4">
            {services.map((service, index) => {
              const isSelected = selectedServices.includes(service);
              return (
                <button
                  key={index}
                  onClick={() => toggleService(service)}
                  className={`flex items-center w-full text-left p-6 md:p-8 rounded-2xl transition-all duration-300 border-2 group hover:-translate-y-1 ${
                    isSelected 
                      ? "border-[#2D6B4F] bg-white shadow-lg shadow-[#2D6B4F]/10" 
                      : "border-transparent bg-white/50 hover:bg-white hover:border-[#EBC99B]/50"
                  }`}
                >
                  <div className={`flex-shrink-0 mr-6 transition-colors duration-300 ${isSelected ? "text-[#2D6B4F]" : "text-[#6B756B] group-hover:text-[#EBC99B]"}`}>
                    {isSelected ? (
                      <CheckCircle2 size={32} strokeWidth={2} />
                    ) : (
                      <Circle size={32} strokeWidth={1.5} />
                    )}
                  </div>
                  <span className={`text-xl md:text-2xl font-medium transition-colors duration-300 ${isSelected ? "text-[#1F3D2C]" : "text-[#6B756B]"}`}>
                    {service}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="w-full lg:w-96 sticky top-8 flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#EBC99B]/30 relative overflow-hidden">
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#2D6B4F]"></div>
              
              <h3 className="text-2xl font-serif mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Selections
              </h3>
              
              {selectedServices.length === 0 ? (
                <p className="text-[#6B756B] mb-8 italic">
                  Select one or more services to get started.
                </p>
              ) : (
                <ul className="mb-8 space-y-3 flex flex-col min-h-[120px]">
                  {selectedServices.map((service, i) => (
                    <li key={i} className="flex items-start text-sm text-[#1F3D2C] animate-in fade-in slide-in-from-left-4 duration-300">
                      <Check size={16} className="text-[#2D6B4F] mt-0.5 mr-2 flex-shrink-0" />
                      <span className="leading-tight">{service}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pt-6 border-t border-[#EBC99B]/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-[#6B756B] uppercase tracking-wider">Total Selected</span>
                  <span className="text-2xl font-serif text-[#2D6B4F]">{selectedServices.length}</span>
                </div>
                
                <button
                  onClick={handleRequestClick}
                  disabled={selectedServices.length === 0}
                  className={`w-full py-4 px-6 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                    selectedServices.length > 0
                      ? "bg-[#2D6B4F] text-white hover:bg-[#1F3D2C] hover:shadow-lg hover:shadow-[#2D6B4F]/20 cursor-pointer"
                      : "bg-[#6B756B]/10 text-[#6B756B] cursor-not-allowed"
                  }`}
                >
                  Request Custom Services
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reveal Form */}
        {showForm && (
          <div 
            ref={formRef}
            className="mt-24 pt-24 border-t border-[#EBC99B]/50 animate-in fade-in slide-in-from-bottom-8 duration-700"
          >
            <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5F2EA] rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <div className="mb-10 text-center relative z-10">
                <h3 className="text-3xl font-serif mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Let's Make It Happen
                </h3>
                <p className="text-[#6B756B]">
                  Tell us a bit about yourself, and we'll get back to you with a tailored plan.
                </p>
              </div>

              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F3D2C]">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-[#6B756B]/20 bg-[#F5F2EA]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6B4F]/50 focus:border-transparent transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1F3D2C]">Business Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-[#6B756B]/20 bg-[#F5F2EA]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6B4F]/50 focus:border-transparent transition-all"
                      placeholder="Acme Co."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F3D2C]">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-[#6B756B]/20 bg-[#F5F2EA]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6B4F]/50 focus:border-transparent transition-all"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1F3D2C]">Tell us what you need</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl border border-[#6B756B]/20 bg-[#F5F2EA]/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6B4F]/50 focus:border-transparent transition-all min-h-[150px] resize-y"
                    defaultValue={defaultMessage}
                  />
                </div>

                <div className="pt-6 flex flex-col md:flex-row items-center gap-6">
                  <button className="w-full md:w-auto bg-[#7D2A03] hover:bg-[#632002] text-white px-8 py-4 rounded-full font-medium transition-colors shadow-lg shadow-[#7D2A03]/20 flex-shrink-0">
                    Send Request
                  </button>
                  <div className="w-full md:w-auto text-center">
                    <span className="text-[#6B756B] mr-2">Prefer to chat?</span>
                    <a href="#" className="text-[#2D6B4F] font-medium hover:underline inline-flex items-center gap-1 group">
                      Book a Call
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
