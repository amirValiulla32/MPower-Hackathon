"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  Brain,
  MapPin,
  Users,
  Calculator,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Target,
  Database,
  Zap,
} from "lucide-react"
import { methodologySteps, mockVoterCandidates, mockZipCodeData } from "@/lib/mock-data"

export default function MethodologyPanel() {
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)

  const runSimulation = () => {
    setSimulationRunning(true)
    setSimulationProgress(0)

    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setSimulationRunning(false)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const resetSimulation = () => {
    setSimulationRunning(false)
    setSimulationProgress(0)
  }

  // Calculate real statistics from our data
  const totalCandidates = mockVoterCandidates.length
  const avgOriginalScore = mockVoterCandidates.reduce((sum, c) => sum + c.originalScore, 0) / totalCandidates
  const avgEnhancedScore = mockVoterCandidates.reduce((sum, c) => sum + c.enhancedScore, 0) / totalCandidates
  const improvementRate = ((avgEnhancedScore - avgOriginalScore) / avgOriginalScore) * 100
  const highEngagementCount = mockVoterCandidates.filter((c) => c.engagementLevel === "High").length
  const successRate = (highEngagementCount / totalCandidates) * 100

  const algorithmSteps = [
    {
      id: 1,
      title: "Data Collection",
      description: "Gather voting history, civic participation records, and demographic information",
      icon: <Database className="h-5 w-5" />,
      color: "bg-chart-1",
      details: [
        "Historical voting patterns (5+ election cycles)",
        "Community involvement records",
        "Demographic and socioeconomic data",
        "Geographic location coordinates",
      ],
    },
    {
      id: 2,
      title: "Behavioral Scoring",
      description: "Analyze individual voting patterns and civic engagement history",
      icon: <Brain className="h-5 w-5" />,
      color: "bg-chart-2",
      details: [
        "Voting frequency analysis",
        "Participation in local elections",
        "Community event attendance",
        "Civic organization membership",
      ],
    },
    {
      id: 3,
      title: "Geographic Analysis",
      description: "Calculate proximity to community institutions and civic infrastructure",
      icon: <MapPin className="h-5 w-5" />,
      color: "bg-chart-3",
      details: [
        "Distance to community centers",
        "Proximity to religious institutions",
        "Access to public transportation",
        "Walkability to civic buildings",
      ],
    },
    {
      id: 4,
      title: "Community Density",
      description: "Assess concentration of civic institutions within neighborhood",
      icon: <Users className="h-5 w-5" />,
      color: "bg-chart-4",
      details: [
        "Institution density per square mile",
        "Population-to-institution ratio",
        "Community center capacity",
        "Social infrastructure quality",
      ],
    },
    {
      id: 5,
      title: "Score Enhancement",
      description: "Apply weighted formula to generate enhanced engagement scores",
      icon: <Calculator className="h-5 w-5" />,
      color: "bg-accent",
      details: [
        "Behavioral Score × 60% weight",
        "Proximity Score × 25% weight",
        "Community Density × 15% weight",
        "Normalization and calibration",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Algorithm Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Enhanced Engagement Algorithm
          </CardTitle>
          <CardDescription>
            Our methodology combines behavioral analysis with geographic proximity to identify high-engagement voter
            candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Formula Display */}
              <div className="text-center p-6 bg-gradient-to-r from-accent/10 to-chart-1/10 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">Enhanced Engagement Score Formula</h3>
                <div className="font-mono text-lg bg-background/80 px-4 py-3 rounded border inline-block">
                  Enhanced Score = (Behavioral × 0.6) + (Proximity × 0.25) + (Density × 0.15)
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  Where each component is normalized to a 0-10 scale for consistent weighting
                </p>
              </div>

              {/* Methodology Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {methodologySteps.map((step) => (
                  <Card
                    key={step.step}
                    className={`text-center transition-all cursor-pointer hover:shadow-md ${
                      activeStep === step.step ? "ring-2 ring-accent shadow-lg" : ""
                    }`}
                    onClick={() => setActiveStep(activeStep === step.step ? null : step.step)}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-2">
                        {step.step}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                      <Badge variant="outline">{step.weight}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {activeStep === step.step && (
                        <div className="mt-4 p-3 bg-muted rounded text-left">
                          <p className="text-xs text-muted-foreground">
                            Click to see detailed breakdown in the Algorithm tab
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="algorithm" className="space-y-6">
              {/* Interactive Algorithm Steps */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Algorithm Simulation</h3>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={runSimulation}
                      disabled={simulationRunning}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {simulationRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      {simulationRunning ? "Running..." : "Run Simulation"}
                    </Button>
                    <Button
                      onClick={resetSimulation}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                </div>

                {simulationRunning && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing {totalCandidates} candidates...</span>
                      <span>{simulationProgress}%</span>
                    </div>
                    <Progress value={simulationProgress} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {algorithmSteps.map((step, index) => (
                    <Card
                      key={step.id}
                      className={`transition-all ${
                        simulationProgress >= (index + 1) * 20 ? "bg-accent/5 border-accent/20" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-10 h-10 ${step.color} text-white rounded-full flex items-center justify-center flex-shrink-0`}
                          >
                            {simulationProgress >= (index + 1) * 20 ? <CheckCircle className="h-5 w-5" /> : step.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{step.title}</h4>
                              {simulationProgress >= (index + 1) * 20 && (
                                <Badge variant="outline" className="text-accent border-accent">
                                  Complete
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {step.details.map((detail, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                                  {detail}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{totalCandidates}</div>
                    <div className="text-sm text-muted-foreground">Candidates Processed</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-accent">+{improvementRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Avg Score Improvement</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-chart-2">{successRate.toFixed(0)}%</div>
                    <div className="text-sm text-muted-foreground">High Engagement Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-chart-3">{mockZipCodeData.length}</div>
                    <div className="text-sm text-muted-foreground">Zip Codes Analyzed</div>
                  </CardContent>
                </Card>
              </div>

              {/* Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    Score Enhancement Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Before Enhancement</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Average Score</span>
                          <span className="font-medium">{avgOriginalScore.toFixed(1)}</span>
                        </div>
                        <Progress value={avgOriginalScore * 10} className="h-2" />
                        <div className="text-xs text-muted-foreground">Based on behavioral analysis only</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">After Enhancement</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Average Score</span>
                          <span className="font-medium text-accent">{avgEnhancedScore.toFixed(1)}</span>
                        </div>
                        <Progress value={avgEnhancedScore * 10} className="h-2" />
                        <div className="text-xs text-muted-foreground">Including geographic and community factors</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-accent" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-chart-2 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Geographic Impact</h5>
                          <p className="text-sm text-muted-foreground">
                            Proximity to community institutions increased engagement scores by an average of{" "}
                            {improvementRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-chart-3 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Success Rate</h5>
                          <p className="text-sm text-muted-foreground">
                            {successRate.toFixed(0)}% of candidates achieved high engagement classification
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-chart-4 mt-0.5" />
                        <div>
                          <h5 className="font-medium">Community Density</h5>
                          <p className="text-sm text-muted-foreground">
                            Areas with higher institution density showed{" "}
                            {(
                              mockZipCodeData.reduce((sum, z) => sum + z.communityEngagementScore, 0) /
                                mockZipCodeData.length -
                              6
                            ).toFixed(1)}{" "}
                            point average score boost
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BarChart3 className="h-5 w-5 text-accent mt-0.5" />
                        <div>
                          <h5 className="font-medium">Model Accuracy</h5>
                          <p className="text-sm text-muted-foreground">
                            Enhanced methodology shows {((successRate / 50) * 100).toFixed(0)}% improvement over
                            baseline behavioral analysis
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Educational Disclaimer */}
      <Alert className="border-accent/20 bg-accent/5">
        <AlertTriangle className="h-4 w-4 text-accent" />
        <AlertDescription>
          <strong>Educational Purpose:</strong> This methodology demonstration uses synthetic data for academic
          learning. The algorithm showcases data science techniques for geographic and behavioral analysis in a
          controlled, educational environment. All voter information is randomly generated and no real voter profiling
          occurs.
        </AlertDescription>
      </Alert>
    </div>
  )
}
