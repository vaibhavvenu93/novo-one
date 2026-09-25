import { GrowthOpportunity } from "@/domain/growth";

export const growthOpportunities: GrowthOpportunity[] = [
  {
    id: "growth-varthur-schools",

    brandId: "monkeybox",
    lane: "schools",
    stage: "qualified",

    title: "Add three schools to the existing Varthur route",

    description:
      "Increase route density by acquiring schools that can potentially be served using the existing morning production and delivery footprint.",

    locationId: "varthur",

    annualRevenuePotential: 1_820_000,
    annualContributionPotential: 546_000,
    investmentRequired: 120_000,

    confidence: 0.78,
    strategicFit: 0.94,
    capacityFit: 0.88,

    timeToImpact: "31-60",

    evidence: "modelled",

    whyNow:
      "Existing production and route infrastructure creates the possibility of adding revenue without building an entirely new operating footprint.",

    constraint:
      "School acquisition cycle and validation of morning kitchen capacity.",

    nextAction:
      "Build a target list of schools within the serviceable Varthur corridor and validate meal volumes, pricing and decision makers.",

    owner: "Growth",
  },

  {
    id: "growth-pressmans-corporate",

    brandId: "pressmans",
    lane: "corporate",
    stage: "research",

    title: "Build a Pressman's corporate kiosk cluster",

    description:
      "Test whether a concentrated group of offices or technology parks can support recurring Pressman's kiosks or managed food counters.",

    locationId: "varthur",

    annualRevenuePotential: 3_150_000,
    annualContributionPotential: 882_000,
    investmentRequired: 420_000,

    confidence: 0.64,
    strategicFit: 0.86,
    capacityFit: 0.72,

    timeToImpact: "61-90",

    evidence: "hypothesis",

    whyNow:
      "Corporate food programmes can create recurring weekday demand and diversify the portfolio away from marketplace dependence.",

    constraint:
      "Requires validation of account economics, footfall and operating format.",

    nextAction:
      "Identify 20 nearby office clusters and qualify five accounts for kiosk or managed-meal pilots.",

    owner: "Founder",
  },

  {
    id: "growth-khichdi-pass",

    brandId: "khichdi-tales",
    lane: "delivery",
    stage: "experiment",

    title: "Launch a Khichdi Tales recurring meal pass",

    description:
      "Test whether repeat customers will pre-commit to a weekly or monthly meal bundle through a direct ordering relationship.",

    locationId: "varthur",

    annualRevenuePotential: 2_400_000,
    annualContributionPotential: 816_000,
    investmentRequired: 160_000,

    confidence: 0.69,
    strategicFit: 0.9,
    capacityFit: 0.91,

    timeToImpact: "0-30",

    evidence: "hypothesis",

    whyNow:
      "Repeat consumption creates an opportunity to improve frequency and potentially reduce dependence on marketplace acquisition.",

    constraint:
      "Repeat rate and willingness to pre-commit have not yet been validated.",

    nextAction:
      "Offer a controlled meal-pass experiment to a small repeat-customer cohort and measure conversion, frequency and contribution.",

    owner: "Growth",
  },

  {
    id: "growth-evening-capacity",

    brandId: "novo",
    lane: "new-business",
    stage: "research",

    title: "Monetise unused evening kitchen capacity",

    description:
      "Evaluate products or demand channels that can use existing kitchen infrastructure during underutilised evening production windows.",

    locationId: "varthur",

    annualRevenuePotential: 1_780_000,
    annualContributionPotential: 605_000,
    investmentRequired: 210_000,

    confidence: 0.61,
    strategicFit: 0.79,
    capacityFit: 0.95,

    timeToImpact: "31-60",

    evidence: "modelled",

    whyNow:
      "Fixed infrastructure already exists, so incremental utilisation could improve asset productivity if demand can be acquired economically.",

    constraint:
      "Need actual hourly utilisation data and a validated demand concept.",

    nextAction:
      "Measure kitchen utilisation by hour and shortlist three evening concepts using existing ingredients and equipment.",

    owner: "Operations",
  },

  {
    id: "growth-school-expansion",

    brandId: "monkeybox",
    lane: "existing-account",
    stage: "signal",

    title: "Increase participation inside existing schools",

    description:
      "Test whether adoption can be increased within current school relationships before adding additional delivery routes.",

    annualRevenuePotential: 1_260_000,
    annualContributionPotential: 428_000,
    investmentRequired: 80_000,

    confidence: 0.73,
    strategicFit: 0.96,
    capacityFit: 0.9,

    timeToImpact: "0-30",

    evidence: "hypothesis",

    whyNow:
      "Expansion inside existing accounts may have lower acquisition friction than winning entirely new schools.",

    constraint:
      "Current penetration and eligible student counts need to be established.",

    nextAction:
      "Calculate school-level penetration and identify the three accounts with the largest unserved student base.",

    owner: "Account Management",
  },

  {
    id: "growth-direct-repeat",

    brandId: "khichdi-tales",
    lane: "delivery",
    stage: "signal",

    title: "Move repeat Khichdi Tales demand toward direct ordering",

    description:
      "Create a compliant direct repeat-ordering proposition and measure whether repeat demand can generate stronger contribution economics.",

    annualRevenuePotential: 960_000,
    annualContributionPotential: 384_000,
    investmentRequired: 95_000,

    confidence: 0.67,
    strategicFit: 0.88,
    capacityFit: 0.93,

    timeToImpact: "0-30",

    evidence: "hypothesis",

    whyNow:
      "The finance model identifies marketplace economics as a meaningful contribution driver.",

    constraint:
      "Customer repeat behaviour and direct-channel conversion need validation.",

    nextAction:
      "Build a repeat-customer cohort analysis and test a direct reorder proposition.",

    owner: "Growth",
  },

  {
    id: "growth-corporate-meals",

    brandId: "novo",
    lane: "corporate",
    stage: "research",

    title: "Recurring corporate meal programme",

    description:
      "Package existing kitchen capability into contracted weekday employee meal programmes for nearby companies.",

    locationId: "varthur",

    annualRevenuePotential: 4_200_000,
    annualContributionPotential: 1_176_000,
    investmentRequired: 350_000,

    confidence: 0.58,
    strategicFit: 0.84,
    capacityFit: 0.76,

    timeToImpact: "61-90",

    evidence: "hypothesis",

    whyNow:
      "Contracted B2B demand could create predictable volume and improve production planning.",

    constraint:
      "Sales cycle, contract pricing and fulfilment requirements are unknown.",

    nextAction:
      "Model economics for 100, 250 and 500 meals per weekday and identify ten target companies.",

    owner: "Founder",
  },

  {
    id: "growth-second-kitchen",

    brandId: "novo",
    lane: "location",
    stage: "signal",

    title: "Identify the next kitchen catchment",

    description:
      "Use demand density, school clusters, corporate density and delivery economics to identify where a second operating node could eventually work.",

    annualRevenuePotential: 7_500_000,
    annualContributionPotential: 1_875_000,
    investmentRequired: 1_800_000,

    confidence: 0.42,
    strategicFit: 0.82,
    capacityFit: 0.45,

    timeToImpact: "90+",

    evidence: "hypothesis",

    whyNow:
      "Expansion should be based on catchment economics rather than intuition once the existing unit model is understood.",

    constraint:
      "Requires verified unit economics, demand mapping and capex assumptions.",

    nextAction:
      "Build a Bengaluru catchment model combining demand, competition, schools, offices and delivery radius.",

    owner: "Founder",
  },
];