import { useBep } from '../../context/BepContext';
import FormField, { inputClass, selectClass, textareaClass } from '../ui/FormField';
import StepWrapper from '../wizard/StepWrapper';

const CDE_PLATFORMS = [
  'Autodesk Construction Cloud (ACC)',
  'Autodesk BIM 360',
  'Bentley ProjectWise',
  'Trimble Connect',
  'Aconex (Oracle)',
  'Viewpoint For Projects',
  'BIM Track',
  'Dalux',
  'SharePoint / Microsoft 365',
  'Asite',
  'Other',
];

export default function CDEInformationManagement() {
  const { bep, dispatch } = useBep();
  const cde = bep.cdeConfiguration;

  const updateCDE = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_CDE', payload: { [field]: value } });
  };

  const updateNaming = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_NAMING_CONVENTION', payload: { [field]: value } });
  };

  return (
    <StepWrapper>
      <div className="max-w-4xl">
        {/* CDE Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            Common Data Environment (CDE)
          </h4>
          <p className="text-sm text-blue-800 mb-3">
            The CDE is the single source of information for the project. ISO 19650 defines four
            states that information moves through:
          </p>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1.5 rounded-lg">
              Work in Progress
            </span>
            <span className="text-blue-400">&rarr;</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-lg">
              Shared
            </span>
            <span className="text-blue-400">&rarr;</span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-lg">
              Published
            </span>
            <span className="text-blue-400">&rarr;</span>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg">
              Archive
            </span>
          </div>
        </div>

        {/* CDE Platform */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CDE Platform</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormField
              label="CDE Platform"
              required
              tooltip={{
                title: 'Common Data Environment',
                content:
                  'The agreed source of information for the project. All project information should be managed, shared, and published via the CDE.',
                isoReference: 'ISO 19650-1, Clause 12',
              }}
            >
              <select
                className={selectClass}
                value={cde.platform}
                onChange={(e) => updateCDE('platform', e.target.value)}
              >
                <option value="">Select CDE platform...</option>
                {CDE_PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Access Method">
              <input
                type="text"
                className={inputClass}
                value={cde.accessMethod}
                onChange={(e) => updateCDE('accessMethod', e.target.value)}
                placeholder="e.g., Web browser, Desktop client, API"
              />
            </FormField>
          </div>

          <FormField label="Folder Structure">
            <textarea
              className={textareaClass}
              value={cde.folderStructure}
              onChange={(e) => updateCDE('folderStructure', e.target.value)}
              placeholder="Describe the CDE folder structure, e.g., organised by discipline, zone, or work stage..."
              rows={3}
            />
          </FormField>

          <FormField label="Revision Strategy">
            <textarea
              className={textareaClass}
              value={cde.revisionStrategy}
              onChange={(e) => updateCDE('revisionStrategy', e.target.value)}
              placeholder="Describe how revisions are managed, e.g., P01, P02... for preliminary, C01, C02... for construction..."
              rows={2}
            />
          </FormField>
        </div>

        {/* Naming Convention */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Naming Convention</h3>
          <p className="text-sm text-gray-500 mb-4">
            The naming convention for information containers follows ISO 19650-2 guidance.
          </p>

          <FormField
            label="Standard"
            tooltip={{
              title: 'Naming Convention Standard',
              content:
                'The standard used for naming information containers. ISO 19650-2 Annex A provides guidance on the structure of container IDs.',
              isoReference: 'ISO 19650-2, Annex A',
            }}
          >
            <input
              type="text"
              className={inputClass}
              value={cde.namingConvention.standard}
              onChange={(e) => updateNaming('standard', e.target.value)}
            />
          </FormField>

          <FormField label="Field Separator">
            <select
              className={selectClass}
              value={cde.namingConvention.separator}
              onChange={(e) => updateNaming('separator', e.target.value)}
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
            </select>
          </FormField>

          {/* Naming Fields Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Field</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Description</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Max Length</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Example</th>
                </tr>
              </thead>
              <tbody>
                {cde.namingConvention.fields.map((field, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-3 py-2 font-medium text-gray-900">{field.name}</td>
                    <td className="px-3 py-2 text-gray-600">{field.description}</td>
                    <td className="px-3 py-2 text-gray-600">{field.maxLength}</td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-bailey-blue">
                        {field.example}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Example container name:</p>
            <code className="text-sm font-mono font-semibold text-bailey-navy">
              {cde.namingConvention.example}
            </code>
          </div>

          <FormField label="Update Example" className="mt-3">
            <input
              type="text"
              className={inputClass}
              value={cde.namingConvention.example}
              onChange={(e) => updateNaming('example', e.target.value)}
              placeholder="e.g., BP2501-BAI-ZZ-01-DR-A-0001"
            />
          </FormField>
        </div>

        {/* Suitability Codes */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Suitability Codes</h3>
          <p className="text-sm text-gray-500 mb-4">
            Suitability codes indicate the purpose for which information may be used. These are
            appended to information containers when shared.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Code</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Description</th>
                </tr>
              </thead>
              <tbody>
                {cde.suitabilityCodes.map((sc, index) => (
                  <tr key={index} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <code className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">
                        {sc.code}
                      </code>
                    </td>
                    <td className="px-3 py-2 text-gray-700">{sc.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
