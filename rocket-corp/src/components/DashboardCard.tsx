import React from "react";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}

export const DashboardCard = ({
  title,
  children,
  bgColor = "bg-white",
  textColor = "text-[#08605F]",
}: DashboardCardProps) => (
  <div
    className={`flex flex-col justify-between rounded-lg p-5 min-w-[16rem] ${bgColor} ${textColor} shadow-sm`}
  >
    <span className="font-bold text-sm mb-2">{title}</span>
    {children}
  </div>
);
