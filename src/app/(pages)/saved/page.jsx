"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SavedJobsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home with saved view or display saved
    router.replace("/home");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBFBFD", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "#5B5867" }}>
        <div style={{ width: "28px", height: "28px", border: "3px solid #E4E1EC", borderTopColor: "#3B6FE0", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span>Loading Saved Jobs...</span>
      </div>
    </div>
  );
}
