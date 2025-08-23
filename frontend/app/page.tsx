"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Users, TrendingUp } from "lucide-react"
import { mockZipCodeData, successMetrics } from "@/lib/mock-data"
import InteractiveMap from "@/components/interactive-map"
import ZipCodeAnalysisPanel from "@/components/zip-code-analysis-panel"
import CandidatesList from "@/components/candidates-list"
import MethodologyPanel from "@/components/methodology-panel"
import ProximityAnalysisPanel from "@/components/proximity-analysis-panel"

export default function VoterAnalysisDashboard() {
  const [selectedZipCode, setSelectedZipCode] = useState<string | null>(null)

  const selectedZipData = selectedZipCode ? mockZipCodeData.find((data) => data.zipCode === selectedZipCode) : null

  const totalCandidates = successMetrics.totalEnhanced
  const highEngagementCount = successMetrics.movedToHighEngagement
  const avgImprovement = successMetrics.averageImprovement

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-sans">Voter Analysis Dashboard</h1>
              <p className="text-muted-foreground font-serif mt-1">Geographic Proximity Analysis Platform</p>
            </div>
            <Badge variant="outline" className="text-accent border-accent">
              Hackathon Project
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="map">Interactive Map</TabsTrigger>
            <TabsTrigger value="proximity">Proximity Analysis</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="methodology">Methodology</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Enhanced Profiles</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{totalCandidates}</div>
                  <p className="text-xs text-muted-foreground">Proximity-enhanced voters</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Moved to High</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{highEngagementCount}</div>
                  <p className="text-xs text-muted-foreground">Engagement category upgrades</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">+{avgImprovement}</div>
                  <p className="text-xs text-muted-foreground">Score points gained</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Area</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{successMetrics.mostImpactfulZip}</div>
                  <p className="text-xs text-muted-foreground">+{successMetrics.mostImpactfulBoost} avg boost</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Zip Code Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Community Engagement by Zip Code</CardTitle>
                <CardDescription>Click on a zip code to view detailed analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockZipCodeData.map((zipData) => (
                    <Card
                      key={zipData.zipCode}
                      className={`cursor-pointer transition-colors hover:bg-accent/5 ${
                        selectedZipCode === zipData.zipCode ? "ring-2 ring-accent" : ""
                      }`}
                      onClick={() => setSelectedZipCode(zipData.zipCode)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-primary">{zipData.zipCode}</span>
                          <Badge
                            variant={zipData.communityEngagementScore >= 8 ? "default" : "secondary"}
                            className={zipData.communityEngagementScore >= 8 ? "bg-accent text-accent-foreground" : ""}
                          >
                            {zipData.communityEngagementScore.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>{zipData.highlyEngagedVoters} engaged voters</div>
                          <div>{zipData.communityCenters + zipData.religiousInstitutions} institutions</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedZipData && <ZipCodeAnalysisPanel zipData={selectedZipData} />}
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans">Interactive Map View</CardTitle>
                <CardDescription>Geographic visualization of community engagement scores</CardDescription>
              </CardHeader>
              <CardContent>
                <InteractiveMap selectedZipCode={selectedZipCode} onZipCodeSelect={setSelectedZipCode} />
              </CardContent>
            </Card>

            {selectedZipData && <ZipCodeAnalysisPanel zipData={selectedZipData} />}
          </TabsContent>

          <TabsContent value="proximity" className="space-y-6">
            <ProximityAnalysisPanel selectedZipCode={selectedZipCode} />
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <CandidatesList selectedZipCode={selectedZipCode} />
          </TabsContent>

          <TabsContent value="methodology" className="space-y-6">
            <MethodologyPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
