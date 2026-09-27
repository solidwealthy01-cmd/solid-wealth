"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SchemePerformanceDetail } from "@/components/mutual-funds/scheme-performance-detail";

function FundCardContent() {
  const searchParams = useSearchParams();

  return (
    <SchemePerformanceDetail
      category={searchParams.get("category") ?? ""}
      period={searchParams.get("period") ?? ""}
      scheme={searchParams.get("scheme") ?? ""}
    />
  );
}

export function FundCardView() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-28 pb-20 sm:pt-36 sm:pb-24 lg:pt-40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-3">
                <div className="size-8 border-4 border-[#0B63E5] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-semibold text-gray-500">
                  Loading fund card analytics...
                </p>
              </div>
            </div>
          }
        >
          <FundCardContent />
        </Suspense>
      </div>
    </div>
  );
}
