import React from "react";

interface DashboardInfoCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  children?: React.ReactNode;
}

export const DashboardInfoCard: React.FC<DashboardInfoCardProps> = ({
  title,
  subtitle,
  icon,
  bgColor = "bg-white",
  textColor = "text-[#08605F]",
  children,
}) => (
  <div
    className={`rounded-lg p-5 min-w-[16rem] shadow-sm ${bgColor} ${textColor} flex flex-col gap-2`}
  >
    <div className="flex items-center justify-between w-full">
      <div>
        <span className="font-bold text-sm">{title}</span>
        {subtitle && <div className="text-xs mt-1">{subtitle}</div>}
      </div>
      {icon && <div className="ml-2">{icon}</div>}
    </div>
    {children}
  </div>
);
