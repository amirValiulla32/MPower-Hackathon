"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Users,
  Building2,
  Church,
  BookOpen,
  GraduationCap,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { type ZipCodeData, mockVoterCandidates } from "@/lib/mock-data"

interface ZipCodeAnalysisPanelProps {
  zipData: ZipCodeData
}

export default function ZipCodeAnalysisPanel({ zipData }: ZipCodeAnalysisPanelProps) {
  // Calculate additional metrics for this zip code
  const candidatesInZip = mockVoterCandidates.filter((c) => c.zipCode === zipData.zipCode)
  const highEngagementInZip = candidatesInZip.filter((c) => c.engagementLevel === "High").length
  const mediumEngagementInZip = candidatesInZip.filter((c) => c.engagementLevel === "Medium").length
  const lowEngagementInZip = candidatesInZip.filter((c) => c.engagementLevel === "Low").length

  const totalInstitutions = zipData.communityCenters + zipData.religiousInstitutions
  const institutionDensity = totalInstitutions / 10 // Normalized per 10k residents

  // Calculate engagement distribution percentages
  const totalCandidates = candidatesInZip.length
  const highPercentage = totalCandidates > 0 ? (highEngagementInZip / totalCandidates) * 100 : 0
  const mediumPercentage = totalCandidates > 0 ? (mediumEngagementInZip / totalCandidates) * 100 : 0
  const lowPercentage = totalCandidates > 0 ? (lowEngagementInZip / totalCandidates) * 100 : 0

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case "Community Center":
        return <Building2 className="h-4 w-4" />
      case "Religious Institution":
        return <Church className="h-4 w-4" />
      case "Library":
        return <BookOpen className="h-4 w-4" />
      case "School":
        return <GraduationCap className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-accent"
      case "Medium":
        return "text-chart-3"
      case "Low":
        return "text-muted-foreground"
      default:
        return "text-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Key Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-sans">Zip Code {zipData.zipCode}</CardTitle>
              <CardDescription>Comprehensive community engagement analysis</CardDescription>
            </div>
            <Badge
              variant={zipData.communityEngagementScore >= 8 ? "default" : "secondary"}
              className={`text-lg px-3 py-1 ${zipData.communityEngagementScore >= 8 ? "bg-accent text-accent-foreground" : ""}`}
            >
              {zipData.communityEngagementScore.toFixed(1)} Score
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-primary">{zipData.highlyEngagedVoters}</div>
              <div className="text-sm text-muted-foreground">Engaged Voters</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="h-6 w-6 text-chart-2" />
              </div>
              <div className="text-2xl font-bold text-primary">{zipData.communityCenters}</div>
              <div className="text-sm text-muted-foreground">Community Centers</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto">
                <Church className="h-6 w-6 text-chart-3" />
              </div>
              <div className="text-2xl font-bold text-primary">{zipData.religiousInstitutions}</div>
              <div className="text-sm text-muted-foreground">Religious Institutions</div>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto">
                <Activity className="h-6 w-6 text-chart-1" />
              </div>
              <div className="text-2xl font-bold text-primary">{zipData.avgCivicEngagement.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Civic Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-accent" />
              Engagement Distribution
            </CardTitle>
            <CardDescription>Breakdown of voter engagement levels in this zip code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-sm font-medium">High Engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{highEngagementInZip} voters</span>
                  <Badge variant="outline">{highPercentage.toFixed(0)}%</Badge>
                </div>
              </div>
              <Progress value={highPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-chart-3 rounded-full"></div>
                  <span className="text-sm font-medium">Medium Engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{mediumEngagementInZip} voters</span>
                  <Badge variant="outline">{mediumPercentage.toFixed(0)}%</Badge>
                </div>
              </div>
              <Progress value={mediumPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                  <span className="text-sm font-medium">Low Engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{lowEngagementInZip} voters</span>
                  <Badge variant="outline">{lowPercentage.toFixed(0)}%</Badge>
                </div>
              </div>
              <Progress value={lowPercentage} className="h-2" />
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Total Candidates</span>
                <span className="text-muted-foreground">{totalCandidates} voters</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Infrastructure Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Infrastructure Analysis
            </CardTitle>
            <CardDescription>Community infrastructure impact on engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Institution Density</span>
                <Badge variant="outline">{institutionDensity.toFixed(1)}/10k</Badge>
              </div>
              <Progress value={Math.min(institutionDensity * 10, 100)} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Community Engagement</span>
                <Badge variant="outline">{zipData.communityEngagementScore.toFixed(1)}/10</Badge>
              </div>
              <Progress value={zipData.communityEngagementScore * 10} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Civic Participation</span>
                <Badge variant="outline">{zipData.avgCivicEngagement.toFixed(1)}/10</Badge>
              </div>
              <Progress value={zipData.avgCivicEngagement * 10} className="h-2" />
            </div>

            <div className="pt-2 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{totalInstitutions}</div>
                <div className="text-sm text-muted-foreground">Total Institutions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Institution List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-accent" />
            Community Institutions
          </CardTitle>
          <CardDescription>
            Nearby institutions within 3-mile radius contributing to community engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zipData.institutions.map((institution, index) => (
              <Card key={index} className="hover:bg-accent/5 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      {getInstitutionIcon(institution.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-primary truncate">{institution.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{institution.address}</div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {institution.type}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Candidates in This Zip Code */}
      {candidatesInZip.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Identified Candidates
            </CardTitle>
            <CardDescription>High-engagement voter candidates found in zip code {zipData.zipCode}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {candidatesInZip.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-primary">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground">{candidate.address}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-sm font-medium">{candidate.originalScore.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Original</div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div className="text-center">
                      <div className="text-sm font-medium text-accent">{candidate.enhancedScore.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Enhanced</div>
                    </div>
                    <Badge
                      variant={candidate.engagementLevel === "High" ? "default" : "secondary"}
                      className={candidate.engagementLevel === "High" ? "bg-accent text-accent-foreground" : ""}
                    >
                      {candidate.engagementLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
