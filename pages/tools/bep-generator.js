/**
 * BEP Generator JavaScript
 * Handles BIM Execution Plan creation and management
 */

// Current section tracking
let currentSection = 1;
const totalSections = 7;
let currentBEP = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeBEP();
    loadProjects();
    setupEventListeners();
});

/**
 * Initialize BEP database
 */
function initializeBEP() {
    if (!localStorage.getItem('bailey_beps')) {
        localStorage.setItem('bailey_beps', JSON.stringify([]));
    }

    // Check if we're editing an existing BEP
    const urlParams = new URLSearchParams(window.location.search);
    const bepId = urlParams.get('id');

    if (bepId) {
        loadBEP(bepId);
    }
}

/**
 * Load existing BEP for editing
 */
function loadBEP(bepId) {
    const beps = JSON.parse(localStorage.getItem('bailey_beps') || '[]');
    currentBEP = beps.find(b => b.id === bepId);

    if (currentBEP) {
        populateFormFromBEP(currentBEP);
        Notifications.show('BEP loaded for editing', 'info');
    }
}

/**
 * Load projects into selector
 */
function loadProjects() {
    const projectSelect = document.getElementById('projectSelect');
    const projects = BaileyDB.getProjects();

    projectSelect.innerHTML = '<option value="">-- Select a project --</option>';

    projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = `${project.projectNumber} - ${project.projectName}`;
        projectSelect.appendChild(option);
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Project selection
    document.getElementById('projectSelect').addEventListener('change', function(e) {
        if (e.target.value) {
            populateFromProject(e.target.value);
        }
    });

    // Originator code update
    document.getElementById('originatorCode').addEventListener('input', updateNamingExample);
    document.getElementById('projectISONumber').addEventListener('input', updateNamingExample);

    // Update naming example on load
    updateNamingExample();
}

/**
 * Populate form from selected project
 */
function populateFromProject(projectId) {
    const project = BaileyDB.getProject(projectId);

    if (!project) return;

    // Section 1: Project Information
    document.getElementById('projectName').value = project.projectName || '';
    document.getElementById('projectNumber').value = project.projectNumber || '';
    document.getElementById('projectISONumber').value = project.isoProject || '';
    document.getElementById('clientName').value = project.clientName || '';
    document.getElementById('projectLocation').value = project.projectLocation || '';
    document.getElementById('projectValue').value = project.projectValue || '';
    document.getElementById('projectStartDate').value = project.projectStartDate || '';
    document.getElementById('projectPhase').value = project.projectPhase || '';
    document.getElementById('projectType').value = project.projectType || '';
    document.getElementById('projectDescription').value = project.projectDescription || '';
    document.getElementById('baileyRole').value = project.baileyRole || '';

    // Section 2: Roles
    document.getElementById('projectLead').value = project.projectLead || '';
    document.getElementById('bimManager').value = project.bimManager || '';
    document.getElementById('taskTeamManager').value = project.taskTeamManager || '';
    document.getElementById('documentController').value = project.documentController || '';

    // Section 3: Standards
    document.getElementById('originatorCode').value = project.isoOriginator || 'BPG';

    // Section 5: CDE
    document.getElementById('cdeProvider').value = project.cdeProvider || '';

    updateNamingExample();

    Notifications.show('Project information loaded', 'success');
}

/**
 * Populate form from existing BEP data
 */
function populateFormFromBEP(bep) {
    // Section 1
    Object.keys(bep.projectInfo || {}).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.value = bep.projectInfo[key];
    });

    // Section 2
    Object.keys(bep.roles || {}).forEach(key => {
        const element = document.getElementById(key);
        if (element) element.value = bep.roles[key];
    });

    // Task teams
    if (bep.taskTeams && bep.taskTeams.length > 0) {
        const container = document.getElementById('taskTeamsList');
        container.innerHTML = '';
        bep.taskTeams.forEach(team => {
            addTaskTeam(team);
        });
    }

    // Section 3
    if (bep.standards) {
        Object.keys(bep.standards.software || {}).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) checkbox.checked = true;
        });

        Object.keys(bep.standards.formats || {}).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) checkbox.checked = true;
        });

        Object.keys(bep.standards.protocols || {}).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) checkbox.checked = true;
        });

        if (bep.standards.namingStandard) {
            document.getElementById('namingStandard').value = bep.standards.namingStandard;
        }
        if (bep.standards.originatorCode) {
            document.getElementById('originatorCode').value = bep.standards.originatorCode;
        }
        if (bep.standards.additionalStandards) {
            document.getElementById('additionalStandards').value = bep.standards.additionalStandards;
        }
    }

    // Section 4: LOIN
    if (bep.loin) {
        Object.keys(bep.loin).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = bep.loin[key];
        });
    }

    // Section 5: CDE
    if (bep.cde) {
        Object.keys(bep.cde).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = bep.cde[key];
        });
    }

    // Section 6: Deliverables
    if (bep.deliverables && bep.deliverables.length > 0) {
        const container = document.getElementById('deliverablesList');
        container.innerHTML = '';
        bep.deliverables.forEach(deliverable => {
            addDeliverable(deliverable);
        });
    }

    if (bep.handoverRequirements) {
        Object.keys(bep.handoverRequirements).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Section 7
    if (bep.additionalNotes) {
        document.getElementById('additionalNotes').value = bep.additionalNotes;
    }
}

