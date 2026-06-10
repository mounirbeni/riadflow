"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/shared/glass-card";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const AUTH_PATHS = ["/login", "/register", "/forgot-password"];
const DEFAULT_CALLBACK_URL = "/dashboard";

function getSafeCallbackUrl(value: string | null) {
  if (!value) return DEFAULT_CALLBACK_URL;

  try {
    const url = new URL(value, "http://localhost");
    const path = `${url.pathname}${url.search}${url.hash}`;

    if (!path.startsWith("/") || path.startsWith("//")) {
      return DEFAULT_CALLBACK_URL;
    }

    if (AUTH_PATHS.some((authPath) => url.pathname === authPath)) {
      return DEFAULT_CALLBACK_URL;
    }

    if (
      typeof window !== "undefined" &&
      url.origin !== "http://localhost" &&
      url.origin !== window.location.origin
    ) {
      return DEFAULT_CALLBACK_URL;
    }

    return path;
  } catch {
    return DEFAULT_CALLBACK_URL;
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"));
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: callbackUrl,
      });

      if (!result?.ok || result.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        window.location.assign(getSafeCallbackUrl(result.url || callbackUrl));
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <GlassCard className="p-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-sand-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-sand-500">Sign in to your RiadFlow account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="pl-10 bg-sand-50 border-sand-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sand-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pl-10 pr-10 bg-sand-50 border-sand-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-terracotta-500 hover:text-terracotta-600"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full py-6"
          >
            {loading ? "Signing in..." : "Sign In"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-sand-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-terracotta-500 hover:text-terracotta-600 font-medium"
          >
            Create one
          </Link>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-md h-96 animate-pulse bg-sand-100 rounded-2xl" />}>
      <LoginForm />
    </Suspense>
  );
}
