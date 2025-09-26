"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useToast } from "@/hooks/use-toast"
import {
  Leaf,
  Plus,
  Edit,
  Trash2,
  Droplets,
  Search,
  Filter,
  Bell,
  Calendar,
  LogOut,
  TrendingUp,
  AlertTriangle,
  Eye,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Types pour les plantes
interface Plant {
  id: number
  name: string
  species: string
  image?: string
  purchaseDate: string
  waterAmount: number
  waterFrequency: number
  lastWatered?: string
  needsWater: boolean
}

// Données simulées
const initialPlants: Plant[] = [
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

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [plants, setPlants] = useState<Plant[]>(initialPlants)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterNeedsWater, setFilterNeedsWater] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    purchaseDate: "",
    waterAmount: 250,
    waterFrequency: 7,
    image: "",
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const filteredPlants = plants.filter((plant) => {
    const matchesSearch =
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.species.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterNeedsWater || plant.needsWater
    return matchesSearch && matchesFilter
  })

  const mockStats = {
    totalPlants: plants.length,
    plantsNeedingWater: plants.filter((p) => p.needsWater).length,
    plantsWateredToday: plants.filter((p) => p.lastWatered === new Date().toISOString().split("T")[0]).length,
  }

  // handleLogout moved to DashboardHeader component

  const resetForm = () => {
    setFormData({
      name: "",
      species: "",
      purchaseDate: "",
      waterAmount: 250,
      waterFrequency: 7,
      image: "",
    })
  }

  const handleAddPlant = () => {
    const newPlant: Plant = {
      id: Math.max(...plants.map((p) => p.id)) + 1,
      name: formData.name,
      species: formData.species,
      image: formData.image || undefined,
      purchaseDate: formData.purchaseDate,
      waterAmount: formData.waterAmount,
      waterFrequency: formData.waterFrequency,
      needsWater: false,
    }

    setPlants([newPlant, ...plants])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditPlant = (plant: Plant) => {
    setEditingPlant(plant)
    setFormData({
      name: plant.name,
      species: plant.species,
      purchaseDate: plant.purchaseDate,
      waterAmount: plant.waterAmount,
      waterFrequency: plant.waterFrequency,
      image: plant.image || "",
    })
  }

  const handleUpdatePlant = () => {
    if (!editingPlant) return

    const updatedPlants = plants.map((plant) =>
      plant.id === editingPlant.id
        ? {
            ...plant,
            name: formData.name,
            species: formData.species,
            purchaseDate: formData.purchaseDate,
            waterAmount: formData.waterAmount,
            waterFrequency: formData.waterFrequency,
            image: formData.image || undefined,
          }
        : plant,
    )

    setPlants(updatedPlants)
    setEditingPlant(null)
    resetForm()
  }

  const handleDeletePlant = (plantId: number) => {
    setPlants(plants.filter((plant) => plant.id !== plantId))
  }

  const handleWaterPlant = (plantId: number) => {
    const plant = plants.find((p) => p.id === plantId)
    if (!plant) return

    const updatedPlants = plants.map((p) =>
      p.id === plantId
        ? {
            ...p,
            lastWatered: new Date().toISOString().split("T")[0],
            needsWater: false,
          }
        : p,
    )
    setPlants(updatedPlants)

    // Show success toast
    toast({
      variant: "success",
      title: "Plante arrosée !",
      description: `${plant.name} a été arrosée avec ${plant.waterAmount}ml d'eau.`,
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a server or cloud storage
      // For now, we'll create a local URL
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, image: imageUrl }))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }))
  }

  const handleSpeciesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, species: e.target.value }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))
  }

  const handleWaterAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, waterAmount: Number.parseInt(e.target.value) }))
  }

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, waterFrequency: Number.parseInt(e.target.value) || 7 }))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Statistiques */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des plantes</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalPlants}</div>
              <p className="text-xs text-muted-foreground">Dans votre collection</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Besoin d'eau</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{mockStats.plantsNeedingWater}</div>
              <p className="text-xs text-muted-foreground">Plantes à arroser</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Arrosées aujourd'hui</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{mockStats.plantsWateredToday}</div>
              <p className="text-xs text-muted-foreground">Plantes arrosées</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions et filtres */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une plante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={filterNeedsWater ? "default" : "outline"}
              onClick={() => setFilterNeedsWater(!filterNeedsWater)}
              className="shrink-0"
            >
              <Filter className="h-4 w-4 mr-2" />
              Besoin d'eau
            </Button>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une plante
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle plante</DialogTitle>
                <DialogDescription>
                  Remplissez les informations de votre nouvelle plante pour commencer le suivi.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la plante *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder="ex: Mon Monstera"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="species">Espèce *</Label>
                    <Input
                      id="species"
                      value={formData.species}
                      onChange={handleSpeciesChange}
                      placeholder="ex: Monstera deliciosa"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Date d'achat *</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={handleDateChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="waterAmount">Quantité d'eau (ml) *</Label>
                    <Input
                      id="waterAmount"
                      type="number"
                      min="50"
                      max="2000"
                      step="50"
                      value={formData.waterAmount}
                      onChange={handleWaterAmountChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="water_frequency">Fréquence d'arrosage (jours) *</Label>
                    <Input
                      id="water_frequency"
                      type="number"
                      min="1"
                      value={formData.waterFrequency}
                      onChange={handleFrequencyChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image de la plante *</Label>
                  <div className="flex gap-2">
                    <Input
                      ref={fileInputRef}
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choisir un fichier
                    </Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <img
                        src={formData.image || "/placeholder.svg"}
                        alt="Aperçu"
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleAddPlant}
                  disabled={
                    !formData.name || !formData.species || !formData.purchaseDate || !formData.image
                  }
                >
                  Ajouter la plante
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des plantes avec cartes détaillées */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Mes plantes ({filteredPlants.length})</h2>

          {filteredPlants.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Leaf className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Aucune plante trouvée</p>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm || filterNeedsWater
                    ? "Essayez de modifier vos critères de recherche"
                    : "Commencez par ajouter votre première plante"}
                </p>
                {!searchTerm && !filterNeedsWater && (
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une plante
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPlants.map((plant) => (
                <Card key={plant.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={plant.image || "/placeholder.svg"} alt={plant.name} />
                          <AvatarFallback>
                            <Leaf className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{plant.name}</CardTitle>
                          <CardDescription className="text-sm">{plant.species}</CardDescription>
                          {plant.needsWater && (
                            <Badge variant="destructive" className="mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Besoin d'eau
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Informations de base */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date d'achat</p>
                        <p className="font-medium">{formatDate(plant.purchaseDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dernier arrosage</p>
                        <p className="font-medium">{plant.lastWatered ? formatDate(plant.lastWatered) : "Jamais"}</p>
                      </div>
                    </div>

                    {/* Informations d'arrosage */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantité</p>
                        <p className="font-medium">{plant.waterAmount}ml</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fréquence</p>
                        <p className="font-medium">
                          Tous les {plant.waterFrequency} jour{plant.waterFrequency > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {/* notes removed */}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        variant={plant.needsWater ? "default" : "outline"}
                        onClick={() => handleWaterPlant(plant.id)}
                      >
                        <Droplets className="h-4 w-4 mr-2" />
                        Arroser
                      </Button>

                      <Link href={`/plant-details/${plant.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Dialog
                        open={editingPlant?.id === plant.id}
                        onOpenChange={(open) => !open && setEditingPlant(null)}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => handleEditPlant(plant)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Modifier {plant.name}</DialogTitle>
                            <DialogDescription>Modifiez les informations de votre plante.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Nom de la plante *</Label>
                                <Input
                                  id="edit-name"
                                  value={formData.name}
                                  onChange={handleNameChange}
                                  placeholder="ex: Mon Monstera"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-species">Espèce *</Label>
                                <Input
                                  id="edit-species"
                                  value={formData.species}
                                  onChange={handleSpeciesChange}
                                  placeholder="ex: Monstera deliciosa"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-purchaseDate">Date d'achat *</Label>
                              <Input
                                id="edit-purchaseDate"
                                type="date"
                                value={formData.purchaseDate}
                                onChange={handleDateChange}
                                required
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-waterAmount">Quantité d'eau (ml) *</Label>
                                <Input
                                  id="edit-waterAmount"
                                  type="number"
                                  min="50"
                                  max="2000"
                                  step="50"
                                  value={formData.waterAmount}
                                  onChange={handleWaterAmountChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-water_frequency">Fréquence d'arrosage (jours) *</Label>
                                <Input
                                  id="edit-water_frequency"
                                  type="number"
                                  min="1"
                                  value={formData.waterFrequency}
                                  onChange={handleFrequencyChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="edit-image">Image de la plante *</Label>
                              <div className="flex gap-2">
                                <Input
                                  ref={fileInputRef}
                                  id="edit-image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  required
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex-1 justify-start"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  Choisir un fichier
                                </Button>
                                <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </div>
                              {formData.image && (
                                <div className="mt-2">
                                  <img
                                    src={formData.image || "/placeholder.svg"}
                                    alt="Aperçu"
                                    className="h-20 w-20 object-cover rounded-md border"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingPlant(null)}>
                              Annuler
                            </Button>
                            <Button
                              onClick={handleUpdatePlant}
                              disabled={
                                !formData.name ||
                                !formData.species ||
                                !formData.purchaseDate ||
                                !formData.image
                              }
                            >
                              Sauvegarder
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer {plant.name}</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette plante ? Cette action est irréversible et
                              supprimera également tout l'historique d'arrosage.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePlant(plant.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
