import { Chip } from "@heroui/react"

type StatusType = "pending" | "confirmed" | "cancelled" | "paid" | "unpaid" | "published" | "draft"

interface StatusBadgeProps {
  status: StatusType
  label: string
}

const statusConfig: Record<StatusType, { color: "warning" | "success" | "danger" | "default" | "accent" }> = {
  pending: { color: "warning" },
  confirmed: { color: "success" },
  cancelled: { color: "danger" },
  paid: { color: "success" },
  unpaid: { color: "danger" },
  published: { color: "success" },
  draft: { color: "default" },
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Chip color={config.color} variant="soft" size="sm">
      {label}
    </Chip>
  )
}
