import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Music2, 
  Search, 
  Twitter, 
  CheckCircle2, 
  Circle,
  ChevronDown
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  steps: string[];
  placeholder: string;
}

const platforms: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    placeholder: '@yourname',
    steps: [
      'Open Instagram app.',
      'Tap your profile photo bottom-right.',
      'Your handle appears as @yourname at the top.'
    ]
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    placeholder: '@handle',
    steps: [
      'Go to your Facebook Page.',
      'Click "Edit Page Info".',
      'Your @handle is listed under "Username".'
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    placeholder: 'company-name',
    steps: [
      'Visit your LinkedIn Company Page.',
      'Click "Edit page".',
      'Find "Public URL" — the last segment is your handle.'
    ]
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: Music2,
    placeholder: '@username',
    steps: [
      'Open TikTok.',
      'Tap the profile icon bottom-right.',
      'Your @username is shown below your profile photo.'
    ]
  },
  {
    id: 'google',
    name: 'Google Business',
    icon: Search,
    placeholder: 'Business Name',
    steps: [
      'Search your business name on Google.',
      'Click your listing.',
      'Your business name from the panel is what to share here.'
    ]
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: Twitter,
    placeholder: '@username',
    steps: [
      'Go to X.com.',
      'Click your profile.',
      'Your @username is shown directly below your display name.'
    ]
  }
];

export function AccordionGuide() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [handles, setHandles] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const handleDone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompleted(prev => ({ ...prev, [id]: true }));
    setOpenId(null);
  };

  return (
    <div className="min-h-screen font-sans flex items-center justify-center p-6 sm:p-12" style={{ backgroundColor: '#F5F2EA', color: '#1F3D2C' }}>
      <div className="max-w-2xl w-full mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-serif mb-3 tracking-tight" style={{ color: '#1F3D2C' }}>Connect your accounts</h2>
          <p className="text-lg opacity-80" style={{ color: '#1F3D2C' }}>
            We'll need your social media handles so our team knows where to post.
          </p>
        </div>

        <div className="space-y-3">
          {platforms.map((platform) => {
            const isOpen = openId === platform.id;
            const isDone = completed[platform.id];
            const value = handles[platform.id] || '';

            return (
              <div 
                key={platform.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border transition-all duration-300"
                style={{ 
                  borderColor: isOpen ? '#2D6B4F' : 'rgba(31, 61, 44, 0.1)',
                  boxShadow: isOpen ? '0 4px 20px rgba(45, 107, 79, 0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <button
                  onClick={() => toggleAccordion(platform.id)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-gray-50 focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: isDone ? 'rgba(45, 107, 79, 0.1)' : '#F5F2EA',
                        color: isDone ? '#2D6B4F' : '#1F3D2C' 
                      }}
                    >
                      <platform.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg" style={{ color: '#1F3D2C' }}>{platform.name}</h3>
                      {isDone && value && (
                        <p className="text-sm mt-0.5" style={{ color: '#2D6B4F' }}>{value}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6" style={{ color: '#2D6B4F' }} />
                    ) : (
                      <Circle className="w-6 h-6 opacity-20" style={{ color: '#1F3D2C' }} />
                    )}
                    <ChevronDown 
                      className="w-5 h-5 opacity-40 transition-transform duration-300" 
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
                    />
                  </div>
                </button>

                <div 
                  className="grid transition-all duration-300 ease-in-out"
                  style={{ 
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    opacity: isOpen ? 1 : 0
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="p-5 pt-0 border-t" style={{ borderColor: 'rgba(31, 61, 44, 0.05)' }}>
                      <div className="mt-5 mb-6 pl-14">
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-60">How to find it</h4>
                        <ul className="space-y-3">
                          {platform.steps.map((step, idx) => (
                            <li key={idx} className="flex gap-3 text-[15px] leading-relaxed opacity-90">
                              <span className="font-semibold opacity-50">{idx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pl-14 pr-4 pb-2 flex gap-3">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setHandles({ ...handles, [platform.id]: e.target.value })}
                          placeholder={platform.placeholder}
                          className="flex-1 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                          style={{ 
                            borderColor: 'rgba(31, 61, 44, 0.1)',
                            focusRing: '#2D6B4F'
                          }}
                        />
                        <button
                          onClick={(e) => handleDone(platform.id, e)}
                          disabled={!value.trim()}
                          className="px-6 py-3 rounded-lg font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#2D6B4F' }}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
