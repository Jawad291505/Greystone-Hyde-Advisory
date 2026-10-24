import { useSyncExternalStore } from "react";

// The visitor's cookie choice: "accepted", "rejected", or null while they
// haven't chosen. Optional cookies (today, only the Google Maps embed in the
// footer) wait for "accepted". The choice itself is kept in localStorage,
// which is strictly necessary to remember it and needs no consent; if
// storage is blocked it lasts for the visit. Bump VERSION when the cookies
// we use change, so everyone is asked again.

const KEY = "gh-cookie-consent";
const VERSION = 1;

let choice;
let settingsOpen = false;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

function read() {
  if (choice !== undefined) return choice;
  choice = null;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved?.v === VERSION && (saved.choice === "accepted" || saved.choice === "rejected")) choice = saved.choice;
  } catch {}
  return choice;
}

export function setConsent(next) {
  choice = next;
  settingsOpen = false;
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, choice: next, at: new Date().toISOString() }));
  } catch {}
  emit();
}

// Re-opens the banner so a choice can be changed at any time
export function openCookieSettings() {
  settingsOpen = true;
  emit();
}

function subscribe(cb) {
  listeners.add(cb);
  // A choice made in another tab applies here too
  const onStorage = (e) => {
    if (e.key !== KEY) return;
    choice = undefined;
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

// Server render and hydration see `undefined` (not yet known), so nothing
// consent-gated flashes in or out before the saved choice is read.
export function useConsent() {
  return useSyncExternalStore(subscribe, read, () => undefined);
}

export function useCookieSettingsOpen() {
  return useSyncExternalStore(subscribe, () => settingsOpen, () => false);
}
