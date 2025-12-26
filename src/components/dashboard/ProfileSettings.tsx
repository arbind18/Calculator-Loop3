"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Briefcase, Target } from "lucide-react"
import { useEffect, useState } from "react"

interface UserProfile {
  name?: string
  email?: string
  occupation?: string
  purpose?: string
  createdAt?: string
  totalCalculations?: number
}

export function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data.user)
      }
    } catch (error) {
      console.error("Failed to load profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
      </div>
    )
  }

  const occupationLabels: Record<string, string> = {
    student: "Student",
    businessman: "Businessman",
    engineer: "Engineer",
    doctor: "Doctor",
    teacher: "Teacher",
    software_developer: "Software Developer",
    accountant: "Accountant",
    lawyer: "Lawyer",
    freelancer: "Freelancer",
    government_employee: "Government Employee",
    private_employee: "Private Employee",
    homemaker: "Homemaker",
    retired: "Retired",
    other: "Other"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile?.name || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile?.email || "Not set"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Profession</p>
            <p className="font-medium">
              {profile?.occupation ? occupationLabels[profile.occupation] || profile.occupation : "Not set"}
            </p>
          </div>
          {profile?.purpose && (
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Target className="h-4 w-4" />
                Other Information
              </p>
              <p className="font-medium">{profile.purpose}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {!profile?.occupation && !profile?.purpose && (
        <Card className="border-dashed border-2">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              Add your profession to complete your profile
            </p>
            <p className="text-sm text-gray-500">
              Click "Edit Profile" above to add your details
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
