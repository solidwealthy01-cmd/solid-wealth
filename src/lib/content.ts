import type { LucideIcon } from "lucide-react";
import { BarChart3, Shield, Zap, } from "lucide-react";
export type FeatureItem = {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
};
export type MarketItem = {
    name: string;
    value: string;
    change: string;
    direction: "up" | "down";
};
export type NavLinkItem = {
    label: string;
    href: string;
    active?: boolean;
};
export const navLinks: NavLinkItem[] = [
    { label: "Mutual Funds", href: "/#mutual-funds" },
    { label: "MF Research", href: "/mutual-funds" },
    { label: "Calculators", href: "/calculators" },
    { label: "Learn Investment", href: "/research" },
    { label: "Blog", href: "/blog" },
];
export const avatarImages = [
    {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDImuTWeiOslCRTrKKhik4leMjn_rYr8_aMjek7x03ufVxMbfh4k-J9IsIIKtl84fYz5R8Vjpdl9bQoiWGxEAJae4QMvSETmY8R1ViujHl2QR5K4mYAADtAot2Z8xSMbtJNTclxCRaAsWvm5mmAWqoAJcUyaL8H8HfJfoE3l7QOndXWL6z7uOGff3c1qBBAEs8HYxZUEnEzWhqs6iExrFk464wRqOQPvTHMWkrjKN2E3VMCxmgFf8vNRozjBqquKyZDfv4pMXND4v8",
        alt: "Investor profile",
    },
    {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBseB2ULs3kypwkVePaGsUuRLRfgRkzFjkjAe2Dnk75Hk-gOkJ-0FK5X-MS3ddaSEGpM_QmhWxchqMocDgF4IrTciOKqIOmMq8PE6hxDUXWtn4LEeWoSpYrsJoOlUsbAYoQZrc1TLb8lJRltogkbPM4Wtax65uBeAoq8pxy6rRc0W5VHmwk3PLQeBCAMa41WEt70qcSAKWZBF2U8TBCRpYbn6cG8_UH09pz9xiffFrCQOuaA-ZD4hmWbA18GzxUVFC770qOS9xJ_ZA",
        alt: "Investor profile",
    },
    {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuASmwv2QeRSqcNGlk9xayhyJmEx6KCrftwA5KGjPNV_J4wbfllhb8i-RJm61omh6ZSBJ7vQkiqzk-E4z2RmJ_VWhw7xHNOPA_cpOscO0ewxP5wLAdnCx73XgLNDv35FPqRRwvS2V9cEugmdDFg8S-r3S2uYdnlvlScm6_OeUEgQZXIMxog3E36nTxBPQMATbSHC9NT4Gp0l5qL3TthpdGU6tdxq_4NDFIrsx24yIF9UsJFiMuVh4Helt8vlJf93D37Z0yGHfbR20mo",
        alt: "Investor profile",
    },
];
export const marketItems: MarketItem[] = [
    { name: "AAPL", value: "182.34", change: "+1.24%", direction: "up" },
    { name: "TSLA", value: "241.17", change: "-0.83%", direction: "down" },
    { name: "BTC/USD", value: "67,420", change: "+2.11%", direction: "up" },
    { name: "MSFT", value: "415.22", change: "+0.95%", direction: "up" },
    { name: "ETH/USD", value: "3,850", change: "+3.41%", direction: "up" },
    { name: "NVDA", value: "894.60", change: "+4.02%", direction: "up" },
    { name: "S&P 500", value: "5,214", change: "+0.71%", direction: "up" },
    { name: "GOOGL", value: "168.40", change: "-0.22%", direction: "down" },
];
export const featureItems: FeatureItem[] = [
    {
        title: "Military-Grade Security",
        description: "Your assets are protected by advanced AES-256 encryption and multi-signature protocols, audited quarterly by independent firms.",
        href: "#security",
        icon: Shield,
    },
    {
        title: "Smart Analytics",
        description: "AI-driven insights that continuously analyze your spending patterns, portfolio exposure, and growth potential in real time.",
        href: "#analytics",
        icon: BarChart3,
    },
    {
        title: "Instant Transfers",
        description: "Move money across borders in seconds with zero hidden fees, transparent exchange rates, and real-time settlement tracking.",
        href: "#transfers",
        icon: Zap,
    },
];
