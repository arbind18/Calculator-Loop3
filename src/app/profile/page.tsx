"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={session.user?.image || ""} />
              <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{session.user?.name}</h3>
              <p className="text-sm text-muted-foreground">{session.user?.email}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <div className="p-2 border rounded-md bg-muted/50">
                {session.user?.name}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <div className="p-2 border rounded-md bg-muted/50">
                {session.user?.email}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>User ID</Label>
              <div className="p-2 border rounded-md bg-muted/50 font-mono text-xs">
                {session.user?.id}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
