import { Plus, Trash2, Users } from 'lucide-react';
import { useBep } from '../../context/BepContext';
import FormField, { inputClass, selectClass, textareaClass } from '../ui/FormField';
import StepWrapper from '../wizard/StepWrapper';
import type { ProjectParty } from '../../types/bep';

const PARTY_ROLES = [
  { value: 'appointing-party', label: 'Appointing Party', description: 'The client/employer commissioning the work' },
  { value: 'lead-appointed-party', label: 'Lead Appointed Party', description: 'Lead consultant or contractor coordinating information delivery' },
  { value: 'appointed-party', label: 'Appointed Party', description: 'Organisation appointed to deliver information' },
  { value: 'information-manager', label: 'Information Manager', description: 'Manages the CDE and information workflows' },
  { value: 'task-team-manager', label: 'Task Team Manager', description: 'Manages a specific task team\u2019s information delivery' },
  { value: 'task-team-member', label: 'Task Team Member', description: 'Individual contributing to information production' },
];

const BIM_CAPABILITY = [
  { value: '', label: 'Select...' },
  { value: 'basic', label: 'Basic - Limited BIM experience, primarily 2D workflows' },
  { value: 'intermediate', label: 'Intermediate - BIM-capable with some ISO 19650 awareness' },
  { value: 'advanced', label: 'Advanced - Fully BIM-capable, ISO 19650 compliant processes' },
  { value: 'expert', label: 'Expert - Demonstrated BIM leadership, certified to ISO 19650' },
];

function createEmptyParty(): ProjectParty {
  return {
    id: crypto.randomUUID(),
    organisationName: '',
    role: 'appointed-party',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    bimCapability: '',
    scope: '',
  };
}

export default function ProjectParties() {
  const { bep, dispatch } = useBep();
  const parties = bep.projectParties;

  const addParty = () => {
    dispatch({ type: 'ADD_PARTY', payload: createEmptyParty() });
  };

  const updateParty = (id: string, field: string, value: string) => {
    dispatch({
      type: 'UPDATE_PARTY',
      payload: { id, data: { [field]: value } },
    });
  };

  const removeParty = (id: string) => {
    dispatch({ type: 'REMOVE_PARTY', payload: id });
  };

  return (
    <StepWrapper>
      <div className="max-w-4xl">
        {/* Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="text-sm font-semibold text-blue-900 mb-1">
            ISO 19650 Party Roles
          </h4>
          <p className="text-sm text-blue-800 mb-2">
            ISO 19650 defines a clear hierarchy of parties responsible for information management:
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li><span className="font-semibold">Appointing Party</span> \u2014 Commissions the work and sets the information requirements (EIR)</li>
            <li><span className="font-semibold">Lead Appointed Party</span> \u2014 Coordinates information delivery across all appointed parties</li>
            <li><span className="font-semibold">Appointed Parties</span> \u2014 Deliver information according to the agreed BEP and TIDP</li>
          </ul>
        </div>

        {/* Party List */}
        {parties.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center mb-6">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No parties added yet</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add the project parties and define their roles within the information management process.
            </p>
            <button
              onClick={addParty}
              className="inline-flex items-center gap-2 px-4 py-2 bg-bailey-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add First Party
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {parties.map((party, index) => (
              <div
                key={party.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">
                    Party {index + 1}
                  </h3>
                  <button
                    onClick={() => removeParty(party.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                  <FormField label="Organisation Name" required>
                    <input
                      type="text"
                      className={inputClass}
                      value={party.organisationName}
                      onChange={(e) => updateParty(party.id, 'organisationName', e.target.value)}
                      placeholder="Organisation name"
                    />
                  </FormField>

                  <FormField
                    label="Role"
                    required
                    tooltip={{
                      title: 'Party Role',
                      content: PARTY_ROLES.find((r) => r.value === party.role)?.description || '',
                      isoReference: 'ISO 19650-1, Clause 3.2',
                    }}
                  >
                    <select
                      className={selectClass}
                      value={party.role}
                      onChange={(e) => updateParty(party.id, 'role', e.target.value)}
                    >
                      {PARTY_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Contact Name">
                    <input
                      type="text"
                      className={inputClass}
                      value={party.contactName}
                      onChange={(e) => updateParty(party.id, 'contactName', e.target.value)}
                      placeholder="Primary contact"
                    />
                  </FormField>

                  <FormField label="Contact Email">
                    <input
                      type="email"
                      className={inputClass}
                      value={party.contactEmail}
                      onChange={(e) => updateParty(party.id, 'contactEmail', e.target.value)}
                      placeholder="email@example.com"
                    />
                  </FormField>

                  <FormField label="Contact Phone">
                    <input
                      type="tel"
                      className={inputClass}
                      value={party.contactPhone}
                      onChange={(e) => updateParty(party.id, 'contactPhone', e.target.value)}
                      placeholder="+44 ..."
                    />
                  </FormField>

                  <FormField
                    label="BIM Capability"
                    tooltip={{
                      title: 'BIM Capability Assessment',
                      content: 'An assessment of the organisation\u2019s BIM maturity and capability to deliver information in accordance with ISO 19650.',
                      isoReference: 'ISO 19650-2, Clause 5.3',
                    }}
                  >
                    <select
                      className={selectClass}
                      value={party.bimCapability}
                      onChange={(e) => updateParty(party.id, 'bimCapability', e.target.value)}
                    >
                      {BIM_CAPABILITY.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Scope of Work">
                  <textarea
                    className={textareaClass}
                    value={party.scope}
                    onChange={(e) => updateParty(party.id, 'scope', e.target.value)}
                    placeholder="Describe this party's scope of information delivery..."
                    rows={2}
                  />
                </FormField>
              </div>
            ))}
          </div>
        )}

        {parties.length > 0 && (
          <button
            onClick={addParty}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:border-bailey-blue hover:text-bailey-blue transition-all w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Add Another Party
          </button>
        )}
      </div>
    </StepWrapper>
  );
}