/**
 * Navigate to next section
 */
function nextSection() {
    if (currentSection < totalSections) {
        // Validate current section
        if (!validateSection(currentSection)) {
            return;
        }

        // Hide current section
        document.querySelector(`.bep-form-section[data-section="${currentSection}"]`).classList.remove('active');

        // Update progress
        document.querySelector(`.progress-step[data-step="${currentSection}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentSection}"]`).classList.add('completed');

        // Show next section
        currentSection++;
        document.querySelector(`.bep-form-section[data-section="${currentSection}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentSection}"]`).classList.add('active');

        // Generate summary if on last section
        if (currentSection === 7) {
            generateSummary();
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Navigate to previous section
 */
function prevSection() {
    if (currentSection > 1) {
        // Hide current section
        document.querySelector(`.bep-form-section[data-section="${currentSection}"]`).classList.remove('active');

        // Update progress
        document.querySelector(`.progress-step[data-step="${currentSection}"]`).classList.remove('active');

        // Show previous section
        currentSection--;
        document.querySelector(`.bep-form-section[data-section="${currentSection}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentSection}"]`).classList.remove('completed');
        document.querySelector(`.progress-step[data-step="${currentSection}"]`).classList.add('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Validate section before proceeding
 */
function validateSection(section) {
    const sectionElement = document.querySelector(`.bep-form-section[data-section="${section}"]`);
    const requiredFields = sectionElement.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'red';
            valid = false;
        } else {
            field.style.borderColor = '';
        }
    });

    if (!valid) {
        Notifications.show('Please fill in all required fields', 'error');
    }

    return valid;
}

/**
 * Add task team entry
 */
function addTaskTeam(data = null) {
    const container = document.getElementById('taskTeamsList');
    const teamDiv = document.createElement('div');
    teamDiv.className = 'team-member';
    teamDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Discipline</label>
                <select class="taskTeamDiscipline">
                    <option value="Architecture" ${data && data.discipline === 'Architecture' ? 'selected' : ''}>Architecture</option>
                    <option value="Structural" ${data && data.discipline === 'Structural' ? 'selected' : ''}>Structural Engineering</option>
                    <option value="MEP" ${data && data.discipline === 'MEP' ? 'selected' : ''}>MEP Engineering</option>
                    <option value="Civil" ${data && data.discipline === 'Civil' ? 'selected' : ''}>Civil Engineering</option>
                    <option value="Landscape" ${data && data.discipline === 'Landscape' ? 'selected' : ''}>Landscape Architecture</option>
                    <option value="Quantity Surveying" ${data && data.discipline === 'Quantity Surveying' ? 'selected' : ''}>Quantity Surveying</option>
                    <option value="Other" ${data && data.discipline === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Organization/Lead</label>
                <input type="text" class="taskTeamOrg" placeholder="Organization name" value="${data ? data.organization : ''}">
            </div>
        </div>
        <div class="form-group">
            <label>Responsibilities</label>
            <input type="text" class="taskTeamResp" placeholder="Key responsibilities and deliverables" value="${data ? data.responsibilities : ''}">
        </div>
        <button type="button" class="remove-button" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(teamDiv);
}

/**
 * Add deliverable entry
 */
function addDeliverable(data = null) {
    const container = document.getElementById('deliverablesList');
    const deliverableDiv = document.createElement('div');
    deliverableDiv.className = 'deliverable-item';
    deliverableDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Deliverable</label>
                <input type="text" class="deliverableName" placeholder="e.g., Architectural Model - Stage 3" value="${data ? data.name : ''}">
            </div>
            <div class="form-group">
                <label>Responsible Party</label>
                <input type="text" class="deliverableResponsible" placeholder="Team/Person" value="${data ? data.responsible : ''}">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Delivery Date</label>
                <input type="date" class="deliverableDate" value="${data ? data.date : ''}">
            </div>
            <div class="form-group">
                <label>Format</label>
                <input type="text" class="deliverableFormat" placeholder="e.g., RVT, IFC, PDF" value="${data ? data.format : ''}">
            </div>
        </div>
        <button type="button" class="remove-button" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(deliverableDiv);
}

/**
 * Update naming convention example
 */
function updateNamingExample() {
    const projectNumber = document.getElementById('projectISONumber').value || '25001';
    const originator = document.getElementById('originatorCode').value || 'BPG';
    const example = `${projectNumber}-${originator}-XX-XX-M3-A-0001_S2_P01.rvt`;
    document.getElementById('namingExample').value = example;
}

/**
 * Collect all form data
 */
function collectFormData() {
    const data = {
        id: currentBEP ? currentBEP.id : 'bep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        projectId: document.getElementById('projectSelect').value,
        bepType: document.getElementById('bepType').value,

        // Section 1: Project Information
        projectInfo: {
            projectName: document.getElementById('projectName').value,
            projectNumber: document.getElementById('projectNumber').value,
            projectISONumber: document.getElementById('projectISONumber').value,
            clientName: document.getElementById('clientName').value,
            projectLocation: document.getElementById('projectLocation').value,
            projectValue: document.getElementById('projectValue').value,
            projectDuration: document.getElementById('projectDuration').value,
            projectStartDate: document.getElementById('projectStartDate').value,
            projectEndDate: document.getElementById('projectEndDate').value,
            projectPhase: document.getElementById('projectPhase').value,
            projectType: document.getElementById('projectType').value,
            projectDescription: document.getElementById('projectDescription').value,
            baileyRole: document.getElementById('baileyRole').value
        },

        // Section 2: Roles
        roles: {
            projectLead: document.getElementById('projectLead').value,
            bimManager: document.getElementById('bimManager').value,
            taskTeamManager: document.getElementById('taskTeamManager').value,
            documentController: document.getElementById('documentController').value,
            designCoordinator: document.getElementById('designCoordinator').value,
            modelCoordinator: document.getElementById('modelCoordinator').value
        },

        // Task Teams
        taskTeams: collectTaskTeams(),

        // Section 3: Standards
        standards: {
            software: {
                soft_revit: document.getElementById('soft_revit').checked,
                soft_archicad: document.getElementById('soft_archicad').checked,
                soft_autocad: document.getElementById('soft_autocad').checked,
                soft_other: document.getElementById('soft_other').checked
            },
            collaboration: {
                collab_navis: document.getElementById('collab_navis').checked,
                collab_bim360: document.getElementById('collab_bim360').checked,
                collab_solibri: document.getElementById('collab_solibri').checked
            },
            formats: {
                format_rvt: document.getElementById('format_rvt').checked,
                format_ifc: document.getElementById('format_ifc').checked,
                format_dwg: document.getElementById('format_dwg').checked,
                format_pdf: document.getElementById('format_pdf').checked,
                format_nwc: document.getElementById('format_nwc').checked
            },
            protocols: {
                std_iso19650: document.getElementById('std_iso19650').checked,
                std_loin: document.getElementById('std_loin').checked,
                std_pas1192: document.getElementById('std_pas1192').checked,
                std_uniclass: document.getElementById('std_uniclass').checked
            },
            namingStandard: document.getElementById('namingStandard').value,
            originatorCode: document.getElementById('originatorCode').value,
            additionalStandards: document.getElementById('additionalStandards').value
        },

        // Section 4: LOIN
        loin: {
            loin_stage2_geo: document.getElementById('loin_stage2_geo').value,
            loin_stage2_data: document.getElementById('loin_stage2_data').value,
            loin_stage2_doc: document.getElementById('loin_stage2_doc').value,
            loin_stage3_geo: document.getElementById('loin_stage3_geo').value,
            loin_stage3_data: document.getElementById('loin_stage3_data').value,
            loin_stage3_doc: document.getElementById('loin_stage3_doc').value,
            loin_stage4_geo: document.getElementById('loin_stage4_geo').value,
            loin_stage4_data: document.getElementById('loin_stage4_data').value,
            loin_stage4_doc: document.getElementById('loin_stage4_doc').value,
            loin_stage5_geo: document.getElementById('loin_stage5_geo').value,
            loin_stage5_data: document.getElementById('loin_stage5_data').value,
            loin_stage5_doc: document.getElementById('loin_stage5_doc').value,
            loin_stage6_geo: document.getElementById('loin_stage6_geo').value,
            loin_stage6_data: document.getElementById('loin_stage6_data').value,
            loin_stage6_doc: document.getElementById('loin_stage6_doc').value,
            loin_stage7_geo: document.getElementById('loin_stage7_geo').value,
            loin_stage7_data: document.getElementById('loin_stage7_data').value,
            loin_stage7_doc: document.getElementById('loin_stage7_doc').value,
            loinNotes: document.getElementById('loinNotes').value
        },

        // Section 5: CDE
        cde: {
            cdeProvider: document.getElementById('cdeProvider').value,
            cdeUrl: document.getElementById('cdeUrl').value,
            folderStructure: document.getElementById('folderStructure').value,
            reviewCycle: document.getElementById('reviewCycle').value,
            coordinationMeetings: document.getElementById('coordinationMeetings').value,
            clashDetection: document.getElementById('clashDetection').value,
            qaProcess: document.getElementById('qaProcess').value,
            modelAudit: document.getElementById('modelAudit').value,
            accessControl: document.getElementById('accessControl').value,
            dataBackup: document.getElementById('dataBackup').value
        },

        // Section 6: Deliverables
        deliverables: collectDeliverables(),
        exchangeSchedule: document.getElementById('exchangeSchedule').value,
        federationStrategy: document.getElementById('federationStrategy').value,
        handoverInfo: document.getElementById('handoverInfo').value,
        handoverRequirements: {
            handover_asbuilt: document.getElementById('handover_asbuilt').checked,
            handover_om: document.getElementById('handover_om').checked,
            handover_cob: document.getElementById('handover_cob').checked,
            handover_drawings: document.getElementById('handover_drawings').checked,
            handover_specs: document.getElementById('handover_specs').checked
        },

        // Section 7: Additional Notes
        additionalNotes: document.getElementById('additionalNotes').value,

        // Metadata
        createdAt: currentBEP ? currentBEP.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return data;
}

/**
 * Collect task teams data
 */
function collectTaskTeams() {
    const teams = [];
    const teamElements = document.querySelectorAll('#taskTeamsList .team-member');

    teamElements.forEach(element => {
        teams.push({
            discipline: element.querySelector('.taskTeamDiscipline').value,
            organization: element.querySelector('.taskTeamOrg').value,
            responsibilities: element.querySelector('.taskTeamResp').value
        });
    });

    return teams;
}

/**
 * Collect deliverables data
 */
function collectDeliverables() {
    const deliverables = [];
    const deliverableElements = document.querySelectorAll('#deliverablesList .deliverable-item');

    deliverableElements.forEach(element => {
        deliverables.push({
            name: element.querySelector('.deliverableName').value,
            responsible: element.querySelector('.deliverableResponsible').value,
            date: element.querySelector('.deliverableDate').value,
            format: element.querySelector('.deliverableFormat').value
        });
    });

    return deliverables;
}

/**
 * Generate summary for review section
 */
function generateSummary() {
    const data = collectFormData();
    const summaryDiv = document.getElementById('bepSummary');

    let html = '<h3>BEP Summary</h3>';

    // Project Information
    html += '<div class="summary-section">';
    html += '<div class="summary-title">Project Information</div>';
    html += '<div class="summary-content">';
    html += `<p><strong>Project:</strong> ${data.projectInfo.projectName} (${data.projectInfo.projectNumber})</p>`;
    html += `<p><strong>Client:</strong> ${data.projectInfo.clientName}</p>`;
    html += `<p><strong>Phase:</strong> ${getPhaseLabel(data.projectInfo.projectPhase)}</p>`;
    html += `<p><strong>BEP Type:</strong> ${data.bepType === 'pre-appointment' ? 'Pre-Appointment (Tender)' : 'Post-Appointment (Delivery)'}</p>`;
    html += `<p><strong>Bailey Role:</strong> ${getRoleLabel(data.projectInfo.baileyRole)}</p>`;
    html += '</div>';
    html += '</div>';

    // Roles
    html += '<div class="summary-section">';
    html += '<div class="summary-title">Key Roles</div>';
    html += '<div class="summary-content">';
    html += `<p><strong>BIM Manager:</strong> ${data.roles.bimManager}</p>`;
    if (data.roles.projectLead) html += `<p><strong>Project Lead:</strong> ${data.roles.projectLead}</p>`;
    html += `<p><strong>Task Teams:</strong> ${data.taskTeams.length} team(s) defined</p>`;
    html += '</div>';
    html += '</div>';

    // Standards
    html += '<div class="summary-section">';
    html += '<div class="summary-title">Standards & Technology</div>';
    html += '<div class="summary-content">';
    html += `<p><strong>Naming Convention:</strong> ${data.standards.namingStandard === 'iso19650' ? 'ISO 19650' : 'Custom'}</p>`;
    html += `<p><strong>Originator Code:</strong> ${data.standards.originatorCode}</p>`;
    const software = Object.entries(data.standards.software).filter(([k, v]) => v).map(([k]) => k.replace('soft_', '')).join(', ');
    if (software) html += `<p><strong>Software:</strong> ${software}</p>`;
    html += '</div>';
    html += '</div>';

    // LOIN
    html += '<div class="summary-section">';
    html += '<div class="summary-title">Level of Information Need</div>';
    html += '<div class="summary-content">';
    html += '<p>LOIN requirements defined for 6 project stages (Concept through In-Use)</p>';
    html += '</div>';
    html += '</div>';

    // CDE
    html += '<div class="summary-section">';
    html += '<div class="summary-title">Common Data Environment</div>';
    html += '<div class="summary-content">';
    html += `<p><strong>Provider:</strong> ${data.cde.cdeProvider}</p>`;
    html += `<p><strong>Review Cycle:</strong> ${data.cde.reviewCycle}</p>`;
    html += `<p><strong>Coordination Meetings:</strong> ${data.cde.coordinationMeetings}</p>`;
    html += '</div>';
    html += '</div>';

    // Deliverables
    html += '<div class="summary-section">';
    html += '<div class="summary-title">Information Deliverables</div>';
    html += '<div class="summary-content">';
    html += `<p><strong>Total Deliverables:</strong> ${data.deliverables.length}</p>`;
    const handoverItems = Object.values(data.handoverRequirements).filter(v => v).length;
    html += `<p><strong>Handover Items:</strong> ${handoverItems} types</p>`;
    html += '</div>';
    html += '</div>';

    summaryDiv.innerHTML = html;
}

/**
 * Get phase label
 */
function getPhaseLabel(phase) {
    const phases = {
        'tender': '5.3 - Tender Response',
        'appointment': '5.4 - Appointment',
        'mobilisation': '5.5 - Mobilisation',
        'production': '5.6 - Collaborative Production',
        'delivery': '5.7 - Information Model Delivery',
        'closeout': '5.8 - Project Close-out'
    };
    return phases[phase] || phase;
}

/**
 * Get role label
 */
function getRoleLabel(role) {
    const roles = {
        'lead_appointed': 'Lead Appointed Party',
        'appointed': 'Appointed Party',
        'consultant': 'Consultant / Task Team'
    };
    return roles[role] || role;
}

/**
 * Save BEP to database
 */
function saveBEP() {
    const data = collectFormData();

    // Validate required fields
    if (!data.projectInfo.projectName || !data.projectInfo.projectNumber || !data.roles.bimManager) {
        Notifications.show('Please fill in all required fields', 'error');
        return;
    }

    // Save to localStorage
    const beps = JSON.parse(localStorage.getItem('bailey_beps') || '[]');
    const existingIndex = beps.findIndex(b => b.id === data.id);

    if (existingIndex >= 0) {
        beps[existingIndex] = data;
        Notifications.show('BEP updated successfully', 'success');
    } else {
        beps.push(data);
        Notifications.show('BEP saved successfully', 'success');
    }

    localStorage.setItem('bailey_beps', JSON.stringify(beps));
    currentBEP = data;

    // Also update the BaileyDB to add BEP methods
    if (!BaileyDB.saveBEP) {
        extendBaileyDB();
    }
}

/**
 * Extend BaileyDB with BEP methods
 */
function extendBaileyDB() {
    BaileyDB.saveBEP = function(bep) {
        const beps = JSON.parse(localStorage.getItem('bailey_beps') || '[]');
        const existingIndex = beps.findIndex(b => b.id === bep.id);

        if (existingIndex >= 0) {
            beps[existingIndex] = { ...beps[existingIndex], ...bep, updatedAt: new Date().toISOString() };
        } else {
            bep.id = bep.id || this.generateId();
            bep.createdAt = new Date().toISOString();
            bep.updatedAt = new Date().toISOString();
            beps.push(bep);
        }

        localStorage.setItem('bailey_beps', JSON.stringify(beps));
        return bep;
    };

    BaileyDB.getBEPs = function() {
        return JSON.parse(localStorage.getItem('bailey_beps') || '[]');
    };

    BaileyDB.getBEP = function(id) {
        const beps = this.getBEPs();
        return beps.find(b => b.id === id);
    };

    BaileyDB.getBEPsByProject = function(projectId) {
        const beps = this.getBEPs();
        return beps.filter(b => b.projectId === projectId);
    };

    BaileyDB.deleteBEP = function(id) {
        const beps = this.getBEPs();
        const filtered = beps.filter(b => b.id !== id);
        localStorage.setItem('bailey_beps', JSON.stringify(filtered));
    };
}

/**
 * Export BEP as document
 */
function exportBEP() {
    const data = collectFormData();

    // Create document content
    let content = generateBEPDocument(data);

    // Create and download
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BEP_${data.projectInfo.projectNumber}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    Notifications.show('BEP exported successfully', 'success');
}

/**
 * Generate BEP document HTML
 */
function generateBEPDocument(data) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>BIM Execution Plan - ${data.projectInfo.projectName}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 8.5in; margin: 0 auto; padding: 1in; line-height: 1.6; }
        h1 { color: #003f7f; border-bottom: 3px solid #f0a000; padding-bottom: 10px; }
        h2 { color: #003f7f; border-bottom: 2px solid #f0a000; padding-bottom: 5px; margin-top: 30px; }
        h3 { color: #003f7f; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #003f7f; color: white; }
        .header { text-align: center; margin-bottom: 30px; }
        .info-box { background: #f0f7ff; border-left: 4px solid #003f7f; padding: 15px; margin: 15px 0; }
        .footer { margin-top: 50px; font-size: 0.9em; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>BIM Execution Plan</h1>
        <h2>${data.projectInfo.projectName}</h2>
        <p><strong>${data.bepType === 'pre-appointment' ? 'Pre-Appointment BEP (Tender)' : 'Post-Appointment BEP (Delivery)'}</strong></p>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="info-box">
        <p><strong>Document Status:</strong> ${data.bepType === 'pre-appointment' ? 'Tender Submission' : 'Approved for Use'}</p>
        <p><strong>Project Number:</strong> ${data.projectInfo.projectNumber}</p>
        <p><strong>ISO 19650 Compliance:</strong> This BEP conforms to ISO 19650-2:2018</p>
    </div>

    <h2>1. Project Information</h2>
    <table>
        <tr><th>Project Name</th><td>${data.projectInfo.projectName}</td></tr>
        <tr><th>Project Number</th><td>${data.projectInfo.projectNumber}</td></tr>
        <tr><th>Client/Appointing Party</th><td>${data.projectInfo.clientName}</td></tr>
        <tr><th>Location</th><td>${data.projectInfo.projectLocation || 'N/A'}</td></tr>
        <tr><th>Project Value</th><td>${data.projectInfo.projectValue ? '£' + data.projectInfo.projectValue : 'N/A'}</td></tr>
        <tr><th>Duration</th><td>${data.projectInfo.projectDuration || 'N/A'}</td></tr>
        <tr><th>Current Phase</th><td>${getPhaseLabel(data.projectInfo.projectPhase)}</td></tr>
        <tr><th>Project Type</th><td>${data.projectInfo.projectType}</td></tr>
        <tr><th>Bailey Role</th><td>${getRoleLabel(data.projectInfo.baileyRole)}</td></tr>
    </table>

    <h3>Project Description</h3>
    <p>${data.projectInfo.projectDescription}</p>

    <h2>2. Information Management Roles and Responsibilities</h2>
    <p>The following roles are assigned in accordance with ISO 19650-2 Annex A:</p>
    <table>
        <tr><th>Role</th><th>Person/Organization</th></tr>
        ${data.roles.projectLead ? `<tr><td>Project Lead</td><td>${data.roles.projectLead}</td></tr>` : ''}
        <tr><td>BIM Manager / Information Manager</td><td>${data.roles.bimManager}</td></tr>
        ${data.roles.taskTeamManager ? `<tr><td>Task Team Manager(s)</td><td>${data.roles.taskTeamManager}</td></tr>` : ''}
        ${data.roles.documentController ? `<tr><td>Document Controller</td><td>${data.roles.documentController}</td></tr>` : ''}
        ${data.roles.designCoordinator ? `<tr><td>Design Coordinator</td><td>${data.roles.designCoordinator}</td></tr>` : ''}
        ${data.roles.modelCoordinator ? `<tr><td>Model Coordinator</td><td>${data.roles.modelCoordinator}</td></tr>` : ''}
    </table>

    <h3>Task Teams</h3>
    <table>
        <tr><th>Discipline</th><th>Organization</th><th>Responsibilities</th></tr>
        ${data.taskTeams.map(team => `
            <tr>
                <td>${team.discipline}</td>
                <td>${team.organization}</td>
                <td>${team.responsibilities}</td>
            </tr>
        `).join('')}
    </table>

    <h2>3. Standards and Technical Procedures</h2>

    <h3>Software and Technology</h3>
    <p><strong>Authoring Software:</strong> ${getCheckedItems(data.standards.software)}</p>
    <p><strong>Collaboration Tools:</strong> ${getCheckedItems(data.standards.collaboration)}</p>
    <p><strong>File Formats:</strong> ${getCheckedItems(data.standards.formats)}</p>

    <h3>Standards and Protocols</h3>
    <p>${getCheckedItems(data.standards.protocols)}</p>
    ${data.standards.additionalStandards ? `<p><strong>Additional Standards:</strong> ${data.standards.additionalStandards}</p>` : ''}

    <h3>Naming Conventions</h3>
    <p><strong>Standard:</strong> ${data.standards.namingStandard === 'iso19650' ? 'ISO 19650' : 'Custom'}</p>
    <p><strong>Originator Code:</strong> ${data.standards.originatorCode}</p>
    <p><strong>Format:</strong> Project-Originator-Volume-Level-Type-Role-Number_Status_Revision</p>

    <h2>4. Level of Information Need (LOIN)</h2>
    <p>Information requirements defined according to BS EN ISO 7817-1:2024</p>

    <h3>LOIN by Project Stage</h3>
    <table>
        <tr>
            <th>Stage</th>
            <th>Geometrical Information</th>
            <th>Alphanumeric Information</th>
            <th>Documentation</th>
        </tr>
        <tr>
            <td>Stage 2: Concept</td>
            <td>${data.loin.loin_stage2_geo}</td>
            <td>${data.loin.loin_stage2_data}</td>
            <td>${data.loin.loin_stage2_doc}</td>
        </tr>
        <tr>
            <td>Stage 3: Spatial Coordination</td>
            <td>${data.loin.loin_stage3_geo}</td>
            <td>${data.loin.loin_stage3_data}</td>
            <td>${data.loin.loin_stage3_doc}</td>
        </tr>
        <tr>
            <td>Stage 4: Technical Design</td>
            <td>${data.loin.loin_stage4_geo}</td>
            <td>${data.loin.loin_stage4_data}</td>
            <td>${data.loin.loin_stage4_doc}</td>
        </tr>
        <tr>
            <td>Stage 5: Construction</td>
            <td>${data.loin.loin_stage5_geo}</td>
            <td>${data.loin.loin_stage5_data}</td>
            <td>${data.loin.loin_stage5_doc}</td>
        </tr>
        <tr>
            <td>Stage 6: Handover</td>
            <td>${data.loin.loin_stage6_geo}</td>
            <td>${data.loin.loin_stage6_data}</td>
            <td>${data.loin.loin_stage6_doc}</td>
        </tr>
        <tr>
            <td>Stage 7: In-Use</td>
            <td>${data.loin.loin_stage7_geo}</td>
            <td>${data.loin.loin_stage7_data}</td>
            <td>${data.loin.loin_stage7_doc}</td>
        </tr>
    </table>

    ${data.loin.loinNotes ? `<p><strong>Additional LOIN Requirements:</strong> ${data.loin.loinNotes}</p>` : ''}

    <h2>5. Common Data Environment (CDE)</h2>

    <h3>CDE Platform</h3>
    <p><strong>Provider:</strong> ${data.cde.cdeProvider}</p>
    ${data.cde.cdeUrl ? `<p><strong>URL:</strong> ${data.cde.cdeUrl}</p>` : ''}

    <h3>Information Management Workflows</h3>
    <div class="info-box">
        <p><strong>CDE States:</strong></p>
        <ul>
            <li><strong>Work in Progress (WIP):</strong> Information under development</li>
            <li><strong>Shared:</strong> Information shared for coordination and review</li>
            <li><strong>Published:</strong> Authorized information for delivery and use</li>
            <li><strong>Archive:</strong> Information retained for record purposes</li>
        </ul>
    </div>

    ${data.cde.folderStructure ? `<h3>Folder Structure</h3><pre>${data.cde.folderStructure}</pre>` : ''}

    <h3>Information Exchange</h3>
    <p><strong>Review and Approval Cycle:</strong> ${data.cde.reviewCycle}</p>
    <p><strong>Coordination Meetings:</strong> ${data.cde.coordinationMeetings}</p>

    ${data.cde.clashDetection ? `<h3>Clash Detection</h3><p>${data.cde.clashDetection}</p>` : ''}
    ${data.cde.qaProcess ? `<h3>Quality Assurance</h3><p>${data.cde.qaProcess}</p>` : ''}
    ${data.cde.modelAudit ? `<h3>Model Audit Procedures</h3><p>${data.cde.modelAudit}</p>` : ''}

    <h3>Information Security</h3>
    ${data.cde.accessControl ? `<p><strong>Access Control:</strong> ${data.cde.accessControl}</p>` : ''}
    ${data.cde.dataBackup ? `<p><strong>Data Backup:</strong> ${data.cde.dataBackup}</p>` : ''}

    <h2>6. Information Deliverables (MIDP)</h2>
    <p>Master Information Delivery Plan outlining key project deliverables</p>

    <table>
        <tr>
            <th>Deliverable</th>
            <th>Responsible Party</th>
            <th>Delivery Date</th>
            <th>Format</th>
        </tr>
        ${data.deliverables.map(d => `
            <tr>
                <td>${d.name}</td>
                <td>${d.responsible}</td>
                <td>${d.date}</td>
                <td>${d.format}</td>
            </tr>
        `).join('')}
    </table>

    ${data.exchangeSchedule ? `<h3>Information Exchange Schedule</h3><p>${data.exchangeSchedule}</p>` : ''}
    ${data.federationStrategy ? `<h3>Model Federation Strategy</h3><p>${data.federationStrategy}</p>` : ''}

    <h3>Handover Requirements</h3>
    ${data.handoverInfo ? `<p>${data.handoverInfo}</p>` : ''}
    <p><strong>Required Handover Deliverables:</strong></p>
    <ul>
        ${data.handoverRequirements.handover_asbuilt ? '<li>As-Built Information Models</li>' : ''}
        ${data.handoverRequirements.handover_om ? '<li>Operations & Maintenance Manuals</li>' : ''}
        ${data.handoverRequirements.handover_cob ? '<li>COBie Data</li>' : ''}
        ${data.handoverRequirements.handover_drawings ? '<li>Record Drawings</li>' : ''}
        ${data.handoverRequirements.handover_specs ? '<li>Specifications and Schedules</li>' : ''}
    </ul>

    ${data.additionalNotes ? `
    <h2>7. Additional Notes</h2>
    <p>${data.additionalNotes}</p>
    ` : ''}

    <div class="footer">
        <p><strong>Bailey Partnership</strong></p>
        <p>This BIM Execution Plan has been prepared in accordance with ISO 19650-2:2018</p>
        <p>Document ID: ${data.id}</p>
        <p>Created: ${new Date(data.createdAt).toLocaleString()}</p>
        <p>Last Updated: ${new Date(data.updatedAt).toLocaleString()}</p>
    </div>
</body>
</html>
    `;

    return html;
}

/**
 * Get checked items from object
 */
function getCheckedItems(obj) {
    const items = Object.entries(obj)
        .filter(([k, v]) => v)
        .map(([k]) => k.replace(/^(soft_|collab_|format_|std_)/, '').replace('_', ' '));
    return items.length > 0 ? items.join(', ') : 'Not specified';
}

/**
 * Print BEP
 */
function printBEP() {
    const data = collectFormData();
    const content = generateBEPDocument(data);

    // Open in new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(content);
    printWindow.document.close();

    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Initialize Notifications if not available
if (typeof Notifications === 'undefined') {
    window.Notifications = {
        show: function(message, type) {
            alert(message);
        }
    };
}
