import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Instagram, Facebook, Linkedin, Twitter, Store } from "lucide-react";

// TikTok SVG
const TiktokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
  </svg>
);

type PlatformId = "instagram" | "facebook" | "linkedin" | "tiktok" | "google_business" | "twitter";

interface PlatformData {
  id: PlatformId;
  name: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  instruction: string;
  placeholder: string;
}

const platforms: PlatformData[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "#E1306C",
    instruction: "Open the app → tap your profile photo → handle shown as @yourname",
    placeholder: "@yourname",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    instruction: "Go to your Page → Edit Page Info → username appears under Username",
    placeholder: "username or URL",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    instruction: "Go to your Company Page → Edit page → Public URL last segment",
    placeholder: "company-name",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: TiktokIcon,
    color: "#000000",
    instruction: "Open app → tap profile → shown as @yourname below your photo",
    placeholder: "@yourname",
  },
  {
    id: "google_business",
    name: "Google Business",
    icon: Store,
    color: "#4285F4",
    instruction: "Search your business on Google → click listing → business name in the panel",
    placeholder: "Business Name",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "#000000",
    instruction: "Go to X.com → click profile → @username shown below display name",
    placeholder: "@username",
  },
];

export function InstructionWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [handles, setHandles] = useState<Record<string, string>>({});

  const isSummary = currentStep === platforms.length;
  const platform = platforms[currentStep];

  const handleNext = () => {
    if (currentStep < platforms.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHandles({
      ...handles,
      [platform.id]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Submitted handles:", handles);
    alert("Handles saved successfully!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: "#F5F2EA", fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col relative">
        {/* Progress Bar Header */}
        {!isSummary && (
          <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`p-2 -ml-2 rounded-full transition-colors ${
                currentStep === 0 ? "opacity-0 pointer-events-none" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex-1 px-4">
              <div className="text-xs font-semibold text-center mb-1" style={{ color: "#1F3D2C" }}>
                Step {currentStep + 1} of {platforms.length}
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{
                    backgroundColor: "#2D6B4F",
                    width: `${((currentStep + 1) / platforms.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          {!isSummary ? (
            <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto shadow-sm" style={{ backgroundColor: `${platform.color}15` }}>
                <platform.icon className="w-8 h-8" style={{ color: platform.color }} />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "#1F3D2C" }}>
                {platform.name}
              </h2>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed text-center">
                  {platform.instruction}
                </p>
              </div>

              <div className="mt-auto mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your {platform.name} Handle
                </label>
                <input
                  type="text"
                  value={handles[platform.id] || ""}
                  onChange={handleInputChange}
                  placeholder={platform.placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-transparent focus:ring-2 focus:ring-[#2D6B4F] outline-none transition-shadow text-gray-900 placeholder:text-gray-400"
                  autoFocus
                />
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
                style={{ backgroundColor: "#2D6B4F" }}
              >
                {currentStep === platforms.length - 1 ? "Review Setup" : "Next Platform"}
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center justify-center w-16 h-16 rounded-full mb-6 mx-auto" style={{ backgroundColor: "#EBC99B" }}>
                <CheckCircle2 className="w-8 h-8" style={{ color: "#1F3D2C" }} />
              </div>

              <h2 className="text-2xl font-bold text-center mb-2" style={{ color: "#1F3D2C" }}>
                You're all set!
              </h2>
              <p className="text-center text-gray-500 mb-8">
                Here are the handles you've provided for our marketing team.
              </p>

              <div className="space-y-3 mb-8 flex-1 overflow-y-auto pr-2">
                {platforms.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <p.icon className="w-5 h-5" style={{ color: p.color }} />
                      <span className="font-medium text-sm text-gray-700">{p.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 max-w-[140px] truncate">
                      {handles[p.id] || <span className="italic opacity-50">Skipped</span>}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="flex-1 py-3.5 px-4 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3.5 px-4 rounded-xl font-semibold text-white shadow-sm transition-transform active:scale-[0.98]"
                  style={{ backgroundColor: "#2D6B4F" }}
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
