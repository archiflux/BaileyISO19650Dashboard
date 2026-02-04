import { useBep } from '../../context/BepContext';
import FormField, { inputClass, selectClass, textareaClass } from '../ui/FormField';
import StepWrapper from '../wizard/StepWrapper';

const PROJECT_TYPES = [
  { value: '', label: 'Select project type...' },
  { value: 'new-build', label: 'New Build' },
  { value: 'refurbishment', label: 'Refurbishment' },
  { value: 'extension', label: 'Extension' },
  { value: 'fit-out', label: 'Fit-Out' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'mixed-use', label: 'Mixed Use' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
];

const PROCUREMENT_ROUTES = [
  { value: '', label: 'Select procurement route...' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'design-and-build', label: 'Design & Build' },
  { value: 'construction-management', label: 'Construction Management' },
  { value: 'management-contracting', label: 'Management Contracting' },
  { value: 'pfi-ppp', label: 'PFI / PPP' },
  { value: 'framework', label: 'Framework Agreement' },
  { value: 'two-stage', label: 'Two-Stage Tender' },
];

const PROJECT_STAGES = [
  { value: '', label: 'Select RIBA stage...' },
  { value: '0-strategic-definition', label: 'Stage 0 - Strategic Definition' },
  { value: '1-preparation-and-briefing', label: 'Stage 1 - Preparation & Briefing' },
  { value: '2-concept-design', label: 'Stage 2 - Concept Design' },
  { value: '3-spatial-coordination', label: 'Stage 3 - Spatial Coordination' },
  { value: '4-technical-design', label: 'Stage 4 - Technical Design' },
  { value: '5-manufacturing-and-construction', label: 'Stage 5 - Manufacturing & Construction' },
  { value: '6-handover', label: 'Stage 6 - Handover' },
  { value: '7-use', label: 'Stage 7 - Use' },
];

export default function ProjectInformation() {
  const { bep, dispatch } = useBep();
  const info = bep.projectInformation;

  const update = (field: string, value: string) => {
    dispatch({
      type: 'UPDATE_PROJECT_INFO',
      payload: { [field]: value },
    });
  };

  return (
    <StepWrapper>
      <div className="max-w-4xl">
        {/* Pre-populated notice */}
        {info.projectName && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Pre-populated:</span> This information has been
              loaded from the selected project. Review and update as needed.
            </p>
          </div>
        )}

        {/* Project Details Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormField
              label="Project Name"
              required
              tooltip={{
                title: 'Project Name',
                content: 'The full name of the project as it will appear in all information containers and documentation.',
              }}
            >
              <input
                type="text"
                className={inputClass}
                value={info.projectName}
                onChange={(e) => update('projectName', e.target.value)}
                placeholder="e.g., Manchester Residential Tower"
              />
            </FormField>

            <FormField
              label="Project Number"
              required
              tooltip={{
                title: 'Project Number',
                content: 'The unique project identifier used within the naming convention for all information containers.',
                isoReference: 'ISO 19650-2, Clause 5.1.2',
              }}
            >
              <input
                type="text"
                className={inputClass}
                value={info.projectNumber}
                onChange={(e) => update('projectNumber', e.target.value)}
                placeholder="e.g., BP-2025-001"
              />
            </FormField>

            <FormField label="Project Type" required>
              <select
                className={selectClass}
                value={info.projectType}
                onChange={(e) => update('projectType', e.target.value)}
              >
                {PROJECT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Project Value">
              <input
                type="text"
                className={inputClass}
                value={info.projectValue}
                onChange={(e) => update('projectValue', e.target.value)}
                placeholder="e.g., \u00a345,000,000"
              />
            </FormField>

            <FormField label="Procurement Route" required>
              <select
                className={selectClass}
                value={info.procurementRoute}
                onChange={(e) => update('procurementRoute', e.target.value)}
              >
                {PROCUREMENT_ROUTES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField
              label="Current RIBA Stage"
              required
              tooltip={{
                title: 'RIBA Plan of Work Stage',
                content:
                  'The current stage of the project aligned to the RIBA Plan of Work 2020. This determines the expected level of information need for deliverables.',
                isoReference: 'Aligned with ISO 19650-2 information delivery cycle',
              }}
            >
              <select
                className={selectClass}
                value={info.projectStage}
                onChange={(e) => update('projectStage', e.target.value)}
              >
                {PROJECT_STAGES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Start Date">
              <input
                type="date"
                className={inputClass}
                value={info.startDate}
                onChange={(e) => update('startDate', e.target.value)}
              />
            </FormField>

            <FormField label="Expected Completion">
              <input
                type="date"
                className={inputClass}
                value={info.completionDate}
                onChange={(e) => update('completionDate', e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Project Address" className="mt-2">
            <input
              type="text"
              className={inputClass}
              value={info.projectAddress}
              onChange={(e) => update('projectAddress', e.target.value)}
              placeholder="Full site address"
            />
          </FormField>

          <FormField label="Project Description">
            <textarea
              className={textareaClass}
              value={info.projectDescription}
              onChange={(e) => update('projectDescription', e.target.value)}
              placeholder="Brief description of the project scope, key features, and objectives..."
              rows={3}
            />
          </FormField>
        </div>

        {/* Client Information Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Client / Appointing Party Information
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            The appointing party is the organisation commissioning the project and defining the
            information requirements (EIR).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormField
              label="Client Organisation"
              required
              tooltip={{
                title: 'Appointing Party',
                content:
                  'The organisation that appoints others to carry out work and deliver information. They are responsible for establishing the Exchange Information Requirements (EIR).',
                isoReference: 'ISO 19650-1, Clause 3.2.1',
              }}
            >
              <input
                type="text"
                className={inputClass}
                value={info.clientOrganisation}
                onChange={(e) => update('clientOrganisation', e.target.value)}
                placeholder="Organisation name"
              />
            </FormField>

            <FormField label="Client Name">
              <input
                type="text"
                className={inputClass}
                value={info.clientName}
                onChange={(e) => update('clientName', e.target.value)}
                placeholder="Client name"
              />
            </FormField>

            <FormField label="Primary Contact">
              <input
                type="text"
                className={inputClass}
                value={info.clientContact}
                onChange={(e) => update('clientContact', e.target.value)}
                placeholder="Contact name"
              />
            </FormField>

            <FormField label="Contact Email">
              <input
                type="email"
                className={inputClass}
                value={info.clientEmail}
                onChange={(e) => update('clientEmail', e.target.value)}
                placeholder="email@example.com"
              />
            </FormField>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
