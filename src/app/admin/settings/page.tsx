"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Settings, Save, Trash2 } from "lucide-react";

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updatedAt: string;
}

const DEFAULT_KEYS = [
  { key: "site_name", label: "Site Name", placeholder: "RiadFlow" },
  { key: "contact_email", label: "Contact Email", placeholder: "hello@riadflow.com" },
  { key: "contact_phone", label: "Contact Phone", placeholder: "+212 5XX-XXXXXX" },
  { key: "address", label: "Address", placeholder: "123 Rue de la Medina, Marrakech" },
  { key: "facebook_url", label: "Facebook URL", placeholder: "https://facebook.com/..." },
  { key: "instagram_url", label: "Instagram URL", placeholder: "https://instagram.com/..." },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success) setSettings(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSetting(key: string, value: string) {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (res.ok) {
        toast.success("Setting saved");
        fetchSettings();
      } else {
        toast.error("Failed to save setting");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function addSetting() {
    if (!newKey.trim() || !newValue.trim()) return;
    await saveSetting(newKey.trim(), newValue.trim());
    setNewKey("");
    setNewValue("");
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading settings..." />
      </div>
    );
  }

  const settingsMap = new Map(settings.map((s) => [s.key, s]));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Settings</h1>
          <p className="text-sand-500">Manage site configuration</p>
        </div>
      </div>

      <div className="space-y-4">
        {DEFAULT_KEYS.map((def, index) => {
          const existing = settingsMap.get(def.key);
          const [value, setValue] = useState(existing?.value || "");

          return (
            <motion.div
              key={def.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-sand-900 mb-1">{def.label}</label>
                    <p className="text-xs text-sand-400 mb-2">Key: {def.key}</p>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={def.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400 text-sm"
                    />
                  </div>
                  <Button
                    onClick={() => saveSetting(def.key, value)}
                    className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full gap-1 mt-6"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <GlassCard className="p-5">
        <h3 className="font-medium text-sand-900 mb-3">Custom Setting</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Key"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400 text-sm"
          />
          <input
            type="text"
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400 text-sm"
          />
          <Button
            onClick={addSetting}
            className="bg-olive-500 hover:bg-olive-600 text-white rounded-full gap-1"
          >
            <Save className="h-4 w-4" />
            Add
          </Button>
        </div>
      </GlassCard>

      {settings.length > 0 && (
        <div className="mt-8">
          <h3 className="font-medium text-sand-900 mb-3">All Saved Settings</h3>
          <div className="space-y-2">
            {settings.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-sand-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-sand-900">{s.key}</p>
                  <p className="text-sm text-sand-600">{s.value}</p>
                </div>
                <span className="text-xs text-sand-400">
                  {new Date(s.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
