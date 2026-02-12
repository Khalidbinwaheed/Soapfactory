"use client"

import { useActionState, useEffect, useState } from "react"
import { updateProfile, changePassword } from "@/actions/settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { User } from "@prisma/client"

export function ProfileForm({ user }: { user: User }) {
  const [profileState, profileAction, isProfilePending] = useActionState(updateProfile, null)
  const [passwordState, passwordAction, isPasswordPending] = useActionState(changePassword, null)

  useEffect(() => {
    if (profileState?.success) toast.success(profileState.message)
    else if (profileState?.message) toast.error(profileState.message)
  }, [profileState])

  useEffect(() => {
    if (passwordState?.success) toast.success(passwordState.message)
    else if (passwordState?.message) toast.error(passwordState.message)
  }, [passwordState])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={profileAction} className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
               <Avatar className="h-16 w-16">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback>{user.name?.[0]}</AvatarFallback>
               </Avatar>
               <div className="flex-1">
                   <Label htmlFor="image">Profile Picture URL</Label>
                   <Input id="image" name="image" defaultValue={user.image || ""} placeholder="https://example.com/me.jpg" />
               </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={user.name || ""} required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" defaultValue={user.email} disabled className="bg-muted" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={user.phone || ""} placeholder="+1234567890" />
            </div>

             <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" defaultValue={(user as any).company || ""} placeholder="Company Name" />
            </div>

            <Button disabled={isProfilePending}>
              {isProfilePending ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Ensure your account is secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={passwordAction} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" name="newPassword" type="password" required minLength={6} />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={6} />
            </div>
            <Button disabled={isPasswordPending} variant="outline">
              {isPasswordPending ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
