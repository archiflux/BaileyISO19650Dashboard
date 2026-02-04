import { Plus, Trash2, Monitor } from 'lucide-react';
import { useBep } from '../../context/BepContext';
import FormField, { textareaClass } from '../ui/FormField';
import StepWrapper from '../wizard/StepWrapper';
import type { SoftwareItem, FileFormat } from '../../types/bep';

const COMMON_AUTHORING = [
  { name: 'Autodesk Revit', vendor: 'Autodesk', purpose: '3D BIM Authoring' },
  { name: 'Archicad', vendor: 'Graphisoft', purpose: '3D BIM Authoring' },
  { name: 'Tekla Structures', vendor: 'Trimble', purpose: 'Structural BIM' },
  { name: 'AutoCAD', vendor: 'Autodesk', purpose: '2D Drafting & Detail' },
  { name: 'MicroStation', vendor: 'Bentley', purpose: '2D/3D Design' },
  { name: 'Vectorworks', vendor: 'Nemetschek', purpose: '3D BIM Authoring' },
  { name: 'Autodesk Civil 3D', vendor: 'Autodesk', purpose: 'Civil Engineering' },
  { name: 'MagiCAD', vendor: 'MagiCAD Group', purpose: 'MEP Design' },
  { name: 'Trimble Nova / DDS-CAD', vendor: 'Trimble', purpose: 'MEP Design' },
];

const COMMON_COORDINATION = [
  { name: 'Autodesk Navisworks', vendor: 'Autodesk', purpose: 'Model Coordination & Clash Detection' },
  { name: 'Solibri Model Checker', vendor: 'Nemetschek', purpose: 'Model Checking & Validation' },
  { name: 'BIM Collab', vendor: 'BIM Collab', purpose: 'Issue Management (BCF)' },
  { name: 'Trimble Connect', vendor: 'Trimble', purpose: 'Model Coordination' },
  { name: 'Autodesk BIM Collaborate Pro', vendor: 'Autodesk', purpose: 'Cloud Coordination' },
  { name: 'Dalux BIM Viewer', vendor: 'Dalux', purpose: 'Site BIM Viewing' },
];

const COMMON_FORMATS: FileFormat[] = [
  { format: 'IFC', purpose: 'Open BIM exchange format', version: 'IFC 4.0 / IFC 2x3' },
  { format: 'RVT', purpose: 'Revit native format', version: '2024/2025' },
  { format: 'DWG', purpose: '2D drawing exchange', version: '2018 format' },
  { format: 'NWD/NWC', purpose: 'Navisworks coordination', version: '2024' },
  { format: 'PDF', purpose: 'Document exchange', version: 'PDF/A' },
  { format: 'COBie', purpose: 'Asset data exchange', version: 'UK 2012' },
  { format: 'BCF', purpose: 'Issue/clash communication', version: 'BCF 2.1' },
  { format: 'DXF', purpose: '2D geometry exchange', version: '' },
  { format: 'gbXML', purpose: 'Energy analysis', version: '' },
  { format: 'Point Cloud (E57/RCP)', purpose: 'Survey data', version: '' },
];

function createSoftwareItem(
  name: string,
  vendor: string,
  purpose: string,
  discipline: string = ''
): SoftwareItem {
  return {
    id: crypto.randomUUID(),
    name,
    version: '',
    vendor,
    purpose,
    discipline,
  };
}

