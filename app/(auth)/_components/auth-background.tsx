"use client";

import { Dithering } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function AuthBackground() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const isDark = resolvedTheme === "dark";

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 -z-10">
      <Dithering
        width={1920}
        height={1080}
        colorBack={isDark ? "#09090b" : "#ffffff"}
        colorFront={isDark ? "#27272a" : "#e4e4e7"}
        shape="warp"
        type="2x2"
        size={2.5}
        speed={0.6}
        fit="cover"
      />
    </div>
  );
}
