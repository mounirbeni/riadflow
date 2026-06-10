"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MessageSquare, Send, User, CheckCircle, Mail } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: { id: string; name: string | null; role: string };
  booking: { id: string; bookingNumber: string; guestName: string };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function sendReply(bookingId: string) {
    const content = replyContent[bookingId];
    if (!content?.trim()) return;

    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, content }),
      });

      if (res.ok) {
        toast.success("Reply sent");
        setReplyContent((prev) => ({ ...prev, [bookingId]: "" }));
        fetchMessages();
      } else {
        toast.error("Failed to send reply");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function markAsRead(id: string) {
    try {
      await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchMessages();
    } catch {
      // silently fail
    }
  }

  // Group messages by booking
  const grouped = messages.reduce<Record<string, Message[]>>((acc, msg) => {
    const key = msg.booking.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">Messages</h1>
          <p className="text-sand-500">Guest communication by booking</p>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(grouped).map(([bookingId, msgs]) => {
          const booking = msgs[0].booking;
          const unreadCount = msgs.filter((m) => !m.isRead && m.sender.role === "GUEST").length;

          return (
            <motion.div
              key={bookingId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-sand-100">
                  <Mail className="h-4 w-4 text-terracotta-500" />
                  <span className="font-medium text-sand-900">{booking.bookingNumber}</span>
                  <span className="text-sm text-sand-500">— {booking.guestName}</span>
                  {unreadCount > 0 && (
                    <span className="ml-auto text-xs bg-terracotta-500 text-white px-2 py-0.5 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                  {msgs.reverse().map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 p-3 rounded-xl ${
                        msg.sender.role === "ADMIN"
                          ? "bg-terracotta-50 ml-8"
                          : "bg-sand-50 mr-8"
                      }`}
                      onClick={() => !msg.isRead && msg.sender.role === "GUEST" && markAsRead(msg.id)}
                    >
                      <div className="h-8 w-8 rounded-full bg-white border border-sand-200 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-sand-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-sand-900">
                            {msg.sender.name || "Guest"}
                          </span>
                          <span className="text-xs text-sand-400">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                          {!msg.isRead && msg.sender.role === "GUEST" && (
                            <span className="h-2 w-2 rounded-full bg-terracotta-500" />
                          )}
                        </div>
                        <p className="text-sm text-sand-700">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a reply..."
                    value={replyContent[bookingId] || ""}
                    onChange={(e) =>
                      setReplyContent((prev) => ({ ...prev, [bookingId]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && sendReply(bookingId)}
                    className="flex-1 px-4 py-2 rounded-xl border border-sand-200 bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-400 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => sendReply(bookingId)}
                    className="bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full gap-1"
                  >
                    <Send className="h-4 w-4" />
                    Reply
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
