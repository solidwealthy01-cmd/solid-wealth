"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}
interface Review {
    id: number;
    title: string;
    text: string;
    author: string;
    role: string;
    avatarColor: string;
}
const reviewsData: Review[] = [
    {
        id: 1,
        title: "Outstanding Wealth Planning",
        text: "Solid Wealth provided clear, strategic financial guidance that helped me make confident investment decisions. Their professionalism and personalized approach truly set them apart.",
        author: "Rajesh Mehta",
        role: "Business Owner",
        avatarColor: "bg-[#E03A3E]",
    },
    {
        id: 2,
        title: "Game-Changing Platform",
        text: "The automated portfolio balancing and mutual fund tracking have made managing my investments effortless. I've seen consistent growth since moving my portfolio here.",
        author: "Priya Sharma",
        role: "Software Engineer",
        avatarColor: "bg-[#00B2A9]",
    },
    {
        id: 3,
        title: "Secure and Trustworthy",
        text: "As a retiree, capital preservation is key. The transparency, robust security measures, and exceptional support team at Solid Wealth give me absolute peace of mind.",
        author: "Vikram Malhotra",
        role: "Retired Consultant",
        avatarColor: "bg-[#F48C06]",
    },
];
export function ReviewsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const envelopeRef = useRef<HTMLDivElement>(null);
    const cardRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];
    const floatRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
    ];
    const isFloatingRef = useRef(false);
    const floatTweens = useRef<gsap.core.Tween[]>([]);

    const startFloating = () => {
        if (isFloatingRef.current)
            return;
        isFloatingRef.current = true;
        floatTweens.current = [
            gsap.to(floatRefs[0].current, {
                y: -12,
                duration: 2.6,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
            }),
            gsap.to(floatRefs[1].current, {
                y: -15,
                duration: 3.0,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: 0.2,
            }),
            gsap.to(floatRefs[2].current, {
                y: -9,
                duration: 2.2,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                delay: 0.4,
            }),
        ];
    };

    const stopFloating = () => {
        if (!isFloatingRef.current && floatTweens.current.length === 0)
            return;
        isFloatingRef.current = false;
        floatTweens.current.forEach((t) => t.kill());
        floatTweens.current = [];
        floatRefs.forEach((ref) => {
            if (ref.current) {
                gsap.set(ref.current, { y: 0 });
            }
        });
    };

    useGSAP(() => {
        const cards = cardRefs.map((r) => r.current);
        const initialRotations = [-8, -2, 8];
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
            const calculateOffsets = () => {
                gsap.set(cards, { clearProps: "all" });
                const envRect = envelopeRef.current?.getBoundingClientRect();
                if (!envRect)
                    return [];
                const envCenter = {
                    x: envRect.left + envRect.width / 2,
                    y: envRect.top + envRect.height * 0.62,
                };
                return cards.map((card) => {
                    if (!card)
                        return { x: 0, y: 0 };
                    const cardRect = card.getBoundingClientRect();
                    const cardCenter = {
                        x: cardRect.left + cardRect.width / 2,
                        y: cardRect.top + cardRect.height / 2,
                    };
                    return {
                        x: envCenter.x - cardCenter.x,
                        y: envCenter.y - cardCenter.y + cardRect.height * 0.15,
                    };
                });
            };

            let offsets = calculateOffsets();
            let tl: gsap.core.Timeline;

            const buildAnimation = () => {
                if (tl)
                    tl.kill();
                stopFloating();
                cards.forEach((card, idx) => {
                    if (!card)
                        return;
                    const offset = offsets[idx] || { x: 0, y: 0 };
                    gsap.set(card, {
                        x: offset.x,
                        y: offset.y,
                        rotation: initialRotations[idx],
                        scale: 0.9,
                        opacity: 0.8,
                        transformOrigin: "center bottom",
                    });
                });

                tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "bottom bottom",
                        end: "+=100%",
                        pin: true,
                        anticipatePin: 1,
                        scrub: 0.6,
                        fastScrollEnd: true,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            if (self.progress >= 0.98) {
                                startFloating();
                            } else {
                                stopFloating();
                            }
                        },
                        onLeaveBack: () => {
                            stopFloating();
                        },
                    },
                });

                const liftStart = 0.2;
                tl.addLabel("lift", liftStart);
                const offset2 = offsets[1] || { x: 0, y: 0 };
                tl.to(cards[1], {
                    y: offset2.y - 180,
                    duration: 1.2,
                    ease: "power1.inOut",
                }, "lift");
                const offset1 = offsets[0] || { x: 0, y: 0 };
                tl.to(cards[0], {
                    y: offset1.y - 140,
                    duration: 1.2,
                    ease: "power1.inOut",
                }, "lift+=0.2");
                const offset3 = offsets[2] || { x: 0, y: 0 };
                tl.to(cards[2], {
                    y: offset3.y - 140,
                    duration: 1.2,
                    ease: "power1.inOut",
                }, "lift+=0.3");
                tl.to(cards[1], {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 1.8,
                    ease: "power2.out",
                }, "lift+=1.2");
                tl.to(cards[0], {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 1.8,
                    ease: "power2.out",
                }, "lift+=1.4");
                tl.to(cards[2], {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 1.8,
                    ease: "power2.out",
                }, "lift+=1.5");
            };

            buildAnimation();

            let resizeTimer: ReturnType<typeof setTimeout> | null = null;
            const handleResize = () => {
                if (resizeTimer) clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    offsets = calculateOffsets();
                    buildAnimation();
                }, 150);
            };

            window.addEventListener("resize", handleResize);
            return () => {
                if (resizeTimer) clearTimeout(resizeTimer);
                window.removeEventListener("resize", handleResize);
                if (tl)
                    tl.kill();
            };
        });

        mm.add("(max-width: 767px)", () => {
            stopFloating();
            gsap.set(cards, { clearProps: "all" });
            if (envelopeRef.current) {
                gsap.set(envelopeRef.current, { clearProps: "all" });
            }
        });

        return () => {
            mm.revert();
            stopFloating();
        };
    }, { scope: containerRef });
    return (<section ref={containerRef} id="reviews" className="relative flex h-auto min-h-0 max-h-none w-full scroll-mt-24 flex-col items-center justify-between overflow-hidden bg-[#FFFDF4] pt-10 pb-0 md:h-[85vh] md:min-h-[680px] md:max-h-[850px]">
      
      <div className="absolute bottom-[-400px] left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] bg-[#fe9800]/10 rounded-full blur-[160px] pointer-events-none z-0"/>

      
      <div className="absolute inset-0 pointer-events-none opacity-30 z-0" style={{
            backgroundImage: "linear-gradient(to right, #9ca3af 2px, transparent 2px), linear-gradient(to bottom, #9ca3af 2px, transparent 2px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at bottom center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at bottom center, black 40%, transparent 80%)",
        }}/>

      
      <div className="relative z-10 flex flex-col items-center text-center px-4 mb-2 max-w-[800px]">
        <SectionLabel className="mb-3 shadow-sm bg-[#FCE7C4] text-[#C99026] hover:scale-105 transition-transform duration-300">
          Review Section
        </SectionLabel>
        <h2 className="text-3xl md:text-[48px] font-black tracking-tight text-[#0f1a2c] leading-[1.15]">
          What the <span className="text-[#fe9800]">Clients</span> Say
        </h2>
      </div>

      
      <div className="relative mt-2 mb-0 flex w-full max-w-[1200px] flex-1 flex-col items-center justify-between px-4 pb-36 md:px-8 md:pb-0">
        
        
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-[1100px] mx-auto z-20">
          {reviewsData.map((review, idx) => {
            const isMiddle = idx === 1;
            const zIndexClass = isMiddle
                ? "z-23"
                : idx === 2
                    ? "z-22"
                    : "z-21";
            return (<div key={review.id} className="relative h-[360px] md:h-[340px] lg:h-[360px]">
                <div ref={cardRefs[idx]} className={cn("absolute inset-0 w-full h-full", zIndexClass)} style={{ willChange: "transform, opacity", transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}>
                  <div ref={floatRefs[idx]} className="w-full h-full" style={{ willChange: "transform", transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}>
                    <ReviewCard review={review}/>
                  </div>
                </div>
              </div>);
        })}
        </div>

        
        <div ref={envelopeRef} className="absolute bottom-0 md:bottom-[-60px] left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[75%] lg:w-[700px] xl:w-[800px] aspect-[1027/437] select-none pointer-events-none z-10">
          <div className="absolute inset-0 w-full h-full" style={{
            backgroundImage: `url(/poster.png)`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
        }}/>
        </div>

        
        <div className="absolute bottom-0 md:bottom-[-60px] left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[75%] lg:w-[700px] xl:w-[800px] aspect-[1027/437] select-none pointer-events-none z-30">
          
          <svg viewBox="0 0 1027 437" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polygon points="0,270 513.5,437 1027,270 1027,437 0,437" fill="white"/>
          </svg>

          
          <div className="absolute inset-0 w-full h-full" style={{
            backgroundImage: `url(/poster.png)`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            clipPath: "polygon(0 61.8%, 100% 61.8%, 100% 100%, 0 100%)",
            WebkitClipPath: "polygon(0 61.8%, 100% 61.8%, 100% 100%, 0 100%)",
        }}/>

          
          <div className="absolute left-1/2 bottom-[12%] -translate-x-1/2 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-[#fe9800] rounded-full flex items-center justify-center shadow-lg border-[3px] md:border-4 border-white z-40">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 relative flex items-center justify-center">
              <Image src="/logo1.png" alt="Solid Wealth Logo" fill sizes="(max-width: 767px) 2rem, (max-width: 1023px) 2.5rem, 3rem" className="object-contain brightness-0 invert" priority/>
            </div>
          </div>
        </div>

      </div>
    </section>);
}
function ReviewCard({ review }: {
    review: Review;
}) {
    return (<div className={cn("bg-white border border-[#EBEFF5] rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(15,26,44,0.04)]", "hover:shadow-[0_24px_50px_rgba(15,26,44,0.08)]", "transition-shadow duration-300 ease-out cursor-pointer flex flex-col justify-between h-full w-full")}>
      
      <div className="flex items-center justify-between">
        
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-[#fe9800] text-[#fe9800] stroke-[1.5]"/>))}
        </div>

        
        <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
      </div>

      
      <div className="flex-1 mt-6 flex flex-col justify-start">
        <h4 className="text-xl font-extrabold text-[#0f1a2c] mb-3 leading-snug">
          {review.title}
        </h4>
        <p className="text-sm leading-relaxed text-[#495973] font-medium line-clamp-5">
          {review.text}
        </p>
      </div>

      
      <div className="flex items-center gap-3.5 mt-6 border-t border-[#F0F4FA] pt-5">
        <div className={cn("w-11 h-11 rounded-full flex-shrink-0 shadow-sm border border-black/5 flex items-center justify-center text-white font-bold text-sm", review.avatarColor)}>
          {review.author
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-[#0f1a2c] leading-tight">
            {review.author}
          </span>
          <span className="text-[12px] font-semibold text-[#879bb8] mt-0.5">
            {review.role}
          </span>
        </div>
      </div>
    </div>);
}
