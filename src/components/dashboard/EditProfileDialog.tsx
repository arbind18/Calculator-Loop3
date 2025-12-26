"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

interface UserProfile {
  name?: string
  occupation?: string
  purpose?: string
}

const PROFESSION_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "student", label: "Student" },
  { value: "businessman", label: "Businessman" },
  { value: "engineer", label: "Engineer" },
  { value: "software_developer", label: "Software Developer" },
  { value: "doctor", label: "Doctor" },
  { value: "teacher", label: "Teacher" },
  { value: "accountant", label: "Accountant" },
  { value: "lawyer", label: "Lawyer" },
  { value: "freelancer", label: "Freelancer" },
  { value: "government_employee", label: "Government Employee" },
  { value: "private_employee", label: "Private Employee" },
  { value: "homemaker", label: "Homemaker" },
  { value: "retired", label: "Retired" },
  { value: "other", label: "Other" },
]

type EditProfileDialogProps = {
  // Intentionally empty: keep component self-contained.
}

export function EditProfileDialog(_: EditProfileDialogProps) {
  const { data: session, update } = useSession()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    occupation: "",
    purpose: "",
  })

  const [professionPreset, setProfessionPreset] = useState<string>("")
  const [professionOther, setProfessionOther] = useState<string>("")

  useEffect(() => {
    if (open) {
      loadProfile()
    }
  }, [open])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()

        const occupationValue: string = data.user.occupation || ""
        const isPreset = PROFESSION_OPTIONS.some((o) => o.value === occupationValue)
        setProfessionPreset(isPreset ? occupationValue : occupationValue ? "other" : "")
        setProfessionOther(isPreset ? "" : occupationValue)

        setProfile({
          name: data.user.name || "",
          occupation: occupationValue,
          purpose: data.user.purpose || "",
        })
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const occupationToSave =
        professionPreset === "other"
          ? (professionOther || "").trim() || "other"
          : professionPreset

      const payload: UserProfile = {
        name: profile.name?.trim() || "",
        occupation: occupationToSave,
        purpose: profile.purpose || "",
      }

      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Failed to update profile')

      const data = await res.json()
      
      // Update session if name changed
      if (profile.name && profile.name !== session?.user?.name) {
        try {
          // Best-effort; UI will still update via onProfileUpdated.
          await update({ name: profile.name })
        } catch {
          // ignore
        }
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("profile-updated", {
            detail: {
              name: data.user?.name,
              occupation: data.user?.occupation,
              purpose: data.user?.purpose,
            },
          })
        )
      }

      toast.success("Profile updated successfully!")
      setOpen(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10" aria-label="Edit profile">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your basic details. Only name and profession are needed. You can add an optional note if you want.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Enter your name"
            />
          </div>

          {/* Profession */}
          <div className="space-y-2">
            <Label htmlFor="occupation">Profession</Label>
            <select
              id="occupation"
              value={professionPreset}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const next = e.target.value
                setProfessionPreset(next)
                if (next !== "other") {
                  setProfessionOther("")
                }
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="" disabled>
                Select your profession
              </option>
              {PROFESSION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {professionPreset === "other" && (
            <div className="space-y-2">
              <Label htmlFor="professionOther">Profession (Other)</Label>
              <Input
                id="professionOther"
                value={professionOther}
                onChange={(e) => setProfessionOther(e.target.value)}
                placeholder="e.g., Designer, Shop Owner, Driver"
              />
            </div>
          )}

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Other Information (Optional)</Label>
            <textarea
              id="purpose"
              value={profile.purpose}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setProfile({ ...profile, purpose: e.target.value })
              }
              placeholder="Anything you want to add (optional)"
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
