"use client";

import { cn } from "@/lib/utils";

export interface DashboardTab {
  id: string;
  label: string;
}

interface DashboardTabsProps {
  tabs: DashboardTab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function DashboardTabs({
  tabs,
  activeTab,
  onChange,
}: DashboardTabsProps) {
  return (
    <div className="mb-8">
      <div
        className="
          overflow-x-auto
          scrollbar-thin
          scrollbar-thumb-brand-brown/10
          scrollbar-track-transparent
        "
      >
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  "h-11 px-5 rounded-xl whitespace-nowrap transition-all",
                  "font-medium text-sm border border-transparent",

                  isActive
                    ? "bg-brand-brown text-white shadow-sm"
                    : "bg-white border border-brand-brown/10 text-brand-muted hover:text-brand-brown hover:bg-brand-brown/[0.03]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}