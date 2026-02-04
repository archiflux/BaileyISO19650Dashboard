import { useNavigate } from 'react-router-dom';
import {
  Building2,
  ArrowRight,
  MapPin,
  Calendar,
  PoundSterling,
} from 'lucide-react';
import { sampleProjects } from '../data/projects';
import { useBep } from '../context/BepContext';

const STAGE_LABELS: Record<string, string> = {
  '0-strategic-definition': 'Stage 0',
  '1-preparation-and-briefing': 'Stage 1',
  '2-concept-design': 'Stage 2',
  '3-spatial-coordination': 'Stage 3',
  '4-technical-design': 'Stage 4',
  '5-manufacturing-and-construction': 'Stage 5',
  '6-handover': 'Stage 6',
  '7-use': 'Stage 7',
};

const TYPE_LABELS: Record<string, string> = {
  'new-build': 'New Build',
  refurbishment: 'Refurbishment',
  extension: 'Extension',
  'fit-out': 'Fit-Out',
  infrastructure: 'Infrastructure',
  'mixed-use': 'Mixed Use',
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
  healthcare: 'Healthcare',
  education: 'Education',
};

export default function ProjectSelector() {
  const navigate = useNavigate();
  const { dispatch } = useBep();

  const selectProject = (projectId: string) => {
    const project = sampleProjects.find((p) => p.id === projectId);
    if (project) {
      dispatch({ type: 'PREPOPULATE_FROM_PROJECT', payload: project });
      navigate('/bep');
    }
  };

  const startBlank = () => {
    navigate('/bep');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-500 mt-1">
          Select a project to pre-populate the BEP Generator, or start with a blank template.
        </p>
      </div>

      {/* Start Blank */}
      <button
        onClick={startBlank}
        className="w-full bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-bailey-blue hover:bg-blue-50/30 transition-all mb-6 group"
      >
        <p className="text-lg font-semibold text-gray-700 group-hover:text-bailey-blue">
          + Start with a Blank BEP
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Create a new BIM Execution Plan from scratch without pre-populated data.
        </p>
      </button>

      {/* Project Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sampleProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:border-bailey-blue hover:shadow-md transition-all group cursor-pointer"
            onClick={() => selectProject(project.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bailey-light rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-bailey-blue" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-bailey-blue transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">{project.number}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-bailey-blue transition-colors" />
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {STAGE_LABELS[project.stage] || project.stage}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {TYPE_LABELS[project.type] || project.type}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {project.procurementRoute.replace(/-/g, ' ')}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {project.address.split(',').slice(-2).join(',').trim()}
              </span>
              <span className="flex items-center gap-1">
                <PoundSterling className="w-3 h-3" />
                {project.value}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {project.client}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
