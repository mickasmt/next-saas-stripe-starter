import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
}

export default function SignUpPage() {
  return (
    <div className="mx-auto flex flex-col justify-center space-y-6">
      <SignUp />
      <div className="mx-auto flex flex-col justify-center">
        <p className="px-8 text-center text-sm text-muted-foreground sm:w-[350px]">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-brand underline underline-offset-4"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-brand underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
