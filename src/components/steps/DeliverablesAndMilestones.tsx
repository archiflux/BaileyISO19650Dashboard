import { Plus, Trash2, Calendar, FileBox } from 'lucide-react';
import { useBep } from '../../context/BepContext';
import FormField, { inputClass, selectClass, textareaClass } from '../ui/FormField';
import StepWrapper from '../wizard/StepWrapper';
import type { Milestone, ModelDeliverable, MIDPEntry } from '../../types/bep';

const PROJECT_STAGES = [
  { value: '', label: 'Select stage...' },
  { value: '0-strategic-definition', label: 'Stage 0' },
  { value: '1-preparation-and-briefing', label: 'Stage 1' },
  { value: '2-concept-design', label: 'Stage 2' },
  { value: '3-spatial-coordination', label: 'Stage 3' },
  { value: '4-technical-design', label: 'Stage 4' },
  { value: '5-manufacturing-and-construction', label: 'Stage 5' },
  { value: '6-handover', label: 'Stage 6' },
  { value: '7-use', label: 'Stage 7' },
];

const DISCIPLINES = [
  'Architecture',
  'Structural Engineering',
  'Mechanical Services',
  'Electrical Services',
  'Public Health',
  'Civil Engineering',
  'Landscape',
  'Interior Design',
  'Fire Engineering',
  'Acoustic Engineering',
  'Facade Engineering',
];

