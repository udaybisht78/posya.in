"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,  // remove spinner
  trickleSpeed: 100,   // faster trickle
  minimum: 0.05,       // start slightly filled
});

export default function GlobalProgress() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false; // skip first render
      return;
    }
    NProgress.start();

    const timer = setTimeout(() => NProgress.done(), 400); // slightly longer for smooth effect
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
