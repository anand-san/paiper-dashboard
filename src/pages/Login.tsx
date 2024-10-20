import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  AuthError,
} from "firebase/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { user, loading: loadingUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleAuthError = (error: AuthError) => {
    setLoading(false);
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-email":
        toast({
          description: "Invalid email or password",
          variant: "destructive",
        });
        break;
      case "auth/too-many-requests":
        toast({
          description: "Too many login attempts. Please try again later.",
          variant: "destructive",
        });
        break;
      default:
        toast({
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
    }
  };

  const handleSuccessfulAuth = () => {
    setLoading(false);
    navigate("/"); // Redirect to dashboard after successful login
  };

  const handleEmailPasswordLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const password = (
      e.currentTarget.elements.namedItem("password") as HTMLInputElement
    ).value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleSuccessfulAuth();
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      handleSuccessfulAuth();
    } catch (error) {
      handleAuthError(error as AuthError);
    }
  };

  if (loadingUserData) {
    return "loading";
  }

  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center px-5 pt-0 md:h-[unset] md:max-w-[50%] lg:h-[100vh] min-h-[100vh] lg:max-w-[50%] lg:px-6">
      <div className="my-auto mb-auto flex flex-col md:mt-[70px] w-[350px] max-w-[450px] mx-auto md:max-w-[450px] lg:mt-[130px] lg:max-w-[450px]">
        <h1 className="text-[32px] font-bold ">Sign In</h1>

        <p className="mb-2.5 mt-2.5 font-normal text-zinc-700 dark:text-zinc-300">
          Enter your email and password to sign in!
        </p>

        <div className="mt-8">
          <Button
            variant="outline"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 w-full py-6 "
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <GoogleIcon className="mr-2 h-5 w-5" />
            <span>{loading ? "Signing in..." : "Google"}</span>
          </Button>
        </div>

        <div className="relative my-4">
          <div className="relative flex items-center py-1">
            <div className="grow border-t border-zinc-200 dark:border-zinc-700"></div>
            <div className="grow border-t border-zinc-200 dark:border-zinc-700"></div>
          </div>
        </div>

        <form onSubmit={handleEmailPasswordLogin} noValidate className="mb-4">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <label className="" htmlFor="email">
                Email
              </label>
              <Input
                className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-700 dark:bg-zinc-800  dark:placeholder:text-zinc-500"
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                name="email"
              />
              <label className="mt-2 " htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-700 dark:bg-zinc-800  dark:placeholder:text-zinc-500"
                name="password"
              />
            </div>
            <Button
              variant="outline"
              className="mt-2 h-[unset] px-4 py-4"
              type="submit"
              disabled={loading}
            >
              Sign in
            </Button>
          </div>
        </form>

        <p>
          <a
            href="/dashboard/signin/forgot_password"
            className="font-medium text-sm"
          >
            Forgot your password?
          </a>
        </p>
        <p>
          <a
            href="/dashboard/signin/email_signin"
            className="font-medium text-sm"
          >
            Sign in via magic link
          </a>
        </p>
        <p>
          <a href="/dashboard/signin/signup" className="font-medium text-sm">
            Don&apos;t have an account? Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

// Google icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 48 48"
      enableBackground="new 0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  );
}
