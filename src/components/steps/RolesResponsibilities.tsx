import { Plus, Trash2, ShieldCheck } from 'lucide-react';
import { useBep } from '../../context/BepContext';
import FormField, { inputClass, selectClass } from '../ui/FormField';
import StepWrapper from '../wizard/StepWrapper';
import type { BIMRole } from '../../types/bep';

const DEFAULT_ROLE_TITLES = [
  'BIM/Information Manager',
  'Lead BIM Coordinator',
  'BIM Coordinator (Architecture)',
  'BIM Coordinator (Structures)',
  'BIM Coordinator (MEP)',
  'Task Team Manager',
  'CDE Administrator',
  'Design Manager',
  'Project Manager',
  'Client BIM Advisor',
];

const DEFAULT_RESPONSIBILITIES: Record<string, string[]> = {
  'BIM/Information Manager': [
    'Manage the Common Data Environment (CDE)',
    'Enforce information management procedures',
    'Review and approve information exchanges',
    'Maintain the BEP and ensure compliance',
    'Coordinate information delivery milestones',
  ],
  'Lead BIM Coordinator': [
    'Federate discipline models',
    'Run clash detection and coordination reviews',
    'Manage BCF issues and resolution tracking',
    'Ensure models comply with BEP standards',
    'Coordinate between task teams',
  ],
  'Task Team Manager': [
    'Manage task team information production',
    'Ensure TIDP deliverables are met on time',
    'Perform internal QA before sharing',
    'Maintain model integrity within discipline',
  ],
  'CDE Administrator': [
    'Set up and maintain CDE folder structure',
    'Manage user access and permissions',
    'Ensure CDE workflow states are applied correctly',
    'Archive superseded information',
  ],
};

export default function RolesResponsibilities() {
  const { bep, dispatch } = useBep();
  const { roles, raciMatrix } = bep.rolesAndResponsibilities;

  const addRole = (title: string = '') => {
    const role: BIMRole = {
      id: crypto.randomUUID(),
      title,
      organisation: '',
      personName: '',
      responsibilities: DEFAULT_RESPONSIBILITIES[title] || [],
    };
    dispatch({ type: 'ADD_ROLE', payload: role });
  };

  return (
    <StepWrapper>
      <div className="max-w-5xl">
        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            Information Management Roles
          </h4>
          <p className="text-sm text-blue-800">
            ISO 19650 requires clearly defined roles for information management. Each role should
            have a named individual and defined responsibilities. The RACI matrix clarifies
            accountability for key activities.
          </p>
        </div>

        {/* Roles */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Defined Roles</h3>
            <button
              onClick={() => addRole()}
              className="flex items-center gap-2 px-3 py-2 bg-bailey-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Role
            </button>
          </div>

          {roles.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg mb-4">
              <ShieldCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-4">No roles defined yet.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {DEFAULT_ROLE_TITLES.slice(0, 5).map((title) => (
                  <button
                    key={title}
                    onClick={() => addRole(title)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-bailey-blue hover:text-bailey-blue transition-all"
                  >
                    <Plus className="w-3 h-3" />
                    {title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 mb-4">
              {roles.map((role) => (
                <div key={role.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-bailey-blue" />
                      <span className="text-sm font-semibold text-gray-900">
                        {role.title || 'Untitled Role'}
                      </span>
                    </div>
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ROLE', payload: role.id })}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField label="Role Title">
                      <select
                        className={selectClass}
                        value={role.title}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_ROLE',
                            payload: { id: role.id, data: { title: e.target.value } },
                          })
                        }
                      >
                        <option value="">Select or type custom...</option>
                        {DEFAULT_ROLE_TITLES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Person Name">
                      <input
                        type="text"
                        className={inputClass}
                        value={role.personName}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_ROLE',
                            payload: { id: role.id, data: { personName: e.target.value } },
                          })
                        }
                        placeholder="Named individual"
                      />
                    </FormField>

                    <FormField label="Organisation">
                      <input
                        type="text"
                        className={inputClass}
                        value={role.organisation}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_ROLE',
                            payload: { id: role.id, data: { organisation: e.target.value } },
                          })
                        }
                        placeholder="Organisation"
                      />
                    </FormField>
                  </div>

                  {role.responsibilities.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">Responsibilities:</p>
                      <ul className="space-y-1">
                        {role.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-gray-700">
                            <span className="w-1.5 h-1.5 bg-bailey-blue rounded-full shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {roles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <p className="text-xs text-gray-500 w-full mb-1">Quick add:</p>
              {DEFAULT_ROLE_TITLES.filter(
                (t) => !roles.some((r) => r.title === t)
              ).map((title) => (
                <button
                  key={title}
                  onClick={() => addRole(title)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-600 hover:bg-blue-50 hover:text-bailey-blue transition-all"
                >
                  <Plus className="w-3 h-3" />
                  {title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RACI Matrix */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">RACI Matrix</h3>
          <p className="text-sm text-gray-500 mb-4">
            Define who is <span className="font-semibold">R</span>esponsible,{' '}
            <span className="font-semibold">A</span>ccountable,{' '}
            <span className="font-semibold">C</span>onsulted, and{' '}
            <span className="font-semibold">I</span>nformed for each information management activity.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-3 py-2 font-medium text-gray-600 min-w-[250px]">
                    Activity
                  </th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600 w-28">
                    <span className="text-green-600">R</span>esponsible
                  </th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600 w-28">
                    <span className="text-blue-600">A</span>ccountable
                  </th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600 w-28">
                    <span className="text-amber-600">C</span>onsulted
                  </th>
                  <th className="text-center px-3 py-2 font-medium text-gray-600 w-28">
                    <span className="text-gray-600">I</span>nformed
                  </th>
                </tr>
              </thead>
              <tbody>
                {raciMatrix.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-100">
                    <td className="px-3 py-2 text-gray-900 font-medium text-xs">
                      {entry.activity}
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-center"
                        value={entry.responsible}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_RACI_ENTRY',
                            payload: { id: entry.id, data: { responsible: e.target.value } },
                          })
                        }
                        placeholder="Who?"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-center"
                        value={entry.accountable}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_RACI_ENTRY',
                            payload: { id: entry.id, data: { accountable: e.target.value } },
                          })
                        }
                        placeholder="Who?"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-center"
                        value={entry.consulted}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_RACI_ENTRY',
                            payload: { id: entry.id, data: { consulted: e.target.value } },
                          })
                        }
                        placeholder="Who?"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full px-2 py-1 border border-gray-200 rounded text-xs text-center"
                        value={entry.informed}
                        onChange={(e) =>
                          dispatch({
                            type: 'UPDATE_RACI_ENTRY',
                            payload: { id: entry.id, data: { informed: e.target.value } },
                          })
                        }
                        placeholder="Who?"
                      />
                    </td>
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
