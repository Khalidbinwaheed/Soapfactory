"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { signupAction } from "@/actions/auth"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setError("")
    setSuccess("")
    startTransition(async () => {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("email", values.email)
        formData.append("password", values.password)

        const result = await signupAction(formData)

        if (result.error) {
            setError(result.error)
        } else {
            setSuccess(result.success)
            // Optional: Redirect to login after a delay
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                {error}
            </div>
        )}
        {success && (
            <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
                {success}
            </div>
        )}
        <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isPending}>
          {isPending ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  )
}
