import Link from "next/link";
import Image from "next/image";
import { FaApple, FaPlay, FaLinkedinIn, FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";
import { appLinks } from "@/lib/app-links";
export function Footer() {
    return (<footer className="w-full bg-[#FFFDF4] px-3 sm:px-6 lg:px-8 pb-4 md:pb-6">
      <div className="mx-auto max-w-[95%] bg-[#0f172a] rounded-xl p-6 lg:p-8 flex flex-col gap-6 md:gap-8 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

          
          <div className="md:col-span-8 lg:col-span-9 flex flex-col items-start gap-4">

            
            <Link href="/" className="flex items-center gap-2 mb-1">
              <Image src="/logo1.png" alt="Solid Wealth Logo" width={36} height={36} className="object-contain md:w-[44px] md:h-[44px]"/>
              <span className="text-white font-bold text-2xl md:text-4xl leading-tight">
                Solid<br />Wealth
              </span>
            </Link>

            
            <p className="text-[#94a3b8] text-sm md:text-xl max-w-[700px] leading-relaxed">
              Solid Wealth is a trusted financial advisory firm dedicated to helping individuals and
              businesses grow, protect, and preserve their wealth through strategic investment solutions.
            </p>

            
            <div className="flex gap-2.5 md:gap-3 mt-1">
              {[
            { icon: FaPlay, label: "Google Play Store", href: appLinks.android },
            { icon: FaApple, label: "Apple App Store", href: appLinks.ios },
            { icon: FaLinkedinIn, label: "LinkedIn", href: "https://www.linkedin.com/company/solid-wealth/?originalSubdomain=in" },
            { icon: FaFacebookF, label: "Facebook", href: "#" },
            { icon: FaInstagram, label: "Instagram", href: "#" },
            { icon: FaEnvelope, label: "Email", href: "mailto:solidwealthy@gmail.com" }
        ].map((Social, idx) => (<a key={idx} href={Social.href} target={Social.href.startsWith("http") ? "_blank" : undefined} rel={Social.href.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={Social.label} className="w-10 h-10 md:w-12 md:h-12 bg-[#fe9800] rounded-lg md:rounded-xl flex items-center justify-center text-[#0f172a] hover:bg-orange-400 hover:scale-105 transition-all">
                  <Social.icon className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]"/>
                </a>))}
            </div>
          </div>

          
          <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-3 md:gap-4">
            <h3 className="text-[#fe9800] font-bold text-xl md:text-3xl mb-1">Links</h3>
            <div className="flex flex-col gap-2 md:gap-3 text-base md:text-xl">
              {[
            { label: "Home", href: "/" },
            { label: "Learn Investment", href: "/research" },
            { label: "Calculators", href: "/calculators" },
            { label: "Mutual Funds", href: "/#mutual-funds" },
            { label: "Blogs", href: "/blog" },
        ].map((link) => (<Link key={link.label} href={link.href} className="text-gray-300 hover:text-white font-medium transition-colors">
                  {link.label}
                </Link>))}
            </div>
          </div>
        </div>

        
        <div className="border-t border-slate-700/50 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm md:text-lg text-slate-500 font-medium">
          <p>
            Solidwealth <span className="text-blue-500 ml-1">&copy;</span> 2026
          </p>
          <p>All rights reserved</p>
        </div>
      </div>
    </footer>);
}
