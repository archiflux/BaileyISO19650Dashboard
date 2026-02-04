import type {
  BEPDocument,
  WizardStep,
  SuitabilityCode,
  StatusCode,
  NamingField,
  RACIEntry,
} from '../types/bep';

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Project Information',
    shortTitle: 'Project',
    description: 'Basic project details, client information, and project parameters',
    icon: 'building-2',
  },
  {
    id: 2,
    title: 'Project Parties & Stakeholders',
    shortTitle: 'Parties',
    description: 'Define the appointing party, lead appointed party, and all appointed parties',
    icon: 'users',
  },
  {
    id: 3,
    title: 'Information Requirements',
    shortTitle: 'Requirements',
    description: 'OIR, AIR, PIR, and EIR as defined by ISO 19650',
    icon: 'clipboard-list',
  },
  {
    id: 4,
    title: 'Level of Information Need',
    shortTitle: 'LOIN',
    description: 'Define geometrical detail, alphanumeric information, and documentation requirements per BS EN 17412-1',
    icon: 'layers',
  },
  {
    id: 5,
    title: 'CDE & Information Management',
    shortTitle: 'CDE',
    description: 'Common Data Environment setup, naming conventions, status codes, and workflows',
    icon: 'database',
  },
  {
    id: 6,
    title: 'Standards, Methods & Procedures',
    shortTitle: 'Standards',
    description: 'Modelling standards, classification systems, coordinate strategy, and quality assurance',
    icon: 'book-open',
  },
  {
    id: 7,
    title: 'Software & IT Infrastructure',
    shortTitle: 'Software',
    description: 'Authoring tools, coordination software, file formats, and interoperability',
    icon: 'monitor',
  },
  {
    id: 8,
    title: 'Deliverables & Milestones',
    shortTitle: 'Deliverables',
    description: 'Information delivery milestones, model deliverables, and MIDP',
    icon: 'calendar',
  },
  {
    id: 9,
    title: 'Roles & Responsibilities',
    shortTitle: 'Roles',
    description: 'Information management roles and RACI matrix',
    icon: 'shield-check',
  },
  {
    id: 10,
    title: 'Review & Generate',
    shortTitle: 'Generate',
    description: 'Review all sections and generate the final BEP document',
    icon: 'file-text',
  },
];

// ── Level of Information Need: Simple Definitions ──

export const GEOMETRY_LEVELS = [
  {
    value: 'symbolic',
    label: 'Symbolic',
    description: 'A 2D symbol or marker indicating presence and location only. No 3D geometry.',
    example: 'A symbol on a plan showing a fire extinguisher location.',
    typical: 'Stage 0-1',
  },
  {
    value: 'conceptual',
    label: 'Conceptual',
    description: 'Simple 3D mass or volume showing approximate size, shape, and position. Used for early-stage spatial planning.',
    example: 'A rectangular block representing a building footprint and height.',
    typical: 'Stage 1-2',
  },
  {
    value: 'approximate',
    label: 'Approximate',
    description: 'Recognisable 3D shape with approximate dimensions. The object is identifiable but not dimensionally precise.',
    example: 'A door with correct swing direction and approximate opening size.',
    typical: 'Stage 2-3',
  },
  {
    value: 'precise',
    label: 'Precise',
    description: 'Accurate 3D representation with correct dimensions, shape, and key features. Suitable for coordination and construction.',
    example: 'A window with exact frame dimensions, opening type, and mullion positions.',
    typical: 'Stage 3-4',
  },
  {
    value: 'fabrication',
    label: 'Fabrication',
    description: 'Highly detailed model suitable for manufacturing or fabrication. Includes fixings, connections, and tolerances.',
    example: 'A steelwork connection with bolt positions, weld details, and material callouts.',
    typical: 'Stage 4-5',
  },
];

