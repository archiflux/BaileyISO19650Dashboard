// ── ISO 19650 BIM Execution Plan (BEP) Type Definitions ──

// ── Step 1: Project Information ──
export interface ProjectInformation {
  projectName: string;
  projectNumber: string;
  projectAddress: string;
  projectDescription: string;
  projectType: ProjectType;
  projectValue: string;
  procurementRoute: ProcurementRoute;
  projectStage: ProjectStage;
  startDate: string;
  completionDate: string;
  clientName: string;
  clientOrganisation: string;
  clientContact: string;
  clientEmail: string;
}

export type ProjectType =
  | ''
  | 'new-build'
  | 'refurbishment'
  | 'extension'
  | 'fit-out'
  | 'infrastructure'
  | 'mixed-use'
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'healthcare'
  | 'education';

export type ProcurementRoute =
  | ''
  | 'traditional'
  | 'design-and-build'
  | 'construction-management'
  | 'management-contracting'
  | 'pfi-ppp'
  | 'framework'
  | 'two-stage';

export type ProjectStage =
  | ''
  | '0-strategic-definition'
  | '1-preparation-and-briefing'
  | '2-concept-design'
  | '3-spatial-coordination'
  | '4-technical-design'
  | '5-manufacturing-and-construction'
  | '6-handover'
  | '7-use';

// ── Step 2: Project Parties ──
export interface ProjectParty {
  id: string;
  organisationName: string;
  role: PartyRole;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  bimCapability: BimCapability;
  scope: string;
}

export type PartyRole =
  | 'appointing-party'
  | 'lead-appointed-party'
  | 'appointed-party'
  | 'information-manager'
  | 'task-team-manager'
  | 'task-team-member';

export type BimCapability =
  | ''
  | 'basic'
  | 'intermediate'
  | 'advanced'
  | 'expert';

// ── Step 3: Information Requirements ──
export interface InformationRequirements {
  oir: OrganisationalInformationRequirements;
  air: AssetInformationRequirements;
  pir: ProjectInformationRequirements;
  eir: ExchangeInformationRequirements;
}

export interface OrganisationalInformationRequirements {
  exists: boolean;
  description: string;
  objectives: string[];
}

export interface AssetInformationRequirements {
  exists: boolean;
  description: string;
  assetManagementSystem: string;
  operationalRequirements: string[];
}

export interface ProjectInformationRequirements {
  exists: boolean;
  description: string;
  decisionPoints: string[];
  keyQuestions: string[];
}

export interface ExchangeInformationRequirements {
  informationStandard: string;
  informationProductionMethods: string;
  referenceInformation: string;
  sharedResources: string;
  informationDeliveryMilestones: string[];
  acceptanceCriteria: string;
}

// ── Step 4: Level of Information Need (BS EN 17412-1) ──
export interface LevelOfInformationNeed {
  elements: ElementLOIN[];
}

export interface ElementLOIN {
  id: string;
  elementType: string;
  purpose: string;
  geometricalInformation: GeometricalDetail;
  alphanumericInformation: AlphanumericDetail;
  documentation: DocumentationDetail;
}

export interface GeometricalDetail {
  level: GeometryLevel;
  description: string;
  dimensionality: '2D' | '3D' | 'both';
  appearance: boolean;
  parametric: boolean;
}

export type GeometryLevel =
  | ''
  | 'symbolic'
  | 'conceptual'
  | 'approximate'
  | 'precise'
  | 'fabrication';

export interface AlphanumericDetail {
  level: InformationLevel;
  description: string;
  properties: string[];
  classification: string;
}

export type InformationLevel =
  | ''
  | 'basic'
  | 'scheduled'
  | 'specified'
  | 'procurement'
  | 'operations';

export interface DocumentationDetail {
  level: DocumentLevel;
  description: string;
  requiredDocuments: string[];
}

export type DocumentLevel =
  | ''
  | 'none'
  | 'basic'
  | 'standard'
  | 'comprehensive';

