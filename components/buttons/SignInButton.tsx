"use client";
import React from "react";
import { Button } from "../ui/button";

import { useRouter } from "next/navigation";

const SignInButton = () => {
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => router.push("/signin")}
      className="border-none px-7 rounded-full"
    >
      Log In
    </Button>
  );
};

export default SignInButton;
