"use client";

import { useEffect, useState } from "react";

export function useDashboardNavVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/preview")
      .then((r) => r.json())
      .then((data: { authorized?: boolean; live?: boolean }) => {
        setVisible(Boolean(data.live || data.authorized));
      })
      .catch(() => setVisible(false));
  }, []);

  return visible;
}
