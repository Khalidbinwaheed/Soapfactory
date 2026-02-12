import { getNotifications, markAllAsReadAction, markAsReadAction } from "@/actions/notifications"
import { auth } from "@/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCheck, Bell } from "lucide-react"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cn } from "@/lib/utils"

export default async function NotificationsPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const notifications = await getNotifications(session.user.id)

  async function markAllRead() {
    "use server"
    if (session?.user?.id) {
        await markAllAsReadAction(session.user.id)
        revalidatePath("/dashboard/notifications")
    }
  }

  // Helper action to form submit
  async function markRead(formData: FormData) {
      "use server"
      const id = formData.get("id") as string
      if(id) {
        await markAsReadAction(id)
        revalidatePath("/dashboard/notifications")
      }
  }

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-lg font-semibold md:text-2xl">Notifications</h1>
            <p className="text-sm text-muted-foreground">Stay updated with your latest alerts.</p>
        </div>
        <form action={markAllRead}>
             <Button variant="outline" size="sm">
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all as read
            </Button>
        </form>
       
      </div>

      <div className="space-y-4">
        {notifications.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No notifications yet.</p>
            </div>
        )}
        {notifications.map((notification) => (
          <Card key={notification.id} className={cn("transition-colors", !notification.isRead && "bg-muted/30 border-l-4 border-l-orange-500")}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        {notification.title}
                        {!notification.isRead && <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />}
                    </CardTitle>
                    <CardDescription>
                        {new Date(notification.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                   {!notification.isRead && (
                       <form action={markRead}>
                           <input type="hidden" name="id" value={notification.id} />
                           <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Mark as read">
                               <CheckCheck className="h-4 w-4" />
                           </Button>
                       </form>
                   )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {notification.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
