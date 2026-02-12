"use client"

import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/clients/columns"
import { User } from "@prisma/client"

interface ClientsClientProps {
  data: User[]
}

export function ClientsClient({ data }: ClientsClientProps) {
  return <DataTable columns={columns} data={data} searchKey="name" />
}
