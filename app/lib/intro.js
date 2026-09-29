import { useSyncExternalStore } from "react";

// One signal for "the page is uncovered". The preloader fires it as its panel
// lifts (or at once when it is skipped), and page intros and smooth scrolling
// wait for it so nothing plays out of sight underneath.

let ready = false;
const listeners = new Set();

export function isIntroReady() {
  return ready;
}

export function markIntroReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((l) => l());
}

export function subscribeIntro(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useIntroReady() {
  return useSyncExternalStore(subscribeIntro, isIntroReady, () => false);
}
