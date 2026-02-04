import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { BEPDocument, ProjectParty, ElementLOIN, SoftwareItem, FileFormat, Milestone, ModelDeliverable, MIDPEntry, BIMRole, RACIEntry } from '../types/bep';
import { createEmptyBEP } from '../data/defaults';
import type { Project } from '../types/bep';

type BepAction =
  | { type: 'SET_BEP'; payload: BEPDocument }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'COMPLETE_STEP'; payload: number }
  | { type: 'UPDATE_PROJECT_INFO'; payload: Partial<BEPDocument['projectInformation']> }
  | { type: 'PREPOPULATE_FROM_PROJECT'; payload: Project }
  | { type: 'SET_PARTIES'; payload: ProjectParty[] }
  | { type: 'ADD_PARTY'; payload: ProjectParty }
  | { type: 'UPDATE_PARTY'; payload: { id: string; data: Partial<ProjectParty> } }
  | { type: 'REMOVE_PARTY'; payload: string }
  | { type: 'UPDATE_INFORMATION_REQUIREMENTS'; payload: Partial<BEPDocument['informationRequirements']> }
  | { type: 'UPDATE_OIR'; payload: Partial<BEPDocument['informationRequirements']['oir']> }
  | { type: 'UPDATE_AIR'; payload: Partial<BEPDocument['informationRequirements']['air']> }
  | { type: 'UPDATE_PIR'; payload: Partial<BEPDocument['informationRequirements']['pir']> }
  | { type: 'UPDATE_EIR'; payload: Partial<BEPDocument['informationRequirements']['eir']> }
  | { type: 'SET_LOIN_ELEMENTS'; payload: ElementLOIN[] }
  | { type: 'UPDATE_LOIN_ELEMENT'; payload: { id: string; data: Partial<ElementLOIN> } }
  | { type: 'ADD_LOIN_ELEMENT'; payload: ElementLOIN }
  | { type: 'REMOVE_LOIN_ELEMENT'; payload: string }
  | { type: 'UPDATE_CDE'; payload: Partial<BEPDocument['cdeConfiguration']> }
  | { type: 'UPDATE_STANDARDS'; payload: Partial<BEPDocument['standardsMethods']> }
  | { type: 'UPDATE_COORDINATE_SYSTEM'; payload: Partial<BEPDocument['standardsMethods']['coordinateSystem']> }
  | { type: 'UPDATE_SOFTWARE_IT'; payload: Partial<BEPDocument['softwareIT']> }
  | { type: 'ADD_AUTHORING_SOFTWARE'; payload: SoftwareItem }
  | { type: 'REMOVE_AUTHORING_SOFTWARE'; payload: string }
  | { type: 'ADD_COORDINATION_SOFTWARE'; payload: SoftwareItem }
  | { type: 'REMOVE_COORDINATION_SOFTWARE'; payload: string }
  | { type: 'ADD_FILE_FORMAT'; payload: FileFormat }
  | { type: 'SET_FILE_FORMATS'; payload: FileFormat[] }
  | { type: 'ADD_MILESTONE'; payload: Milestone }
  | { type: 'UPDATE_MILESTONE'; payload: { id: string; data: Partial<Milestone> } }
  | { type: 'REMOVE_MILESTONE'; payload: string }
  | { type: 'ADD_MODEL_DELIVERABLE'; payload: ModelDeliverable }
  | { type: 'UPDATE_MODEL_DELIVERABLE'; payload: { id: string; data: Partial<ModelDeliverable> } }
  | { type: 'REMOVE_MODEL_DELIVERABLE'; payload: string }
  | { type: 'SET_MIDP'; payload: MIDPEntry[] }
  | { type: 'ADD_MIDP_ENTRY'; payload: MIDPEntry }
  | { type: 'REMOVE_MIDP_ENTRY'; payload: string }
  | { type: 'SET_ROLES'; payload: BIMRole[] }
  | { type: 'ADD_ROLE'; payload: BIMRole }
  | { type: 'UPDATE_ROLE'; payload: { id: string; data: Partial<BIMRole> } }
  | { type: 'REMOVE_ROLE'; payload: string }
  | { type: 'SET_RACI'; payload: RACIEntry[] }
  | { type: 'UPDATE_RACI_ENTRY'; payload: { id: string; data: Partial<RACIEntry> } }
  | { type: 'UPDATE_NAMING_CONVENTION'; payload: Partial<BEPDocument['cdeConfiguration']['namingConvention']> };

