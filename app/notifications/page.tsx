"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, Droplets, Leaf, AlertTriangle, CheckCircle, Settings, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  type: "watering" | "warning" | "success"
  title: string
  message: string
  plantName?: string
  plantImage?: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "watering",
    title: "Arrosage requis",
    message: "Il est temps d'arroser votre Monstera Deliciosa",
    plantName: "Monstera Deliciosa",
    plantImage: "/monstera-plant.png",
    timestamp: "2024-01-15T09:00:00Z",
    read: false,
    priority: "high",
  },
  {
    id: "2",
    type: "warning",
    title: "Attention - Arrosage en retard",
    message: "Votre Ficus Lyrata n'a pas été arrosé depuis 5 jours",
    plantName: "Ficus Lyrata",
    plantImage: "/fiddle-leaf-fig.png",
    timestamp: "2024-01-15T08:30:00Z",
    read: false,
    priority: "high",
  },
  {
    id: "3",
    type: "success",
    title: "Arrosage effectué",
    message: "Pothos Doré arrosé avec succès",
    plantName: "Pothos Doré",
    plantImage: "/golden-pothos.png",
    timestamp: "2024-01-14T18:45:00Z",
    read: true,
    priority: "low",
  },
  {
    id: "4",
    type: "watering",
    title: "Arrosage recommandé",
    message: "Il est temps d'arroser votre Sansevieria",
    plantName: "Sansevieria",
    plantImage: "/snake-plant-sansevieria.png",
    timestamp: "2024-01-14T10:00:00Z",
    read: true,
    priority: "medium",
  },
]

const notificationIcons = {
  watering: Droplets,
  warning: AlertTriangle,
  success: CheckCircle,
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-600 border-blue-200",
  medium: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  high: "bg-red-500/10 text-red-600 border-red-200",
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const highPriorityCount = notifications.filter((n) => !n.read && n.priority === "high").length

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "À l'instant"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    return date.toLocaleDateString("fr-FR")
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Notifications" 
        subtitle="Gérez vos alertes et rappels de soins"
        showBackButton={true}
        onBackClick={() => router.push("/dashboard")}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead} className="gap-2 bg-transparent">
                <CheckCircle className="h-4 w-4" />
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Non lues</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unreadCount}</div>
              <p className="text-xs text-muted-foreground">Notifications en attente</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Priorité haute</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highPriorityCount}</div>
              <p className="text-xs text-muted-foreground">Actions urgentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notifications.length}</div>
              <p className="text-xs text-muted-foreground">Toutes les notifications</p>
            </CardContent>
          </Card>
        </div>

        {/* Paramètres de notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramètres des notifications
            </CardTitle>
            <CardDescription>Configurez vos préférences de notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications-enabled">Notifications activées</Label>
                <p className="text-sm text-muted-foreground">Recevoir toutes les notifications de l'application</p>
              </div>
              <Switch
                id="notifications-enabled"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Notifications par email</Label>
                <p className="text-sm text-muted-foreground">Recevoir les rappels importants par email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                disabled={!notificationsEnabled}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Notifications push</Label>
                <p className="text-sm text-muted-foreground">Recevoir des notifications sur votre appareil</p>
              </div>
              <Switch
                id="push-notifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                disabled={!notificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Liste des notifications */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
                <p className="text-muted-foreground text-center">Vous êtes à jour ! Aucune notification en attente.</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => {
              const IconComponent = notificationIcons[notification.type]
              return (
                <Card
                  key={notification.id}
                  className={`hover:shadow-md transition-shadow ${
                    !notification.read ? "border-l-4 border-l-primary" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {notification.plantImage ? (
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={notification.plantImage || "/placeholder.svg"}
                            alt={notification.plantName}
                          />
                          <AvatarFallback>
                            <Leaf className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="p-3 bg-muted rounded-full">
                          <IconComponent className="h-6 w-6" />
                        </div>
                      )}

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                          >
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={priorityColors[notification.priority]}>
                              {notification.priority === "high"
                                ? "Urgent"
                                : notification.priority === "medium"
                                  ? "Moyen"
                                  : "Faible"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                        </div>

                        <p className={`text-sm ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                          {!notification.read && (
                            <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                              Marquer comme lu
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