export const INFORMATION_LEVELS = [
  {
    value: 'basic',
    label: 'Basic',
    description: 'Classification and identity only. The element is categorised (e.g., "wall", "door") with a unique reference.',
    properties: ['Uniclass classification', 'Element ID', 'Description'],
    typical: 'Stage 0-1',
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    description: 'Key performance and planning data. Enough to schedule and quantify elements for early cost planning.',
    properties: ['Dimensions', 'Area/Volume', 'Material type', 'Fire rating', 'U-value'],
    typical: 'Stage 2-3',
  },
  {
    value: 'specified',
    label: 'Specified',
    description: 'Full specification data. The element is fully defined with performance requirements and product standards.',
    properties: ['Full specification', 'Performance criteria', 'Standards compliance', 'Colour/finish', 'Acoustic rating'],
    typical: 'Stage 3-4',
  },
  {
    value: 'procurement',
    label: 'Procurement',
    description: 'Manufacturer-specific data for procurement and installation. Includes product references and lead times.',
    properties: ['Manufacturer', 'Product reference', 'Cost data', 'Lead time', 'Installation requirements', 'Warranty'],
    typical: 'Stage 4-5',
  },
  {
    value: 'operations',
    label: 'Operations',
    description: 'Full asset data for facilities management and operations. Includes maintenance schedules and lifecycle data.',
    properties: ['Serial numbers', 'Maintenance schedule', 'Replacement cost', 'Expected life', 'O&M manuals', 'Spare parts'],
    typical: 'Stage 6-7',
  },
];

export const DOCUMENTATION_LEVELS = [
  {
    value: 'none',
    label: 'None Required',
    description: 'No supporting documentation required for this element at this stage.',
  },
  {
    value: 'basic',
    label: 'Basic',
    description: 'General product literature or catalogue data sheets.',
  },
  {
    value: 'standard',
    label: 'Standard',
    description: 'Detailed product data sheets, installation guides, test certificates, and compliance documentation.',
  },
  {
    value: 'comprehensive',
    label: 'Comprehensive',
    description: 'Full O&M manuals, as-built records, commissioning data, warranties, and health & safety files.',
  },
];

// ── Default Element Types for LOIN ──
export const DEFAULT_ELEMENT_TYPES = [
  'Substructure / Foundations',
  'Structural Frame',
  'Upper Floors',
  'Roof',
  'External Walls',
  'Windows & External Doors',
  'Internal Walls & Partitions',
  'Internal Doors',
  'Stairs & Ramps',
  'Ceiling Finishes',
  'Floor Finishes',
  'Mechanical Services (HVAC)',
  'Electrical Services',
  'Plumbing & Drainage',
  'Fire Protection Systems',
  'Lifts & Escalators',
  'External Works',
  'Furniture & Equipment',
];

// ── Default Suitability Codes (BS 1192 / ISO 19650) ──
export const DEFAULT_SUITABILITY_CODES: SuitabilityCode[] = [
  { code: 'S0', description: 'Work In Progress (WIP)' },
  { code: 'S1', description: 'Fit for Coordination' },
  { code: 'S2', description: 'Fit for Information' },
  { code: 'S3', description: 'Fit for Review & Comment' },
  { code: 'S4', description: 'Fit for Stage Approval' },
  { code: 'S6', description: 'Fit for PIM Authorisation' },
  { code: 'S7', description: 'Fit for AIM Authorisation' },
  { code: 'CR', description: 'As-Built / Record' },
];

// ── Default Status Codes ──
export const DEFAULT_STATUS_CODES: StatusCode[] = [
  { code: 'P01', description: 'Preliminary issue', cdeState: 'work-in-progress' },
  { code: 'S1', description: 'First shared issue', cdeState: 'shared' },
  { code: 'A1', description: 'First approved issue', cdeState: 'published' },
  { code: 'CR', description: 'As-constructed record', cdeState: 'archive' },
];

// ── Default Naming Convention Fields (ISO 19650-2) ──
export const DEFAULT_NAMING_FIELDS: NamingField[] = [
  { name: 'Project', description: 'Project code', maxLength: 6, example: 'BP2501' },
  { name: 'Originator', description: 'Organisation code', maxLength: 6, example: 'BAI' },
  { name: 'Volume/System', description: 'Volume or system zone', maxLength: 6, example: 'ZZ' },
  { name: 'Level', description: 'Level or location', maxLength: 6, example: '01' },
  { name: 'Type', description: 'Information container type', maxLength: 2, example: 'DR' },
  { name: 'Discipline', description: 'Discipline code', maxLength: 2, example: 'A' },
  { name: 'Number', description: 'Sequential number', maxLength: 6, example: '0001' },
];