function bepReducer(state: BEPDocument, action: BepAction): BEPDocument {
  const updated = { ...state, lastModified: new Date().toISOString() };

  switch (action.type) {
    case 'SET_BEP':
      return action.payload;

    case 'SET_STEP':
      return { ...updated, currentStep: action.payload };

    case 'COMPLETE_STEP':
      return {
        ...updated,
        completedSteps: updated.completedSteps.includes(action.payload)
          ? updated.completedSteps
          : [...updated.completedSteps, action.payload],
      };

    case 'UPDATE_PROJECT_INFO':
      return {
        ...updated,
        projectInformation: { ...updated.projectInformation, ...action.payload },
      };

    case 'PREPOPULATE_FROM_PROJECT':
      return {
        ...updated,
        projectInformation: {
          ...updated.projectInformation,
          projectName: action.payload.name,
          projectNumber: action.payload.number,
          projectAddress: action.payload.address,
          projectDescription: action.payload.description,
          projectType: action.payload.type,
          projectValue: action.payload.value,
          procurementRoute: action.payload.procurementRoute,
          projectStage: action.payload.stage,
          startDate: action.payload.startDate,
          completionDate: action.payload.completionDate,
          clientName: action.payload.client,
          clientOrganisation: action.payload.client,
          clientContact: action.payload.clientContact,
          clientEmail: action.payload.clientEmail,
        },
      };

    case 'SET_PARTIES':
      return { ...updated, projectParties: action.payload };

    case 'ADD_PARTY':
      return { ...updated, projectParties: [...updated.projectParties, action.payload] };

    case 'UPDATE_PARTY':
      return {
        ...updated,
        projectParties: updated.projectParties.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload.data } : p
        ),
      };

    case 'REMOVE_PARTY':
      return {
        ...updated,
        projectParties: updated.projectParties.filter((p) => p.id !== action.payload),
      };

    case 'UPDATE_INFORMATION_REQUIREMENTS':
      return {
        ...updated,
        informationRequirements: { ...updated.informationRequirements, ...action.payload },
      };

    case 'UPDATE_OIR':
      return {
        ...updated,
        informationRequirements: {
          ...updated.informationRequirements,
          oir: { ...updated.informationRequirements.oir, ...action.payload },
        },
      };

    case 'UPDATE_AIR':
      return {
        ...updated,
        informationRequirements: {
          ...updated.informationRequirements,
          air: { ...updated.informationRequirements.air, ...action.payload },
        },
      };

    case 'UPDATE_PIR':
      return {
        ...updated,
        informationRequirements: {
          ...updated.informationRequirements,
          pir: { ...updated.informationRequirements.pir, ...action.payload },
        },
      };

    case 'UPDATE_EIR':
      return {
        ...updated,
        informationRequirements: {
          ...updated.informationRequirements,
          eir: { ...updated.informationRequirements.eir, ...action.payload },
        },
      };

    case 'SET_LOIN_ELEMENTS':
      return {
        ...updated,
        levelOfInformationNeed: { elements: action.payload },
      };

    case 'ADD_LOIN_ELEMENT':
      return {
        ...updated,
        levelOfInformationNeed: {
          elements: [...updated.levelOfInformationNeed.elements, action.payload],
        },
      };

    case 'UPDATE_LOIN_ELEMENT':
      return {
        ...updated,
        levelOfInformationNeed: {
          elements: updated.levelOfInformationNeed.elements.map((e) =>
            e.id === action.payload.id ? { ...e, ...action.payload.data } : e
          ),
        },
      };

    case 'REMOVE_LOIN_ELEMENT':
      return {
        ...updated,
        levelOfInformationNeed: {
          elements: updated.levelOfInformationNeed.elements.filter(
            (e) => e.id !== action.payload
          ),
        },
      };

    case 'UPDATE_CDE':
      return {
        ...updated,
        cdeConfiguration: { ...updated.cdeConfiguration, ...action.payload },
      };

    case 'UPDATE_NAMING_CONVENTION':
      return {
        ...updated,
        cdeConfiguration: {
          ...updated.cdeConfiguration,
          namingConvention: { ...updated.cdeConfiguration.namingConvention, ...action.payload },
        },
      };

    case 'UPDATE_STANDARDS':
      return {
        ...updated,
        standardsMethods: { ...updated.standardsMethods, ...action.payload },
      };

    case 'UPDATE_COORDINATE_SYSTEM':
      return {
        ...updated,
        standardsMethods: {
          ...updated.standardsMethods,
          coordinateSystem: {
            ...updated.standardsMethods.coordinateSystem,
            ...action.payload,
          },
        },
      };

    case 'UPDATE_SOFTWARE_IT':
      return {
        ...updated,
        softwareIT: { ...updated.softwareIT, ...action.payload },
      };

    case 'ADD_AUTHORING_SOFTWARE':
      return {
        ...updated,
        softwareIT: {
          ...updated.softwareIT,
          authoringSoftware: [...updated.softwareIT.authoringSoftware, action.payload],
        },
      };

    case 'REMOVE_AUTHORING_SOFTWARE':
      return {
        ...updated,
        softwareIT: {
          ...updated.softwareIT,
          authoringSoftware: updated.softwareIT.authoringSoftware.filter(
            (s) => s.id !== action.payload
          ),
        },
      };

    case 'ADD_COORDINATION_SOFTWARE':
      return {
        ...updated,
        softwareIT: {
          ...updated.softwareIT,
          coordinationSoftware: [...updated.softwareIT.coordinationSoftware, action.payload],
        },
      };

    case 'REMOVE_COORDINATION_SOFTWARE':
      return {
        ...updated,
        softwareIT: {
          ...updated.softwareIT,
          coordinationSoftware: updated.softwareIT.coordinationSoftware.filter(
            (s) => s.id !== action.payload
          ),
        },
      };

    case 'ADD_FILE_FORMAT':
      return {
        ...updated,
        softwareIT: {
          ...updated.softwareIT,
          fileFormats: [...updated.softwareIT.fileFormats, action.payload],
        },
      };

    case 'SET_FILE_FORMATS':
      return {
        ...updated,
        softwareIT: { ...updated.softwareIT, fileFormats: action.payload },
      };

    case 'ADD_MILESTONE':
      return {
        ...updated,
        deliverablesAndMilestones: {
          ...updated.deliverablesAndMilestones,
          informationDeliveryMilestones: [
            ...updated.deliverablesAndMilestones.informationDeliveryMilestones,
            action.payload,
          ],
        },
      };

    case 'UPDATE_MILESTONE':
      return {
        ...updated,
        deliverablesAndMilestones: {
          ...updated.deliverablesAndMilestones,
          informationDeliveryMilestones:
            updated.deliverablesAndMilestones.informationDeliveryMilestones.map((m) =>
              m.id === action.payload.id ? { ...m, ...action.payload.data } : m
            ),
        },
      };

    case 'REMOVE_MILESTONE':
      return {
        ...updated,
        deliverablesAndMilestones: {
          ...updated.deliverablesAndMilestones,
          informationDeliveryMilestones:
            updated.deliverablesAndMilestones.informationDeliveryMilestones.filter(
              (m) => m.id !== action.payload
            ),
        },
      };

    case 'ADD_MODEL_DELIVERABLE':
      return {
        ...updated,
        deliverablesAndMilestones: {
          ...updated.deliverablesAndMilestones,
          modelDeliverables: [
            ...updated.deliverablesAndMilestones.modelDeliverables,
            action.payload,
          ],
        },
      };

    case 'UPDATE_MODEL_DELIVERABLE':
      return {
        ...updated,
        deliverablesAndMilestones: {
          ...updated.deliverablesAndMilestones,
          modelDeliverables:
            updated.deliverablesAndMilestones.modelDeliverables.map((d) =>
              d.id === action.payload.id ? { ...d, ...action.payload.data } : d
            ),
        },
      };

    case 'REMOVE_MODEL_DELIVERABLE':
      return {
        ...updated,
        deliverablesAndMilestones: {
          ...updated.deliverablesAndMilestones,
          modelDeliverables:
            updated.deliverablesAndMilestones.modelDeliverables.filter(
              (d) => d.id !== action.payload
            ),
        },
      };

    case 'SET_MIDP':
      return {
        ...updated,
        deliverablesAndMilestones: {
          ...updated.deliverablesAndMilestones,
          masterInformationDeliveryPlan: action.payload,
        },
      };

    case 'ADD_MIDP_ENTRY':
      return {
        ...updated,
        deliverablesAndMilestones: {
          ...updated.deliverablesAndMilestones,
          masterInformationDeliveryPlan: [
            ...updated.deliverablesAndMilestones.masterInformationDeliveryPlan,
            action.payload,
          ],
        },
      };

    case 'REMOVE_MIDP_ENTRY':
      return {
        ...updated,
        deliverablesAndMilestones: {
          ...updated.deliverablesAndMilestones,
          masterInformationDeliveryPlan:
            updated.deliverablesAndMilestones.masterInformationDeliveryPlan.filter(
              (e) => e.id !== action.payload
            ),
        },
      };

    case 'SET_ROLES':
      return {
        ...updated,
        rolesAndResponsibilities: {
          ...updated.rolesAndResponsibilities,
          roles: action.payload,
        },
      };

    case 'ADD_ROLE':
      return {
        ...updated,
        rolesAndResponsibilities: {
          ...updated.rolesAndResponsibilities,
          roles: [...updated.rolesAndResponsibilities.roles, action.payload],
        },
      };

    case 'UPDATE_ROLE':
      return {
        ...updated,
        rolesAndResponsibilities: {
          ...updated.rolesAndResponsibilities,
          roles: updated.rolesAndResponsibilities.roles.map((r) =>
            r.id === action.payload.id ? { ...r, ...action.payload.data } : r
          ),
        },
      };

    case 'REMOVE_ROLE':
      return {
        ...updated,
        rolesAndResponsibilities: {
          ...updated.rolesAndResponsibilities,
          roles: updated.rolesAndResponsibilities.roles.filter(
            (r) => r.id !== action.payload
          ),
        },
      };

    case 'SET_RACI':
      return {
        ...updated,
        rolesAndResponsibilities: {
          ...updated.rolesAndResponsibilities,
          raciMatrix: action.payload,
        },
      };

    case 'UPDATE_RACI_ENTRY':
      return {
        ...updated,
        rolesAndResponsibilities: {
          ...updated.rolesAndResponsibilities,
          raciMatrix: updated.rolesAndResponsibilities.raciMatrix.map((r) =>
            r.id === action.payload.id ? { ...r, ...action.payload.data } : r
          ),
        },
      };

    default:
      return state;
  }
}

interface BepContextValue {
  bep: BEPDocument;
  dispatch: React.Dispatch<BepAction>;
}

const BepContext = createContext<BepContextValue | null>(null);

export function BepProvider({ children }: { children: ReactNode }) {
  const [bep, dispatch] = useReducer(bepReducer, createEmptyBEP());

  return (
    <BepContext.Provider value={{ bep, dispatch }}>
      {children}
    </BepContext.Provider>
  );
}

export function useBep() {
  const context = useContext(BepContext);
  if (!context) {
    throw new Error('useBep must be used within a BepProvider');
  }
  return context;
}
