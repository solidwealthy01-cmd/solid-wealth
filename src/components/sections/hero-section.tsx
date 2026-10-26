import Link from "next/link";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["500", "600", "700", "800", "900"],
    display: "swap",
});

const rise = "animate-hero-rise";

export function HeroSection() {
    return (<section className={cn(montserrat.className, "relative overflow-hidden bg-[#FFF4DD] text-[#3B1A0E] antialiased")}>
      {/* Warm glows behind the content */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-[120px] size-[720px] 2xl:size-[960px] rounded-full bg-[radial-gradient(circle,rgba(251,168,58,.30)_0%,rgba(251,168,58,0)_65%)]"/>
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[220px] -left-[200px] size-[520px] 2xl:size-[700px] rounded-full bg-[radial-gradient(circle,rgba(238,106,26,.18)_0%,rgba(120,25,5,0)_65%)]"/>

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-6 pb-10 pt-32 sm:pt-36 lg:grid-cols-2 xl:max-w-[1360px] xl:gap-16 xl:px-10 xl:pt-40 2xl:max-w-[1600px] 2xl:gap-16 2xl:px-16 2xl:pb-12 2xl:pt-40">
        <div className="flex flex-col gap-[26px] 2xl:gap-8">
          <p className={cn(rise, "text-xs font-extrabold uppercase tracking-[0.14em] text-[#B4560A] 2xl:text-sm")}>
            Start, run and review your mutual funds
          </p>
          <h1 className={cn(rise, "text-balance text-[clamp(44px,6.2vw,80px)] xl:text-[88px] 2xl:text-[94px] font-black leading-[1.02] tracking-[-0.035em] [animation-delay:80ms]")}>
            Invest with a{" "}
            <em className="bg-gradient-to-br from-[#EE6A1A] to-[#FBA83A] bg-clip-text not-italic text-transparent">
              plan.
            </em>
          </h1>
          <p className={cn(rise, "max-w-[28em] text-pretty text-lg font-medium xl:text-xl 2xl:text-[20px] leading-relaxed text-[#5A3A2C] [animation-delay:160ms]")}>
            Tell us what you are saving for and by when. We build the plan, set up your SIP and review it with you every year.
          </p>
          <div className={cn(rise, "flex flex-wrap items-center gap-3 [animation-delay:240ms]")}>
            <Link href="/#contact" className="inline-flex items-center rounded-full bg-gradient-to-br from-[#EE6A1A] to-[#FBA83A] px-7 py-4 text-[15px] font-extrabold 2xl:px-8 2xl:py-[18px] 2xl:text-base text-[#FFFDF4] shadow-[0_12px_28px_-10px_rgba(238,106,26,.6)] transition duration-150 ease-[cubic-bezier(.2,0,0,1)] hover:from-[#2A1008] hover:to-[#2A1008] hover:text-[#FFFDF4] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6A1A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF4DD]">
              Plan this with us
            </Link>
            <Link href="/calculators" className="inline-flex items-center rounded-full border-[1.5px] border-[#3B1A0E]/30 px-6 py-[15px] text-[15px] font-bold 2xl:px-7 2xl:py-[17px] 2xl:text-base text-[#3B1A0E] backdrop-blur-sm transition duration-150 ease-[cubic-bezier(.2,0,0,1)] hover:border-[#3B1A0E] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EE6A1A]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF4DD]">
              Work out your numbers
            </Link>
          </div>
        </div>

        <div aria-hidden="true" className="relative h-[360px] min-w-0 sm:h-[420px] xl:h-[480px] 2xl:h-[550px]">
          <div className="absolute left-[4%] top-5 flex aspect-[1.58] w-[min(340px,78%)] xl:w-[min(390px,78%)] 2xl:top-6 2xl:w-[min(420px,78%)] animate-hero-card-a flex-col justify-between overflow-hidden rounded-[22px] bg-[#FFFDF4] p-6 2xl:rounded-[26px] 2xl:p-7 shadow-[0_30px_60px_-20px_rgba(120,50,10,.28)]">
            <div className="absolute -bottom-10 -right-10 size-[190px] 2xl:size-[220px] rounded-full bg-[#FBA83A]/[.18]"/>
            <div className="absolute -bottom-[70px] right-10 size-[150px] rounded-full bg-[#EE6A1A]/[.12]"/>
            <div className="relative flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] 2xl:text-[13px] text-[#B4560A]">Monthly SIP</span>
              <span className="grid size-[30px] place-items-center rounded-[7px] bg-[#FFF4C2] text-[17px] 2xl:size-9 2xl:text-xl font-black text-[#EE6A1A]">S</span>
            </div>
            <div className="relative flex flex-col gap-1">
              <span className="text-[32px] font-black tabular-nums xl:text-[36px] 2xl:text-[40px] tracking-[-0.035em]">₹15,000</span>
              <span className="text-[13px] font-semibold 2xl:text-[15px] text-[#6B7690]">On the 5th, every month</span>
            </div>
          </div>

          <div className="absolute right-0 top-[170px] flex aspect-[1.58] w-[min(340px,78%)] xl:top-[195px] xl:w-[min(390px,78%)] 2xl:top-[250px] 2xl:w-[min(420px,78%)] animate-hero-card-b flex-col justify-between overflow-hidden rounded-[22px] 2xl:rounded-[26px] 2xl:p-7 border border-white/10 bg-gradient-to-br from-[rgba(74,32,16,.95)] to-[rgba(42,16,8,.97)] p-6 text-[#FFFDF4] shadow-[0_30px_60px_-20px_rgba(60,20,5,.6)]">
            <div className="absolute -right-[30px] -top-[30px] size-[150px] 2xl:size-[180px] rounded-full bg-[#FBA83A]/[.16]"/>
            <div className="relative flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] 2xl:text-[13px] text-white/80">Portfolio value</span>
              <span className="text-[13px] font-bold text-[#FBA83A] 2xl:text-[15px]">↑ 12.4%</span>
            </div>
            <div className="relative flex flex-col gap-1">
              <span className="text-[32px] font-black tabular-nums xl:text-[36px] 2xl:text-[40px] tracking-[-0.035em]">₹48.23 L</span>
              <span className="text-[13px] font-semibold 2xl:text-[15px] text-white/80">Balanced · Moderate risk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 pb-12 xl:max-w-[1360px] xl:px-10 2xl:max-w-[1600px] 2xl:px-16 2xl:pb-16">
        <div className="grid items-center gap-7 rounded-3xl border border-[#EE6A1A]/[.14] bg-[#FFFDF4]/70 px-8 py-7 backdrop-blur-lg 2xl:gap-8 2xl:px-10 2xl:py-8 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
          <h2 className="text-[22px] font-extrabold leading-tight 2xl:text-[24px] tracking-[-0.02em]">Every fund you hold, in one place</h2>
          <p className="text-[15px] font-medium leading-relaxed text-[#5A3A2C] 2xl:text-[17px]">
            Track your SIPs, see what you have invested and what it is worth, and get a yearly review report.
          </p>
          <p className="text-xs leading-relaxed text-[#7A5A4A] 2xl:text-sm">
            Mutual Fund investments are subject to market risks, read all scheme related documents carefully.
          </p>
        </div>
      </div>
    </section>);
}
