"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function InputOTPControlled() {
  const [value, setValue] = React.useState("");
  const [email, setEmail] = React.useState<string>("");
  const router = useRouter();

  // ✅ Load query param client-side only
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  async function handleOtp() {
    const data = {
      email,
      otp: value,
    };

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/auth/signin");
    }
  }

  return (
    <Card className="w-full max-w-sm mx-auto my-28">
      <CardHeader>
        <CardTitle>----------------Enter the otp----------------</CardTitle>
        <CardDescription>
          check the otp in your email: {email}
        </CardDescription>
      </CardHeader>
      <div className="space-y-2 flex flex-col max-w-sm w-full items-center">
        <InputOTP maxLength={6} value={value} onChange={setValue}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button onClick={handleOtp} className="cursor-pointer">
          Submit
        </Button>
      </div>
    </Card>
  );
}
