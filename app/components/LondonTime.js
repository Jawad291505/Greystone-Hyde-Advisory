"use client";

import { useSyncExternalStore } from "react";

const londonTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});
function subscribe(cb) {
  const id = setInterval(cb, 15000);
  return () => clearInterval(id);
}

// The practice's local time. Empty on the server (the build doesn't know
// when the page will be read), filled in once the page is live.
export default function LondonTime() {
  const time = useSyncExternalStore(subscribe, () => londonTime.format(new Date()), () => "");
  return time || " ";
}
