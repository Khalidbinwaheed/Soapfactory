import { getClients } from "@/actions/users"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ClientForm } from "@/components/clients/client-form"
import { ClientsClient } from "@/components/clients/clients-client"

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const clientsRaw = await getClients()
  const clients = clientsRaw.map(client => ({
      ...client,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
      // emailVerified: client.emailVerified?.toISOString() || null // User model in schema Step 838 DOES NOT have emailVerified? 
      // User model: id, name, email, password, role, phone, address, image, company, isActive, createdAt, updatedAt.
      // No emailVerified.
  }))

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Clients</h1>
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Client
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                    <DialogDescription>
                        Create a new client account. Default password is '123456'.
                    </DialogDescription>
                </DialogHeader>
                <ClientForm />
            </DialogContent>
        </Dialog>
      </div>
      <ClientsClient data={clients as any} />
    </div>
  )
}
