import { auth } from "@/auth"
import { ProfileForm } from "@/components/profile/profile-form"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) redirect("/login")

  const sanitizedUser = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      </div>
      <ProfileForm user={sanitizedUser as any} />
    </div>
  )
}
