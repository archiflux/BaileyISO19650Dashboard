import { Link } from 'react-router-dom';
import {
  FileText,
  FolderOpen,
  ArrowRight,
  ClipboardList,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">ISO 19650 Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Manage your BIM Execution Plans and information management processes.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/bep"
          className="bg-gradient-to-br from-bailey-blue to-blue-700 rounded-xl p-6 text-white hover:shadow-lg transition-all group"
        >
          <FileText className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="text-lg font-semibold mb-1">BEP Generator</h3>
          <p className="text-sm text-blue-100 mb-3">
            Create a new BIM Execution Plan with guided step-by-step wizard.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
            Get Started <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <Link
          to="/projects"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:border-bailey-blue hover:shadow-md transition-all group"
        >
          <FolderOpen className="w-8 h-8 mb-3 text-bailey-blue" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Projects</h3>
          <p className="text-sm text-gray-500 mb-3">
            Browse projects and initiate a BEP from pre-populated project data.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-bailey-blue group-hover:gap-2 transition-all">
            View Projects <ArrowRight className="w-4 h-4" />
          </span>
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <ClipboardList className="w-8 h-8 mb-3 text-bailey-gray" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Compliance</h3>
          <p className="text-sm text-gray-500 mb-3">
            Track ISO 19650 compliance across your active projects.
          </p>
          <span className="text-sm text-gray-400 font-medium">Coming Soon</span>
        </div>
      </div>

      {/* ISO 19650 Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          BEP Generator Coverage
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          The BEP generator methodically walks through all sections required for a compliant BIM
          Execution Plan under BS EN ISO 19650.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Project Information', desc: 'Pre-populated from project data' },
            { title: 'Project Parties', desc: 'Appointing party, lead, and task teams' },
            { title: 'Information Requirements', desc: 'OIR, AIR, PIR & EIR hierarchy' },
            { title: 'Level of Information Need', desc: 'BS EN 17412-1 compliant LOIN definitions' },
            { title: 'CDE Configuration', desc: 'Platform, naming, status & suitability codes' },
            { title: 'Standards & Methods', desc: 'Classification, coordinates & QA' },
            { title: 'Software & IT', desc: 'Authoring tools, formats & interoperability' },
            { title: 'Deliverables & Milestones', desc: 'MIDP, data drops & model deliverables' },
            { title: 'Roles & Responsibilities', desc: 'Named roles & RACI matrix' },
            { title: 'Review & Generate', desc: 'Completeness check & HTML/JSON export' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-bailey-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standards Reference */}
      <div className="bg-bailey-light rounded-xl p-6">
        <h2 className="text-lg font-semibold text-bailey-navy mb-3">Standards Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Core Standards</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-bailey-blue" />
                BS EN ISO 19650-1:2018 &mdash; Concepts & Principles
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-bailey-blue" />
                BS EN ISO 19650-2:2018 &mdash; Delivery Phase
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-bailey-blue" />
                BS EN ISO 19650-5:2020 &mdash; Security-Minded Approach
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Supporting Standards</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-bailey-accent" />
                BS EN 17412-1:2020 &mdash; Level of Information Need
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-bailey-accent" />
                UK BIM Framework &mdash; Guidance & Templates
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-bailey-accent" />
                Uniclass 2015 &mdash; Unified Classification
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
