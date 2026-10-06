"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

// The About page's entrance, played once as the element scrolls into view: a
// short rise out of transparency. Opacity and transform only, so it stays
// off the main thread's layout work.
export function Reveal({ as = "div", delay = 0, y = 22, className, children, ...rest }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </M>
  );
}
