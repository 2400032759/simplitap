import { Link } from "react-router-dom";
import { useProfileRedirect } from "@/hooks/useProfileRedirect";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/simplify-tap/Navbar";
import { Footer } from "@/components/simplify-tap/Footer";
import { PhoneMockup } from "@/components/simplify-tap/PhoneMockup";
import { DigitalCard } from "@/components/simplify-tap/DigitalCard";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {
  Smartphone,
  Share2,
  RefreshCw,
  Leaf,
  Shield,
  ArrowRight,
  Check,
  Crown,
  Zap
} from "lucide-react";

/* 
  OrderModal Component
*/
const OrderModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
    <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 text-center ring-1 ring-black/5 animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Order Confirmed!</h2>
      <p className="text-[#64748B] mb-8 leading-relaxed">
        Thank you for your purchase. You will receive an email confirmation shortly.
      </p>
      <div className="space-y-3">
        <Button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium shadow-xl shadow-teal-900/5"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  </div>
);

const Index = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { checkProfileAndRedirect } = useProfileRedirect();
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      checkProfileAndRedirect();
    }
  }, [isLoaded, isSignedIn, checkProfileAndRedirect]);

  const handleOrder = () => {
    setTimeout(() => {
      setShowOrderSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-[#0F172A] selection:bg-primary/10 selection:text-teal-900">
      <Navbar />

      {/* 
        HERO SECTION 
      */}
      <section className="pt-32 md:pt-40 pb-8 md:pb-12 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-20 items-center">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left z-10">
            <h1 className="hidden md:block text-5xl lg:text-7xl font-bold tracking-tight text-[#0F172A] mb-6 leading-[1.1]">
              Simplifying the way <br /> <span className="text-primary">we connect.</span>
            </h1>
            <h1 className="md:hidden text-4xl font-bold tracking-tight text-[#0F172A] mb-4 leading-tight">
              Simplifying the way <span className="text-primary">we connect.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#64748B] leading-relaxed mb-8 md:mb-10 font-normal max-w-lg mx-auto lg:mx-0">
              A free digital business card you can upgrade anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start w-full">
              <Link to="/create" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-base shadow-lg shadow-primary/20 transition-all">
                  Create free digital card
                </Button>
              </Link>
              <Link to="/nfc" className="text-[#0F172A] font-medium hover:text-primary transition-colors flex items-center gap-1 group py-2">
                Buy NFC card <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center items-center mt-0 lg:mt-0">
            <div className="hidden md:block transform scale-90 lg:scale-100">
              <PhoneMockup />
            </div>
            <div className="md:hidden transform scale-75 -mt-24 -mb-12 origin-center">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* 
        ONE CARD, ENDLESS CONNECTIONS
      */}
      <section className="py-20 px-6 md:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-teal-50/50 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[#0F172A] mb-6">
            One card. <span className="text-primary">Endless connections.</span>
          </h2>
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto mb-16 leading-relaxed">
            Replace your stack of paper cards with a single, smart digital profile that instantly shares who you are and what you do.
          </p>

          <div className="relative mx-auto max-w-4xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 md:p-16 overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="text-left space-y-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A]">Share Instantly</h3>
                  <p className="text-[#64748B]">Tap your card or scan your QR code to instantly share your contact info, social links, and more.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A]">Always Up-to-Date</h3>
                  <p className="text-[#64748B]">Changed your number? Update your profile in seconds and your card stays current. No reprinting needed.</p>
                </div>
              </div>

              {/* Central Visual - Custom NFC Card */}
              <div className="relative flex justify-center perspective-1000">
                <div className="w-80 h-52 bg-gradient-to-br from-[#0097B2] to-[#33CCCC] rounded-2xl shadow-2xl relative overflow-hidden transform rotate-6 hover:rotate-0 transition-all duration-500 border border-white/20 flex flex-col justify-between p-6 group cursor-pointer">
                  {/* Card Surface Effects */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none group-hover:opacity-100 transition-opacity mix-blend-overlay" />

                  <div className="flex justify-between items-start z-10 w-full opacity-90">
                    <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-sm">
                      <Zap className="w-5 h-5 text-white fill-current" />
                    </div>
                    {/* Chip Mock */}
                    <div className="w-10 h-7 rounded border border-white/40 grid grid-cols-2 gap-0.5 p-1 bg-white/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/20 to-transparent" />
                    </div>
                  </div>

                  <div className="z-10 text-white text-center pb-2">
                    <div className="font-bold text-2xl tracking-widest drop-shadow-md">SIMPLIFY</div>
                    <div className="text-xs tracking-[0.3em] font-light opacity-90">ACCESS CARD</div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-[3000ms]">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-[#0F172A]">Tap to share</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 
        HOW IT WORKS
      */}
      <section className="py-20 px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">How Simplify Tap Works</h2>
            <p className="text-[#64748B]">From creation to connection in five simple steps.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {[
                { title: "Create Free Profile", desc: "Sign up and build your identity.", icon: "1", delay: "delay-0" },
                { title: "Customise", desc: "Add your photo, logo & colors.", icon: "2", delay: "delay-100" },
                { title: "Publish", desc: "Go live with your unique link.", icon: "3", delay: "delay-200" },
                { title: "Order NFC Card", desc: "Get a physical card to tap.", icon: "4", delay: "delay-300" },
                { title: "Integrate & Share", desc: "Connect and grow your network.", icon: "5", delay: "delay-400" }
              ].map((step, i) => (
                <div
                  key={i}
                  className={`group relative bg-white md:bg-transparent p-6 md:p-0 rounded-2xl border md:border-0 border-gray-100 md:text-center hover:bg-white transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 fill-mode-both ${step.delay} hover:-translate-y-2 hover:shadow-xl md:hover:shadow-none`}
                >
                  <div className="w-12 h-12 md:w-24 md:h-24 mx-auto bg-white rounded-full border-2 border-primary text-primary flex items-center justify-center font-bold text-xl md:text-3xl mb-4 md:mb-6 shadow-sm group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 relative z-10">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 
        FEATURE SHOWCASE (Bento Grid)
      */}
      <section className="py-20 px-6 md:px-8 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">Everything you need to <br /> grow your network.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Feature 1: Large Left - NO APP */}
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="relative z-10 max-w-md h-full flex flex-col justify-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Smartphone className="w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-[#0F172A] mb-4">No App Required</h3>
                <p className="text-[#64748B] text-lg leading-relaxed mb-8">
                  Forget about forcing people to download apps. Your digital card works instantly in any browser, on any device. Just tap or scan.
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Safari', 'Chrome', 'Firefox'].map(browser => (
                    <span key={browser} className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600">
                      {browser}
                    </span>
                  ))}
                </div>
              </div>

              {/* Decorative Browser Visual on Right */}
              <div className="absolute top-1/2 right-0 translate-x-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-gray-50 rounded-xl border border-gray-200 shadow-xl rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500 hidden md:block p-4">
                <div className="w-full h-4 bg-gray-200 rounded-full mb-4 opacity-50" />
                <div className="space-y-3">
                  <div className="w-3/4 h-3 bg-gray-200 rounded-full opacity-30" />
                  <div className="w-full h-3 bg-gray-200 rounded-full opacity-30" />
                  <div className="w-5/6 h-3 bg-gray-200 rounded-full opacity-30" />
                </div>
                <div className="mt-8 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Top Right - SECURE */}
            <div className="bg-[#0F172A] rounded-3xl p-8 text-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Enterprise-grade security. You control exactly what you share with whom.</p>
                </div>
              </div>
              {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-24 h-24 border-2 border-white/5 rounded-full" />
              <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-32 h-32 border-2 border-white/5 rounded-full" />
            </div>

            {/* Feature 3: Bottom Right - SUSTAINABLE */}
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-6 text-green-600">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Sustainable</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">Save thousands of paper cards. Good for your wallet, better for the planet.</p>
              </div>
              <Leaf className="absolute -bottom-4 -right-4 w-32 h-32 text-green-50 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* 
        TRUSTED BY PROFESSIONALS (Testimonials - Scrolling)
      */}
      <section className="py-20 bg-white border-t border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8 mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Loved by innovators</h2>
          <p className="text-[#64748B]">Join thousands of professionals growing their network.</p>
        </div>

        <div className="relative w-full">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scroller */}
          <div className="flex w-max animate-scroll gap-6 hover:pause">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-6">
                {[
                  {
                    text: "The easiest way to share my contact info. I haven't carried paper cards in months.",
                    author: "Sarah J.",
                    role: "Creative Director"
                  },
                  {
                    text: "Clients are always impressed when I tap my phone. It's an instant conversation starter.",
                    author: "Michael C.",
                    role: "Real Estate Agent"
                  },
                  {
                    text: "Sustainable, smart, and looks amazing. Simplify Tap is a no-brainer for our sales team.",
                    author: "Priya R.",
                    role: "Tech Founder"
                  },
                  {
                    text: "Setup was incredibly fast. I was sharing my new profile within minutes of signing up.",
                    author: "David K.",
                    role: "Freelance Designer"
                  },
                  {
                    text: "The analytics are a game changer. I know exactly who visited my profile.",
                    author: "Sonia M.",
                    role: "Marketing Manager"
                  }
                ].map((review, i) => (
                  <div key={`${setIndex}-${i}`} className="w-[350px] bg-gray-50 p-8 rounded-3xl border border-gray-100 relative group hover:shadow-lg transition-all duration-300">
                    <div className="absolute top-6 right-6 text-6xl text-gray-200 font-serif leading-none opacity-50 group-hover:text-primary/20 transition-colors">"</div>
                    <div className="flex gap-1 text-yellow-400 mb-4">
                      {[...Array(5)].map((_, j) => (<div key={j} className="w-4 h-4 fill-current">★</div>))}
                    </div>
                    <p className="text-[#0F172A] mb-6 font-medium leading-relaxed relative z-10">"{review.text}"</p>
                    <div>
                      <div className="font-bold text-[#0F172A]">{review.author}</div>
                      <div className="text-sm text-[#64748B]">{review.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        FAQ
      */}
      <section className="py-20 px-6 md:px-8 bg-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "Is the digital card really free?", a: "Yes! You can create, customize, and share your digital card for free, forever. No credit card required." },
              { q: "Do I need an NFC device?", a: "No. You can share your card via QR code or link perfectly fine. The NFC card is just an optional premium way to share." },
              { q: "Does the other person need an app?", a: "Never. Your card opens in their phone's web browser instantly." },
              { q: "Can I update my info later?", a: "Anytime. Log in to your dashboard, update your details, and your card stays the same—no need to reprint anything." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-primary/50 transition-colors">
                <h3 className="font-bold text-[#0F172A] mb-2 text-lg">{item.q}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        FINAL CTA 
      */}
      <section className="py-24 px-6 md:px-8 bg-[#0F172A] text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e293b] via-[#0F172A] to-[#0F172A]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">Ready to upgrade your network?</h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">Join thousands of professionals using Simplify Tap to grow their business.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <Button className="h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 w-full sm:w-auto">
                Create free card
              </Button>
            </Link>
            <Link to="/nfc">
              <Button className="h-14 px-10 rounded-full bg-transparent border border-gray-700 text-white hover:bg-white hover:text-[#0F172A] hover:border-white transition-all w-full sm:w-auto font-semibold">
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      {showOrderSuccess && <OrderModal onClose={() => setShowOrderSuccess(false)} />}
    </div>
  );
};

export default Index;
