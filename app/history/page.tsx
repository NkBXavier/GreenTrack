"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Droplets,
  Leaf,
  Search,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowLeft,
  Bell,
  Settings,
} from "lucide-react"
import Link from "next/link"

interface WateringRecord {
  id: string
  plantName: string
  plantImage: string
  date: string
  time: string
  amount: string
  type: "watering" | "fertilizing" | "repotting" | "pruning"
}

const mockHistory: WateringRecord[] = [
  {
    id: "1",
    plantName: "Monstera Deliciosa",
    plantImage: "/monstera-plant.png",
    date: "2024-01-15",
    time: "09:30",
    amount: "250ml",
    type: "watering",
  },
  {
    id: "2",
    plantName: "Ficus Lyrata",
    plantImage: "/fiddle-leaf-fig.png",
    date: "2024-01-15",
    time: "10:15",
    amount: "300ml",
    type: "watering",
  },
  {
    id: "3",
    plantName: "Pothos Doré",
    plantImage: "/golden-pothos.png",
    date: "2024-01-14",
    time: "18:45",
    amount: "150ml",
    type: "fertilizing",
  },
  {
    id: "4",
    plantName: "Sansevieria",
    plantImage: "/snake-plant-sansevieria.png",
    date: "2024-01-13",
    time: "16:20",
    amount: "100ml",
    type: "watering",
  },
  {
    id: "5",
    plantName: "Monstera Deliciosa",
    plantImage: "/monstera-plant.png",
    date: "2024-01-12",
    time: "11:00",
    amount: "200ml",
    notes: "Rempotage dans un pot plus grand",
    type: "repotting",
  },
]

const typeLabels = {
  watering: "Arrosage",
  fertilizing: "Fertilisation",
  repotting: "Rempotage",
  pruning: "Taille",
}

const typeIcons = {
  watering: Droplets,
  fertilizing: Leaf,
  repotting: TrendingUp,
  pruning: CheckCircle,
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPeriod, setFilterPeriod] = useState<string>("all")

  const filteredHistory = mockHistory.filter((record) => {
    const matchesSearch = record.plantName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || record.type === filterType

    let matchesPeriod = true
    if (filterPeriod !== "all") {
      const recordDate = new Date(record.date)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (filterPeriod) {
        case "today":
          matchesPeriod = daysDiff === 0
          break
        case "week":
          matchesPeriod = daysDiff <= 7
          break
        case "month":
          matchesPeriod = daysDiff <= 30
          break
      }
    }

    return matchesSearch && matchesType && matchesPeriod
  })

  const stats = {
    totalActions: mockHistory.length,
    thisWeek: mockHistory.filter((r) => {
      const recordDate = new Date(r.date)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7
    }).length,
    totalWater: mockHistory.filter((r) => r.type === "watering").reduce((sum, r) => sum + Number.parseInt(r.amount), 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="border-b bg-card/50 backdrop-blur-sm rounded-lg p-4 mb-6">
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
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Historique des soins</h1>
                  <p className="text-sm text-muted-foreground">Suivez toutes les actions effectuées sur vos plantes</p>
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
              <Link href="/watering">
                <Button variant="outline" size="sm">
                  <Droplets className="h-4 w-4 mr-2" />
                  Rappels
                </Button>
              </Link>
              <Link href="/notifications">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div></div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Exporter
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actions totales</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalActions}</div>
              <p className="text-xs text-muted-foreground">Toutes les actions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">Actions récentes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eau utilisée</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWater}ml</div>
              <p className="text-xs text-muted-foreground">Volume total</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher une plante..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Type d'action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  <SelectItem value="watering">Arrosage</SelectItem>
                  <SelectItem value="fertilizing">Fertilisation</SelectItem>
                  <SelectItem value="repotting">Rempotage</SelectItem>
                  <SelectItem value="pruning">Taille</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toute la période</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste de l'historique */}
        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun historique trouvé</h3>
                <p className="text-muted-foreground text-center">
                  Aucune action ne correspond à vos critères de recherche.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredHistory.map((record) => {
              const IconComponent = typeIcons[record.type]
              return (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={record.plantImage || "/placeholder.svg"} alt={record.plantName} />
                        <AvatarFallback>
                          <Leaf className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{record.plantName}</h3>
                          <Badge variant="secondary" className="gap-1">
                            <IconComponent className="h-3 w-3" />
                            {typeLabels[record.type]}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(record.date).toLocaleDateString("fr-FR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {record.time}
                          </span>
                          {record.type === "watering" && (
                            <span className="flex items-center gap-1">
                              <Droplets className="h-3 w-3" />
                              {record.amount}
                            </span>
                          )}
                        </div>

                        {/* notes removed */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
