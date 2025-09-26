"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Droplets, Leaf, ArrowLeft, Clock, CheckCircle, AlertTriangle, Calendar, Bell, Settings } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

// Types pour les rappels d'arrosage
interface WateringReminder {
  id: number
  plantId: number
  plantName: string
  plantSpecies: string
  plantImage?: string
  waterAmount: number
  dueDate: string
  priority: "urgent" | "today" | "soon" | "upcoming"
  lastWatered?: string
  isCompleted: boolean
}

// Données simulées pour les rappels
const initialReminders: WateringReminder[] = [
  {
    id: 1,
    plantId: 2,
    plantName: "Ficus Lyrata",
    plantSpecies: "Ficus lyrata",
    plantImage: "/fiddle-leaf-fig.png",
    waterAmount: 400,
    dueDate: "2024-01-17",
    priority: "urgent",
    lastWatered: "2024-01-12",
    isCompleted: false,
  },
  {
    id: 2,
    plantId: 1,
    plantName: "Monstera Deliciosa",
    plantSpecies: "Monstera deliciosa",
    plantImage: "/monstera-plant.png",
    waterAmount: 300,
    dueDate: "2024-01-18",
    priority: "today",
    lastWatered: "2024-01-15",
    isCompleted: false,
  },
  {
    id: 3,
    plantId: 3,
    plantName: "Pothos Doré",
    plantSpecies: "Epipremnum aureum",
    plantImage: "/golden-pothos.png",
    waterAmount: 200,
    dueDate: "2024-01-19",
    priority: "soon",
    lastWatered: "2024-01-14",
    isCompleted: false,
  },
  {
    id: 4,
    plantId: 4,
    plantName: "Sansevieria",
    plantSpecies: "Sansevieria trifasciata",
    plantImage: "/snake-plant-sansevieria.png",
    waterAmount: 150,
    dueDate: "2024-01-24",
    priority: "upcoming",
    lastWatered: "2024-01-10",
    isCompleted: false,
  },
]

