"use client";

import { useEffect, useState } from "react";

export default function OfflineBar() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <div role="status" className="offline-bar">
      Você está offline. Alguns recursos podem não funcionar.
    </div>
  );
}
