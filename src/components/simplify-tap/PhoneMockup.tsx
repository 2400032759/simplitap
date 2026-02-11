
import { DigitalCard } from "./DigitalCard";
import { Zap, Wifi, Battery, Signal } from "lucide-react";

interface PhoneMockupProps {
  className?: string;
}

export const PhoneMockup = ({ className = "" }: PhoneMockupProps) => {
  return (
    <div className={`relative ${className} w-[360px] h-[720px] flex items-center justify-center pointer-events-none`}>
      {/* 
        3D Stage Container 
      */}
      <div className="relative w-full h-full perspective-[1200px] preserve-3d">

        {/* 
          Main Float Wrapper 
        */}
        <div className="relative w-full h-full animate-float-slow preserve-3d flex items-center justify-center">

          {/* 
            NFC Card Layer
          */}
          <div className="absolute top-1/2 left-1/2 w-0 h-0 z-40 animate-tap-gesture-card preserve-3d">
            <div className="w-[140px] h-[220px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl border border-white/20 flex flex-col items-center justify-between p-4 transform-style-3d backface-visible">

              {/* Card Surface Effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-xl pointer-events-none mix-blend-overlay" />
              <div className="absolute inset-0 bg-noise opacity-10 rounded-xl" />

              {/* Card Content Top */}
              <div className="w-full flex justify-between items-start opacity-90">
                <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                  <Zap className="w-4 h-4 text-white fill-current" />
                </div>
                {/* Chip Mock */}
                <div className="w-8 h-6 rounded border border-white/40 grid grid-cols-2 gap-0.5 p-1 bg-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 to-transparent" />
                </div>
              </div>

              {/* Card Content Middle */}
              <div className="text-white text-center transform translate-z-10">
                <div className="font-bold text-lg tracking-widest drop-shadow-md">SIMPLIFY</div>
                <div className="text-[10px] tracking-[0.2em] font-light opacity-80">ACCESS CARD</div>
              </div>

              {/* Card Thickness (Pseudo-3D) */}
              <div className="absolute top-0 left-0 right-0 h-full w-1 bg-white/20 -translate-x-[1px] rounded-l-xl opacity-50 transform rotateY(-90deg) origin-left"></div>
            </div>
          </div>

          {/* 
             Phone Visual Layer 
          */}
          <div className="relative w-[300px] h-[600px] z-20">
            {/* Glossy Black Frame - THINNER BORDER MODIFICATION */}
            <div className="w-full h-full bg-[#121212] rounded-[3rem] p-1.5 shadow-2xl border-[2px] border-[#2a2a2a] ring-1 ring-white/10 relative overflow-hidden preserve-3d">

              {/* External Buttons */}
              <div className="absolute top-28 -left-[7px] w-[3px] h-8 bg-[#333] rounded-l-sm" />
              <div className="absolute top-44 -left-[7px] w-[3px] h-14 bg-[#333] rounded-l-sm" />
              <div className="absolute top-36 -right-[7px] w-[3px] h-20 bg-[#333] rounded-r-sm" />

              {/* Screen Bezel Area - THINNER BEZEL MODIFICATION */}
              <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative border-[2px] border-black">

                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 h-8 w-[100px] bg-black rounded-full z-50 flex items-center justify-center">
                  <div className="w-[90%] h-full flex justify-end items-center pr-2">
                    <div className="w-2 h-2 rounded-full bg-[#1a1a1a] ring-1 ring-white/5" />
                  </div>
                </div>

                {/* Status Bar */}
                <div className="absolute top-4 right-6 z-50 flex gap-1.5 opacity-90 scale-90 origin-right text-white">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-4 h-4" />
                </div>

                {/* 
                  SCREEN CONTENT 
                */}
                <div className="w-full h-full bg-black relative overflow-hidden">

                  {/* 
                     1. LOCK SCREEN / HOMESCREEN
                     Visible initially, fades out when app opens
                   */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center animate-wallpaper-fade">
                    {/* Apps Grid simulation */}
                    <div className="pt-24 px-6 grid grid-cols-4 gap-4">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className={`w-12 h-12 rounded-2xl ${i === 2 ? 'bg-primary' : 'bg-white/20 backdrop-blur-md'}`} />
                          <div className="w-8 h-1.5 bg-white/40 rounded-full" />
                        </div>
                      ))}
                    </div>

                    {/* Dock */}
                    <div className="absolute bottom-6 left-4 right-4 h-20 bg-white/10 backdrop-blur-xl rounded-[2rem] flex items-center justify-around px-2 animate-dock-slide">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-12 h-12 rounded-xl bg-gradient-to-b from-white/20 to-white/5" />
                      ))}
                    </div>
                  </div>

                  {/* 
                     2. APP OPENING ANIMATION
                     Starts small, expands to fill screen
                   */}
                  <div className="absolute inset-0 z-10 overflow-hidden bg-white origin-center animate-app-launch">
                    <div className="w-full h-full">
                      <DigitalCard
                        showBranding={false}
                        premium={true}
                        previewMode={true}
                        userData={{
                          firstName: "Abhijeet",
                          lastName: "Navandar",
                          title: "Founder",
                          company: "Simplify Tap",
                          bio: "Founder & CEO at SimplifyTap",
                          phone: "+919876543210",
                          email: "hello@simplifytap.com",
                          website: "simplifytap.com",
                          linkedin: "linkedin.com",
                          twitter: "x.com",
                          instagram: "instagram.com"
                        }}
                      />
                    </div>
                  </div>

                </div>

                {/* 
                  Interactive Notification
                */}
                <div className="absolute inset-0 z-50 pointer-events-none">
                  <div className="absolute top-0 left-1/2 w-[90%] bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 animate-notification-slide-enter flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shadow-inner">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground leading-tight">NFC Tag Detected</h4>
                      <p className="text-xs text-muted-foreground truncate">Opening Simplify Tap...</p>
                    </div>
                  </div>
                </div>

                {/* Screen Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-50 rounded-[3rem]" />
              </div>
            </div>
          </div>

          {/* 
            Ground Shadow
          */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/20 blur-[40px] rounded-full animate-shadow-breathe" />
        </div>
      </div>
    </div>
  );
};
