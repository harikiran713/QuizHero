"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function inputCollector(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function formHandler(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      username: formData.email,
      password: formData.password,
      // ⛔ callbackUrl removed
    });

    // Optional: if needed, manually handle errors or redirects
    // if (res?.error) {
    //   console.error("Login failed:", res.error);
    // }
  }

  return (
    <div className="py-36">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              className="cursor-pointer"
              onClick={() => router.push("/auth/signup")}
            >
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={formHandler}>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                name="email"
                value={formData.email}
                onChange={inputCollector}
              />

              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={inputCollector}
              />

              <Button type="submit" className="cursor-pointer">
                Login
              </Button>

              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => signIn("google")} // ⛔ callbackUrl removed
              >
                Login with Google
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
