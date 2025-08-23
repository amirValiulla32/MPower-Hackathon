"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Download,
  SortAsc,
  SortDesc,
  Users,
  TrendingUp,
  MapPin,
  Star,
  BarChart3,
  Eye,
  EyeOff,
} from "lucide-react"
import { mockVoterCandidates, mockZipCodeData, type VoterCandidate } from "@/lib/mock-data"

interface CandidatesListProps {
  selectedZipCode?: string | null
}

type SortField = "name" | "originalScore" | "enhancedScore" | "zipCode" | "engagementLevel"
type SortDirection = "asc" | "desc"
type ViewMode = "list" | "grid" | "detailed"

export default function CandidatesList({ selectedZipCode }: CandidatesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [engagementFilter, setEngagementFilter] = useState<string>("all")
  const [zipCodeFilter, setZipCodeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("enhancedScore")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [showScoreDetails, setShowScoreDetails] = useState(false)

  // Filter and sort candidates
  const filteredAndSortedCandidates = useMemo(() => {
    const filtered = mockVoterCandidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.zipCode.includes(searchTerm) ||
        candidate.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEngagement = engagementFilter === "all" || candidate.engagementLevel === engagementFilter

      const matchesZipCode =
        zipCodeFilter === "all" || candidate.zipCode === zipCodeFilter || candidate.zipCode === selectedZipCode

      return matchesSearch && matchesEngagement && matchesZipCode
    })

    // Sort candidates
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === "engagementLevel") {
        const levelOrder = { High: 3, Medium: 2, Low: 1 }
        aValue = levelOrder[a.engagementLevel as keyof typeof levelOrder]
        bValue = levelOrder[b.engagementLevel as keyof typeof levelOrder]
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [searchTerm, engagementFilter, zipCodeFilter, sortField, sortDirection, selectedZipCode])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredAndSortedCandidates.length
    const high = filteredAndSortedCandidates.filter((c) => c.engagementLevel === "High").length
    const medium = filteredAndSortedCandidates.filter((c) => c.engagementLevel === "Medium").length
    const low = filteredAndSortedCandidates.filter((c) => c.engagementLevel === "Low").length
    const avgOriginal = total > 0 ? filteredAndSortedCandidates.reduce((sum, c) => sum + c.originalScore, 0) / total : 0
    const avgEnhanced = total > 0 ? filteredAndSortedCandidates.reduce((sum, c) => sum + c.enhancedScore, 0) / total : 0

    return { total, high, medium, low, avgOriginal, avgEnhanced }
  }, [filteredAndSortedCandidates])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-accent text-accent-foreground"
      case "Medium":
        return "bg-chart-3 text-white"
      case "Low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getScoreImprovement = (candidate: VoterCandidate) => {
    const improvement = candidate.enhancedScore - candidate.originalScore
    const percentage = (improvement / candidate.originalScore) * 100
    return { improvement, percentage }
  }

  const exportCandidates = () => {
    const csvContent = [
      ["Name", "Zip Code", "Address", "Original Score", "Enhanced Score", "Engagement Level", "Improvement"],
      ...filteredAndSortedCandidates.map((candidate) => {
        const { improvement } = getScoreImprovement(candidate)
        return [
          candidate.name,
          candidate.zipCode,
          candidate.address,
          candidate.originalScore.toFixed(1),
          candidate.enhancedScore.toFixed(1),
          candidate.engagementLevel,
          `+${improvement.toFixed(1)}`,
        ]
      }),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "voter-candidates.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Candidates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{stats.high}</div>
            <div className="text-sm text-muted-foreground">High Engagement</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.avgOriginal.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avg Original Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{stats.avgEnhanced.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avg Enhanced Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            Engagement Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="text-sm font-medium">High ({stats.high})</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.total > 0 ? ((stats.high / stats.total) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <Progress value={stats.total > 0 ? (stats.high / stats.total) * 100 : 0} className="h-2" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                <span className="text-sm font-medium">Medium ({stats.medium})</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.total > 0 ? ((stats.medium / stats.total) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <Progress value={stats.total > 0 ? (stats.medium / stats.total) * 100 : 0} className="h-2" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                <span className="text-sm font-medium">Low ({stats.low})</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.total > 0 ? ((stats.low / stats.total) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <Progress value={stats.total > 0 ? (stats.low / stats.total) * 100 : 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Candidate Analysis
              </CardTitle>
              <CardDescription>
                {selectedZipCode
                  ? `Showing candidates in zip code ${selectedZipCode}`
                  : "Comprehensive list of identified voter candidates"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowScoreDetails(!showScoreDetails)}
                className="flex items-center gap-2"
              >
                {showScoreDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showScoreDetails ? "Hide" : "Show"} Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportCandidates}
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, zip code, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={engagementFilter} onValueChange={setEngagementFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by engagement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={zipCodeFilter} onValueChange={setZipCodeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by zip code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zip Codes</SelectItem>
                {mockZipCodeData.map((zip) => (
                  <SelectItem key={zip.zipCode} value={zip.zipCode}>
                    {zip.zipCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
            {[
              { field: "enhancedScore" as SortField, label: "Enhanced Score" },
              { field: "originalScore" as SortField, label: "Original Score" },
              { field: "name" as SortField, label: "Name" },
              { field: "zipCode" as SortField, label: "Zip Code" },
              { field: "engagementLevel" as SortField, label: "Engagement" },
            ].map(({ field, label }) => (
              <Button
                key={field}
                variant={sortField === field ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort(field)}
                className={`flex items-center gap-1 ${sortField === field ? "bg-accent text-accent-foreground" : ""}`}
              >
                {label}
                {sortField === field &&
                  (sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />)}
              </Button>
            ))}
          </div>

          {/* Candidates List */}
          <div className="space-y-3">
            {filteredAndSortedCandidates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No candidates found matching your criteria.</p>
                <p className="text-sm">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredAndSortedCandidates.map((candidate) => {
                const { improvement, percentage } = getScoreImprovement(candidate)
                const zipData = mockZipCodeData.find((z) => z.zipCode === candidate.zipCode)

                return (
                  <Card key={candidate.id} className="hover:bg-accent/5 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1">
                              <div className="font-semibold text-primary text-lg">{candidate.name}</div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {candidate.address}
                              </div>
                            </div>
                          </div>

                          {showScoreDetails && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <div className="font-medium text-muted-foreground">Community Context</div>
                                  <div className="mt-1">
                                    <div>Engagement Score: {zipData?.communityEngagementScore.toFixed(1)}</div>
                                    <div>
                                      Institutions:{" "}
                                      {(zipData?.communityCenters || 0) + (zipData?.religiousInstitutions || 0)}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-muted-foreground">Score Breakdown</div>
                                  <div className="mt-1">
                                    <div>Behavioral: {(candidate.originalScore * 0.6).toFixed(1)}</div>
                                    <div>Geographic: {(improvement * 0.4).toFixed(1)}</div>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-medium text-muted-foreground">Improvement</div>
                                  <div className="mt-1">
                                    <div className="text-accent font-medium">+{improvement.toFixed(1)} points</div>
                                    <div className="text-xs">({percentage.toFixed(0)}% increase)</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 ml-4">
                          <div className="text-center">
                            <div className="text-sm font-medium">{candidate.originalScore.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">Original</div>
                          </div>
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <div className="text-center">
                            <div className="text-sm font-medium text-accent">{candidate.enhancedScore.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">Enhanced</div>
                          </div>
                          <Badge className={getEngagementColor(candidate.engagementLevel)}>
                            {candidate.engagementLevel}
                          </Badge>
                          {candidate.engagementLevel === "High" && <Star className="h-4 w-4 text-accent" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          {filteredAndSortedCandidates.length > 0 && (
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Showing {filteredAndSortedCandidates.length} of {mockVoterCandidates.length} total candidates
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
