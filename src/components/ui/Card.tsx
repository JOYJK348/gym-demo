import React from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs transition-all duration-150',
        hoverable && 'hover:shadow-md hover:border-blue-200 cursor-pointer active:scale-[0.995]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  iconBg?: string;
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon,
  iconBg = 'bg-blue-50 text-blue-600',
  trend,
  onClick
}) => {
  return (
    <Card
      onClick={onClick}
      hoverable={!!onClick}
      className="flex flex-col justify-between space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={cn('p-2.5 rounded-xl text-lg font-bold shrink-0', iconBg)}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </div>
        {(subtext || trend) && (
          <div className="flex items-center gap-1.5 mt-1">
            {trend && (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                {trend}
              </span>
            )}
            {subtext && <span className="text-xs text-slate-500">{subtext}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
