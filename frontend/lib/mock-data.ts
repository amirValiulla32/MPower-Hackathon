// Mock data for the voter analysis dashboard
export interface VoterCandidate {
  id: string
  name: string
  zipCode: string
  originalScore: number
  enhancedScore: number
  engagementLevel: "High" | "Medium" | "Low"
  address: string
}

export interface ZipCodeData {
  zipCode: string
  communityEngagementScore: number
  communityCenters: number
  religiousInstitutions: number
  highlyEngagedVoters: number
  avgCivicEngagement: number
  institutions: Array<{
    name: string
    type: "Community Center" | "Religious Institution" | "Library" | "School"
    address: string
  }>
  coordinates: [number, number] // [lat, lng]
}

export interface ProximityAnalysis {
  voterId: string
  distanceToCenter: number // miles
  proximityBoost: number // score boost from proximity
  bucketZone: "high" | "medium" | "low" // proximity bucket
  nearbyInstitutions: number
}

export interface EnhancedVoterCandidate extends VoterCandidate {
  distanceToCenter: number
  proximityBoost: number
  bucketZone: "high" | "medium" | "low"
  nearbyInstitutions: number
  scoreImprovement: number
}

export const mockZipCodeData: ZipCodeData[] = [
  {
    zipCode: "92602",
    communityEngagementScore: 8.7,
    communityCenters: 4,
    religiousInstitutions: 6,
    highlyEngagedVoters: 342,
    avgCivicEngagement: 7.8,
    coordinates: [33.6189, -117.9298],
    institutions: [
      { name: "Irvine Community Center", type: "Community Center", address: "1 Civic Center Plaza, Irvine, CA 92606" },
      {
        name: "St. Timothy Catholic Church",
        type: "Religious Institution",
        address: "10425 Mojeska Summit Rd, Trabuco Canyon, CA 92679",
      },
      { name: "Irvine Valley College", type: "School", address: "5500 Irvine Center Dr, Irvine, CA 92618" },
      { name: "Heritage Park Library", type: "Library", address: "14361 Yale Ave, Irvine, CA 92604" },
    ],
  },
  {
    zipCode: "92603",
    communityEngagementScore: 7.2,
    communityCenters: 3,
    religiousInstitutions: 4,
    highlyEngagedVoters: 278,
    avgCivicEngagement: 6.9,
    coordinates: [33.6405, -117.8443],
    institutions: [
      {
        name: "Woodbridge Community Center",
        type: "Community Center",
        address: "4752 Barranca Pkwy, Irvine, CA 92604",
      },
      {
        name: "Mariners Church Irvine",
        type: "Religious Institution",
        address: "5001 Newport Coast Dr, Newport Coast, CA 92657",
      },
      { name: "Woodbridge High School", type: "School", address: "2 Meadowbrook, Irvine, CA 92604" },
    ],
  },
  {
    zipCode: "92604",
    communityEngagementScore: 9.1,
    communityCenters: 5,
    religiousInstitutions: 7,
    highlyEngagedVoters: 425,
    avgCivicEngagement: 8.4,
    coordinates: [33.6751, -117.842],
    institutions: [
      { name: "Northwood Community Center", type: "Community Center", address: "4531 Bryan Ave, Irvine, CA 92620" },
      {
        name: "New Life Presbyterian Church",
        type: "Religious Institution",
        address: "2336 Mesa Verde Dr E, Costa Mesa, CA 92626",
      },
      { name: "Northwood High School", type: "School", address: "4515 Portola Pkwy, Irvine, CA 92602" },
      { name: "Northwood Branch Library", type: "Library", address: "4211 Yale Ave, Irvine, CA 92604" },
      { name: "Cypress Community Center", type: "Community Center", address: "5700 Orange Ave, Cypress, CA 90630" },
    ],
  },
  {
    zipCode: "92606",
    communityEngagementScore: 6.8,
    communityCenters: 2,
    religiousInstitutions: 3,
    highlyEngagedVoters: 198,
    avgCivicEngagement: 6.2,
    coordinates: [33.6856, -117.7794],
    institutions: [
      { name: "Eastbluff Community Center", type: "Community Center", address: "6 Trailwood, Irvine, CA 92604" },
      {
        name: "Newport Harbor Lutheran Church",
        type: "Religious Institution",
        address: "798 Dover Dr, Newport Beach, CA 92663",
      },
      { name: "University High School", type: "School", address: "4771 Campus Dr, Irvine, CA 92612" },
    ],
  },
  {
    zipCode: "92612",
    communityEngagementScore: 8.3,
    communityCenters: 4,
    religiousInstitutions: 5,
    highlyEngagedVoters: 356,
    avgCivicEngagement: 7.6,
    coordinates: [33.6595, -117.8348],
    institutions: [
      { name: "Turtle Rock Community Center", type: "Community Center", address: "1 Sunnyhill, Irvine, CA 92603" },
      { name: "University Synagogue", type: "Religious Institution", address: "2877 Pullman St, Santa Ana, CA 92705" },
      { name: "UC Irvine", type: "School", address: "Irvine, CA 92697" },
      { name: "University Park Library", type: "Library", address: "4512 Sandburg Way, Irvine, CA 92612" },
    ],
  },
  {
    zipCode: "92807",
    communityEngagementScore: 9.8,
    communityCenters: 6,
    religiousInstitutions: 8,
    highlyEngagedVoters: 89,
    avgCivicEngagement: 9.2,
    coordinates: [33.8358, -117.9147],
    institutions: [
      { name: "Anaheim Community Center", type: "Community Center", address: "250 E Center St, Anaheim, CA 92805" },
      {
        name: "St. Boniface Catholic Church",
        type: "Religious Institution",
        address: "120 N Kraemer Blvd, Anaheim, CA 92806",
      },
      { name: "Anaheim Central Library", type: "Library", address: "500 W Broadway, Anaheim, CA 92805" },
      { name: "Loara High School", type: "School", address: "1765 W Cerritos Ave, Anaheim, CA 92804" },
      { name: "West Anaheim Youth Center", type: "Community Center", address: "320 S Beach Blvd, Anaheim, CA 92804" },
      {
        name: "Messiah Lutheran Church",
        type: "Religious Institution",
        address: "515 W Cerritos Ave, Anaheim, CA 92804",
      },
    ],
  },
]

