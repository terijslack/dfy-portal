import React, { useState } from "react";
import { Check, Instagram, Facebook, Linkedin, Twitter, Store, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PlatformId = "instagram" | "facebook" | "linkedin" | "tiktok" | "google" | "x";

interface Platform {
  id: PlatformId;
  name: string;
  icon: React.ReactNode;
  placeholder: string;
}

const PLATFORMS: Platform[] = [
  { id: "instagram", name: "Instagram", icon: <Instagram className="w-8 h-8" />, placeholder: "@yourhandle" },
  { id: "facebook", name: "Facebook", icon: <Facebook className="w-8 h-8" />, placeholder: "facebook.com/yourpage" },
  { id: "linkedin", name: "LinkedIn", icon: <Linkedin className="w-8 h-8" />, placeholder: "linkedin.com/company/yourpage" },
  { id: "tiktok", name: "TikTok", icon: <Music2 className="w-8 h-8" />, placeholder: "@yourhandle" },
  { id: "google", name: "Google Business", icon: <Store className="w-8 h-8" />, placeholder: "Business Profile Link" },
  { id: "x", name: "X (Twitter)", icon: <Twitter className="w-8 h-8" />, placeholder: "@yourhandle" },
];

export function CardGrid() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<PlatformId>>(new Set());
  const [handles, setHandles] = useState<Record<string, string>>({});

  const togglePlatform = (id: PlatformId) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleInputChange = (id: PlatformId, value: string) => {
    setHandles((prev) => ({ ...prev, [id]: value }));
  };

  const activePlatforms = PLATFORMS.filter((p) => selectedPlatforms.has(p.id));

  return (
    <div 
      className="min-h-screen p-6 md:p-12 font-sans flex items-center justify-center" 
      style={{ backgroundColor: "#F5F2EA", color: "#1F3D2C", fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#EBC99B]/30">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#1F3D2C" }}>Where can we find you?</h2>
          <p className="text-gray-600">Select the platforms your business is active on.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {PLATFORMS.map((platform) => {
            const isSelected = selectedPlatforms.has(platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected 
                    ? "border-[#2D6B4F] bg-[#2D6B4F]/5 shadow-sm" 
                    : "border-gray-100 bg-gray-50 hover:border-[#EBC99B] hover:bg-gray-100/50"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-[#2D6B4F] text-white rounded-full p-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
                <div 
                  className={`mb-3 transition-colors ${isSelected ? "text-[#2D6B4F]" : "text-gray-400"}`}
                >
                  {platform.icon}
                </div>
                <span className={`font-medium text-sm ${isSelected ? "text-[#1F3D2C]" : "text-gray-500"}`}>
                  {platform.name}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-8 border-t border-gray-100">
          <h3 className="text-xl font-bold mb-6" style={{ color: "#1F3D2C" }}>Your handles</h3>
          
          {activePlatforms.length === 0 ? (
            <div className="text-center py-8 rounded-xl border border-dashed border-gray-200 bg-gray-50">
              <p className="text-gray-500 text-sm">Select at least one platform above to add your handles.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {activePlatforms.map((platform) => (
                <div key={`input-${platform.id}`} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <Label htmlFor={platform.id} className="md:w-32 font-medium shrink-0 flex items-center gap-2" style={{ color: "#1F3D2C" }}>
                    <div className="text-[#2D6B4F] w-5 h-5 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4">
                      {platform.icon}
                    </div>
                    {platform.name}
                  </Label>
                  <Input
                    id={platform.id}
                    placeholder={platform.placeholder}
                    value={handles[platform.id] || ""}
                    onChange={(e) => handleInputChange(platform.id, e.target.value)}
                    className="flex-1 focus-visible:ring-[#2D6B4F]"
                  />
                </div>
              ))}
              
              <div className="pt-6 flex justify-end">
                <Button 
                  className="px-8 py-6 text-base rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#2D6B4F", color: "white" }}
                >
                  Save Handles
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardGrid;
