"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient, updateClient } from "@/actions/users"
import { User } from "@prisma/client"
import { toast } from "sonner"
import { ImageUpload } from "@/components/ui/image-upload"

interface ClientFormProps {
  client?: User
  onSuccess?: () => void
}

export function ClientForm({ client, onSuccess }: ClientFormProps) {
  const [state, action, isPending] = useActionState(client ? updateClient : createClient, null)
  const [imageUrl, setImageUrl] = useState<string>((client as any)?.image || "")

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message)
      if (onSuccess) {
         onSuccess()
      }
    } else if (state?.message) {
      toast.error(state.message)
    }
  }, [state, onSuccess])

  return (
    <form action={action} className="grid gap-4 py-4">
      {client && <input type="hidden" name="id" value={client.id} />}
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input id="name" name="name" defaultValue={client?.name || ""} className="col-span-3" required />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input id="email" name="email" type="email" defaultValue={client?.email || ""} className="col-span-3" required />
      </div>

       <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone
        </Label>
        <Input id="phone" name="phone" defaultValue={client?.phone || ""} className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="address" className="text-right">
          Address
        </Label>
        <Input id="address" name="address" defaultValue={client?.address || ""} className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="company" className="text-right">
          Company
        </Label>
        {/* Type casting to avoid potential stale type definition in editor */}
        <Input id="company" name="company" defaultValue={(client as any)?.company || ""} className="col-span-3" />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="image" className="text-right">
          Photo
        </Label>
        <div className="col-span-3">
             <ImageUpload 
                value={imageUrl} 
                onChange={setImageUrl}
                disabled={isPending}
             />
             <input type="hidden" name="image" value={imageUrl} />
        </div>
      </div>

      {!client && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" name="password" type="password" placeholder="Default: 123456" className="col-span-3" />
          </div>
      )}

      <div className="flex justify-end">
         <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : (client ? "Update Client" : "Create Client")}
         </Button>
      </div>
    </form>
  )
}
