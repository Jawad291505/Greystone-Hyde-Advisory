"use client";

import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("../lib/motionFeatures").then((mod) => mod.default);

// The pages' animated elements are framer-motion's slim `m.` components. They
// server-render in their starting state like `motion.` ones do, but the
// engine that animates them arrives here, after the first paint, instead of
// in the scripts every visitor downloads before the page can show: on a slow
// phone that frees the connection for the hero.
export default function MotionFeatures({ children }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