export const mockVoterCandidates: EnhancedVoterCandidate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    zipCode: "92604",
    originalScore: 7.2,
    enhancedScore: 9.1,
    engagementLevel: "High",
    address: "123 Oak Street, Irvine, CA 92604",
    distanceToCenter: 0.8,
    proximityBoost: 1.9,
    bucketZone: "high",
    nearbyInstitutions: 5,
    scoreImprovement: 1.9,
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    zipCode: "92602",
    originalScore: 6.8,
    enhancedScore: 8.7,
    engagementLevel: "High",
    address: "456 Pine Avenue, Irvine, CA 92602",
    distanceToCenter: 1.2,
    proximityBoost: 1.9,
    bucketZone: "high",
    nearbyInstitutions: 4,
    scoreImprovement: 1.9,
  },
  {
    id: "3",
    name: "Jennifer Park",
    zipCode: "92612",
    originalScore: 6.5,
    enhancedScore: 8.3,
    engagementLevel: "High",
    address: "789 Maple Drive, Irvine, CA 92612",
    distanceToCenter: 1.5,
    proximityBoost: 1.8,
    bucketZone: "high",
    nearbyInstitutions: 4,
    scoreImprovement: 1.8,
  },
  {
    id: "4",
    name: "David Thompson",
    zipCode: "92603",
    originalScore: 5.9,
    enhancedScore: 7.2,
    engagementLevel: "Medium",
    address: "321 Elm Street, Irvine, CA 92603",
    distanceToCenter: 2.1,
    proximityBoost: 1.3,
    bucketZone: "medium",
    nearbyInstitutions: 3,
    scoreImprovement: 1.3,
  },
  {
    id: "5",
    name: "Lisa Wang",
    zipCode: "92606",
    originalScore: 5.2,
    enhancedScore: 6.8,
    engagementLevel: "Medium",
    address: "654 Cedar Lane, Irvine, CA 92606",
    distanceToCenter: 3.2,
    proximityBoost: 1.6,
    bucketZone: "medium",
    nearbyInstitutions: 2,
    scoreImprovement: 1.6,
  },
  {
    id: "6",
    name: "Robert Johnson",
    zipCode: "92604",
    originalScore: 8.1,
    enhancedScore: 9.3,
    engagementLevel: "High",
    address: "987 Birch Court, Irvine, CA 92604",
    distanceToCenter: 0.6,
    proximityBoost: 1.2,
    bucketZone: "high",
    nearbyInstitutions: 5,
    scoreImprovement: 1.2,
  },
  {
    id: "7",
    name: "Amanda Foster",
    zipCode: "92602",
    originalScore: 7.5,
    enhancedScore: 8.9,
    engagementLevel: "High",
    address: "147 Willow Way, Irvine, CA 92602",
    distanceToCenter: 1.0,
    proximityBoost: 1.4,
    bucketZone: "high",
    nearbyInstitutions: 4,
    scoreImprovement: 1.4,
  },
  {
    id: "8",
    name: "Kevin Lee",
    zipCode: "92612",
    originalScore: 6.3,
    enhancedScore: 8.1,
    engagementLevel: "High",
    address: "258 Spruce Street, Irvine, CA 92612",
    distanceToCenter: 1.8,
    proximityBoost: 1.8,
    bucketZone: "high",
    nearbyInstitutions: 4,
    scoreImprovement: 1.8,
  },
  {
    id: "9",
    name: "Maria Gonzalez",
    zipCode: "92807",
    originalScore: 4.2,
    enhancedScore: 8.9,
    engagementLevel: "High",
    address: "159 Valley View Dr, Anaheim, CA 92807",
    distanceToCenter: 0.4,
    proximityBoost: 4.7,
    bucketZone: "high",
    nearbyInstitutions: 6,
    scoreImprovement: 4.7,
  },
  {
    id: "10",
    name: "James Wilson",
    zipCode: "92807",
    originalScore: 3.8,
    enhancedScore: 8.5,
    engagementLevel: "High",
    address: "742 Community Blvd, Anaheim, CA 92807",
    distanceToCenter: 0.3,
    proximityBoost: 4.7,
    bucketZone: "high",
    nearbyInstitutions: 6,
    scoreImprovement: 4.7,
  },
]

export const methodologySteps = [
  {
    step: 1,
    title: "Behavioral Analysis",
    description: "Analyze voting history, civic participation, and community involvement patterns",
    weight: "60%",
  },
  {
    step: 2,
    title: "Geographic Proximity",
    description: "Calculate distance to community centers, religious institutions, and civic buildings",
    weight: "25%",
  },
  {
    step: 3,
    title: "Community Density",
    description: "Factor in the concentration of civic institutions within 3-mile radius",
    weight: "15%",
  },
]

export const successMetrics = {
  totalEnhanced: 247,
  movedToHighEngagement: 89,
  averageImprovement: 12.4,
  mostImpactfulZip: "92807",
  mostImpactfulBoost: 18.7,
}
