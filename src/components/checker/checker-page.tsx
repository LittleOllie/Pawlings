"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface CheckPageProps {
  checkerEnabled: boolean;
  heading: string;
  closedMessage: string;
  approvedMessage: string;
  notApprovedMessage: string;
}

export function CheckerPage({
  checkerEnabled,
  heading,
  closedMessage,
  approvedMessage,
  notApprovedMessage,
}: CheckPageProps) {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    message: string;
  } | null>(null);

  if (!checkerEnabled) {
    return (
      <PublicLayout>
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-32">
          <Card className="max-w-lg w-full text-center p-8 sm:p-12 space-y-6">
            <Clock className="h-16 w-16 text-accent mx-auto" />
            <h1 className="font-display text-3xl font-bold">{heading}</h1>
            <p className="text-foreground-muted leading-relaxed">
              {closedMessage}
            </p>
          </Card>
        </main>
        <Footer />
      </PublicLayout>
    );
  }

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: wallet }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        status: "error",
        message: "Unable to check wallet. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const icons: Record<string, typeof CheckCircle> = {
    approved: CheckCircle,
    not_found: XCircle,
    invalid: AlertTriangle,
    rate_limited: AlertTriangle,
  };

  return (
    <PublicLayout>
      <Header />
      <main className="flex-1 px-4 py-28 sm:px-6">
        <div className="mx-auto max-w-lg space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              {heading}
            </h1>
            <p className="text-foreground-muted">
              Enter your wallet address to check approval status.
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <Input
              label="Wallet address"
              placeholder="0x..."
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
            />
            <Button
              onClick={handleCheck}
              loading={loading}
              className="w-full"
              disabled={!wallet.trim()}
            >
              <Search className="h-4 w-4" />
              Check Wallet
            </Button>
          </Card>

          {result && (
            <Card className="p-6 text-center space-y-3">
              {(() => {
                const Icon = icons[result.status] ?? AlertTriangle;
                return (
                  <Icon
                    className={`h-12 w-12 mx-auto ${
                      result.status === "approved"
                        ? "text-success"
                        : "text-foreground-muted"
                    }`}
                  />
                );
              })()}
              <p className="text-foreground-muted">{result.message}</p>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </PublicLayout>
  );
}
