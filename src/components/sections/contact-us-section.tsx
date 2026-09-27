"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/api-config";
const countries = [
    { code: "+91", flag: "🇮🇳", name: "India" },
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+971", flag: "🇦🇪", name: "United Arab Emirates" },
    { code: "+65", flag: "🇸🇬", name: "Singapore" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
];
export function ContactUsSection() {
    const [name, setName] = useState("");
    const [phonePrefix, setPhonePrefix] = useState("+91");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [knownSource, setKnownSource] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        if (showSuccessModal) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [showSuccessModal]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || isLoading)
            return;
        setIsLoading(true);
        try {
            const requestBody: any = {
                name: name.trim(),
                email: email.trim(),
                source: knownSource,
                interests: knownSource ? [knownSource] : []
            };
            if (phone.trim()) {
                requestBody.mobile_number = `${phonePrefix.trim()}${phone.trim()}`.trim();
            }
            const response = await fetch(`${API_BASE_URL}/api/subscribers/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            if (response.ok) {
                setShowSuccessModal(true);
            }
            else {
                const errData = await response.json().catch(() => ({}));
                let errorMessage = errData.detail;
                if (!errorMessage && typeof errData === "object" && errData !== null) {
                    const messages = Object.entries(errData)
                        .map(([field, errs]) => Array.isArray(errs) ? `${field}: ${errs.join(", ")}` : `${field}: ${errs}`)
                        .filter(Boolean);
                    if (messages.length > 0) {
                        errorMessage = messages.join("\n");
                    }
                }
                alert(errorMessage || "Failed to subscribe. Please check your inputs and try again.");
            }
        }
        catch (err) {
            console.error("Error subscribing:", err);
            alert("Network error. Please check your internet connection and try again.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleClose = () => {
        setShowSuccessModal(false);
        setName("");
        setPhone("");
        setPhonePrefix("+91");
        setSelectedCountry(countries[0]);
        setEmail("");
        setKnownSource("");
    };
    return (<section id="contact" className="w-full bg-[#FFFDF4] py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="w-full mb-8 flex justify-start">
          <span className="inline-flex items-center px-6 py-2 text-sm font-semibold uppercase tracking-widest rounded-full bg-[#FFEAC9] text-[#B06D1A]">
            CONTACT US
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-16 lg:gap-12 xl:gap-20">

          
          <div className="flex-1 w-full max-w-2xl lg:max-w-none flex flex-col justify-start">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-[54px] xl:text-[64px] font-black text-[#0f1a2c] leading-[1.05] tracking-tight mb-4">
                <span className="whitespace-nowrap">Let&apos;s Make <span className="text-[#fe9800]">Financial</span></span><br />
                <span className="text-[#fe9800]">Goals</span> Reality.
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-snug mb-12 max-w-md lg:max-w-lg font-medium">
                Tell us your financial goals and we&apos;ll help create a strategy designed for long-term growth and security.
              </p>
              <div className="relative w-full max-w-[500px] aspect-square -mt-4">
                <Image src="/bro.svg" alt="Financial Planning" fill className="object-contain object-left-top"/>
              </div>
            </div>
          </div>

          
          <div className="flex-1 w-full max-w-2xl lg:max-w-none h-full lg:min-h-full py-4">
            <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-[0_0_60px_rgba(254,152,0,0.25)] relative transition-shadow hover:shadow-[0_0_80px_rgba(254,152,0,0.35)] h-full flex flex-col justify-center min-h-[720px]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#0f1a2c] tracking-wide">
                    Full Name
                  </label>
                  <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border-b border-gray-300 pb-2 text-lg md:text-xl focus:outline-none focus:border-[#fe9800] transition-colors placeholder:text-gray-400 placeholder:italic font-medium text-gray-800 bg-transparent"/>
                </div>

                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#0f1a2c] tracking-wide">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-4 border-b border-gray-300 pb-2 relative">
                    
                    <div className="relative" ref={dropdownRef}>
                      <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-1.5 text-lg font-medium text-gray-800 focus:outline-none cursor-pointer select-none hover:text-[#fe9800] transition-colors">
                        <span className="text-xl">{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                        <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>

                      
                      {isDropdownOpen && (<div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-2 animate-modal-zoom">
                          {countries.map((c) => (<button key={c.code} type="button" onClick={() => {
                    setSelectedCountry(c);
                    setPhonePrefix(c.code);
                    setIsDropdownOpen(false);
                }} className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-3 transition-colors text-sm font-medium text-gray-700 hover:text-gray-900">
                              <span className="text-lg">{c.flag}</span>
                              <span className="text-gray-500 w-10">{c.code}</span>
                              <span className="truncate">{c.name}</span>
                            </button>))}
                        </div>)}
                    </div>

                    
                    <div className="h-6 w-[1px] bg-gray-300"></div>

                    
                    <input type="tel" placeholder="XXXXXXXXXX" value={phone} onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            setPhone(val);
        }} className="flex-1 text-lg md:text-xl focus:outline-none placeholder:text-gray-400 placeholder:italic font-medium text-gray-800 bg-transparent border-none p-0 focus:ring-0"/>
                  </div>
                </div>

                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#0f1a2c] tracking-wide">
                    Email ID
                  </label>
                  <input type="email" placeholder="name@domain.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-b border-gray-300 pb-2 text-lg md:text-xl focus:outline-none focus:border-[#fe9800] transition-colors placeholder:text-gray-400 placeholder:italic font-medium text-gray-800 bg-transparent"/>
                </div>

                
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-[#0f1a2c] tracking-wide">
                    Known Us From
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {["Instagram", "Facebook", "Meta Ads", "Google Ads", "Website", "Other"].map((source) => (<button key={source} type="button" onClick={() => {
                setKnownSource(knownSource === source ? "" : source);
            }} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all border cursor-pointer select-none ${knownSource === source
                ? "bg-[#132644] text-white border-[#132644] shadow-md"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100"}`}>
                        {source}
                      </button>))}
                  </div>
                </div>

                
                <button type="submit" disabled={isLoading} className="mt-6 bg-[#132644] hover:bg-[#0d1b32] disabled:bg-gray-400 text-white font-bold text-lg h-14 rounded-full w-full max-w-[220px] transition-all shadow-[0_8px_20px_rgba(19,38,68,0.2)] hover:shadow-[0_8px_25px_rgba(19,38,68,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed group">
                  {isLoading ? (<>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>) : (<>
                      Get Started
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"/>
                      </svg>
                    </>)}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      
      {showSuccessModal && (<>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes modalFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes modalZoomIn {
              from { transform: scale(0.95); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            .animate-modal-fade {
              animation: modalFadeIn 0.25s ease-out forwards;
            }
            .animate-modal-zoom {
              animation: modalZoomIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
          ` }}/>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-modal-fade">
            <div className="bg-white rounded-[32px] w-full max-w-[480px] p-8 md:p-10 shadow-2xl flex flex-col items-center text-center animate-modal-zoom relative border border-gray-100">
              
              <div className="relative w-full h-[220px] mb-6">
                <Image src="/confirm.svg" alt="Subscription Confirmed" fill className="object-contain" priority/>
              </div>

              
              <h3 className="text-[#0f1a2c] font-black text-3xl leading-tight mb-3">
                Thank You for <br />
                <span className="text-[#fe9800]">Subscribing!</span>
              </h3>

              
              <p className="text-gray-600 font-medium text-sm md:text-base mb-8 max-w-sm">
                Welcome to the Solid Wealth community. <br />
                You&apos;ll now receive expert market insights, investment updates, and wealth-building strategies directly in your inbox.
              </p>

              
              <div className="flex gap-4 w-full">
                <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="flex-1 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-colors text-sm">
                  View Inbox
                </a>
                <button onClick={handleClose} className="flex-1 h-12 bg-[#1a2332] hover:bg-[#121924] text-white font-bold rounded-full transition-colors text-sm">
                  Close
                </button>
              </div>
            </div>
          </div>
        </>)}
    </section>);
}
