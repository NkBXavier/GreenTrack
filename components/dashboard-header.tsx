"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Leaf, Bell, Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  onBackClick?: () => void
}

export function DashboardHeader({ 
  title = "GreenTrack", 
  subtitle = "Tableau de bord",
  showBackButton = false,
  onBackClick
}: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    // Simulation de déconnexion - redirection vers la page d'accueil
    router.push("/")
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button variant="ghost" size="sm" onClick={onBackClick}>
                <LogOut className="h-4 w-4 mr-2 rotate-180" />
                Retour
              </Button>
            )}
            <div className="p-2 bg-primary/10 rounded-lg">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/notifications">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
              </Button>
            </Link>
            <Link href="/history">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
