import { useBep } from '../../context/BepContext';
import FormField, { inputClass, selectClass, textareaClass } from '../ui/FormField';
import StepWrapper from '../wizard/StepWrapper';

const CLASSIFICATION_SYSTEMS = [
  { value: '', label: 'Select classification system...' },
  { value: 'uniclass-2015', label: 'Uniclass 2015 (UK standard)' },
  { value: 'omniclass', label: 'OmniClass (US/International)' },
  { value: 'masterformat', label: 'MasterFormat (US)' },
  { value: 'uniformat', label: 'UniFormat (US)' },
  { value: 'nrm', label: 'NRM (New Rules of Measurement - UK)' },
  { value: 'other', label: 'Other' },
];

const COMMON_MODELLING_STANDARDS = [
  'BS 8541 series (Library objects for architecture, engineering and construction)',
  'BS 1192:2007+A2:2016 (Collaborative production of architectural, engineering and construction information)',
  'PAS 1192-2:2013 (Specification for information management for the capital/delivery phase)',
  'ISO 19650-2:2018 (Information management using BIM - Delivery phase)',
  'Employer/Client-specific BIM standards',
  'NBS BIM Object Standard',
];

const COMMON_DRAWING_STANDARDS = [
  'BS 1192:2007+A2:2016',
  'BS EN ISO 7519 (Technical drawings)',
  'BS 8888:2020 (Technical product documentation)',
  'BS EN ISO 5457 (Drawing sizes)',
  'AEC (UK) CAD Standard',
  'NBS Annotations',
];

export default function StandardsMethods() {
  const { bep, dispatch } = useBep();
  const standards = bep.standardsMethods;

  const updateStandards = (field: string, value: unknown) => {
    dispatch({ type: 'UPDATE_STANDARDS', payload: { [field]: value } });
  };

  const updateCoords = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_COORDINATE_SYSTEM', payload: { [field]: value } });
  };

  const toggleStandard = (list: string[], item: string, field: string) => {
    const updated = list.includes(item)
      ? list.filter((s) => s !== item)
      : [...list, item];
    updateStandards(field, updated);
  };

  return (
    <StepWrapper>
      <div className="max-w-4xl">
        {/* Modelling Standards */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Modelling Standards</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select or specify the modelling standards that apply to this project.
          </p>

          <div className="space-y-2 mb-4">
            {COMMON_MODELLING_STANDARDS.map((std) => (
              <label key={std} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={standards.modellingStandards.includes(std)}
                  onChange={() =>
                    toggleStandard(standards.modellingStandards, std, 'modellingStandards')
                  }
                  className="rounded border-gray-300 text-bailey-blue focus:ring-bailey-blue mt-0.5"
                />
                <span className="text-sm text-gray-700">{std}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Drawing Standards */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Drawing Standards</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select the drawing standards and conventions for 2D output.
          </p>

          <div className="space-y-2 mb-4">
            {COMMON_DRAWING_STANDARDS.map((std) => (
              <label key={std} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={standards.drawingStandards.includes(std)}
                  onChange={() =>
                    toggleStandard(standards.drawingStandards, std, 'drawingStandards')
                  }
                  className="rounded border-gray-300 text-bailey-blue focus:ring-bailey-blue mt-0.5"
                />
                <span className="text-sm text-gray-700">{std}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Classification System */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Classification System</h3>

          <FormField
            label="Classification System"
            required
            tooltip={{
              title: 'Classification System',
              content:
                'The classification system used to categorise all building elements. Uniclass 2015 is the standard for UK projects and is required by ISO 19650.',
              isoReference: 'ISO 19650-2, Clause 5.1.4',
            }}
          >
            <select
              className={selectClass}
              value={standards.classificationSystem}
              onChange={(e) => updateStandards('classificationSystem', e.target.value)}
            >
              {CLASSIFICATION_SYSTEMS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Coordinate System */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Coordinate System & Survey Strategy
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Define the shared coordinate system to ensure all models align correctly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormField
              label="Project Base Point"
              tooltip={{
                title: 'Project Base Point',
                content:
                  'A defined point in the model that acts as the origin for the project coordinate system. All models should share the same base point for federation.',
              }}
            >
              <input
                type="text"
                className={inputClass}
                value={standards.coordinateSystem.projectBasePoint}
                onChange={(e) => updateCoords('projectBasePoint', e.target.value)}
                placeholder="e.g., South-west corner of site, ground level"
              />
            </FormField>

            <FormField label="Survey Point / OS Grid Reference">
              <input
                type="text"
                className={inputClass}
                value={standards.coordinateSystem.surveyPoint}
                onChange={(e) => updateCoords('surveyPoint', e.target.value)}
                placeholder="e.g., E 383456.789, N 398765.432"
              />
            </FormField>

            <FormField label="Datum Level">
              <input
                type="text"
                className={inputClass}
                value={standards.coordinateSystem.datum}
                onChange={(e) => updateCoords('datum', e.target.value)}
                placeholder="e.g., AOD (Above Ordnance Datum) = 45.500m"
              />
            </FormField>

            <FormField label="Grid Reference System">
              <input
                type="text"
                className={inputClass}
                value={standards.coordinateSystem.gridReference}
                onChange={(e) => updateCoords('gridReference', e.target.value)}
                placeholder="e.g., OSGB36 / British National Grid"
              />
            </FormField>

            <FormField label="True North Orientation">
              <input
                type="text"
                className={inputClass}
                value={standards.coordinateSystem.trueNorth}
                onChange={(e) => updateCoords('trueNorth', e.target.value)}
                placeholder="e.g., 5.2\u00b0 west of Project North"
              />
            </FormField>

            <FormField label="Measurement Units">
              <select
                className={selectClass}
                value={standards.measurementUnits}
                onChange={(e) => updateStandards('measurementUnits', e.target.value)}
              >
                <option value="Metric (mm)">Metric (millimetres)</option>
                <option value="Metric (m)">Metric (metres)</option>
                <option value="Imperial (ft-in)">Imperial (feet-inches)</option>
              </select>
            </FormField>
          </div>
        </div>

        {/* Quality Assurance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Assurance</h3>

          <FormField
            label="Clash Detection Process"
            tooltip={{
              title: 'Clash Detection',
              content:
                'The process for identifying and resolving spatial clashes between different discipline models. This should define the frequency, tolerance levels, and resolution workflow.',
            }}
          >
            <textarea
              className={textareaClass}
              value={standards.clashDetectionProcess}
              onChange={(e) => updateStandards('clashDetectionProcess', e.target.value)}
              placeholder="Describe the clash detection process: frequency, software, tolerance levels, resolution workflow..."
              rows={3}
            />
          </FormField>

          <FormField label="Quality Assurance Procedures">
            <textarea
              className={textareaClass}
              value={standards.qualityAssurance}
              onChange={(e) => updateStandards('qualityAssurance', e.target.value)}
              placeholder="Describe QA procedures: model audit checklists, compliance checking, review gates..."
              rows={3}
            />
          </FormField>

          <FormField label="Tolerances">
            <input
              type="text"
              className={inputClass}
              value={standards.tolerances}
              onChange={(e) => updateStandards('tolerances', e.target.value)}
              placeholder="e.g., Structural: \u00b115mm, Architectural: \u00b15mm, MEP: \u00b125mm"
            />
          </FormField>
        </div>
      </div>
    </StepWrapper>
  );
}
