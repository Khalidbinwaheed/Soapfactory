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
import { Settings, User } from "@prisma/client"
import { updateProfile, updateSystemSettings } from "@/actions/settings"
import { toast } from "sonner"
import { useState, useTransition } from "react"

export function SettingsForms({ user, initialSettings }: { user: User, initialSettings: Settings | null }) {
    const [isPending, startTransition] = useTransition()

    const handleProfileUpdate = async (formData: FormData) => {
        startTransition(async () => {
             const result = await updateProfile(null, formData)
             if (result.success) toast.success("Profile updated")
             else toast.error(result.message)
        })
    }

    const handleSettingsUpdate = async (formData: FormData) => {
        startTransition(async () => {
             const result = await updateSystemSettings(null, formData)
             if (result.success) toast.success("System settings updated")
             else toast.error(result.message)
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Update your personal information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleProfileUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" defaultValue={user?.name || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" defaultValue={user?.email || ""} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" defaultValue={user?.role || ""} disabled className="bg-muted" />
                        </div>
                        <Button disabled={isPending}>Save Profile</Button> 
                    </form>
                </CardContent>
            </Card>

            {/* Admin Only Settings */}
            {(user.role === "ADMIN" || user.role === "SUPER_ADMIN" || user.role === "MANAGER") && (
                <Card>
                    <CardHeader>
                        <CardTitle>System Settings</CardTitle>
                        <CardDescription>Configuration for the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleSettingsUpdate} className="grid gap-4 md:grid-cols-2">
                             <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input id="companyName" name="companyName" defaultValue={initialSettings?.companyName || "Soap Factory ERP"} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="currency">Currency Code</Label>
                                <Input id="currency" name="currency" defaultValue={initialSettings?.currency || "USD"} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                                <Input id="taxRate" name="taxRate" type="number" step="0.01" defaultValue={initialSettings?.taxRate || 0} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                                <Input id="invoicePrefix" name="invoicePrefix" defaultValue={initialSettings?.invoicePrefix || "INV-"} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="lowStockLimit">Low Stock Alert Limit</Label>
                                <Input id="lowStockLimit" name="lowStockLimit" type="number" defaultValue={initialSettings?.lowStockLimit || 10} />
                            </div>
                            <div className="col-span-2">
                                <Button disabled={isPending}>Save System Settings</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