export default function SoftwareIT() {
  const { bep, dispatch } = useBep();
  const software = bep.softwareIT;

  const addAuthoring = (name: string, vendor: string, purpose: string) => {
    dispatch({
      type: 'ADD_AUTHORING_SOFTWARE',
      payload: createSoftwareItem(name, vendor, purpose),
    });
  };

  const addCoordination = (name: string, vendor: string, purpose: string) => {
    dispatch({
      type: 'ADD_COORDINATION_SOFTWARE',
      payload: createSoftwareItem(name, vendor, purpose),
    });
  };

  const toggleFormat = (format: FileFormat) => {
    const exists = software.fileFormats.some((f) => f.format === format.format);
    if (exists) {
      dispatch({
        type: 'SET_FILE_FORMATS',
        payload: software.fileFormats.filter((f) => f.format !== format.format),
      });
    } else {
      dispatch({ type: 'ADD_FILE_FORMAT', payload: format });
    }
  };

  return (
    <StepWrapper>
      <div className="max-w-4xl">
        {/* Authoring Software */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Authoring Software</h3>
          <p className="text-sm text-gray-500 mb-4">
            Define the BIM authoring software used by each discipline on the project.
          </p>

          {software.authoringSoftware.length > 0 && (
            <div className="space-y-3 mb-4">
              {software.authoringSoftware.map((sw) => (
                <div
                  key={sw.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-bailey-blue" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sw.name}</p>
                      <p className="text-xs text-gray-500">
                        {sw.vendor} &middot; {sw.purpose}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                      placeholder="Version"
                      value={sw.version}
                      onChange={(e) => {
                        const updated = software.authoringSoftware.map((s) =>
                          s.id === sw.id ? { ...s, version: e.target.value } : s
                        );
                        dispatch({ type: 'UPDATE_SOFTWARE_IT', payload: { authoringSoftware: updated } });
                      }}
                    />
                    <input
                      type="text"
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                      placeholder="Discipline"
                      value={sw.discipline}
                      onChange={(e) => {
                        const updated = software.authoringSoftware.map((s) =>
                          s.id === sw.id ? { ...s, discipline: e.target.value } : s
                        );
                        dispatch({ type: 'UPDATE_SOFTWARE_IT', payload: { authoringSoftware: updated } });
                      }}
                    />
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_AUTHORING_SOFTWARE', payload: sw.id })}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 mb-2">Quick add common software:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_AUTHORING.filter(
              (ca) => !software.authoringSoftware.some((s) => s.name === ca.name)
            ).map((ca) => (
              <button
                key={ca.name}
                onClick={() => addAuthoring(ca.name, ca.vendor, ca.purpose)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-blue-50 hover:text-bailey-blue transition-all"
              >
                <Plus className="w-3 h-3" />
                {ca.name}
              </button>
            ))}
          </div>
        </div>

        {/* Coordination Software */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Coordination Software</h3>
          <p className="text-sm text-gray-500 mb-4">
            Software used for model federation, clash detection, and issue tracking.
          </p>

          {software.coordinationSoftware.length > 0 && (
            <div className="space-y-3 mb-4">
              {software.coordinationSoftware.map((sw) => (
                <div
                  key={sw.id}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{sw.name}</p>
                      <p className="text-xs text-gray-500">
                        {sw.vendor} &middot; {sw.purpose}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                      placeholder="Version"
                      value={sw.version}
                      onChange={(e) => {
                        const updated = software.coordinationSoftware.map((s) =>
                          s.id === sw.id ? { ...s, version: e.target.value } : s
                        );
                        dispatch({ type: 'UPDATE_SOFTWARE_IT', payload: { coordinationSoftware: updated } });
                      }}
                    />
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_COORDINATION_SOFTWARE', payload: sw.id })}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-500 mb-2">Quick add common software:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_COORDINATION.filter(
              (cc) => !software.coordinationSoftware.some((s) => s.name === cc.name)
            ).map((cc) => (
              <button
                key={cc.name}
                onClick={() => addCoordination(cc.name, cc.vendor, cc.purpose)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs hover:bg-blue-50 hover:text-bailey-blue transition-all"
              >
                <Plus className="w-3 h-3" />
                {cc.name}
              </button>
            ))}
          </div>
        </div>

        {/* File Formats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">File Formats</h3>
          <p className="text-sm text-gray-500 mb-4">
            Define the accepted file formats for information exchange on this project.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {COMMON_FORMATS.map((fmt) => {
              const isSelected = software.fileFormats.some((f) => f.format === fmt.format);
              return (
                <label
                  key={fmt.format}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-bailey-blue'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFormat(fmt)}
                    className="rounded border-gray-300 text-bailey-blue focus:ring-bailey-blue mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {fmt.format}
                      {fmt.version && (
                        <span className="text-xs text-gray-500 ml-1">({fmt.version})</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{fmt.purpose}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Interoperability */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interoperability</h3>

          <FormField
            label="Interoperability Approach"
            tooltip={{
              title: 'Interoperability',
              content:
                'The strategy for ensuring different software tools can exchange information effectively. IFC (Industry Foundation Classes) is the primary open standard for BIM data exchange.',
              isoReference: 'ISO 19650-2, Clause 5.1.4',
            }}
          >
            <textarea
              className={textareaClass}
              value={software.interoperabilityApproach}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_SOFTWARE_IT',
                  payload: { interoperabilityApproach: e.target.value },
                })
              }
              placeholder="Describe how interoperability will be managed between different software platforms, e.g., IFC exchange strategy, model federation approach..."
              rows={3}
            />
          </FormField>

          <FormField label="Hardware Requirements">
            <textarea
              className={textareaClass}
              value={software.hardwareRequirements}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_SOFTWARE_IT',
                  payload: { hardwareRequirements: e.target.value },
                })
              }
              placeholder="Minimum hardware specifications if applicable..."
              rows={2}
            />
          </FormField>
        </div>
      </div>
    </StepWrapper>
  );
}
