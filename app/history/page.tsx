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
import { DashboardHeader } from "@/components/dashboard-header"
import { useRouter } from "next/navigation"

interface WateringRecord {
  id: string
  plantName: string
  plantImage: string
  date: string
  time: string
  amount: string
  type: "watering"
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
    type: "watering",
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
    type: "watering",
  },
]

const typeLabels = {
  watering: "Arrosage",
}

const typeIcons = {
  watering: Droplets,
}

export default function HistoryPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPeriod, setFilterPeriod] = useState<string>("all")

  const filteredHistory = mockHistory.filter((record) => {
    const matchesSearch = record.plantName.toLowerCase().includes(searchTerm.toLowerCase())

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

    return matchesSearch && matchesPeriod
  })

  const stats = {
    totalActions: mockHistory.length,
    thisWeek: mockHistory.filter((r) => {
      const recordDate = new Date(r.date)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7
    }).length,
    totalWater: mockHistory.reduce((sum, r) => sum + Number.parseInt(r.amount), 0),
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Historique" 
        subtitle="Actions effectuées"
        showBackButton={true}
        onBackClick={() => router.push("/dashboard")}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">

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
      </main>
    </div>
  )
}
