"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from "bcryptjs"

const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().optional(), // Optional for updates
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["CLIENT", "MANAGER", "ADMIN"]).default("CLIENT"),
})

export async function getClients() {
  try {
    return await db.user.findMany({
      where: { role: "CLIENT" },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    return []
  }
}

export async function createClient(prevState: any, formData: FormData) {
  const rawData = Object.fromEntries(formData.entries())
  const validated = userSchema.safeParse(rawData)

  if (!validated.success) {
    return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
  }

  const { name, email, password, image, company, phone } = validated.data
  const hashedPassword = await bcrypt.hash(password || "123456", 10)

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENT",
        image,
        company,
        phone
      }
    })
    revalidatePath("/dashboard/clients")
    return { success: true, message: "Client created" }
  } catch (e) {
    return { message: "Failed to create client" }
  }
}

export async function updateClient(prevState: any, formData: FormData) {
    } catch (e) {
        return { message: "Failed to update client" }
    }
}
