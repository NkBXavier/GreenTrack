"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, Droplets, Calendar, Bell } from "lucide-react"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulation d'authentification
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Section gauche - Présentation */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-balance">GreenTrack</h1>
            </div>
            <p className="text-xl text-muted-foreground text-pretty">
              Prenez soin de vos plantes d'intérieur avec intelligence
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Droplets className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Rappels d'arrosage</h3>
                <p className="text-sm text-muted-foreground">Ne manquez plus jamais l'arrosage de vos plantes</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Suivi personnalisé</h3>
                <p className="text-sm text-muted-foreground">Historique détaillé pour chaque plante</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <Bell className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <h3 className="font-semibold">Notifications intelligentes</h3>
                <p className="text-sm text-muted-foreground">
                  Alertes automatiques basées sur les besoins de vos plantes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Authentification */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl">Bienvenue</CardTitle>
              <CardDescription>Connectez-vous ou créez votre compte pour commencer</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Connexion</TabsTrigger>
                  <TabsTrigger value="register">Inscription</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="votre@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input id="password" type="password" placeholder="••••••••" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Connexion..." : "Se connecter"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" type="text" placeholder="Votre nom" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-register">Email</Label>
                      <Input id="email-register" type="email" placeholder="votre@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-register">Mot de passe</Label>
                      <Input id="password-register" type="password" placeholder="••••••••" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-confirm">Confirmer le mot de passe</Label>
                      <Input id="password-confirm" type="password" placeholder="••••••••" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Création..." : "Créer un compte"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