export default function DeliverablesAndMilestones() {
  const { bep, dispatch } = useBep();
  const deliverables = bep.deliverablesAndMilestones;

  const addMilestone = () => {
    const milestone: Milestone = {
      id: crypto.randomUUID(),
      name: '',
      date: '',
      stage: '',
      description: '',
      deliverables: [],
    };
    dispatch({ type: 'ADD_MILESTONE', payload: milestone });
  };

  const addModelDeliverable = () => {
    const deliverable: ModelDeliverable = {
      id: crypto.randomUUID(),
      modelName: '',
      discipline: '',
      description: '',
      responsibleParty: '',
      deliveryDate: '',
      format: '',
    };
    dispatch({ type: 'ADD_MODEL_DELIVERABLE', payload: deliverable });
  };

  const addMIDPEntry = () => {
    const entry: MIDPEntry = {
      id: crypto.randomUUID(),
      informationContainer: '',
      description: '',
      responsibleParty: '',
      milestone: '',
      status: 'Not Started',
    };
    dispatch({ type: 'ADD_MIDP_ENTRY', payload: entry });
  };

  return (
    <StepWrapper>
      <div className="max-w-5xl">
        {/* Milestones */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Information Delivery Milestones
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Key dates when information must be delivered, aligned to project stages and decision points.
              </p>
            </div>
            <button
              onClick={addMilestone}
              className="flex items-center gap-2 px-3 py-2 bg-bailey-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Milestone
            </button>
          </div>

          {deliverables.informationDeliveryMilestones.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No milestones defined yet. Add key information delivery dates.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliverables.informationDeliveryMilestones.map((milestone, index) => (
                <div key={milestone.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Milestone {index + 1}
                    </span>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_MILESTONE', payload: milestone.id })}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Milestone Name" required>
                      <input
                        type="text"
                        className={inputClass}
                        value={milestone.name}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_MILESTONE',
                            payload: { id: milestone.id, data: { name: e.target.value } },
                          })
                        }
                        placeholder="e.g., Stage 2 Data Drop"
                      />
                    </FormField>

                    <FormField label="Date" required>
                      <input
                        type="date"
                        className={inputClass}
                        value={milestone.date}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_MILESTONE',
                            payload: { id: milestone.id, data: { date: e.target.value } },
                          })
                        }
                      />
                    </FormField>

                    <FormField label="Stage">
                      <select
                        className={selectClass}
                        value={milestone.stage}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_MILESTONE',
                            payload: { id: milestone.id, data: { stage: e.target.value as Milestone['stage'] } },
                          })
                        }
                      >
                        {PROJECT_STAGES.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                  <FormField label="Description">
                    <textarea
                      className={textareaClass}
                      value={milestone.description}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_MILESTONE',
                          payload: { id: milestone.id, data: { description: e.target.value } },
                        })
                      }
                      placeholder="What information is expected at this milestone?"
                      rows={2}
                    />
                  </FormField>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Model Deliverables */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Model Deliverables</h3>
              <p className="text-sm text-gray-500 mt-1">
                Define the models to be produced, by which discipline, and in what format.
              </p>
            </div>
            <button
              onClick={addModelDeliverable}
              className="flex items-center gap-2 px-3 py-2 bg-bailey-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Model
            </button>
          </div>

          {deliverables.modelDeliverables.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FileBox className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No model deliverables defined yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Model Name</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Discipline</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Responsible</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Format</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Date</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {deliverables.modelDeliverables.map((del) => (
                    <tr key={del.id} className="border-t border-gray-100">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                          value={del.modelName}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_MODEL_DELIVERABLE',
                              payload: { id: del.id, data: { modelName: e.target.value } },
                            })
                          }
                          placeholder="Model name"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                          value={del.discipline}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_MODEL_DELIVERABLE',
                              payload: { id: del.id, data: { discipline: e.target.value } },
                            })
                          }
                        >
                          <option value="">Select...</option>
                          {DISCIPLINES.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                          value={del.responsibleParty}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_MODEL_DELIVERABLE',
                              payload: { id: del.id, data: { responsibleParty: e.target.value } },
                            })
                          }
                          placeholder="Party"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                          value={del.format}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_MODEL_DELIVERABLE',
                              payload: { id: del.id, data: { format: e.target.value } },
                            })
                          }
                          placeholder="e.g., RVT, IFC"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="date"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                          value={del.deliveryDate}
                          onChange={(e) =>
                            dispatch({
                              type: 'UPDATE_MODEL_DELIVERABLE',
                              payload: { id: del.id, data: { deliveryDate: e.target.value } },
                            })
                          }
                        />
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_MODEL_DELIVERABLE', payload: del.id })}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MIDP */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Master Information Delivery Plan (MIDP)
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                The MIDP aggregates all task information delivery plans and defines when each
                information container is due.
              </p>
            </div>
            <button
              onClick={addMIDPEntry}
              className="flex items-center gap-2 px-3 py-2 bg-bailey-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Entry
            </button>
          </div>

          {deliverables.masterInformationDeliveryPlan.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">
                No MIDP entries yet. Add information containers and assign them to milestones.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Container ID</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Description</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Responsible</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Milestone</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-600">Status</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {deliverables.masterInformationDeliveryPlan.map((entry) => (
                    <tr key={entry.id} className="border-t border-gray-100">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs font-mono"
                          value={entry.informationContainer}
                          onChange={(e) =>
                            dispatch({
                              type: 'ADD_MIDP_ENTRY',
                              payload: { ...entry, informationContainer: e.target.value },
                            })
                          }
                          placeholder="e.g., BP2501-BAI-ZZ-01-M3-A-0001"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                          value={entry.description}
                          onChange={(e) => {
                            const updated = deliverables.masterInformationDeliveryPlan.map((e2) =>
                              e2.id === entry.id ? { ...e2, description: e.target.value } : e2
                            );
                            dispatch({ type: 'SET_MIDP', payload: updated });
                          }}
                          placeholder="Description"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                          value={entry.responsibleParty}
                          onChange={(e) => {
                            const updated = deliverables.masterInformationDeliveryPlan.map((e2) =>
                              e2.id === entry.id ? { ...e2, responsibleParty: e.target.value } : e2
                            );
                            dispatch({ type: 'SET_MIDP', payload: updated });
                          }}
                          placeholder="Party"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                          value={entry.milestone}
                          onChange={(e) => {
                            const updated = deliverables.masterInformationDeliveryPlan.map((e2) =>
                              e2.id === entry.id ? { ...e2, milestone: e.target.value } : e2
                            );
                            dispatch({ type: 'SET_MIDP', payload: updated });
                          }}
                          placeholder="Milestone"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs bg-white"
                          value={entry.status}
                          onChange={(e) => {
                            const updated = deliverables.masterInformationDeliveryPlan.map((e2) =>
                              e2.id === entry.id ? { ...e2, status: e.target.value } : e2
                            );
                            dispatch({ type: 'SET_MIDP', payload: updated });
                          }}
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => dispatch({ type: 'REMOVE_MIDP_ENTRY', payload: entry.id })}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </StepWrapper>
  );
}
