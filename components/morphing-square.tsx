"use client"

import { useEffect, useState } from "react"
import { cva } from "class-variance-authority"
import { HTMLMotionProps, motion } from "motion/react"
import { cn } from "@/lib/utils"

const morphingSquareVariants = cva(
  "flex gap-2 items-center justify-center",
  {
    variants: {
      messagePlacement: {
        bottom: "flex-col",
        top: "flex-col-reverse",
        right: "flex-row",
        left: "flex-row-reverse",
      },
    },
    defaultVariants: {
      messagePlacement: "bottom",
    },
  }
)

const messages = [
  "Chargement des données...",
  "Le chargement prend plus de temps que prévu…",
  "Toujours en cours de chargement…",
  "Le chargement a pris trop de temps vérifier votre connexion",
  "ça doit être un problème technique revenez plus tard"
]

export interface MorphingSquareProps {
  messagePlacement?: "top" | "bottom" | "left" | "right"
}

export function MorphingSquare({
  className,
  messagePlacement = "right",
  ...props
}: HTMLMotionProps<"div"> & MorphingSquareProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setMessageIndex(1), 5000),
      setTimeout(() => setMessageIndex(2), 10000),
      setTimeout(() => setMessageIndex(3), 15000),
      setTimeout(() => setMessageIndex(4), 20000),
      setTimeout(() => setMessageIndex(5), 25000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className={cn(morphingSquareVariants({ messagePlacement }))}>
      <motion.div
        className={cn("w-10 h-10 bg-[#1e3fae]", className)}
        animate={{
          borderRadius: ["6%", "50%", "6%"],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        {...props}
      />

      <div className="text-base font-semibold  text-[#8e0b10] ">
        {messages[messageIndex]}
      </div>
    </div>
  )
}
