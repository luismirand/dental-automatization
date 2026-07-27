"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function CalReactWidget() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        theme: "light",
        styles: { branding: { brandColor: "#0d9488" } }
      });
    })();
  }, []);

  return (
    <div className="w-full h-full min-h-[700px] overflow-hidden rounded-2xl bg-white shadow-inner">
      <Cal
        namespace="30min"
        calLink="luis-miranda/30min"
        style={{ width: "100%", height: "100%", minHeight: "700px", overflow: "scroll" }}
        config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
      />
    </div>
  );
}
