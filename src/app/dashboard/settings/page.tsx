import { auth } from "@/auth"
import { getSystemSettings } from "@/actions/settings"
import { SettingsForms } from "@/components/settings/settings-forms" // Check import path
import { redirect } from "next/navigation"
import { db } from "@/lib/db"

// Fetch user fresh from DB just in case session is stale, or rely on session.
async function getUser(id: string) {
    return await db.user.findUnique({ where: { id } })
}

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  
  const user = await getUser(session.user.id)
  if (!user) redirect("/login")

  const settings = await getSystemSettings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <SettingsForms user={user} initialSettings={settings} />
    </div>
  )
}
