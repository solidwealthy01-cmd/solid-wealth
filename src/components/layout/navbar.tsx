"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/content";
import { courseLevels } from "@/lib/course-curriculum";
import { appLinks } from "@/lib/app-links";
import { cn } from "@/lib/utils";
const researchLevelLinks = courseLevels.map((level) => {
    const [firstModule, lastModule] = level.moduleRange;
    const moduleLabel = firstModule === lastModule
        ? `Module ${firstModule}`
        : `Modules ${firstModule}–${lastModule}`;
    return {
        title: `Level ${level.levelNumber}: ${level.title}`,
        description: `${moduleLabel} · ${level.focus}`,
        href: `/research/${level.id}`,
    };
});
const column1Links = researchLevelLinks.slice(0, 4);
const column2Links = researchLevelLinks.slice(4);
export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileResearchOpen, setIsMobileResearchOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const [isResearchOpen, setIsResearchOpen] = useState(false);
    const researchCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const researchItemRef = useRef<HTMLLIElement>(null);
    const cancelResearchClose = () => {
        if (researchCloseTimer.current) {
            clearTimeout(researchCloseTimer.current);
            researchCloseTimer.current = null;
        }
    };
    const openResearchMenu = () => {
        cancelResearchClose();
        setIsResearchOpen(true);
    };
    const closeResearchMenu = () => {
        cancelResearchClose();
        researchCloseTimer.current = setTimeout(() => {
            setIsResearchOpen(false);
        }, 180);
    };
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 15) {
                setIsScrolled(true);
            }
            else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (researchItemRef.current &&
                !researchItemRef.current.contains(event.target as Node)) {
                setIsResearchOpen(false);
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsResearchOpen(false);
                setIsMobileMenuOpen(false);
                setIsMobileResearchOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    useEffect(() => {
        return () => cancelResearchClose();
    }, []);
    useEffect(() => {
        if (!isMobileMenuOpen) {
            return;
        }
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileMenuOpen]);
    useEffect(() => {
        const desktopNavigation = window.matchMedia("(min-width: 1280px)");
        const handleBreakpointChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setIsMobileMenuOpen(false);
                setIsMobileResearchOpen(false);
            }
        };
        desktopNavigation.addEventListener("change", handleBreakpointChange);
        return () => {
            desktopNavigation.removeEventListener("change", handleBreakpointChange);
        };
    }, []);
    useEffect(() => {
        if (pathname !== "/") {
            return;
        }
        const handleScroll = () => {
            if (window.scrollY < 100) {
                setActiveSection("");
            }
        };
        const sections = ["features", "reviews", "mutual-funds", "download-app", "contact"];
        const observerOptions = {
            root: null,
            rootMargin: "-45% 0px -45% 0px",
            threshold: 0,
        };
        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            const visibleEntries = entries.filter((entry) => entry.isIntersecting);
            if (visibleEntries.length === 0) {
                return;
            }
            const activeEntry = visibleEntries.reduce((best, current) => {
                return current.intersectionRatio > best.intersectionRatio ? current : best;
            });
            setActiveSection(activeEntry.target.id);
        };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el)
                observer.observe(el);
        });
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);
    const isLinkActive = (href: string) => {
        if (href.startsWith("/#")) {
            const hash = href.substring(2);
            return pathname === "/" && activeSection === hash;
        }
        if (href.startsWith("/")) {
            const baseHref = href.split("?")[0].split("#")[0];
            if (baseHref === "/") {
                return pathname === "/";
            }
            return pathname.startsWith(baseHref);
        }
        return false;
    };
    return (<header className={cn("fixed inset-x-0 z-50 flex justify-center transition-all duration-500 ease-out", isScrolled ? "top-2 px-2 sm:top-4 sm:px-6" : "top-0 px-0 bg-transparent")}>
      <div className={cn("w-full transition-all duration-500 ease-out flex flex-col justify-center relative", isScrolled
            ? "max-w-[1050px] lg:max-w-[1280px] xl:max-w-[1360px] 2xl:max-w-[1440px] rounded-[16px] shadow-lg py-2.5 px-3.5 sm:py-3.5 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-xl border border-gray-200"
            : "max-w-full rounded-none py-3.5 px-4 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 shadow-none bg-white border-b border-[#eeeeee]")}>
        <nav aria-label="Main navigation" className="flex h-[54px] w-full items-center justify-between sm:h-[62px]">
          
          <Link className={cn("flex min-w-0 items-center gap-2 whitespace-nowrap font-display font-extrabold tracking-normal text-[#ff8500] no-underline transition-all duration-500 hover:opacity-90", isScrolled ? "text-[19px] sm:text-xl" : "text-xl sm:text-[24px]")} style={{ fontFamily: "var(--font-righteous)" }} href="/" onClick={() => {
            setIsMobileMenuOpen(false);
            setIsMobileResearchOpen(false);
          }}>
            <Image src="/logo1.png" alt="Solid Wealth Logo" width={32} height={32} className={cn("inline-flex shrink-0 object-contain transition-all duration-500", isScrolled ? "size-6" : "size-7 sm:size-8")}/>
            Solid Wealth
          </Link>

          
          <ul className="hidden items-center gap-3 xl:gap-[18px] 2xl:gap-[28px] xl:flex list-none m-0 p-0">
            {navLinks.map((link) => {
            const isResearchLink = link.href === "/research";
            if (isResearchLink) {
                return (<li className={cn("nav-item research-item relative", isResearchOpen && "active")} key={link.label} ref={researchItemRef} onMouseEnter={openResearchMenu} onMouseLeave={closeResearchMenu}>
                    <Link aria-controls="research-mega-menu" aria-expanded={isResearchOpen} aria-haspopup="true" className={cn("nav-link nav-link-underline flex items-center gap-[6px] font-semibold transition-colors duration-200 text-[14px] 2xl:text-[15px] whitespace-nowrap py-1 no-underline", isResearchOpen || isLinkActive(link.href)
                        ? "active text-[#ff8500]"
                        : "text-[#475467] hover:text-[#ff8500]")} href="/research" onClick={() => setIsResearchOpen(false)}>
                      <span>{link.label}</span>
                      <span className={cn("chevron inline-block w-[7px] h-[7px] border-r-[1.5px] border-b-[1.5px] border-current transition-transform duration-250 ease-in-out", isResearchOpen
                        ? "rotate-[225deg] mt-[4px]"
                        : "rotate-45 -mt-[4px]")}/>
                    </Link>

                    
                      <div aria-hidden={!isResearchOpen} aria-label="Investment education" id="research-mega-menu" className={cn("mega-menu fixed left-0 right-0 z-50 hidden w-full border-y border-[#e8e8e8] bg-white shadow-[0_14px_28px_rgba(16,24,40,0.08)] transition-[opacity,transform,visibility] duration-200 ease-in-out xl:block", isScrolled ? "top-[88px]" : "top-[86px]", isResearchOpen
                        ? "opacity-100 visible translate-y-0 pointer-events-auto"
                        : "opacity-0 invisible -translate-y-2 pointer-events-none")} onMouseEnter={openResearchMenu} onMouseLeave={closeResearchMenu} role="region">
                      <div className="mega-inner w-[min(1100px,calc(100%-60px))] mx-auto grid grid-cols-1 md:grid-cols-[330px_1px_1fr_1px_1fr] gap-[28px] py-[30px]">
                        
                        <div className="feature-panel pr-0 md:pr-[10px] pb-6 md:pb-0 border-b md:border-b-0 border-[#eeeeee]">
                          <svg className="illustration w-[180px] h-[150px] mx-auto mb-[18px] block" viewBox="0 0 220 180" xmlns="http://www.w3.org/2000/svg" fill="none">
                            
                            <ellipse cx="110" cy="151" rx="78" ry="18" fill="#FFF1DE"/>

                            
                            <rect x="44" y="76" width="52" height="67" rx="4" fill="#FFE3BD" stroke="#FF9B24" strokeWidth="2"/>
                            <rect x="52" y="86" width="9" height="10" fill="#ffffff"/>
                            <rect x="66" y="86" width="9" height="10" fill="#ffffff"/>
                            <rect x="80" y="86" width="9" height="10" fill="#ffffff"/>
                            <rect x="52" y="103" width="9" height="10" fill="#ffffff"/>
                            <rect x="66" y="103" width="9" height="10" fill="#ffffff"/>
                            <rect x="80" y="103" width="9" height="10" fill="#ffffff"/>
                            <rect x="64" y="121" width="13" height="22" fill="#FF9B24"/>

                            
                            <rect x="112" y="91" width="62" height="52" rx="4" fill="#FFF5E8" stroke="#FF9B24" strokeWidth="2"/>
                            <rect x="121" y="102" width="12" height="11" fill="#FFD08B"/>
                            <rect x="140" y="102" width="12" height="11" fill="#FFD08B"/>
                            <rect x="159" y="102" width="8" height="11" fill="#FFD08B"/>
                            <rect x="135" y="122" width="17" height="21" fill="#FF9B24"/>

                            
                            <rect x="88" y="36" width="34" height="74" rx="12" fill="#FFF8EE" stroke="#FF8A00" strokeWidth="2"/>
                            <ellipse cx="105" cy="38" rx="18" ry="6" fill="#FFD28F" stroke="#FF8A00" strokeWidth="2"/>
                            <rect x="93" y="47" width="24" height="25" rx="5" fill="#FFB64D"/>
                            <line x1="97" y1="79" x2="113" y2="79" stroke="#FF8A00" strokeWidth="2"/>
                            <line x1="97" y1="86" x2="113" y2="86" stroke="#FF8A00" strokeWidth="2"/>

                            
                            <line x1="105" y1="31" x2="105" y2="16" stroke="#FF8A00" strokeWidth="2"/>
                            <circle cx="105" cy="12" r="5" fill="#FF8A00"/>

                            
                            <path d="M28 124L37 114L46 118" stroke="#FF8A00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M172 72L183 61L193 67L205 50" stroke="#FF8A00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="183" cy="61" r="3" fill="#FF8A00"/>
                            <circle cx="205" cy="50" r="3" fill="#FF8A00"/>
                          </svg>

                          <Link href="/research" className="feature-link inline-flex items-center gap-[8px] mb-[8px] text-[#101828] text-[14px] font-bold no-underline hover:text-[#ff8500] transition-colors duration-200" onClick={() => setIsResearchOpen(false)}>
                            Explore Investment Education
                            <span aria-hidden="true">→</span>
                          </Link>

                          <p className="feature-description text-[#667085] text-[13px] leading-[1.6] m-0">
                            Follow all 8 learning levels, from investment foundations to a complete portfolio-planning capstone.
                          </p>
                        </div>

                        
                        <div className="divider hidden md:block w-[1px] bg-[#e8e8e8]"/>

                        
                        <div className="menu-column flex flex-col gap-[24px]">
                          {column1Links.map((item) => (<Link key={item.title} href={item.href} className="menu-link group block no-underline" onClick={() => setIsResearchOpen(false)}>
                              <h3 className="mb-[6px] text-[#182230] text-[14px] font-[650] transition-colors duration-200 group-hover:text-[#ff8500] m-0">
                                {item.title}
                              </h3>
                              <p className="text-[#98a2b3] text-[12.5px] leading-[1.5] m-0">
                                {item.description}
                              </p>
                            </Link>))}
                        </div>

                        
                        <div className="divider hidden md:block w-[1px] bg-[#e8e8e8]"/>

                        
                        <div className="menu-column flex flex-col gap-[24px]">
                          {column2Links.map((item) => (<Link key={item.title} href={item.href} className="menu-link group block no-underline" onClick={() => setIsResearchOpen(false)}>
                              <h3 className="mb-[6px] text-[#182230] text-[14px] font-[650] transition-colors duration-200 group-hover:text-[#ff8500] m-0">
                                {item.title}
                              </h3>
                              <p className="text-[#98a2b3] text-[12.5px] leading-[1.5] m-0">
                                {item.description}
                              </p>
                            </Link>))}
                        </div>
                      </div>
                    </div>
                  </li>);
            }
            return (<li key={link.label} className="nav-item">
                  <Link className={cn("nav-link nav-link-underline flex items-center gap-[6px] font-semibold transition-colors duration-200 text-[14px] 2xl:text-[15px] whitespace-nowrap no-underline py-1", isLinkActive(link.href)
                    ? "active text-[#ff8500]"
                    : "text-[#475467] hover:text-[#ff8500]")} href={link.href}>
                    {link.label}
                  </Link>
                </li>);
        })}
          </ul>

          
          <div className="flex items-center gap-3">
            <div className="hidden xl:block">
              <a href={appLinks.android} target="_blank" rel="noopener noreferrer" className="no-underline">
                <Button aria-label="Get started with Solid Wealth" variant="black" className={cn("get-started rounded-full bg-[#050505] text-white font-semibold cursor-pointer border-0 transition-all duration-300 inline-flex items-center justify-center gap-2 shrink-0", isScrolled ? "h-10 px-5 text-sm" : "py-[12px] px-[22px] text-[14px]")}>
                  <span>Get Started</span>
                </Button>
              </a>
            </div>

            
            <button aria-controls="mobile-navigation" aria-expanded={isMobileMenuOpen} aria-label="Toggle main menu" className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition hover:border-[#ff8500] hover:text-[#ff8500] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8500] focus-visible:ring-offset-2 xl:hidden", "border-gray-200 bg-white/80 text-[#101828]")} onClick={() => {
            setIsMobileMenuOpen((isOpen) => {
                if (isOpen)
                    setIsMobileResearchOpen(false);
                return !isOpen;
            });
        }} type="button">
              {isMobileMenuOpen ? (<X className="size-5 transition-transform duration-300 rotate-90"/>) : (<Menu className="size-5 transition-transform duration-300"/>)}
            </button>
          </div>
        </nav>

        
        {isMobileMenuOpen && (<nav aria-label="Mobile navigation" className={cn("absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 flex max-h-[calc(100dvh-5.75rem)] flex-col gap-3 overflow-y-auto overscroll-contain border border-[#eeeeee] bg-white p-3 shadow-xl xl:hidden sm:left-auto sm:w-[430px] sm:p-5", isScrolled ? "rounded-2xl" : "rounded-b-2xl sm:rounded-2xl")} id="mobile-navigation">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                if (link.href === "/research") {
                    return (<div key={link.label}>
                      <button aria-controls="mobile-research-menu" aria-expanded={isMobileResearchOpen} className={cn("flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[#475467] transition-all duration-200 hover:bg-[#fff7ed] hover:text-[#ff8500] sm:px-4 sm:py-3 sm:text-base", (isMobileResearchOpen || isLinkActive(link.href)) && "bg-[#fff7ed] text-[#ff8500]")} onClick={() => setIsMobileResearchOpen((isOpen) => !isOpen)} type="button">
                        <span>{link.label}</span>
                        <ChevronDown aria-hidden="true" className={cn("size-4 transition-transform duration-200", isMobileResearchOpen && "rotate-180")}/>
                      </button>

                      {isMobileResearchOpen && (<div className="mt-2 flex flex-col gap-4 rounded-xl border border-[#eeeeee] bg-[#fffdf7] p-3 sm:gap-5 sm:p-4" id="mobile-research-menu">
                          
                          <div className="pb-3 border-b border-[#eeeeee]">
                            <Link href="/research" className="inline-flex items-center gap-2 text-sm font-bold text-[#101828] hover:text-[#ff8500]" onClick={() => {
                                setIsMobileMenuOpen(false);
                                setIsMobileResearchOpen(false);
                            }}>
                              Explore Investment Education →
                            </Link>
                            <p className="mt-1 text-xs text-[#667085] leading-relaxed m-0">
                              Follow all 8 learning levels, from investment foundations to a complete portfolio-planning capstone.
                            </p>
                          </div>

                          
                          <div className="flex flex-col gap-3">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff8500] m-0">
                              Levels 1–4
                            </p>
                            {column1Links.map((item) => (<Link key={item.title} href={item.href} className="block no-underline" onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsMobileResearchOpen(false);
                                }}>
                                <p className="text-xs font-bold text-[#182230] hover:text-[#ff8500] m-0">
                                  {item.title}
                                </p>
                                <p className="m-0 text-[11px] leading-4 text-[#98a2b3]">
                                  {item.description}
                                </p>
                              </Link>))}
                          </div>

                          
                          <div className="flex flex-col gap-3 pt-2 border-t border-[#eeeeee]">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#ff8500] m-0">
                              Levels 5–8
                            </p>
                            {column2Links.map((item) => (<Link key={item.title} href={item.href} className="block no-underline" onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsMobileResearchOpen(false);
                                }}>
                                <p className="text-xs font-bold text-[#182230] hover:text-[#ff8500] m-0">
                                  {item.title}
                                </p>
                                <p className="m-0 text-[11px] leading-4 text-[#98a2b3]">
                                  {item.description}
                                </p>
                              </Link>))}
                          </div>
                        </div>)}
                    </div>);
                }
                return (<Link className={cn("flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-[#475467] transition-all duration-200 hover:bg-[#fff7ed] hover:text-[#ff8500] sm:px-4 sm:py-3 sm:text-base", isLinkActive(link.href) && "bg-[#fff7ed] text-[#ff8500]")} href={link.href} key={link.label} onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsMobileResearchOpen(false);
                    }}>
                    {link.label}
                  </Link>);
            })}
            </div>

            <div className="my-1 h-px w-full bg-[#eeeeee]"/>
            <a href={appLinks.android} target="_blank" rel="noopener noreferrer" className="w-full no-underline" onClick={() => {
                setIsMobileMenuOpen(false);
                setIsMobileResearchOpen(false);
            }}>
              <Button aria-label="Get started with Solid Wealth" variant="black" className="w-full justify-center py-3 text-base rounded-full bg-[#050505] text-white font-semibold">
                Get Started →
              </Button>
            </a>
          </nav>)}
      </div>
    </header>);
}
