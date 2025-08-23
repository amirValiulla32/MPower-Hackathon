"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Search, Download, Filter, MapPin, Target } from "lucide-react"
import { mockVoterCandidates, successMetrics } from "@/lib/mock-data"

interface ProximityAnalysisPanelProps {
  selectedZipCode?: string | null
}

export default function ProximityAnalysisPanel({ selectedZipCode }: ProximityAnalysisPanelProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [distanceFilter, setDistanceFilter] = useState<string>("all")
  const [improvementFilter, setImprovementFilter] = useState<string>("all")
  const [bucketFilter, setBucketFilter] = useState<string>("all")

  // Filter candidates based on selected zip code and filters
  const filteredCandidates = mockVoterCandidates.filter((candidate) => {
    const matchesZip = !selectedZipCode || candidate.zipCode === selectedZipCode
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || candidate.zipCode.includes(searchTerm)
    const matchesDistance =
      distanceFilter === "all" ||
      (distanceFilter === "near" && candidate.distanceToCenter <= 1.5) ||
      (distanceFilter === "medium" && candidate.distanceToCenter > 1.5 && candidate.distanceToCenter <= 3) ||
      (distanceFilter === "far" && candidate.distanceToCenter > 3)
    const matchesImprovement =
      improvementFilter === "all" ||
      (improvementFilter === "high" && candidate.scoreImprovement >= 2) ||
      (improvementFilter === "medium" && candidate.scoreImprovement >= 1 && candidate.scoreImprovement < 2) ||
      (improvementFilter === "low" && candidate.scoreImprovement < 1)
    const matchesBucket = bucketFilter === "all" || candidate.bucketZone === bucketFilter

    return matchesZip && matchesSearch && matchesDistance && matchesImprovement && matchesBucket
  })

  const exportData = () => {
    const csvContent = [
      "voter_id,name,zip_code,original_score,distance_to_center,proximity_boost,enhanced_score,bucket_zone,score_improvement",
      ...filteredCandidates.map(
        (c) =>
          `${c.id},${c.name},${c.zipCode},${c.originalScore},${c.distanceToCenter},${c.proximityBoost},${c.enhancedScore},${c.bucketZone},${c.scoreImprovement}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "proximity_analysis_results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getBucketColor = (zone: string) => {
    switch (zone) {
      case "high":
        return "bg-green-500/20 text-green-700 border-green-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
      case "low":
        return "bg-red-500/20 text-red-700 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Success Metrics Header */}
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-sans">
            <Target className="h-5 w-5 text-accent" />
            Proximity Analysis Results
          </CardTitle>
          <CardDescription>Geographic proximity impact on voter engagement prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{successMetrics.totalEnhanced}</div>
              <div className="text-sm text-muted-foreground">Enhanced Profiles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{successMetrics.movedToHighEngagement}</div>
              <div className="text-sm text-muted-foreground">Moved to High Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">+{successMetrics.averageImprovement}</div>
              <div className="text-sm text-muted-foreground">Avg Score Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">+{successMetrics.mostImpactfulBoost}</div>
              <div className="text-sm text-muted-foreground">Best Area ({successMetrics.mostImpactfulZip})</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between font-sans">
            <span className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Enhanced Candidate Analysis
            </span>
            <Button onClick={exportData} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or zip..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={distanceFilter} onValueChange={setDistanceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Distance Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distances</SelectItem>
                <SelectItem value="near">Near (&lt;=1.5 mi)</SelectItem>
                <SelectItem value="medium">Medium (1.5-3 mi)</SelectItem>
                <SelectItem value="far">Far (&gt;3 mi)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={improvementFilter} onValueChange={setImprovementFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Score Improvement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Improvements</SelectItem>
                <SelectItem value="high">High (+2.0+)</SelectItem>
                <SelectItem value="medium">Medium (+1.0-2.0)</SelectItem>
                <SelectItem value="low">Low (&lt;1.0)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={bucketFilter} onValueChange={setBucketFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Proximity Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="high">High Boost Zone</SelectItem>
                <SelectItem value="medium">Medium Boost Zone</SelectItem>
                <SelectItem value="low">Low Boost Zone</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              {filteredCandidates.length} candidates
            </div>
          </div>

          {/* Bucket Zone Legend */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getBucketColor("high")}>High Boost Zone (0-1.5 mi)</Badge>
            <Badge className={getBucketColor("medium")}>Medium Boost Zone (1.5-3 mi)</Badge>
            <Badge className={getBucketColor("low")}>Low Boost Zone (3+ mi)</Badge>
          </div>

          {/* Candidates List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:bg-accent/5 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold text-primary">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {candidate.zipCode} • {candidate.distanceToCenter} mi from center
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getBucketColor(candidate.bucketZone)}>{candidate.bucketZone} boost</Badge>
                      <Badge variant={candidate.engagementLevel === "High" ? "default" : "secondary"}>
                        {candidate.engagementLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Original Score</div>
                      <div className="font-semibold">{candidate.originalScore}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Enhanced Score</div>
                      <div className="font-semibold text-accent">{candidate.enhancedScore}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Improvement</div>
                      <div className="font-semibold text-green-600">+{candidate.scoreImprovement}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Nearby Institutions</div>
                      <div className="font-semibold">{candidate.nearbyInstitutions}</div>
                    </div>
                  </div>

                  {/* Score Improvement Visualization */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Score Progress</span>
                      <span>{candidate.enhancedScore}/10</span>
                    </div>
                    <Progress value={candidate.enhancedScore * 10} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
