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

export default async function ClientsPage() {
  const clients = await getClients()

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
