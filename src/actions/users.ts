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

  const { name, email, password, phone, address, role } = validated.data
  
  // Basic password requirement for new users if not provided
  const hashedPassword = await bcrypt.hash(password || "123456", 10) 

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: role as any,
      },
    })
    revalidatePath("/dashboard/clients")
    return { message: "Client created successfully", success: true }
  } catch (error) {
    console.error(error)
    return { message: "Failed to create client. Email might be duplicate." }
  }
}

export async function updateClient(prevState: any, formData: FormData) {
    const id = formData.get("id") as string
    const rawData = Object.fromEntries(formData.entries())
    const validated = userSchema.safeParse(rawData)

    if (!validated.success) {
        return { message: "Invalid fields", errors: validated.error.flatten().fieldErrors }
    }

    const { name, email, phone, address, role } = validated.data

    try {
        await db.user.update({
            where: { id },
            data: {
                name,
                email,
                phone,
                address,
                role: role as any,
            }
        })
        revalidatePath("/dashboard/clients")
        return { message: "Client updated successfully", success: true }
    } catch (e) {
        return { message: "Failed to update client" }
    }
}
