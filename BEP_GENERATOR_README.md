# BEP Generator Feature

## Overview

The BEP (BIM Execution Plan) Generator is a comprehensive tool for creating ISO 19650-compliant BIM Execution Plans. It guides users through a methodical process to define all aspects of information management for a project.

## Features

### 1. **Project Pre-Population**
- Select an existing project from the dropdown to automatically populate project information
- Supports both WorkflowMax-synced and manually created projects
- Saves time by reusing existing project data

### 2. **Multi-Step Wizard Interface**
The BEP generator uses a 7-step wizard to systematically collect all required information:

#### Step 1: Project Information
- Basic project details (name, number, location, value)
- Project phase (aligned with ISO 19650-2 clauses 5.3-5.8)
- Project type and description
- Bailey Partnership role (Lead Appointed Party, Appointed Party, or Consultant)

#### Step 2: Roles and Responsibilities
- Key information management roles (ISO 19650-2 Annex A)
- BIM Manager/Information Manager
- Project Lead, Task Team Managers, Document Controller
- Task team structure and responsibilities by discipline

#### Step 3: Standards and Procedures
- Software and technology selection (Revit, ArchiCAD, AutoCAD, etc.)
- Collaboration tools (Navisworks, BIM 360/ACC, Solibri)
- File format requirements (native, IFC, DWG, PDF)
- Naming conventions (ISO 19650 standard)
- Standards compliance (ISO 19650, BS EN ISO 7817-1, Uniclass, etc.)

#### Step 4: Level of Information Need (LOIN)
- **IMPORTANT UPDATE**: Now uses BS EN ISO 7817-1:2024 (formerly BS EN 17412-1:2020)
- Define LOIN for 6 project stages (Concept through In-Use)
- Three components for each stage:
  - **Geometrical Information**: Level of detail and accuracy
  - **Alphanumeric Information**: Non-graphical data and properties
  - **Documentation**: Associated documents and specifications
- Simple dropdown selections for each stage
- Pre-configured with recommended defaults

#### Step 5: CDE and Information Management
- Common Data Environment provider selection
- CDE folder structure definition
- Information exchange protocols
- Review and approval cycles
- Clash detection procedures
- Quality assurance processes
- Information security and access control
- Data backup and recovery procedures

#### Step 6: Information Deliverables
- Master Information Delivery Plan (MIDP)
- Define key deliverables with responsible parties and dates
- Information exchange schedule
- Model federation strategy
- Asset Information Requirements (AIR) for handover
- Handover deliverables selection (As-Built models, O&M manuals, COBie, etc.)

#### Step 7: Review and Generate
- Summary of all entered information
- Additional notes and project-specific requirements
- Save BEP to database
- Export as HTML document
- Print functionality

### 3. **LOIN Implementation**

The BEP generator includes a comprehensive Level of Information Need (LOIN) framework:

**What is LOIN?**
LOIN specifies the extent and granularity of information required at each project stage, consisting of:
- Geometrical Information
- Alphanumeric Information
- Documentation

**Predefined LOIN Levels:**

| Stage | Typical Geometric Detail | Typical Data Richness | Typical Documentation |
|-------|-------------------------|----------------------|---------------------|
| Stage 2: Concept | Conceptual (masses/volumes) | Minimal (basic properties) | Basic drawings |
| Stage 3: Spatial Coord. | Approximate geometry | Moderate | Standard set |
| Stage 4: Technical | Precise geometry | Detailed | Comprehensive |
| Stage 5: Construction | Exact/As-designed | Comprehensive | Comprehensive + Fabrication |
| Stage 6: Handover | As-Built | Operational (O&M) | As-Built + O&M |
| Stage 7: In-Use | As-Built (verified) | Operational (O&M) | As-Built + O&M |

### 4. **Export and Document Generation**

The BEP generator can export a fully formatted HTML document that includes:
- Professional formatting with Bailey Partnership branding
- All project information in structured tables
- ISO 19650 compliance statements
- LOIN requirements by stage
- CDE workflows and information security protocols
- MIDP with deliverable schedules
- Document metadata (creation date, version, etc.)

The exported document can be:
- Downloaded as an HTML file
- Printed directly to PDF
- Shared with clients and project teams

### 5. **Data Persistence**

All BEP data is stored in the browser's localStorage under the key `bailey_beps`. BEPs are:
- Automatically saved when clicking "Save BEP"
- Linked to projects via projectId
- Included in the Export/Import data functionality
- Versioned with creation and update timestamps

## ISO 19650 Compliance

The BEP generator is aligned with:

- **ISO 19650-1:2018** - Concepts and principles
- **ISO 19650-2:2018** - Delivery phase of assets
- **BS EN ISO 7817-1:2024** - Level of Information Need (replaces BS EN 17412-1:2020)

