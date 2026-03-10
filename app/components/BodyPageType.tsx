"use client";

import { useEffect } from "react";

export function BodyPageType({ type }: { type: string }) {
  useEffect(() => {
    document.body.setAttribute("data-page-type", type);
    return () => document.body.removeAttribute("data-page-type");
  }, [type]);
  return null;
}
