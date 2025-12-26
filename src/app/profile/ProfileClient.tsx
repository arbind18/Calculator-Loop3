"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardOverview } from "@/components/dashboard/DashboardOverview"
import { CalculationHistory } from "@/components/dashboard/CalculationHistory"
import { FavoritesManager } from "@/components/dashboard/FavoritesManager"
import { SavedCalculations } from "@/components/dashboard/SavedCalculations"
import { EditProfileDialog } from "@/components/dashboard/EditProfileDialog"
import { ProfileSettings } from "@/components/dashboard/ProfileSettings"
import { User, History, Star, Bookmark, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"

export default function ProfileClient() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [profileUser, setProfileUser] = useState<{
    name?: string | null
    createdAt?: string | Date
    occupation?: string | null
    purpose?: string | null
  } | null>(null)
  const [counts, setCounts] = useState({
    history: 0,
    favorites: 0,
    saved: 0
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session) return
      try {
        const res = await fetch('/api/user/profile')
        if (!res.ok) return
        const data = await res.json()
        setProfileUser(data.user)
      } catch (e) {
        console.error('Failed to fetch profile', e)
      }
    }

    fetchProfile()
  }, [session])

  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<{ name?: string; occupation?: string; purpose?: string }>
      const detail = custom.detail

      if (!detail) return

      setProfileUser((prev) => ({
        ...(prev || {}),
        name: detail.name ?? prev?.name ?? null,
        occupation: detail.occupation ?? prev?.occupation ?? null,
        purpose: detail.purpose ?? prev?.purpose ?? null,
      }))
    }

    window.addEventListener('profile-updated', handler)
    return () => window.removeEventListener('profile-updated', handler)
  }, [])

  useEffect(() => {
    const fetchCounts = async () => {
      if (!session) return

      try {
        const res = await fetch('/api/user/history?limit=1')
        const data = await res.json()
        if (data.total !== undefined) {
          setCounts(prev => ({ ...prev, history: data.total }))
        }
      } catch (e) {
        console.error("Failed to fetch history count", e)
      }

      try {
        const res = await fetch('/api/user/saved')
        const data = await res.json()
        if (data.savedResults) {
          setCounts(prev => ({ ...prev, saved: data.savedResults.length }))
        }
      } catch (e) {
        console.error("Failed to fetch saved count", e)
      }

      try {
        const res = await fetch('/api/user/favorites')
        const data = await res.json()
        if (data.favorites) {
          setCounts(prev => ({ ...prev, favorites: data.favorites.length }))
        }
      } catch (e) {
        console.error("Failed to fetch favorites count", e)
      }
    }

    fetchCounts()
  }, [session])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && ['overview', 'history', 'favorites', 'saved', 'settings'].includes(hash)) {
      setActiveTab(hash)
    }
  }, [])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
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
    other: "Other",
  }

  const displayName = profileUser?.name || session.user?.name
  const occupationDisplay = profileUser?.occupation
    ? occupationLabels[profileUser.occupation] || profileUser.occupation
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-10 px-4">
        <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-purple-200 dark:border-purple-800">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                  {displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
                <p className="text-muted-foreground">{session.user?.email}</p>
                {occupationDisplay && (
                  <p className="text-sm text-muted-foreground mt-1">{occupationDisplay}</p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Member since {new Date(profileUser?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div>
                <EditProfileDialog />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <Tooltip content="View your account summary">
              <TabsTrigger value="overview" className="flex items-center gap-2 w-full">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
            </Tooltip>

            <Tooltip content="View your past calculations">
              <TabsTrigger value="history" className="flex items-center gap-2 relative w-full">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
                {counts.history > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                    {counts.history > 99 ? '99+' : counts.history}
                  </Badge>
                )}
              </TabsTrigger>
            </Tooltip>

            <Tooltip content="Quick access to your favorite tools">
              <TabsTrigger value="favorites" className="flex items-center gap-2 w-full">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Favorites</span>
                {counts.favorites > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                    {counts.favorites}
                  </Badge>
                )}
              </TabsTrigger>
            </Tooltip>

            <Tooltip content="View your saved financial plans">
              <TabsTrigger value="saved" className="flex items-center gap-2 w-full">
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">Saved</span>
                {counts.saved > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                    {counts.saved}
                  </Badge>
                )}
              </TabsTrigger>
            </Tooltip>

            <Tooltip content="Manage your account settings">
              <TabsTrigger value="settings" className="flex items-center gap-2 w-full">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </Tooltip>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <CalculationHistory />
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <FavoritesManager />
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <SavedCalculations />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