export default function WateringPage() {
  const [reminders, setReminders] = useState<WateringReminder[]>(initialReminders)
  const [completedToday, setCompletedToday] = useState<WateringReminder[]>([])

  // Calculer les statistiques
  const urgentCount = reminders.filter((r) => r.priority === "urgent" && !r.isCompleted).length
  const todayCount = reminders.filter((r) => r.priority === "today" && !r.isCompleted).length
  const totalPending = reminders.filter((r) => !r.isCompleted).length
  const completionRate = reminders.length > 0 ? Math.round((completedToday.length / reminders.length) * 100) : 0

  const handleWaterPlant = (reminderId: number) => {
    const reminder = reminders.find((r) => r.id === reminderId)
    if (!reminder) return

    // Marquer comme arrosé
    const updatedReminders = reminders.map((r) =>
      r.id === reminderId ? { ...r, isCompleted: true, lastWatered: new Date().toISOString().split("T")[0] } : r,
    )

    setReminders(updatedReminders)
    setCompletedToday([...completedToday, { ...reminder, isCompleted: true }])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Demain"
    if (diffDays === -1) return "Hier"
    if (diffDays < 0) return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? "s" : ""}`
    return `Dans ${diffDays} jour${diffDays > 1 ? "s" : ""}`
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-destructive"
      case "today":
        return "text-orange-600"
      case "soon":
        return "text-yellow-600"
      case "upcoming":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return { variant: "destructive" as const, label: "Urgent" }
      case "today":
        return { variant: "default" as const, label: "Aujourd'hui" }
      case "soon":
        return { variant: "secondary" as const, label: "Bientôt" }
      case "upcoming":
        return { variant: "outline" as const, label: "À venir" }
      default:
        return { variant: "outline" as const, label: "À venir" }
    }
  }

  // Grouper les rappels par priorité
  const groupedReminders = {
    urgent: reminders.filter((r) => r.priority === "urgent" && !r.isCompleted),
    today: reminders.filter((r) => r.priority === "today" && !r.isCompleted),
    soon: reminders.filter((r) => r.priority === "soon" && !r.isCompleted),
    upcoming: reminders.filter((r) => r.priority === "upcoming" && !r.isCompleted),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Droplets className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Rappels d'arrosage</h1>
                  <p className="text-sm text-muted-foreground">
                    {totalPending} plante{totalPending > 1 ? "s" : ""} à arroser
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/plants">
                <Button variant="outline" size="sm">
                  <Leaf className="h-4 w-4 mr-2" />
                  Plantes
                </Button>
              </Link>
              <Link href="/notifications">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Historique
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Statistiques */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{urgentCount}</div>
              <p className="text-xs text-muted-foreground">Arrosage en retard</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{todayCount}</div>
              <p className="text-xs text-muted-foreground">À arroser aujourd'hui</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total en attente</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPending}</div>
              <p className="text-xs text-muted-foreground">Plantes à arroser</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progression</CardTitle>
              <CheckCircle className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Plantes arrosées aujourd'hui */}
        {completedToday.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Arrosées aujourd'hui ({completedToday.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {completedToday.map((plant) => (
                  <div key={plant.id} className="flex items-center gap-2 bg-primary/10 rounded-lg px-3 py-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={plant.plantImage || "/placeholder.svg"} alt={plant.plantName} />
                      <AvatarFallback>
                        <Leaf className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{plant.plantName}</span>
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rappels par priorité */}
        <div className="space-y-6">
          {/* Urgent */}
          {groupedReminders.urgent.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h2 className="text-xl font-bold text-destructive">Urgent ({groupedReminders.urgent.length})</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedReminders.urgent.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onWater={handleWaterPlant}
                    formatDate={formatDate}
                    getPriorityBadge={getPriorityBadge}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Aujourd'hui */}
          {groupedReminders.today.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <h2 className="text-xl font-bold">Aujourd'hui ({groupedReminders.today.length})</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedReminders.today.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onWater={handleWaterPlant}
                    formatDate={formatDate}
                    getPriorityBadge={getPriorityBadge}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bientôt */}
          {groupedReminders.soon.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-600" />
                <h2 className="text-xl font-bold">Bientôt ({groupedReminders.soon.length})</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedReminders.soon.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onWater={handleWaterPlant}
                    formatDate={formatDate}
                    getPriorityBadge={getPriorityBadge}
                  />
                ))}
              </div>
            </div>
          )}

          {/* À venir */}
          {groupedReminders.upcoming.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-bold">À venir ({groupedReminders.upcoming.length})</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedReminders.upcoming.map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    reminder={reminder}
                    onWater={handleWaterPlant}
                    formatDate={formatDate}
                    getPriorityBadge={getPriorityBadge}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message si aucun rappel */}
        {totalPending === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <p className="text-lg font-medium">Toutes vos plantes sont arrosées !</p>
              <p className="text-muted-foreground text-center">Excellent travail ! Vos plantes vous remercient.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

// Composant pour les cartes de rappel
interface ReminderCardProps {
  reminder: WateringReminder
  onWater: (id: number) => void
  formatDate: (date: string) => string
  getPriorityBadge: (priority: string) => { variant: any; label: string }
}

function ReminderCard({ reminder, onWater, formatDate, getPriorityBadge }: ReminderCardProps) {
  const badge = getPriorityBadge(reminder.priority)

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow",
        reminder.priority === "urgent" && "border-destructive/50 bg-destructive/5",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={reminder.plantImage || "/placeholder.svg"} alt={reminder.plantName} />
              <AvatarFallback>
                <Leaf className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{reminder.plantName}</CardTitle>
              <CardDescription className="text-sm">{reminder.plantSpecies}</CardDescription>
            </div>
          </div>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Quantité</p>
            <p className="font-medium">{reminder.waterAmount}ml</p>
          </div>
          <div>
            <p className="text-muted-foreground">Échéance</p>
            <p className="font-medium">{formatDate(reminder.dueDate)}</p>
          </div>
        </div>

        {reminder.lastWatered && (
          <div className="text-sm">
            <p className="text-muted-foreground">Dernier arrosage</p>
            <p className="font-medium">{formatDate(reminder.lastWatered)}</p>
          </div>
        )}

        <Button
          onClick={() => onWater(reminder.id)}
          className="w-full"
          variant={reminder.priority === "urgent" ? "default" : "outline"}
        >
          <Droplets className="h-4 w-4 mr-2" />
          Arroser maintenant
        </Button>
      </CardContent>
    </Card>
  )
}
