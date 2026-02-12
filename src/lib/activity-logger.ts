import { db } from "@/lib/db"

export async function logActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: string
) {
  try {
    await db.activityLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        details,
      },
    })
  } catch (error) {
    console.error("Failed to log activity:", error)
    // Don't throw, just log error, to avoid breaking main flows
  }
}