### Key ISO 19650-2 Requirements Covered:

1. **Pre-Appointment BEP (Clause 5.3.2)** - Tender submission
2. **Post-Appointment BEP (Clause 5.4.1)** - Confirmed delivery plan
3. **Information Management Functions (Annex A)** - Role assignments
4. **Master Information Delivery Plan** - Delivery schedules
5. **CDE Workflows (ISO 19650-1 Clause 5.4)** - WIP, Shared, Published, Archive states
6. **Information Naming Conventions** - Project-Originator-Volume-Level-Type-Role-Number format

## Usage Workflow

### Creating a New BEP

1. Navigate to **3.4 BEP Generator** from the main dashboard
2. (Optional) Select an existing project to pre-populate data
3. Select BEP Type: Pre-Appointment (Tender) or Post-Appointment (Delivery)
4. Complete all 7 sections, using Next/Previous buttons to navigate
5. Review the summary in Section 7
6. Click "Save BEP" to store in the database
7. Click "Export as Document" to download an HTML file
8. Or click "Print BEP" to generate a PDF via browser print

### Editing an Existing BEP

1. Navigate to the BEP generator with `?id=<bep_id>` in the URL
2. The form will pre-populate with existing data
3. Make changes as needed
4. Click "Save BEP" to update

### Best Practices

1. **Start from a Project**: Always select a project first to auto-populate basic information
2. **Complete All Sections**: While only some fields are required, completing all sections creates a more comprehensive BEP
3. **Use Descriptive Names**: For deliverables and task teams, use clear, descriptive names
4. **Review Before Export**: Always review the summary in Section 7 before exporting
5. **Save Regularly**: The browser doesn't auto-save, so click "Save BEP" after completing each section
6. **Export for Sharing**: The HTML export is perfect for emailing to clients or including in tender submissions

## Technical Details

### Files

- `/pages/tools/bep-generator.html` - Main HTML page with form structure
- `/pages/tools/bep-generator.js` - JavaScript functionality for data management and export
- `/assets/js/dashboard.js` - Extended with BEP storage methods

### localStorage Keys

- `bailey_beps` - Array of BEP objects

### BEP Data Structure

```javascript
{
  id: 'bep_[timestamp]_[random]',
  projectId: 'bp_...',  // Link to project
  bepType: 'pre-appointment' | 'post-appointment',
  projectInfo: { ... },
  roles: { ... },
  taskTeams: [ ... ],
  standards: { ... },
  loin: { ... },
  cde: { ... },
  deliverables: [ ... ],
  handoverRequirements: { ... },
  additionalNotes: string,
  createdAt: ISO8601,
  updatedAt: ISO8601
}
```

### API Methods (BaileyDB)

- `BaileyDB.saveBEP(bep)` - Save or update a BEP
- `BaileyDB.getBEPs()` - Get all BEPs
- `BaileyDB.getBEP(id)` - Get BEP by ID
- `BaileyDB.getBEPsByProject(projectId)` - Get all BEPs for a project
- `BaileyDB.deleteBEP(id)` - Delete a BEP

## Browser Compatibility

- Modern browsers with localStorage support (Chrome, Firefox, Safari, Edge)
- JavaScript must be enabled
- Recommended minimum screen width: 1024px for optimal layout

## Future Enhancements

Potential future improvements:
- PDF export (currently HTML only)
- BEP templates for common project types
- Version comparison between BEPs
- Automatic TIDP generation from BEP
- Integration with RACI matrices
- BEP approval workflow
- Multi-language support

## Support and Resources

### References

- [ISO 19650 BEP Guidance (CDBB)](https://www.cdbb.cam.ac.uk/files/bep_guidance.pdf)
- [UK BIM Framework Guidance Part E](https://www.ukbimframework.org/wp-content/uploads/2021/02/Guidance-Part-E_Tendering-and-appointments_Edition-2.pdf)
- [NATSPEC BIM Templates](https://bim.natspec.org/documents/natspec-bim-execution-plan-bep-templates)
- [BS EN ISO 7817-1:2024 - Level of Information Need](https://www.iso.org/standard/78394.html)

### Key Standards

- ISO 19650-1:2018 - Building information modelling — Information management using building information modelling — Part 1: Concepts and principles
- ISO 19650-2:2018 - Building information modelling — Information management using building information modelling — Part 2: Delivery phase of the assets
- BS EN ISO 7817-1:2024 - Building information modelling — Level of information need — Part 1: Concepts and principles (formerly BS EN 17412-1:2020)

## License

© 2025 Bailey Partnership Group Limited. All rights reserved.
