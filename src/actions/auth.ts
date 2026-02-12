"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function signupAction(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const validatedFields = signupSchema.safeParse({ name, email, password })

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Email already in use" }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "CLIENT", // Default role
    },
  })

  return { success: "Account created! You can now login." }
}
