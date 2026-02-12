"use client"

import { ColumnDef } from "@tanstack/react-table"
import { User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ClientForm } from "./client-form"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const columns: ColumnDef<User>[] = [
  {
    id: "image",
    header: "Image",
    cell: ({ row }) => {
        const user = row.original as any
        return (
            <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
        )
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => row.original.address || "-",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const [isOpen, setIsOpen] = useState(false)

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DialogTrigger asChild>
                    <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4"/> Edit
                    </DropdownMenuItem>
                </DialogTrigger>
            </DropdownMenuContent>
            </DropdownMenu>
            <DialogContent>
                <ClientForm client={user} onSuccess={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
      )
    },
  },
]
