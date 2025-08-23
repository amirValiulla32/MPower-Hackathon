"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Layers, ZoomIn, ZoomOut } from "lucide-react"
import { mockZipCodeData } from "@/lib/mock-data"

interface InteractiveMapProps {
  selectedZipCode: string | null
  onZipCodeSelect: (zipCode: string) => void
}

export default function InteractiveMap({ selectedZipCode, onZipCodeSelect }: InteractiveMapProps) {
  const [showHeatMap, setShowHeatMap] = useState(true)
  const [showInstitutions, setShowInstitutions] = useState(true)
  const [hoveredZip, setHoveredZip] = useState<string | null>(null)

  // Calculate color intensity based on engagement score
  const getEngagementColor = (score: number) => {
    if (score >= 8.5) return "bg-accent/90 border-accent"
    if (score >= 7.5) return "bg-accent/70 border-accent/80"
    if (score >= 6.5) return "bg-accent/50 border-accent/60"
    return "bg-accent/30 border-accent/40"
  }

  const getEngagementIntensity = (score: number) => {
    return Math.min(Math.max((score - 5) / 5, 0.2), 1)
  }

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={showHeatMap ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHeatMap(!showHeatMap)}
            className={showHeatMap ? "bg-accent text-accent-foreground" : ""}
          >
            <Layers className="h-4 w-4 mr-2" />
            Heat Map
          </Button>
          <Button
            variant={showInstitutions ? "default" : "outline"}
            size="sm"
            onClick={() => setShowInstitutions(!showInstitutions)}
            className={showInstitutions ? "bg-accent text-accent-foreground" : ""}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Institutions
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-96 bg-muted rounded-lg overflow-hidden border">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Zip Code Regions */}
        <div className="absolute inset-0 p-4">
          <div className="grid grid-cols-3 gap-2 h-full">
            {mockZipCodeData.map((zipData, index) => {
              const isSelected = selectedZipCode === zipData.zipCode
              const isHovered = hoveredZip === zipData.zipCode
              const intensity = getEngagementIntensity(zipData.communityEngagementScore)

              return (
                <div
                  key={zipData.zipCode}
                  className={`
                    relative cursor-pointer transition-all duration-200 rounded-lg border-2 p-3
                    ${showHeatMap ? getEngagementColor(zipData.communityEngagementScore) : "bg-card border-border"}
                    ${isSelected ? "ring-2 ring-accent ring-offset-2 scale-105" : ""}
                    ${isHovered ? "scale-102 shadow-lg" : ""}
                    hover:shadow-md
                  `}
                  style={{
                    backgroundColor: showHeatMap ? `hsl(var(--accent) / ${intensity})` : undefined,
                  }}
                  onClick={() => onZipCodeSelect(zipData.zipCode)}
                  onMouseEnter={() => setHoveredZip(zipData.zipCode)}
                  onMouseLeave={() => setHoveredZip(null)}
                >
                  {/* Zip Code Label */}
                  <div className="text-xs font-semibold text-foreground mb-1">{zipData.zipCode}</div>

                  {/* Engagement Score */}
                  <Badge variant="secondary" className="text-xs mb-2 bg-background/80 text-foreground">
                    {zipData.communityEngagementScore.toFixed(1)}
                  </Badge>

                  {/* Institution Markers */}
                  {showInstitutions && (
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: Math.min(zipData.communityCenters, 3) }).map((_, i) => (
                        <div key={`cc-${i}`} className="w-2 h-2 bg-chart-2 rounded-full" title="Community Center" />
                      ))}
                      {Array.from({ length: Math.min(zipData.religiousInstitutions, 3) }).map((_, i) => (
                        <div
                          key={`ri-${i}`}
                          className="w-2 h-2 bg-chart-3 rounded-full"
                          title="Religious Institution"
                        />
                      ))}
                    </div>
                  )}

                  {/* Hover Tooltip */}
                  {isHovered && (
                    <div className="absolute top-full left-0 mt-2 z-10 bg-popover border rounded-lg p-2 shadow-lg min-w-48">
                      <div className="text-sm font-semibold text-popover-foreground">Zip Code {zipData.zipCode}</div>
                      <div className="text-xs text-muted-foreground space-y-1 mt-1">
                        <div>Engagement Score: {zipData.communityEngagementScore.toFixed(1)}</div>
                        <div>Engaged Voters: {zipData.highlyEngagedVoters}</div>
                        <div>Community Centers: {zipData.communityCenters}</div>
                        <div>Religious Institutions: {zipData.religiousInstitutions}</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border rounded-lg p-3">
          <div className="text-xs font-semibold mb-2">Community Engagement Score</div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-accent/30 rounded"></div>
              <span>6.0-7.0</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-accent/50 rounded"></div>
              <span>7.0-8.0</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-accent/70 rounded"></div>
              <span>8.0-8.5</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-accent/90 rounded"></div>
              <span>8.5+</span>
            </div>
          </div>
          {showInstitutions && (
            <div className="mt-2 pt-2 border-t">
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                  <span>Community Centers</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                  <span>Religious Institutions</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Title */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border rounded-lg px-3 py-2">
          <div className="text-sm font-semibold">Orange County, CA</div>
          <div className="text-xs text-muted-foreground">Voter Engagement Analysis</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-accent">
              {mockZipCodeData.reduce((sum, zip) => sum + zip.highlyEngagedVoters, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Total Engaged Voters</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-primary">
              {mockZipCodeData.reduce((sum, zip) => sum + zip.communityCenters, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Community Centers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-primary">
              {mockZipCodeData.reduce((sum, zip) => sum + zip.religiousInstitutions, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Religious Institutions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold text-accent">
              {(
                mockZipCodeData.reduce((sum, zip) => sum + zip.communityEngagementScore, 0) / mockZipCodeData.length
              ).toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Avg Engagement</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
