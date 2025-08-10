"use client";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Loading component for Suspense fallback
function VerificationLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Loading verification details...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main page component
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerificationLoading />}>
      <VerificationClient />
    </Suspense>
  );
}

// Client component that uses useSearchParams

import { useEffect, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { updateEmailVerificationStatus } from "@/lib/auth";
import { Button } from "@/components/ui/button";

function VerificationClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = useState("Verifying your email address...");
  const [isPending, startTransition] = useTransition();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (!userId || !secret) {
      setStatus("error");
      setMessage("Invalid verification link. Please try again.");
      return;
    }

    startTransition(async () => {
      const result = await updateEmailVerificationStatus(userId, secret);
      console.log(result, "result-----------", secret, userId);
      if (result.success) {
        setStatus("success");
        setMessage(
          "Your email has been successfully verified! You can now access all features."
        );
      } else {
        setStatus("error");
        setMessage(
          "Failed to verify your email. The link may have expired or is invalid."
        );
      }
    });
  }, [userId, secret]);

  const handleRedirect = () => {
    router.push("/sign-in");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "verifying" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">{message}</p>
            </div>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-foreground">{message}</p>
              <Button onClick={handleRedirect} className="mt-4">
                Go to Login
              </Button>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="text-destructive">{message}</p>
              <Button
                onClick={() => router.push("/sign-in")}
                className="mt-4"
                variant="outline"
              >
                Back to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
