import { AuthLayout } from "@/components/auth/auth-layout"
import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function SignupPage() {
  return (
    <AuthLayout imageSrc="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop">
      <div className="flex flex-col space-y-2 text-center">
        <div className="flex justify-center mb-4">
             <div className="bg-orange-500 rounded-lg p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                  <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
                  <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 2.322-.446.75.75 0 0 0 1.052.765 2.381 2.381 0 0 1 2.375 0 .75.75 0 0 0 1.052-.765 5.248 5.248 0 0 0 2.572-.761.75.75 0 1 0-.9-1.203c-.269.201-.559.384-.863.546a.881.881 0 0 0-.886 0 3.883 3.883 0 0 0-3.876 0 .881.881 0 0 0-.886 0A3.74 3.74 0 0 1 5.26 17.242Z" />
                </svg>
            </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight font-serif">Create an Account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <SignupForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/login" className="hover:text-brand underline underline-offset-4">
          Already have an account? Sign In
        </Link>
      </p>
    </AuthLayout>
  )
}
