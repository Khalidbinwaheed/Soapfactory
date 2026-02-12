"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useState, useEffect } from "react"
import { getNotifications, markAsReadAction, markAllAsReadAction } from "@/actions/notifications"
import { Notification } from "@prisma/client"
// import { useSession } from "next-auth/react" // If client side session needed

interface NotificationBellProps {
    userId: string
}

export function NotificationBell({ userId }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const fetchNotifications = async () => {
        const data = await getNotifications(userId)
        setNotifications(data)
        setUnreadCount(data.filter(n => !n.isRead).length)
    }

    // Poll every 30 seconds for simplicity for now
    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [userId])

    const handleMarkAsRead = async (id: string) => {
        await markAsReadAction(id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
        setUnreadCount(prev => Math.max(0, prev - 1))
    }
    
    const handleMarkAllRead = async () => {
        await markAllAsReadAction(userId)
        setNotifications(prev => prev.map(n => ({...n, isRead: true})))
        setUnreadCount(0)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="xs" className="text-xs h-auto p-1" onClick={handleMarkAllRead}>
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <DropdownMenuItem key={notification.id} className="cursor-pointer flex flex-col items-start gap-1 p-3" onClick={() => handleMarkAsRead(notification.id)}>
                                <div className="flex justify-between w-full">
                                    <span className={`font-medium text-sm ${notification.isRead ? 'text-muted-foreground' : ''}`}>
                                        {notification.title}
                                    </span>
                                    {/* <span className="text-[10px] text-muted-foreground">{new Date(notification.createdAt).toLocaleDateString()}</span> */}
                                </div>
                                <p className={`text-xs ${notification.isRead ? 'text-muted-foreground' : ''}`}>
                                    {notification.message}
                                </p>
                                {!notification.isRead && (
                                    <span className="h-2 w-2 bg-blue-500 rounded-full absolute right-2 top-4"></span>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
