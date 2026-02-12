"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useState, useTransition } from "react"
// import { updateProfileAction } from "@/actions/users" // I need to create this

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()

  // Placeholder for real implementation
  // Since I haven't created user update actions yet, I'll just show the UI
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
                Update your personal information.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={session?.user?.name || ""} disabled />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={session?.user?.email || ""} disabled />
            </div>
             <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue={session?.user?.role || ""} disabled />
            </div>
            <Button disabled>Save Changes (Coming Soon)</Button>
        </CardContent>
      </Card>
      
      <Card>
          <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configuration for the application.</CardDescription>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-muted-foreground">Global settings like Tax Rate, Currency, etc. will be here.</p>
          </CardContent>
      </Card>
    </div>
  )
}
