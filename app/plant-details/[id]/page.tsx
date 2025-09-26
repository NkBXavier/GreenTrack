"use client"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Leaf, ArrowLeft, Droplets, Calendar, AlertTriangle, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { DashboardHeader } from "@/components/dashboard-header"

// Types pour l'historique d'arrosage
interface WateringRecord {
  id: number
  date: string
  amount: number
}

// Données simulées pour l'historique d'arrosage
const mockWateringHistory: Record<number, WateringRecord[]> = {
  1: [
    { id: 1, date: "2024-01-15", amount: 300 },
    { id: 2, date: "2024-01-12", amount: 300 },
    { id: 3, date: "2024-01-09", amount: 250 },
    { id: 4, date: "2024-01-06", amount: 300 },
    { id: 5, date: "2024-01-03", amount: 300 },
  ],
  2: [
    { id: 1, date: "2024-01-12", amount: 400 },
    { id: 2, date: "2024-01-07", amount: 400 },
    { id: 3, date: "2024-01-02", amount: 350 },
  ],
  3: [
    { id: 1, date: "2024-01-14", amount: 200 },
    { id: 2, date: "2024-01-10", amount: 200 },
    { id: 3, date: "2024-01-06", amount: 200 },
    { id: 4, date: "2024-01-02", amount: 150 },
  ],
  4: [
    { id: 1, date: "2024-01-10", amount: 150 },
    { id: 2, date: "2023-12-27", amount: 150 },
    { id: 3, date: "2023-12-13", amount: 150 },
  ],
}

// Données simulées des plantes (même structure que dans le dashboard)
const plantsData = [
  {
    id: 1,
    name: "Monstera Deliciosa",
    species: "Monstera deliciosa",
    image: "/monstera-plant.png",
    purchaseDate: "2024-01-01",
    waterAmount: 300,
    waterFrequency: 3,
    lastWatered: "2024-01-15",
    needsWater: false,
  },
  {
    id: 2,
    name: "Ficus Lyrata",
    species: "Ficus lyrata",
    image: "/fiddle-leaf-fig.png",
    purchaseDate: "2023-12-15",
    waterAmount: 400,
    waterFrequency: 5,
    notes: "Sensible aux changements d'environnement",
    lastWatered: "2024-01-12",
    needsWater: true,
  },
  {
    id: 3,
    name: "Pothos Doré",
    species: "Epipremnum aureum",
    image: "/golden-pothos.png",
    purchaseDate: "2024-01-10",
    waterAmount: 200,
    waterFrequency: 4,
    lastWatered: "2024-01-14",
    needsWater: false,
  },
  {
    id: 4,
    name: "Sansevieria",
    species: "Sansevieria trifasciata",
    image: "/snake-plant-sansevieria.png",
    purchaseDate: "2023-11-20",
    waterAmount: 150,
    waterFrequency: 14,
    lastWatered: "2024-01-10",
    needsWater: false,
  },
]

export default function PlantDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const plantId = Number.parseInt(params.id as string)

  const plant = plantsData.find((p) => p.id === plantId)
  const wateringHistory = mockWateringHistory[plantId] || []

  if (!plant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Plante non trouvée</p>
            <Button onClick={() => router.push("/dashboard")} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const calculateNextWatering = () => {
    if (!plant.lastWatered) return "Non défini"

    const lastWatered = new Date(plant.lastWatered)
    const nextWatering = new Date(lastWatered)
    nextWatering.setDate(lastWatered.getDate() + plant.waterFrequency)

    const today = new Date()
    const diffTime = nextWatering.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `En retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? "s" : ""}`
    } else if (diffDays === 0) {
      return "Aujourd'hui"
    } else if (diffDays === 1) {
      return "Demain"
    } else {
      return `Dans ${diffDays} jours`
    }
  }

  const handleWaterPlant = () => {
    if (!plant) return

    // In a real app, this would update the database
    // For now, we'll just show a success notification
    toast({
      variant: "success",
      title: "Plante arrosée !",
      description: `${plant.name} a été arrosée avec ${plant.waterAmount}ml d'eau.`,
    })

    // Optionally redirect back to dashboard after a delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        showBackButton={true}
        onBackClick={() => router.push("/dashboard")}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Informations principales de la plante */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image et informations de base */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={plant.image || "/placeholder.svg"} alt={plant.name} />
                  <AvatarFallback>
                    <Leaf className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{plant.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Espèce</p>
                    <p className="font-medium">{plant.species}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date d'achat</p>
                  <p className="font-medium">{formatDate(plant.purchaseDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations d'arrosage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Arrosage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Quantité</p>
                  <p className="font-medium text-lg">{plant.waterAmount}ml</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fréquence</p>
                  <p className="font-medium text-lg">
                    Tous les {plant.waterFrequency} jour{plant.waterFrequency > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dernier arrosage</p>
                  <p className="font-medium">{plant.lastWatered ? formatDate(plant.lastWatered) : "Jamais"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prochain arrosage</p>
                  <p className="font-medium">{calculateNextWatering()}</p>
                </div>
              </div>

              {plant.needsWater && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <p className="text-sm font-medium text-destructive">Cette plante a besoin d'eau !</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Historique d'arrosage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique d'arrosage
            </CardTitle>
            <CardDescription>Derniers arrosages de {plant.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {wateringHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">Aucun historique d'arrosage</p>
                <p className="text-muted-foreground">Commencez par arroser votre plante pour voir l'historique ici.</p>
              </div>
            ) : (
              <div className="space-y-4">
              {wateringHistory.map((record, index) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Droplets className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{formatShortDate(record.date)}</p>
                        <p className="text-sm text-muted-foreground">{record.amount}ml</p>
                      </div>
                    </div>
                    {index === 0 && <Badge variant="secondary">Dernier arrosage</Badge>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