// ── Step 5: CDE & Information Management ──
export interface CDEConfiguration {
  platform: string;
  accessMethod: string;
  folderStructure: string;
  namingConvention: NamingConvention;
  statusCodes: StatusCode[];
  revisionStrategy: string;
  suitabilityCodes: SuitabilityCode[];
}

export interface NamingConvention {
  standard: string;
  separator: string;
  fields: NamingField[];
  example: string;
}

export interface NamingField {
  name: string;
  description: string;
  maxLength: number;
  example: string;
}

export interface StatusCode {
  code: string;
  description: string;
  cdeState: CDEState;
}

export type CDEState =
  | 'work-in-progress'
  | 'shared'
  | 'published'
  | 'archive';

export interface SuitabilityCode {
  code: string;
  description: string;
}

// ── Step 6: Standards, Methods & Procedures ──
export interface StandardsMethods {
  modellingStandards: string[];
  drawingStandards: string[];
  classificationSystem: ClassificationSystem;
  coordinateSystem: CoordinateSystem;
  measurementUnits: string;
  tolerances: string;
  clashDetectionProcess: string;
  qualityAssurance: string;
}

export type ClassificationSystem =
  | ''
  | 'uniclass-2015'
  | 'omniclass'
  | 'masterformat'
  | 'uniformat'
  | 'nrm'
  | 'other';

export interface CoordinateSystem {
  projectBasePoint: string;
  surveyPoint: string;
  datum: string;
  gridReference: string;
  trueNorth: string;
}

// ── Step 7: Software & IT ──
export interface SoftwareIT {
  authoringSoftware: SoftwareItem[];
  coordinationSoftware: SoftwareItem[];
  cdePlatform: string;
  fileFormats: FileFormat[];
  hardwareRequirements: string;
  networkRequirements: string;
  interoperabilityApproach: string;
}

export interface SoftwareItem {
  id: string;
  name: string;
  version: string;
  vendor: string;
  purpose: string;
  discipline: string;
}

export interface FileFormat {
  format: string;
  purpose: string;
  version: string;
}

// ── Step 8: Deliverables & Milestones ──
export interface DeliverablesAndMilestones {
  informationDeliveryMilestones: Milestone[];
  modelDeliverables: ModelDeliverable[];
  masterInformationDeliveryPlan: MIDPEntry[];
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  stage: ProjectStage;
  description: string;
  deliverables: string[];
}

export interface ModelDeliverable {
  id: string;
  modelName: string;
  discipline: string;
  description: string;
  responsibleParty: string;
  deliveryDate: string;
  format: string;
}

export interface MIDPEntry {
  id: string;
  informationContainer: string;
  description: string;
  responsibleParty: string;
  milestone: string;
  status: string;
}

// ── Step 9: Roles & Responsibilities ──
export interface RolesAndResponsibilities {
  roles: BIMRole[];
  raciMatrix: RACIEntry[];
}

export interface BIMRole {
  id: string;
  title: string;
  organisation: string;
  personName: string;
  responsibilities: string[];
}

export interface RACIEntry {
  id: string;
  activity: string;
  responsible: string;
  accountable: string;
  consulted: string;
  informed: string;
}

// ── Complete BEP Document ──
export interface BEPDocument {
  id: string;
  version: string;
  createdDate: string;
  lastModified: string;
  status: 'draft' | 'in-review' | 'approved' | 'superseded';
  currentStep: number;
  completedSteps: number[];
  projectInformation: ProjectInformation;
  projectParties: ProjectParty[];
  informationRequirements: InformationRequirements;
  levelOfInformationNeed: LevelOfInformationNeed;
  cdeConfiguration: CDEConfiguration;
  standardsMethods: StandardsMethods;
  softwareIT: SoftwareIT;
  deliverablesAndMilestones: DeliverablesAndMilestones;
  rolesAndResponsibilities: RolesAndResponsibilities;
}

// ── Helper Types ──
export interface WizardStep {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}

export interface Project {
  id: string;
  name: string;
  number: string;
  client: string;
  type: ProjectType;
  stage: ProjectStage;
  address: string;
  description: string;
  value: string;
  procurementRoute: ProcurementRoute;
  startDate: string;
  completionDate: string;
  clientContact: string;
  clientEmail: string;
}
