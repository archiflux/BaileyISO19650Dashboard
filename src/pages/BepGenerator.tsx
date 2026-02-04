import { useBep } from '../context/BepContext';
import WizardNav from '../components/wizard/WizardNav';
import ProjectInformation from '../components/steps/ProjectInformation';
import ProjectParties from '../components/steps/ProjectParties';
import InformationRequirements from '../components/steps/InformationRequirements';
import LevelOfInformationNeed from '../components/steps/LevelOfInformationNeed';
import CDEInformationManagement from '../components/steps/CDEInformationManagement';
import StandardsMethods from '../components/steps/StandardsMethods';
import SoftwareIT from '../components/steps/SoftwareIT';
import DeliverablesAndMilestones from '../components/steps/DeliverablesAndMilestones';
import RolesResponsibilities from '../components/steps/RolesResponsibilities';
import ReviewGenerate from '../components/steps/ReviewGenerate';

const STEP_COMPONENTS: Record<number, React.ComponentType> = {
  1: ProjectInformation,
  2: ProjectParties,
  3: InformationRequirements,
  4: LevelOfInformationNeed,
  5: CDEInformationManagement,
  6: StandardsMethods,
  7: SoftwareIT,
  8: DeliverablesAndMilestones,
  9: RolesResponsibilities,
  10: ReviewGenerate,
};

export default function BepGenerator() {
  const { bep } = useBep();
  const StepComponent = STEP_COMPONENTS[bep.currentStep] || ProjectInformation;

  return (
    <div className="flex flex-col h-screen">
      {/* Wizard Navigation */}
      <WizardNav />

      {/* Current Step */}
      <div className="flex-1 overflow-hidden">
        <StepComponent />
      </div>
    </div>
  );
}
