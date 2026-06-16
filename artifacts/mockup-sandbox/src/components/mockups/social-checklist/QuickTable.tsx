import React, { useState } from "react";
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  MapPin, 
  Twitter, 
  HelpCircle,
  Save,
  Check
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Platform = {
  id: string;
  name: string;
  icon: React.ReactNode;
  hint: string;
  placeholder: string;
};

const platforms: Platform[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram className="w-4 h-4" />,
    hint: "e.g. @yourbusiness",
    placeholder: "@handle",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <Facebook className="w-4 h-4" />,
    hint: "Your page URL or handle",
    placeholder: "Page name or URL",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin className="w-4 h-4" />,
    hint: "Company page URL",
    placeholder: "Company page",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>,
    hint: "e.g. @yourbusiness",
    placeholder: "@handle",
  },
  {
    id: "google",
    name: "Google Business",
    icon: <MapPin className="w-4 h-4" />,
    hint: "Your maps listing link",
    placeholder: "Maps URL",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: <Twitter className="w-4 h-4" />,
    hint: "e.g. @yourbusiness",
    placeholder: "@handle",
  },
];

export function QuickTable() {
  const [handles, setHandles] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const completedCount = Object.values(handles).filter((val) => val.trim() !== "").length;
  const totalCount = platforms.length;

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }, 600);
  };

  return (
    <div 
      className="min-h-[100dvh] w-full flex items-center justify-center p-4 font-sans" 
      style={{ backgroundColor: "#F5F2EA", color: "#1F3D2C", fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full max-w-3xl bg-white border border-stone-200 shadow-sm rounded-md overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50/50">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Social Handles</h2>
          </div>
          <div className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: "#F5F2EA", color: "#1F3D2C" }}>
            {completedCount} of {totalCount} added
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-stone-50 border-b border-stone-200 text-stone-500">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-medium w-48">Platform</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Handle / URL</th>
                <th scope="col" className="px-4 py-2.5 font-medium w-16 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {platforms.map((platform) => {
                const value = handles[platform.id] || "";
                const isDone = value.trim() !== "";
                
                return (
                  <tr key={platform.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400 group-hover:text-stone-600 transition-colors">
                          {platform.icon}
                        </span>
                        <span className="font-medium">{platform.name}</span>
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-stone-300 hover:text-stone-500 transition-colors focus:outline-none">
                                <HelpCircle className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="text-xs py-1 px-2 border-stone-200 shadow-sm" style={{ backgroundColor: "#1F3D2C", color: "#F5F2EA" }}>
                              <p>{platform.hint}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setHandles({ ...handles, [platform.id]: e.target.value })}
                        placeholder={platform.placeholder}
                        className="w-full bg-transparent border-0 border-b border-transparent hover:border-stone-200 focus:border-stone-300 focus:ring-0 px-0 py-1 transition-colors outline-none placeholder:text-stone-300"
                        style={{ color: "#1F3D2C" }}
                      />
                    </td>
                    <td className="px-4 py-2 text-center align-middle">
                      <div className="flex justify-center">
                        <div 
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isDone ? 'border-transparent' : 'border-stone-300 bg-stone-50'}`}
                          style={isDone ? { backgroundColor: "#2D6B4F", color: "white" } : {}}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-stone-200 flex justify-end bg-stone-50">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md text-white transition-all hover:opacity-90 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: "#2D6B4F" }}
          >
            {isSaving ? (
              <span className="animate-pulse">Saving...</span>
            ) : justSaved ? (
              <>
                <Check className="w-4 h-4" />
                Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default QuickTable;
