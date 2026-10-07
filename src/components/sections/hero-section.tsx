"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { HeroPhone } from "@/components/sections/hero-phone";
import { Button } from "@/components/ui/button";
import { SplitText } from "@/components/ui/split-text";
import { appLinks } from "@/lib/app-links";
import { cn } from "@/lib/utils";
export function HeroSection() {
    const SCROLL_TRACK_HEIGHT = "260vh";
    const ACTIVE_ANIMATION_RATIO = 0.5;
    const containerRef = useRef<HTMLDivElement>(null);
    const hemisphereRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const phoneRef = useRef<HTMLDivElement>(null);
    const subContentRef = useRef<HTMLDivElement>(null);
    const scrollArrowRef = useRef<HTMLDivElement>(null);
    const moneyTextRef = useRef<HTMLSpanElement>(null);
    const h1Ref = useRef<HTMLHeadingElement>(null);
    const line1Ref = useRef<HTMLSpanElement>(null);
    const line2Ref = useRef<HTMLSpanElement>(null);
    const headingWidthRef = useRef(0);
    const headingNaturalTopRef = useRef(0);
    const line1WidthRef = useRef(0);
    const line2WidthRef = useRef(0);
    const shiftPxRef = useRef(0);
    const phoneShiftPxRef = useRef(0);
    const targetProgress = useRef(0);
    const currentProgress = useRef(0);
    const isMobileRef = useRef(false);
    const isRevealedRef = useRef(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const updateElements = useCallback((progress: number) => {
        const tReveal = Math.min(Math.max(progress / 0.3, 0), 1);
        const tLayout = Math.min(Math.max((progress - 0.45) / 0.55, 0), 1);
        const wHeight = window.innerHeight;
        const easeLayout = tLayout < 0.5
            ? 4 * tLayout * tLayout * tLayout
            : 1 - Math.pow(-2 * tLayout + 2, 3) / 2;
        const textYOffset = -8;
        if (hemisphereRef.current) {
            const translateY = 70 - easeLayout * 48;
            const scale = 1.15 + easeLayout * 4.5;
            hemisphereRef.current.style.transform = `translate3d(-50%, ${translateY}%, 0) scale(${scale})`;
        }
        if (ringRef.current) {
            const ringTranslateY = 70 - easeLayout * 56;
            const ringScale = 1.15 + easeLayout * 5.6;
            ringRef.current.style.transform = `translate3d(-50%, ${ringTranslateY}%, 0) scale(${ringScale})`;
        }
        const tyBase = isMobileRef.current
            ? (1 - progress) * -5 - 4 + textYOffset * (1 - tLayout)
            : (1 - tLayout) * (tReveal * -5) + tLayout * -4 + textYOffset * (1 - tLayout);
        let correctionY = 0;
        if (h1Ref.current && containerRef.current && hemisphereRef.current) {
            const h = wHeight;
            const naturalH1Bottom = h / 2 + (isMobileRef.current ? -20 : -10);
            const tyBasePx = h * (tyBase / 100);
            const currentTranslateY = 70 - easeLayout * 48;
            const currentScale = 1.15 + easeLayout * 4.5;
            const domeHeight = hemisphereRef.current.offsetHeight || 1350;
            const domeRadius = domeHeight / 2;
            const translateYPx = domeHeight * (currentTranslateY / 100);
            const hemisphereTop = (h - domeRadius + translateYPx) - (domeRadius * currentScale);
            const margin = 24;
            const requiredCorrection = Math.min(0, hemisphereTop - (naturalH1Bottom + tyBasePx) - margin);
            const fadeFactor = Math.max(0, 1 - progress / 0.3);
            correctionY = requiredCorrection * fadeFactor;
        }
        if (textRef.current) {
            let textTranslateYPx = (tyBase * wHeight) / 100 + correctionY;
            if (!isMobileRef.current && headingNaturalTopRef.current > 0) {
                const minimumDesktopHeadingTop = 128;
                const projectedHeadingTop = headingNaturalTopRef.current + textTranslateYPx;
                if (projectedHeadingTop < minimumDesktopHeadingTop) {
                    textTranslateYPx +=
                        minimumDesktopHeadingTop - projectedHeadingTop;
                }
            }
            if (isMobileRef.current) {
                textRef.current.style.transform = `translate3d(0, ${textTranslateYPx}px, 0)`;
            }
            else {
                const txDesktop = (1 - tLayout) * shiftPxRef.current;
                const textScale = 0.96 + tLayout * 0.04;
                textRef.current.style.transform = `translate3d(${txDesktop}px, ${textTranslateYPx}px, 0) scale(${textScale})`;
            }
            if (line1Ref.current && line2Ref.current && headingWidthRef.current > 0) {
                const offset1 = (headingWidthRef.current - line1WidthRef.current) / 2;
                const offset2 = (headingWidthRef.current - line2WidthRef.current) / 2;
                line1Ref.current.style.transform = `translate3d(${offset1 * (1 - tLayout)}px, 0, 0)`;
                line2Ref.current.style.transform = `translate3d(${offset2 * (1 - tLayout)}px, 0, 0)`;
            }
            if (textRef.current.style.textAlign !== "left") {
                textRef.current.style.textAlign = "left";
                textRef.current.style.alignItems = "flex-start";
                if (h1Ref.current)
                    h1Ref.current.style.textAlign = "left";
            }
        }
        if (moneyTextRef.current) {
            if (progress > 0.6) {
                if (!moneyTextRef.current.classList.contains("text-white")) {
                    moneyTextRef.current.classList.remove("text-[#fe9800]");
                    moneyTextRef.current.classList.add("text-white");
                }
            }
            else {
                if (!moneyTextRef.current.classList.contains("text-[#fe9800]")) {
                    moneyTextRef.current.classList.remove("text-white");
                    moneyTextRef.current.classList.add("text-[#fe9800]");
                }
            }
        }
        if (labelRef.current) {
            labelRef.current.style.opacity = `${tLayout}`;
            labelRef.current.style.transform = `translate3d(0, ${(1 - tLayout) * -10}px, 0)`;
        }
        if (subContentRef.current) {
            const subOpacity = tLayout;
            const subTranslateY = (1 - tLayout) * 20;
            subContentRef.current.style.opacity = `${subOpacity}`;
            subContentRef.current.style.transform = `translate3d(0, ${subTranslateY}px, 0)`;
        }
        if (phoneRef.current) {
            let phoneOpacity: number;
            if (isMobileRef.current) {
                phoneOpacity = 1;
            }
            else {
                phoneOpacity = tReveal;
            }
            if (isMobileRef.current) {
                const phoneTyMobile = 25 - progress * 60;
                const phoneTyMobilePx = (phoneTyMobile * wHeight) / 100;
                const phoneScaleMobile = 0.8 + progress * 0.2;
                phoneRef.current.style.transform = `translate3d(0, ${phoneTyMobilePx}px, 0) scale(${phoneScaleMobile})`;
            }
            else {
                const phoneTxDesktopPx = (1 - tLayout) * phoneShiftPxRef.current;
                const phoneTyDesktop = (1 - tReveal) * 60 + (1 - tLayout) * 26 + tLayout * 6;
                const phoneTyDesktopPx = (phoneTyDesktop * wHeight) / 100;
                const phoneScaleDesktop = 0.8 + tReveal * 0.15 + tLayout * 0.1;
                const phoneRotateDesktop = (1 - tReveal) * -3 + (1 - tLayout) * -2;
                phoneRef.current.style.transform = `translate3d(${phoneTxDesktopPx}px, ${phoneTyDesktopPx}px, 0) scale(${phoneScaleDesktop}) rotate(${phoneRotateDesktop}deg)`;
            }
            phoneRef.current.style.opacity = `${phoneOpacity}`;
        }
        if (scrollArrowRef.current) {
            const arrowOpacity = Math.max(0, 1 - progress * 4.5);
            scrollArrowRef.current.style.opacity = `${arrowOpacity}`;
            if (arrowOpacity <= 0) {
                if (scrollArrowRef.current.style.display !== "none") {
                    scrollArrowRef.current.style.display = "none";
                }
            }
            else {
                if (scrollArrowRef.current.style.display !== "flex") {
                    scrollArrowRef.current.style.display = "flex";
                }
            }
        }
    }, []);
    useEffect(() => {
        let animFrameId: number | null = null;
        let isRunning = false;
        const measureWidths = () => {
            if (h1Ref.current && line1Ref.current && line2Ref.current && textRef.current && phoneRef.current) {
                const originalTextTransform = textRef.current.style.transform;
                const originalLine1Transform = line1Ref.current.style.transform;
                const originalLine2Transform = line2Ref.current.style.transform;
                const originalPhoneTransform = phoneRef.current.style.transform;
                textRef.current.style.transform = "none";
                line1Ref.current.style.transform = "none";
                line2Ref.current.style.transform = "none";
                phoneRef.current.style.transform = "none";
                const textRect = textRef.current.getBoundingClientRect();
                const h1Rect = h1Ref.current.getBoundingClientRect();
                const line1Rect = line1Ref.current.getBoundingClientRect();
                const line2Rect = line2Ref.current.getBoundingClientRect();
                const phoneRect = phoneRef.current.getBoundingClientRect();
                headingWidthRef.current = h1Rect.width;
                headingNaturalTopRef.current = h1Rect.top;
                line1WidthRef.current = line1Rect.width;
                line2WidthRef.current = line2Rect.width;
                const screenCenter = window.innerWidth / 2;
                const textCenter = textRect.left + textRect.width / 2;
                shiftPxRef.current = screenCenter - textCenter;
                const phoneCenter = phoneRect.left + phoneRect.width / 2;
                phoneShiftPxRef.current = screenCenter - phoneCenter;
                textRef.current.style.transform = originalTextTransform;
                line1Ref.current.style.transform = originalLine1Transform;
                line2Ref.current.style.transform = originalLine2Transform;
                phoneRef.current.style.transform = originalPhoneTransform;
            }
        };
        const handleScroll = () => {
            if (!containerRef.current)
                return;
            const rect = containerRef.current.getBoundingClientRect();
            const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
            if (totalHeight <= 0)
                return;
            const scrolled = -rect.top;
            const progress = Math.min(Math.max(scrolled / (totalHeight * ACTIVE_ANIMATION_RATIO), 0), 1);
            targetProgress.current = progress;
            if (!isRunning) {
                isRunning = true;
                animFrameId = requestAnimationFrame(tick);
            }
        };
        const tick = () => {
            const diff = targetProgress.current - currentProgress.current;
            if (Math.abs(diff) < 0.0001) {
                currentProgress.current = targetProgress.current;
                updateElements(currentProgress.current);
                const shouldReveal = currentProgress.current > 0.6;
                if (shouldReveal !== isRevealedRef.current) {
                    isRevealedRef.current = shouldReveal;
                    setIsRevealed(shouldReveal);
                }
                isRunning = false;
                animFrameId = null;
                return;
            }
            currentProgress.current += diff * 0.16;
            updateElements(currentProgress.current);
            const shouldReveal = currentProgress.current > 0.6;
            if (shouldReveal !== isRevealedRef.current) {
                isRevealedRef.current = shouldReveal;
                setIsRevealed(shouldReveal);
            }
            animFrameId = requestAnimationFrame(tick);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        measureWidths();
        handleScroll();
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            if (isMobileRef.current !== mobile) {
                isMobileRef.current = mobile;
                setIsMobile(mobile);
            }
            measureWidths();
            if (!isRunning) {
                isRunning = true;
                animFrameId = requestAnimationFrame(tick);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", checkMobile);
            if (animFrameId)
                cancelAnimationFrame(animFrameId);
        };
    }, [updateElements]);
    return (<div ref={containerRef} className="relative w-full bg-white/80 z-10" style={{ height: isMobile ? "110vh" : SCROLL_TRACK_HEIGHT }}>
      
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        <div ref={hemisphereRef} className="absolute bottom-0 left-1/2 rounded-[50%] bg-[#fe9800] pointer-events-none z-0" style={{
            width: "clamp(900px, 116vw, 1400px)",
            height: "clamp(760px, 176dvh, 1350px)",
            transform: "translate3d(-50%, 70%, 0) scale(1.15)",
            transformOrigin: "center center",
            opacity: 0.9,
            willChange: "transform",
        }}/>

        
        <div ref={ringRef} className="absolute bottom-0 left-1/2 rounded-[50%] border-4 border-[#fe9800] bg-transparent pointer-events-none z-0 shadow-[0_0_50px_rgba(254,152,0,0.18),inset_0_0_50px_rgba(254,152,0,0.1)]" style={{
            width: "clamp(950px, 120vw, 1450px)",
            height: "clamp(810px, calc(176dvh + 50px), 1400px)",
            transform: "translate3d(-50%, 70%, 0) scale(1.15)",
            transformOrigin: "center center",
            opacity: 0.9,
            willChange: "transform",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 1%, black 32%)",
            maskImage: "linear-gradient(to bottom, transparent 1%, black 32%)",
        }}/>

        
        <div className="relative z-10 mx-auto grid h-full w-full max-w-[1800px] items-center gap-6 px-4 pt-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8 lg:px-15 xl:grid-cols-[1.15fr_0.85fr] xl:gap-16 xl:px-18 [@media(max-height:700px)]:gap-4 [@media(max-height:700px)]:pt-14">
          
          <div ref={textRef} className="relative z-20 flex min-w-0 flex-col gap-6 [@media(max-height:700px)]:gap-4" style={{
            textAlign: "center",
            alignItems: "center",
            willChange: "transform",
        }}>
            
            

            <h1 ref={h1Ref} className={cn("w-full animate-fade-up font-black text-[#0f1a2c] [animation-delay:100ms]", "text-[clamp(38px,10vw,60px)] leading-[1.08] tracking-tight lg:text-[clamp(52px,min(6.2vw,9.5dvh),90px)] lg:leading-[1.04]")}>
              <span className="block whitespace-normal sm:whitespace-nowrap">
                <span ref={line1Ref} className="inline-block will-change-transform">
                  Reimagine{" "}
                  <span ref={moneyTextRef} className="drop-shadow-md transition-colors duration-500 text-[#fe9800]">
                    money,
                  </span>
                </span>
              </span>
              <span className="block whitespace-normal sm:whitespace-nowrap">
                <span ref={line2Ref} className="inline-block will-change-transform">
                  Simple solutions
                </span>
              </span>
            </h1>

            
            <div ref={subContentRef} className="flex w-full flex-col gap-6 [@media(max-height:700px)]:gap-3" style={{ opacity: 0, transform: "translate3d(0, 20px, 0)" }}>
              <SplitText text="Experience next-generation wealth management. Transparent, secure, and designed for the modern investor who values clarity over complexity." className="max-w-[460px] text-[17px] leading-relaxed text-[#3F3820] [@media(max-height:700px)]:max-w-[390px] [@media(max-height:700px)]:text-[14px] [@media(max-height:700px)]:leading-[1.55]" delay={20} duration={0.6} ease="power3.out" splitType="words" from={{ opacity: 0, y: 15 }} to={{ opacity: 1, y: 0 }} threshold={0.1} textAlign="left" trigger={isRevealed}/>

              <div className="flex animate-fade-up flex-wrap gap-3 [animation-delay:300ms] justify-start">
                <a href={appLinks.android} target="_blank" rel="noopener noreferrer" className="no-underline">
                  <Button variant="black" className="group relative overflow-hidden [@media(max-height:700px)]:h-11 [@media(max-height:700px)]:px-5 [@media(max-height:700px)]:text-sm" icon={<ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1 relative z-10"/>} size="lg">
                    <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-20 transition-all duration-1000 ease-out group-hover:-translate-x-56 pointer-events-none z-0"/>
                    <span className="relative z-10">Get Started</span>
                  </Button>
                </a>
                <Link href="/research" className="inline-flex h-[52px] w-fit items-center justify-center rounded-wealth-pill border border-black bg-white px-7 text-[15px] font-semibold text-black transition duration-200 ease-out hover:-translate-y-0.5 hover:border-wealth-accent hover:text-wealth-accent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wealth-accent/45 focus-visible:ring-offset-2 focus-visible:ring-offset-wealth-bg [@media(max-height:700px)]:h-11 [@media(max-height:700px)]:px-5 [@media(max-height:700px)]:text-sm">
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          
          <div className="absolute lg:relative bottom-[-260px] xs:bottom-[-280px] md:bottom-[-320px] lg:bottom-auto left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 w-full max-w-[240px] xs:max-w-[280px] md:max-w-[340px] lg:max-w-none z-30 lg:z-10">
            <div ref={phoneRef} style={{ opacity: 0, willChange: "transform, opacity" }}>
              <HeroPhone />
            </div>
          </div>
        </div>

        
        <div ref={scrollArrowRef} className="absolute bottom-8 left-[50%] -translate-x-1/2 top-[64%] sm:top-[80%] flex flex-col items-center gap-2 pointer-events-none z-20">
          <span className="text-[11px] pb-2 font-bold tracking-widest uppercase text-wealth-secondary/80 font-mono animate-pulse">
            Scroll to explore
          </span>
          <div className="flex size-10 items-center justify-center rounded-full bg-white border border-wealth-border shadow-wealth-sm text-wealth-accent animate-bounce">
            <ChevronDown className="size-5"/>
          </div>
        </div>
      </div>
    </div>);
}
