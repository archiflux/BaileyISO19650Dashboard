import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useBep } from '../../context/BepContext';
import FormField, { inputClass, textareaClass } from '../ui/FormField';
import InfoTooltip from '../ui/InfoTooltip';
import StepWrapper from '../wizard/StepWrapper';

function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder,
}: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput('');
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
          >
            {tag}
            <button onClick={() => onRemove(i)} className="hover:text-red-500">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className={inputClass}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      <p className="text-xs text-gray-400 mt-1">Press Enter to add</p>
    </div>
  );
}

function CollapsibleSection({
  title,
  description,
  tooltip,
  children,
  defaultOpen = false,
}: {
  title: string;
  description: string;
  tooltip: { title: string; content: string; isoReference?: string };
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <InfoTooltip
            title={tooltip.title}
            content={tooltip.content}
            isoReference={tooltip.isoReference}
          />
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {!isOpen && (
        <p className="px-6 pb-4 text-sm text-gray-500 -mt-2">{description}</p>
      )}
      {isOpen && <div className="px-6 pb-6 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  );
}

export default function InformationRequirements() {
  const { bep, dispatch } = useBep();
  const { oir, air, pir, eir } = bep.informationRequirements;

  return (
    <StepWrapper>
      <div className="max-w-4xl">
        {/* Introduction */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            Information Requirements Hierarchy
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            ISO 19650 defines a hierarchy of information requirements that flow from organisational
            needs down to specific exchange requirements:
          </p>
          <div className="flex items-center gap-2 text-xs text-blue-700 font-medium">
            <span className="bg-blue-100 px-2 py-1 rounded">OIR</span>
            <span>\u2192</span>
            <span className="bg-blue-100 px-2 py-1 rounded">AIR / PIR</span>
            <span>\u2192</span>
            <span className="bg-blue-100 px-2 py-1 rounded">EIR</span>
          </div>
        </div>

        {/* OIR */}
        <CollapsibleSection
          title="Organisational Information Requirements (OIR)"
          description="High-level information needs of the appointing party's organisation"
          tooltip={{
            title: 'OIR - Organisational Information Requirements',
            content:
              'Information requirements related to or arising from the objectives of the appointing party\u2019s wider organisation. These inform both AIR and PIR.',
            isoReference: 'ISO 19650-1, Clause 5.2',
          }}
        >
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={oir.exists}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_OIR', payload: { exists: e.target.checked } })
                }
                className="rounded border-gray-300 text-bailey-blue focus:ring-bailey-blue"
              />
              <span className="text-sm text-gray-700">
                The appointing party has defined Organisational Information Requirements
              </span>
            </label>
          </div>

          {oir.exists && (
            <>
              <FormField label="OIR Description">
                <textarea
                  className={textareaClass}
                  value={oir.description}
                  onChange={(e) =>
                    dispatch({ type: 'UPDATE_OIR', payload: { description: e.target.value } })
                  }
                  placeholder="Describe the organisation's overarching information requirements..."
                  rows={3}
                />
              </FormField>

              <FormField label="Key Objectives">
                <TagInput
                  tags={oir.objectives}
                  onAdd={(tag) =>
                    dispatch({
                      type: 'UPDATE_OIR',
                      payload: { objectives: [...oir.objectives, tag] },
                    })
                  }
                  onRemove={(i) =>
                    dispatch({
                      type: 'UPDATE_OIR',
                      payload: { objectives: oir.objectives.filter((_, idx) => idx !== i) },
                    })
                  }
                  placeholder="Add an organisational objective..."
                />
              </FormField>
            </>
          )}
        </CollapsibleSection>

        {/* AIR */}
        <CollapsibleSection
          title="Asset Information Requirements (AIR)"
          description="Information needed for asset management and operations"
          tooltip={{
            title: 'AIR - Asset Information Requirements',
            content:
              'Information requirements in relation to the operation of an asset. The AIR defines what information is needed for the ongoing management and operation of the built asset.',
            isoReference: 'ISO 19650-1, Clause 5.3',
          }}
        >
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={air.exists}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_AIR', payload: { exists: e.target.checked } })
                }
                className="rounded border-gray-300 text-bailey-blue focus:ring-bailey-blue"
              />
              <span className="text-sm text-gray-700">
                Asset Information Requirements have been defined
              </span>
            </label>
          </div>

          {air.exists && (
            <>
              <FormField label="AIR Description">
                <textarea
                  className={textareaClass}
                  value={air.description}
                  onChange={(e) =>
                    dispatch({ type: 'UPDATE_AIR', payload: { description: e.target.value } })
                  }
                  placeholder="Describe the asset information requirements..."
                  rows={3}
                />
              </FormField>

              <FormField label="Asset Management System">
                <input
                  type="text"
                  className={inputClass}
                  value={air.assetManagementSystem}
                  onChange={(e) =>
                    dispatch({
                      type: 'UPDATE_AIR',
                      payload: { assetManagementSystem: e.target.value },
                    })
                  }
                  placeholder="e.g., CAFM system, Maximo, Planon..."
                />
              </FormField>

              <FormField label="Operational Requirements">
                <TagInput
                  tags={air.operationalRequirements}
                  onAdd={(tag) =>
                    dispatch({
                      type: 'UPDATE_AIR',
                      payload: {
                        operationalRequirements: [...air.operationalRequirements, tag],
                      },
                    })
                  }
                  onRemove={(i) =>
                    dispatch({
                      type: 'UPDATE_AIR',
                      payload: {
                        operationalRequirements: air.operationalRequirements.filter(
                          (_, idx) => idx !== i
                        ),
                      },
                    })
                  }
                  placeholder="Add an operational requirement..."
                />
              </FormField>
            </>
          )}
        </CollapsibleSection>

        {/* PIR */}
        <CollapsibleSection
          title="Project Information Requirements (PIR)"
          description="Information needed to support project decision-making"
          tooltip={{
            title: 'PIR - Project Information Requirements',
            content:
              'Information requirements in relation to the delivery of an asset. The PIR identifies what information is needed at key decision points throughout the project lifecycle.',
            isoReference: 'ISO 19650-1, Clause 5.3',
          }}
          defaultOpen
        >
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={pir.exists}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_PIR', payload: { exists: e.target.checked } })
                }
                className="rounded border-gray-300 text-bailey-blue focus:ring-bailey-blue"
              />
              <span className="text-sm text-gray-700">
                Project Information Requirements have been defined
              </span>
            </label>
          </div>

          {pir.exists && (
            <>
              <FormField label="PIR Description">
                <textarea
                  className={textareaClass}
                  value={pir.description}
                  onChange={(e) =>
                    dispatch({ type: 'UPDATE_PIR', payload: { description: e.target.value } })
                  }
                  placeholder="Describe the project information requirements..."
                  rows={3}
                />
              </FormField>

              <FormField label="Key Decision Points">
                <TagInput
                  tags={pir.decisionPoints}
                  onAdd={(tag) =>
                    dispatch({
                      type: 'UPDATE_PIR',
                      payload: { decisionPoints: [...pir.decisionPoints, tag] },
                    })
                  }
                  onRemove={(i) =>
                    dispatch({
                      type: 'UPDATE_PIR',
                      payload: {
                        decisionPoints: pir.decisionPoints.filter((_, idx) => idx !== i),
                      },
                    })
                  }
                  placeholder="e.g., Planning submission, Stage 3 sign-off..."
                />
              </FormField>

              <FormField label="Key Questions to be Answered">
                <TagInput
                  tags={pir.keyQuestions}
                  onAdd={(tag) =>
                    dispatch({
                      type: 'UPDATE_PIR',
                      payload: { keyQuestions: [...pir.keyQuestions, tag] },
                    })
                  }
                  onRemove={(i) =>
                    dispatch({
                      type: 'UPDATE_PIR',
                      payload: {
                        keyQuestions: pir.keyQuestions.filter((_, idx) => idx !== i),
                      },
                    })
                  }
                  placeholder="What questions should the information answer?"
                />
              </FormField>
            </>
          )}
        </CollapsibleSection>

        {/* EIR */}
        <CollapsibleSection
          title="Exchange Information Requirements (EIR)"
          description="Specific requirements for information exchanges between parties"
          tooltip={{
            title: 'EIR - Exchange Information Requirements',
            content:
              'The EIR specifies what, when, how, and for whom information is to be produced. It is a key document that forms part of the appointment and drives the BEP.',
            isoReference: 'ISO 19650-2, Clause 5.1',
          }}
          defaultOpen
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormField
              label="Information Standard"
              tooltip={{
                title: 'Information Standard',
                content: 'The standard or guidance used to define the information requirements, e.g., BS EN ISO 19650, PAS 1192, employer-specific standards.',
              }}
            >
              <input
                type="text"
                className={inputClass}
                value={eir.informationStandard}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_EIR',
                    payload: { informationStandard: e.target.value },
                  })
                }
                placeholder="e.g., BS EN ISO 19650-2:2018"
              />
            </FormField>

            <FormField label="Information Production Methods">
              <input
                type="text"
                className={inputClass}
                value={eir.informationProductionMethods}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_EIR',
                    payload: { informationProductionMethods: e.target.value },
                  })
                }
                placeholder="e.g., 3D BIM authoring with federated coordination"
              />
            </FormField>
          </div>

          <FormField label="Reference Information & Shared Resources">
            <textarea
              className={textareaClass}
              value={eir.referenceInformation}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_EIR',
                  payload: { referenceInformation: e.target.value },
                })
              }
              placeholder="Describe any reference information or shared resources to be provided by the appointing party..."
              rows={2}
            />
          </FormField>

          <FormField label="Acceptance Criteria">
            <textarea
              className={textareaClass}
              value={eir.acceptanceCriteria}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_EIR',
                  payload: { acceptanceCriteria: e.target.value },
                })
              }
              placeholder="Define the criteria for accepting information deliverables..."
              rows={2}
            />
          </FormField>
        </CollapsibleSection>
      </div>
    </StepWrapper>
  );
}
