"use client"

import { useActionState, useEffect } from "react"
import { signupAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(signupAction, null)

  useEffect(() => {
    if (state?.success) toast.success(state.success) 
    else if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center p-4">
       <div className="max-w-md w-full space-y-8">
         <div className="flex flex-col items-center justify-center gap-2">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
             <Sparkles className="h-7 w-7 fill-white" />
           </div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">SoapFactory</h1>
           <p className="text-muted-foreground text-sm font-medium">Create your account</p>
         </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
                Enter your details below to create your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required minLength={6} />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]" disabled={isPending}>
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline hover:text-orange-500 font-medium transition-colors">
                    Sign in
                </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
