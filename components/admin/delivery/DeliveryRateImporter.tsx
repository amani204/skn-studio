"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function DeliveryRateImporter() {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/delivery-rates/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Une erreur est survenue");

      alert(`Succès ! ${data.count} wilayas ont été importées.`);
      
      // Instantly refreshes the server table data without reloading the page
      router.refresh(); 
    } catch (err: any) {
      alert(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; 
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={loading}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
        // Using your exact styling framework classes
        className="rounded-lg border border-navy/20 px-5 py-2.5 text-sm font-medium text-navy hover:bg-navy/5 transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Importation..." : "Importer depuis CSV"}
      </button>
    </>
  );
}