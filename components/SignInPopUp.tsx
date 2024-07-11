import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const SignInPopUp = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="hidden md:inline-flex">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Sign in to get access to all features
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <Input
              id="name"
              type="email"
              className="col-span-3"
              placeholder="enter email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Password
            </Label>
            <Input
              type="password"
              id="username"
              className="col-span-3"
              placeholder="enter password"
            />
          </div>
          <div className="text-sm flex justify-center gap-1">
            Don't have an account?
            <a href="/signup" className="text-blue-400">
              Sign Up
            </a>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Sign In</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignInPopUp;
