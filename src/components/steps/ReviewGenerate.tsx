import {
  Check,
  AlertCircle,
  Download,
  Building2,
  Users,
  ClipboardList,
  Layers,
  Database,
  BookOpen,
  Monitor,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { useBep } from '../../context/BepContext';
import StepWrapper from '../wizard/StepWrapper';

interface SectionSummary {
  step: number;
  title: string;
  icon: React.ReactNode;
  status: 'complete' | 'partial' | 'empty';
  items: { label: string; value: string; ok: boolean }[];
}

function getStatusBadge(status: 'complete' | 'partial' | 'empty') {
  switch (status) {
    case 'complete':
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
          <Check className="w-3 h-3" /> Complete
        </span>
      );
    case 'partial':
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
          <AlertCircle className="w-3 h-3" /> Partial
        </span>
      );
    case 'empty':
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
          <AlertCircle className="w-3 h-3" /> Not Started
        </span>
      );
  }
}

export default function ReviewGenerate() {
  const { bep, dispatch } = useBep();

  const sections: SectionSummary[] = [
    {
      step: 1,
      title: 'Project Information',
      icon: <Building2 className="w-5 h-5" />,
      status: bep.projectInformation.projectName && bep.projectInformation.projectNumber ? 'complete' : bep.projectInformation.projectName ? 'partial' : 'empty',
      items: [
        { label: 'Project Name', value: bep.projectInformation.projectName || '-', ok: !!bep.projectInformation.projectName },
        { label: 'Project Number', value: bep.projectInformation.projectNumber || '-', ok: !!bep.projectInformation.projectNumber },
        { label: 'Client', value: bep.projectInformation.clientOrganisation || '-', ok: !!bep.projectInformation.clientOrganisation },
        { label: 'Stage', value: bep.projectInformation.projectStage || '-', ok: !!bep.projectInformation.projectStage },
        { label: 'Type', value: bep.projectInformation.projectType || '-', ok: !!bep.projectInformation.projectType },
      ],
    },
    {
      step: 2,
      title: 'Project Parties',
      icon: <Users className="w-5 h-5" />,
      status: bep.projectParties.length >= 2 ? 'complete' : bep.projectParties.length > 0 ? 'partial' : 'empty',
      items: [
        { label: 'Total Parties', value: String(bep.projectParties.length), ok: bep.projectParties.length > 0 },
        { label: 'Appointing Party', value: bep.projectParties.find(p => p.role === 'appointing-party')?.organisationName || 'Not defined', ok: !!bep.projectParties.find(p => p.role === 'appointing-party') },
        { label: 'Lead Appointed Party', value: bep.projectParties.find(p => p.role === 'lead-appointed-party')?.organisationName || 'Not defined', ok: !!bep.projectParties.find(p => p.role === 'lead-appointed-party') },
      ],
    },
    {
      step: 3,
      title: 'Information Requirements',
      icon: <ClipboardList className="w-5 h-5" />,
      status: bep.informationRequirements.eir.informationStandard ? 'complete' : bep.informationRequirements.pir.exists ? 'partial' : 'empty',
      items: [
        { label: 'OIR Defined', value: bep.informationRequirements.oir.exists ? 'Yes' : 'No', ok: bep.informationRequirements.oir.exists },
        { label: 'AIR Defined', value: bep.informationRequirements.air.exists ? 'Yes' : 'No', ok: bep.informationRequirements.air.exists },
        { label: 'PIR Defined', value: bep.informationRequirements.pir.exists ? 'Yes' : 'No', ok: bep.informationRequirements.pir.exists },
        { label: 'EIR Standard', value: bep.informationRequirements.eir.informationStandard || '-', ok: !!bep.informationRequirements.eir.informationStandard },
      ],
    },
    {
      step: 4,
      title: 'Level of Information Need',
      icon: <Layers className="w-5 h-5" />,
      status: bep.levelOfInformationNeed.elements.length >= 5 ? 'complete' : bep.levelOfInformationNeed.elements.length > 0 ? 'partial' : 'empty',
      items: [
        { label: 'Elements Defined', value: String(bep.levelOfInformationNeed.elements.length), ok: bep.levelOfInformationNeed.elements.length > 0 },
        { label: 'With Geometry Level', value: String(bep.levelOfInformationNeed.elements.filter(e => e.geometricalInformation.level).length), ok: bep.levelOfInformationNeed.elements.some(e => e.geometricalInformation.level !== '') },
        { label: 'With Info Level', value: String(bep.levelOfInformationNeed.elements.filter(e => e.alphanumericInformation.level).length), ok: bep.levelOfInformationNeed.elements.some(e => e.alphanumericInformation.level !== '') },
      ],
    },
    {
      step: 5,
      title: 'CDE & Information Management',
      icon: <Database className="w-5 h-5" />,
      status: bep.cdeConfiguration.platform ? 'complete' : 'empty',
      items: [
        { label: 'CDE Platform', value: bep.cdeConfiguration.platform || '-', ok: !!bep.cdeConfiguration.platform },
        { label: 'Naming Convention', value: bep.cdeConfiguration.namingConvention.example || '-', ok: !!bep.cdeConfiguration.namingConvention.example },
      ],
    },
    {
      step: 6,
      title: 'Standards & Methods',
      icon: <BookOpen className="w-5 h-5" />,
      status: bep.standardsMethods.classificationSystem ? 'complete' : bep.standardsMethods.modellingStandards.length > 0 ? 'partial' : 'empty',
      items: [
        { label: 'Classification', value: bep.standardsMethods.classificationSystem || '-', ok: !!bep.standardsMethods.classificationSystem },
        { label: 'Modelling Standards', value: `${bep.standardsMethods.modellingStandards.length} selected`, ok: bep.standardsMethods.modellingStandards.length > 0 },
        { label: 'Coordinate System', value: bep.standardsMethods.coordinateSystem.projectBasePoint ? 'Defined' : 'Not set', ok: !!bep.standardsMethods.coordinateSystem.projectBasePoint },
      ],
    },
    {
      step: 7,
      title: 'Software & IT',
      icon: <Monitor className="w-5 h-5" />,
      status: bep.softwareIT.authoringSoftware.length > 0 ? 'complete' : 'empty',
      items: [
        { label: 'Authoring Software', value: `${bep.softwareIT.authoringSoftware.length} tools`, ok: bep.softwareIT.authoringSoftware.length > 0 },
        { label: 'Coordination Software', value: `${bep.softwareIT.coordinationSoftware.length} tools`, ok: bep.softwareIT.coordinationSoftware.length > 0 },
        { label: 'File Formats', value: `${bep.softwareIT.fileFormats.length} formats`, ok: bep.softwareIT.fileFormats.length > 0 },
      ],
    },
    {
      step: 8,
      title: 'Deliverables & Milestones',
      icon: <Calendar className="w-5 h-5" />,
      status: bep.deliverablesAndMilestones.informationDeliveryMilestones.length > 0 ? 'complete' : 'empty',
      items: [
        { label: 'Milestones', value: String(bep.deliverablesAndMilestones.informationDeliveryMilestones.length), ok: bep.deliverablesAndMilestones.informationDeliveryMilestones.length > 0 },
        { label: 'Model Deliverables', value: String(bep.deliverablesAndMilestones.modelDeliverables.length), ok: bep.deliverablesAndMilestones.modelDeliverables.length > 0 },
        { label: 'MIDP Entries', value: String(bep.deliverablesAndMilestones.masterInformationDeliveryPlan.length), ok: bep.deliverablesAndMilestones.masterInformationDeliveryPlan.length > 0 },
      ],
    },
    {
      step: 9,
      title: 'Roles & Responsibilities',
      icon: <ShieldCheck className="w-5 h-5" />,
      status: bep.rolesAndResponsibilities.roles.length > 0 ? 'complete' : 'empty',
      items: [
        { label: 'Roles Defined', value: String(bep.rolesAndResponsibilities.roles.length), ok: bep.rolesAndResponsibilities.roles.length > 0 },
        { label: 'RACI Activities', value: String(bep.rolesAndResponsibilities.raciMatrix.length), ok: true },
      ],
    },
  ];

  const completedSections = sections.filter((s) => s.status === 'complete').length;
  const totalSections = sections.length;
  const completionPercentage = Math.round((completedSections / totalSections) * 100);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(bep, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BEP-${bep.projectInformation.projectNumber || 'draft'}-v${bep.version}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportHTML = () => {
    const html = generateHTMLReport(bep);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BEP-${bep.projectInformation.projectNumber || 'draft'}-v${bep.version}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <StepWrapper>
      <div className="max-w-4xl">
        {/* Completion Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">BEP Completion Summary</h3>
              <p className="text-sm text-gray-500 mt-1">
                Review all sections before generating the final document.
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-bailey-navy">{completionPercentage}%</p>
              <p className="text-xs text-gray-500">
                {completedSections} of {totalSections} sections
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${completionPercentage}%`,
                backgroundColor:
                  completionPercentage === 100
                    ? '#10b981'
                    : completionPercentage >= 60
                    ? '#3b82f6'
                    : '#f59e0b',
              }}
            />
          </div>

          {/* Section Cards */}
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.step}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => dispatch({ type: 'SET_STEP', payload: section.step })}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-bailey-blue">{section.icon}</div>
                    <span className="text-sm font-semibold text-gray-900">
                      {section.step}. {section.title}
                    </span>
                  </div>
                  {getStatusBadge(section.status)}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-8">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.ok ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      />
                      <span className="text-xs text-gray-500">{item.label}:</span>
                      <span className="text-xs text-gray-700 font-medium truncate">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BEP Metadata */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">BEP ID</p>
              <p className="font-mono text-xs text-gray-900 mt-1">{bep.id.substring(0, 8)}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Version</p>
              <p className="font-medium text-gray-900 mt-1">{bep.version}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Created</p>
              <p className="font-medium text-gray-900 mt-1">
                {new Date(bep.createdDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Status</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium capitalize">
                {bep.status}
              </span>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate & Export</h3>
          <p className="text-sm text-gray-500 mb-4">
            Export the BEP document in your preferred format.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportHTML}
              className="flex items-center gap-2 px-5 py-3 bg-bailey-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
            >
              <Download className="w-4 h-4" />
              Export as HTML Report
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all"
            >
              <Download className="w-4 h-4" />
              Export as JSON
            </button>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}

function generateHTMLReport(bep: ReturnType<typeof useBep>['bep']): string {
  const info = bep.projectInformation;
  const parties = bep.projectParties;
  const loin = bep.levelOfInformationNeed;
  const cde = bep.cdeConfiguration;
  const standards = bep.standardsMethods;
  const sw = bep.softwareIT;
  const del = bep.deliverablesAndMilestones;
  const roles = bep.rolesAndResponsibilities;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BIM Execution Plan - ${info.projectName}</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 20px; color: #1e293b; line-height: 1.6; }
    h1 { color: #1e3a5f; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e3a5f; margin-top: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    h3 { color: #334155; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; font-size: 14px; }
    th { background: #f1f5f9; font-weight: 600; }
    .meta { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .meta span { display: inline-block; margin-right: 30px; }
    .meta label { font-weight: 600; color: #64748b; font-size: 12px; text-transform: uppercase; }
    .section { margin: 25px 0; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .badge-blue { background: #dbeafe; color: #1d4ed8; }
    .badge-green { background: #dcfce7; color: #166534; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>BIM Execution Plan (BEP)</h1>
  <div class="meta">
    <span><label>Project</label><br>${info.projectName}</span>
    <span><label>Number</label><br>${info.projectNumber}</span>
    <span><label>Version</label><br>${bep.version}</span>
    <span><label>Status</label><br><span class="badge badge-blue">${bep.status}</span></span>
    <span><label>Date</label><br>${new Date().toLocaleDateString()}</span>
  </div>

  <h2>1. Project Information</h2>
  <table>
    <tr><th>Project Name</th><td>${info.projectName}</td></tr>
    <tr><th>Project Number</th><td>${info.projectNumber}</td></tr>
    <tr><th>Address</th><td>${info.projectAddress}</td></tr>
    <tr><th>Description</th><td>${info.projectDescription}</td></tr>
    <tr><th>Type</th><td>${info.projectType}</td></tr>
    <tr><th>Value</th><td>${info.projectValue}</td></tr>
    <tr><th>Procurement Route</th><td>${info.procurementRoute}</td></tr>
    <tr><th>RIBA Stage</th><td>${info.projectStage}</td></tr>
    <tr><th>Client</th><td>${info.clientOrganisation}</td></tr>
    <tr><th>Client Contact</th><td>${info.clientContact} (${info.clientEmail})</td></tr>
  </table>

  <h2>2. Project Parties</h2>
  <table>
    <thead><tr><th>Organisation</th><th>Role</th><th>Contact</th><th>BIM Capability</th><th>Scope</th></tr></thead>
    <tbody>${parties.map(p => `<tr><td>${p.organisationName}</td><td>${p.role}</td><td>${p.contactName} (${p.contactEmail})</td><td>${p.bimCapability}</td><td>${p.scope}</td></tr>`).join('')}</tbody>
  </table>

  <h2>3. Information Requirements</h2>
  <h3>EIR</h3>
  <table>
    <tr><th>Information Standard</th><td>${bep.informationRequirements.eir.informationStandard}</td></tr>
    <tr><th>Production Methods</th><td>${bep.informationRequirements.eir.informationProductionMethods}</td></tr>
    <tr><th>Acceptance Criteria</th><td>${bep.informationRequirements.eir.acceptanceCriteria}</td></tr>
  </table>

  <h2>4. Level of Information Need</h2>
  <table>
    <thead><tr><th>Element</th><th>Geometry</th><th>Information</th><th>Documentation</th><th>Purpose</th></tr></thead>
    <tbody>${loin.elements.map(e => `<tr><td>${e.elementType}</td><td>${e.geometricalInformation.level}</td><td>${e.alphanumericInformation.level}</td><td>${e.documentation.level}</td><td>${e.purpose}</td></tr>`).join('')}</tbody>
  </table>

  <h2>5. Common Data Environment</h2>
  <table>
    <tr><th>Platform</th><td>${cde.platform}</td></tr>
    <tr><th>Naming Convention</th><td>${cde.namingConvention.example}</td></tr>
    <tr><th>Revision Strategy</th><td>${cde.revisionStrategy}</td></tr>
  </table>

  <h2>6. Standards & Methods</h2>
  <table>
    <tr><th>Classification</th><td>${standards.classificationSystem}</td></tr>
    <tr><th>Units</th><td>${standards.measurementUnits}</td></tr>
    <tr><th>Modelling Standards</th><td>${standards.modellingStandards.join(', ')}</td></tr>
    <tr><th>Drawing Standards</th><td>${standards.drawingStandards.join(', ')}</td></tr>
  </table>

  <h2>7. Software & IT</h2>
  <table>
    <thead><tr><th>Software</th><th>Version</th><th>Purpose</th><th>Discipline</th></tr></thead>
    <tbody>${[...sw.authoringSoftware, ...sw.coordinationSoftware].map(s => `<tr><td>${s.name}</td><td>${s.version}</td><td>${s.purpose}</td><td>${s.discipline}</td></tr>`).join('')}</tbody>
  </table>

  <h2>8. Deliverables & Milestones</h2>
  <table>
    <thead><tr><th>Milestone</th><th>Date</th><th>Stage</th><th>Description</th></tr></thead>
    <tbody>${del.informationDeliveryMilestones.map(m => `<tr><td>${m.name}</td><td>${m.date}</td><td>${m.stage}</td><td>${m.description}</td></tr>`).join('')}</tbody>
  </table>

  <h2>9. Roles & Responsibilities</h2>
  <table>
    <thead><tr><th>Role</th><th>Person</th><th>Organisation</th><th>Responsibilities</th></tr></thead>
    <tbody>${roles.roles.map(r => `<tr><td>${r.title}</td><td>${r.personName}</td><td>${r.organisation}</td><td>${r.responsibilities.join('; ')}</td></tr>`).join('')}</tbody>
  </table>

  <h3>RACI Matrix</h3>
  <table>
    <thead><tr><th>Activity</th><th>R</th><th>A</th><th>C</th><th>I</th></tr></thead>
    <tbody>${roles.raciMatrix.map(r => `<tr><td>${r.activity}</td><td>${r.responsible}</td><td>${r.accountable}</td><td>${r.consulted}</td><td>${r.informed}</td></tr>`).join('')}</tbody>
  </table>

  <div class="footer">
    <p>Generated by Bailey ISO 19650 Dashboard &mdash; BEP Generator</p>
    <p>This document has been prepared in accordance with BS EN ISO 19650-1 and BS EN ISO 19650-2.</p>
    <p>Document ID: ${bep.id} | Version: ${bep.version} | Generated: ${new Date().toISOString()}</p>
  </div>
</body>
</html>`;
}
