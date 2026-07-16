"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-2 text-xs font-semibold text-slate-450 mb-6">
      <Link href="/" className="hover:text-white transition-colors">
        Home
      </Link>
      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <React.Fragment key={segment}>
            <span className="text-slate-550">/</span>
            {isLast ? (
              <span className="text-slate-350">{name}</span>
            ) : (
              <Link href={url} className="hover:text-white transition-colors">
                {name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
