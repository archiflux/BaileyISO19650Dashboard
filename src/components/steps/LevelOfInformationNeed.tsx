import { useState } from 'react';
import { Plus, Trash2, Layers, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useBep } from '../../context/BepContext';
import FormField, { inputClass, selectClass, textareaClass } from '../ui/FormField';
import StepWrapper from '../wizard/StepWrapper';
import {
  GEOMETRY_LEVELS,
  INFORMATION_LEVELS,
  DOCUMENTATION_LEVELS,
  DEFAULT_ELEMENT_TYPES,
} from '../../data/defaults';
import type { ElementLOIN, GeometricalDetail, AlphanumericDetail, DocumentationDetail } from '../../types/bep';

function createDefaultElement(elementType: string): ElementLOIN {
  return {
    id: crypto.randomUUID(),
    elementType,
    purpose: '',
    geometricalInformation: {
      level: '',
      description: '',
      dimensionality: '3D',
      appearance: false,
      parametric: false,
    },
    alphanumericInformation: {
      level: '',
      description: '',
      properties: [],
      classification: 'Uniclass 2015',
    },
    documentation: {
      level: '',
      description: '',
      requiredDocuments: [],
    },
  };
}

function LevelDefinitionCard({
  title,
  levels,
}: {
  title: string;
  levels: { value: string; label: string; description: string; typical?: string; example?: string; properties?: string[] }[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-bailey-blue" />
          <span className="text-sm font-medium text-gray-700">
            {title} — Quick Reference Guide
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200 pt-3">
          <div className="space-y-3">
            {levels.map((level) => (
              <div key={level.value} className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-bailey-navy">{level.label}</span>
                  {level.typical && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      Typical: {level.typical}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{level.description}</p>
                {level.example && (
                  <p className="text-xs text-gray-500 mt-1 italic">Example: {level.example}</p>
                )}
                {level.properties && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {level.properties.map((prop) => (
                      <span
                        key={prop}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                      >
                        {prop}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ElementEditor({
  element,
  onUpdate,
  onRemove,
}: {
  element: ElementLOIN;
  onUpdate: (data: Partial<ElementLOIN>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(true);

  const updateGeo = (data: Partial<GeometricalDetail>) => {
    onUpdate({
      geometricalInformation: { ...element.geometricalInformation, ...data },
    });
  };

  const updateAlpha = (data: Partial<AlphanumericDetail>) => {
    onUpdate({
      alphanumericInformation: { ...element.alphanumericInformation, ...data },
    });
  };

  const updateDoc = (data: Partial<DocumentationDetail>) => {
    onUpdate({
      documentation: { ...element.documentation, ...data },
    });
  };

  const selectedGeo = GEOMETRY_LEVELS.find(
    (g) => g.value === element.geometricalInformation.level
  );
  const selectedAlpha = INFORMATION_LEVELS.find(
    (i) => i.value === element.alphanumericInformation.level
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-4">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-3 text-left flex-1"
        >
          <div className="w-8 h-8 bg-bailey-light rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-bailey-blue" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{element.elementType}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              {element.geometricalInformation.level && (
                <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">
                  Geometry: {selectedGeo?.label}
                </span>
              )}
              {element.alphanumericInformation.level && (
                <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">
                  Information: {selectedAlpha?.label}
                </span>
              )}
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400 ml-auto" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
          )}
        </button>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors ml-3"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          <FormField
            label="Purpose"
            tooltip={{
              title: 'Purpose of Information',
              content:
                'Why is this information needed? The purpose drives the level of detail required. BS EN 17412-1 requires that every information requirement has a defined purpose.',
              isoReference: 'BS EN 17412-1, Clause 5',
            }}
          >
            <textarea
              className={textareaClass}
              value={element.purpose}
              onChange={(e) => onUpdate({ purpose: e.target.value })}
              placeholder="Why is this information needed? e.g., For spatial coordination, cost estimation, regulatory compliance..."
              rows={2}
            />
          </FormField>

          {/* Geometrical Information */}
          <div className="bg-purple-50/50 rounded-lg p-4 mb-4 border border-purple-100">
            <h5 className="text-sm font-semibold text-purple-900 mb-3">
              Geometrical Information (Level of Detail)
            </h5>
            <p className="text-xs text-purple-700 mb-3">
              How detailed does the 3D geometry need to be? This defines the visual and spatial
              accuracy of the model element.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FormField label="Geometry Level">
                <select
                  className={selectClass}
                  value={element.geometricalInformation.level}
                  onChange={(e) => updateGeo({ level: e.target.value as GeometricalDetail['level'] })}
                >
                  <option value="">Select level...</option>
                  {GEOMETRY_LEVELS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label} — {g.description.substring(0, 60)}...
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Dimensionality">
                <select
                  className={selectClass}
                  value={element.geometricalInformation.dimensionality}
                  onChange={(e) =>
                    updateGeo({ dimensionality: e.target.value as '2D' | '3D' | 'both' })
                  }
                >
                  <option value="2D">2D Only</option>
                  <option value="3D">3D Only</option>
                  <option value="both">Both 2D and 3D</option>
                </select>
              </FormField>
            </div>

            {selectedGeo && (
              <div className="bg-white rounded-lg p-3 mt-2 border border-purple-100">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">{selectedGeo.label}:</span>{' '}
                  {selectedGeo.description}
                </p>
                {selectedGeo.example && (
                  <p className="text-xs text-gray-500 mt-1 italic">
                    Example: {selectedGeo.example}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-6 mt-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={element.geometricalInformation.appearance}
                  onChange={(e) => updateGeo({ appearance: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">Appearance (materials/textures) required</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={element.geometricalInformation.parametric}
                  onChange={(e) => updateGeo({ parametric: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-xs text-gray-700">Parametric behaviour required</span>
              </label>
            </div>
          </div>

          {/* Alphanumeric Information */}
          <div className="bg-green-50/50 rounded-lg p-4 mb-4 border border-green-100">
            <h5 className="text-sm font-semibold text-green-900 mb-3">
              Alphanumeric Information (Level of Information)
            </h5>
            <p className="text-xs text-green-700 mb-3">
              What data properties and attributes need to be attached to this element? This defines
              the non-graphical information.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <FormField label="Information Level">
                <select
                  className={selectClass}
                  value={element.alphanumericInformation.level}
                  onChange={(e) =>
                    updateAlpha({ level: e.target.value as AlphanumericDetail['level'] })
                  }
                >
                  <option value="">Select level...</option>
                  {INFORMATION_LEVELS.map((i) => (
                    <option key={i.value} value={i.value}>
                      {i.label} — {i.description.substring(0, 60)}...
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Classification System">
                <input
                  type="text"
                  className={inputClass}
                  value={element.alphanumericInformation.classification}
                  onChange={(e) => updateAlpha({ classification: e.target.value })}
                  placeholder="e.g., Uniclass 2015"
                />
              </FormField>
            </div>

            {selectedAlpha && (
              <div className="bg-white rounded-lg p-3 mt-2 border border-green-100">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">{selectedAlpha.label}:</span>{' '}
                  {selectedAlpha.description}
                </p>
                {selectedAlpha.properties && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedAlpha.properties.map((prop) => (
                      <span
                        key={prop}
                        className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded"
                      >
                        {prop}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <FormField label="Additional Properties Required" className="mt-3">
              <textarea
                className={textareaClass}
                value={element.alphanumericInformation.description}
                onChange={(e) => updateAlpha({ description: e.target.value })}
                placeholder="List any specific properties beyond the standard level, e.g., COBie attributes, bespoke client requirements..."
                rows={2}
              />
            </FormField>
          </div>

          {/* Documentation */}
          <div className="bg-amber-50/50 rounded-lg p-4 border border-amber-100">
            <h5 className="text-sm font-semibold text-amber-900 mb-3">Documentation</h5>
            <p className="text-xs text-amber-700 mb-3">
              What documents need to accompany this element? This covers data sheets, manuals, certificates, etc.
            </p>

            <FormField label="Documentation Level">
              <select
                className={selectClass}
                value={element.documentation.level}
                onChange={(e) =>
                  updateDoc({ level: e.target.value as DocumentationDetail['level'] })
                }
              >
                <option value="">Select level...</option>
                {DOCUMENTATION_LEVELS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label} — {d.description.substring(0, 60)}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Specific Documents Required">
              <textarea
                className={textareaClass}
                value={element.documentation.description}
                onChange={(e) => updateDoc({ description: e.target.value })}
                placeholder="List any specific documents required, e.g., fire test certificates, acoustic test data, product data sheets..."
                rows={2}
              />
            </FormField>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LevelOfInformationNeed() {
  const { bep, dispatch } = useBep();
  const elements = bep.levelOfInformationNeed.elements;
  const [showAddMenu, setShowAddMenu] = useState(false);

  const addElement = (elementType: string) => {
    dispatch({
      type: 'ADD_LOIN_ELEMENT',
      payload: createDefaultElement(elementType),
    });
    setShowAddMenu(false);
  };

  const addAllDefaults = () => {
    DEFAULT_ELEMENT_TYPES.forEach((et) => {
      dispatch({
        type: 'ADD_LOIN_ELEMENT',
        payload: createDefaultElement(et),
      });
    });
    setShowAddMenu(false);
  };

  return (
    <StepWrapper>
      <div className="max-w-4xl">
        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            Level of Information Need (BS EN 17412-1)
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            For each building element, define three aspects of information need:
          </p>
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="bg-purple-100 rounded-lg p-2.5">
              <p className="text-xs font-semibold text-purple-900">Geometrical Information</p>
              <p className="text-xs text-purple-700 mt-0.5">
                How detailed the 3D shape needs to be (the "Level of Detail")
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-2.5">
              <p className="text-xs font-semibold text-green-900">Alphanumeric Information</p>
              <p className="text-xs text-green-700 mt-0.5">
                What data properties are needed (the "Level of Information")
              </p>
            </div>
            <div className="bg-amber-100 rounded-lg p-2.5">
              <p className="text-xs font-semibold text-amber-900">Documentation</p>
              <p className="text-xs text-amber-700 mt-0.5">
                What documents must accompany the element
              </p>
            </div>
          </div>
        </div>

        {/* Reference Guides */}
        <LevelDefinitionCard title="Geometrical Detail Levels" levels={GEOMETRY_LEVELS} />
        <LevelDefinitionCard title="Alphanumeric Information Levels" levels={INFORMATION_LEVELS} />

        {/* Elements */}
        {elements.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-4">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No elements defined yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Add building elements and define the level of information needed for each at the
              current project stage.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={addAllDefaults}
                className="inline-flex items-center gap-2 px-4 py-2 bg-bailey-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add All Standard Elements
              </button>
              <button
                onClick={() => setShowAddMenu(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
              >
                Add Individual Element
              </button>
            </div>
          </div>
        ) : (
          <>
            {elements.map((element) => (
              <ElementEditor
                key={element.id}
                element={element}
                onUpdate={(data) =>
                  dispatch({
                    type: 'UPDATE_LOIN_ELEMENT',
                    payload: { id: element.id, data },
                  })
                }
                onRemove={() =>
                  dispatch({ type: 'REMOVE_LOIN_ELEMENT', payload: element.id })
                }
              />
            ))}

            <div className="relative">
              <button
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-bailey-blue hover:text-bailey-blue transition-all w-full justify-center"
              >
                <Plus className="w-4 h-4" />
                Add Element
              </button>
            </div>
          </>
        )}

        {/* Add Menu */}
        {showAddMenu && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Add Element</h3>
                <button
                  onClick={() => setShowAddMenu(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-xl">&times;</span>
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-3">
                  Select an element type or add a custom one:
                </p>
                <div className="mb-4">
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Type a custom element name and press Enter..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          addElement(target.value.trim());
                        }
                      }
                    }}
                  />
                </div>
                <div className="space-y-1">
                  {DEFAULT_ELEMENT_TYPES.filter(
                    (et) => !elements.some((e) => e.elementType === et)
                  ).map((et) => (
                    <button
                      key={et}
                      onClick={() => addElement(et)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-bailey-blue rounded-lg transition-all"
                    >
                      {et}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}