// ── Default RACI Activities ──
export const DEFAULT_RACI_ACTIVITIES: RACIEntry[] = [
  { id: 'raci-1', activity: 'BEP Development & Maintenance', responsible: '', accountable: '', consulted: '', informed: '' },
  { id: 'raci-2', activity: 'Model Authoring', responsible: '', accountable: '', consulted: '', informed: '' },
  { id: 'raci-3', activity: 'Model Coordination & Clash Detection', responsible: '', accountable: '', consulted: '', informed: '' },
  { id: 'raci-4', activity: 'Information Exchange Approval', responsible: '', accountable: '', consulted: '', informed: '' },
  { id: 'raci-5', activity: 'CDE Administration', responsible: '', accountable: '', consulted: '', informed: '' },
  { id: 'raci-6', activity: 'Quality Assurance & Compliance Checks', responsible: '', accountable: '', consulted: '', informed: '' },
  { id: 'raci-7', activity: 'Information Security Management', responsible: '', accountable: '', consulted: '', informed: '' },
  { id: 'raci-8', activity: 'Data Drop / Milestone Deliverables', responsible: '', accountable: '', consulted: '', informed: '' },
  { id: 'raci-9', activity: 'Training & Capability Development', responsible: '', accountable: '', consulted: '', informed: '' },
  { id: 'raci-10', activity: 'Health & Safety File Contribution', responsible: '', accountable: '', consulted: '', informed: '' },
];

// ── Create Empty BEP Document ──
export function createEmptyBEP(): BEPDocument {
  return {
    id: crypto.randomUUID(),
    version: '0.1',
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    status: 'draft',
    currentStep: 1,
    completedSteps: [],
    projectInformation: {
      projectName: '',
      projectNumber: '',
      projectAddress: '',
      projectDescription: '',
      projectType: '',
      projectValue: '',
      procurementRoute: '',
      projectStage: '',
      startDate: '',
      completionDate: '',
      clientName: '',
      clientOrganisation: '',
      clientContact: '',
      clientEmail: '',
    },
    projectParties: [],
    informationRequirements: {
      oir: { exists: false, description: '', objectives: [] },
      air: { exists: false, description: '', assetManagementSystem: '', operationalRequirements: [] },
      pir: { exists: false, description: '', decisionPoints: [], keyQuestions: [] },
      eir: {
        informationStandard: '',
        informationProductionMethods: '',
        referenceInformation: '',
        sharedResources: '',
        informationDeliveryMilestones: [],
        acceptanceCriteria: '',
      },
    },
    levelOfInformationNeed: { elements: [] },
    cdeConfiguration: {
      platform: '',
      accessMethod: '',
      folderStructure: '',
      namingConvention: {
        standard: 'ISO 19650-2',
        separator: '-',
        fields: [...DEFAULT_NAMING_FIELDS],
        example: 'BP2501-BAI-ZZ-01-DR-A-0001',
      },
      statusCodes: [...DEFAULT_STATUS_CODES],
      revisionStrategy: '',
      suitabilityCodes: [...DEFAULT_SUITABILITY_CODES],
    },
    standardsMethods: {
      modellingStandards: [],
      drawingStandards: [],
      classificationSystem: '',
      coordinateSystem: {
        projectBasePoint: '',
        surveyPoint: '',
        datum: '',
        gridReference: '',
        trueNorth: '',
      },
      measurementUnits: 'Metric (mm)',
      tolerances: '',
      clashDetectionProcess: '',
      qualityAssurance: '',
    },
    softwareIT: {
      authoringSoftware: [],
      coordinationSoftware: [],
      cdePlatform: '',
      fileFormats: [],
      hardwareRequirements: '',
      networkRequirements: '',
      interoperabilityApproach: '',
    },
    deliverablesAndMilestones: {
      informationDeliveryMilestones: [],
      modelDeliverables: [],
      masterInformationDeliveryPlan: [],
    },
    rolesAndResponsibilities: {
      roles: [],
      raciMatrix: [...DEFAULT_RACI_ACTIVITIES],
    },
  };
}
