"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Settings, Upload, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface SettingsModalProps {
  user: {
    id: string
    full_name: string
    role: string
    gcash_qr_url?: string
    maya_qr_url?: string
  }
  onUpdate?: () => void
}

export function SettingsModal({ user, onUpdate }: SettingsModalProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [gcashFile, setGcashFile] = useState<File | null>(null)
  const [mayaFile, setMayaFile] = useState<File | null>(null)
  const [gcashPreview, setGcashPreview] = useState<string | null>(user.gcash_qr_url || null)
  const [mayaPreview, setMayaPreview] = useState<string | null>(user.maya_qr_url || null)

  const handleFileSelect = (file: File, type: "gcash" | "maya") => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === "gcash") {
          setGcashFile(file)
          setGcashPreview(result)
        } else {
          setMayaFile(file)
          setMayaPreview(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const supabase = createClient()
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage.from("qr-codes").upload(fileName, file)

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from("qr-codes").getPublicUrl(fileName)

    return publicUrl
  }

  const handleSave = async () => {
    setUploading(true)
    try {
      const supabase = createClient()
      const updates: any = {}

      // Upload new files if selected
      if (gcashFile) {
        updates.gcash_qr_url = await uploadFile(gcashFile)
      }
      if (mayaFile) {
        updates.maya_qr_url = await uploadFile(mayaFile)
      }

      // Update user profile if there are changes
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.from("users").update(updates).eq("id", user.id)

        if (error) throw error
      }

      toast({
        title: "Settings Updated",
        description: "Your payment QR codes have been updated successfully.",
      })

      setOpen(false)
      onUpdate?.()
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-sm text-muted-foreground">
            Upload your payment QR codes so others know where to send money.
          </div>

          {/* GCash QR Code */}
          <div className="space-y-2">
            <Label>GCash QR Code</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {gcashPreview ? (
                <div className="relative">
                  <img
                    src={gcashPreview || "/placeholder.svg"}
                    alt="GCash QR Code"
                    className="max-w-full h-32 mx-auto object-contain"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => {
                      setGcashPreview(null)
                      setGcashFile(null)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload GCash QR</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file, "gcash")
                }}
              />
            </div>
          </div>

          {/* Maya QR Code - Only show for brokers */}
          {user.role === "broker" && (
            <div className="space-y-2">
              <Label>Maya QR Code</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center relative">
                {mayaPreview ? (
                  <div className="relative">
                    <img
                      src={mayaPreview || "/placeholder.svg"}
                      alt="Maya QR Code"
                      className="max-w-full h-32 mx-auto object-contain"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => {
                        setMayaPreview(null)
                        setMayaFile(null)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Click to upload Maya QR</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileSelect(file, "maya")
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
