"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function PostSheet({ isOpen, onClose }: Props) {
  const [body, setBody] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSend = async () => {
    if (!body.trim()) {
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/confess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      })

      const data = await response.json()

      if (response.ok && data.ok) {
        toast({
          title: "Sent for review",
        })
        setBody("")
        onClose()
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to send confession",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send confession",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setBody("")
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <SheetContent side="bottom" className="p-0">
        <SheetHeader>
          <div className="flex items-center justify-between w-full">
            <button
              onClick={handleCancel}
              className="text-[#DC2626] font-medium text-base hover:opacity-80 transition-opacity"
            >
              Cancel
            </button>
            <SheetTitle>New Confession</SheetTitle>
            <button
              onClick={handleSend}
              disabled={!body.trim() || isSubmitting}
              className="text-[#DC2626] font-medium text-base hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </SheetHeader>
        <div className="flex flex-col flex-grow p-6 overflow-y-auto">
          <label className="flex flex-col flex-grow">
            <textarea
              className="flex w-full flex-grow resize-none rounded-lg border border-[#FFD700] bg-transparent p-4 text-white placeholder:text-gray-500 focus:border-[#FFD700] focus:outline-0 focus:ring-0 focus:ring-offset-0 text-base leading-relaxed font-mono"
              placeholder="Write anything..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ fontFamily: "Fira Code, monospace" }}
            />
          </label>
        </div>
        <SheetFooter>
          <p className="text-[#FFD700] text-xs font-normal">You will remain anonymous.</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

