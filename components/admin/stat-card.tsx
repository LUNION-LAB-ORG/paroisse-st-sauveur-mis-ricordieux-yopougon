import { Card, Chip } from "@heroui/react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  icon: LucideIcon
  value: string | number
  label: string
  trend?: string
  trendUp?: boolean
  iconBgColor?: string
  iconColor?: string
}

export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  trendUp = true,
  iconBgColor = "bg-[#2d2d83]/10",
  iconColor = "text-[#2d2d83]",
}: StatCardProps) {
  return (
    <Card className="p-4 lg:p-5 hover:shadow-md transition-shadow">
      <Card.Content>
        <div className="flex items-start gap-3 lg:gap-4">
          <div className={cn("p-2.5 lg:p-3 rounded-xl shrink-0", iconBgColor)}>
            <Icon className={cn("w-5 h-5 lg:w-6 lg:h-6", iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xl lg:text-2xl font-bold text-foreground truncate">{value}</p>
            <p className="text-xs lg:text-sm text-muted mt-0.5 line-clamp-2">{label}</p>
          </div>
          {trend && (
            <Chip
              color={trendUp ? "success" : "danger"}
              variant="soft"
              size="sm"
            >
              {trendUp ? "↗" : "↘"} {trend}
            </Chip>
          )}
        </div>
      </Card.Content>
    </Card>
  )
}
