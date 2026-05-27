"use client";

import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  as?: "div" | "article" | "section";
}

export default function Card({
  children,
  className = "",
  hoverable = false,
  as: Component = "div",
}: CardProps) {
  const baseStyles = "bg-white rounded-2xl border border-gray-100";
  const hoverStyles = hoverable 
    ? "card-hoverable" 
    : "";

  return (
    <Component className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </Component>
  );
}