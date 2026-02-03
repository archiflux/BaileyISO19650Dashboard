# Bailey Partnership ISO19650 Dashboard

A comprehensive web-based dashboard for managing ISO19650 compliance, policies, templates, and project information for Bailey Partnership Group Limited.

## Overview

This dashboard provides a centralized platform for:
- **Information Management Policies** - BS EN ISO 19650 compliant policies and procedures
- **Project Management** - Track projects with ISO19650 numbering system
- **RACI Matrix Generator** - Create responsibility assignment matrices
- **Templates & Tools** - BEP generators, mobilisation plans, and capability assessments
- **Document Database** - Store and retrieve project documents and templates

## Features

### 📋 Policy Management
- Information Management Policy
- Capability & Capacity Policy
- Quality Assurance frameworks
- UK BIM Framework alignment

### 🚀 Project Tools
- New project setup wizard with ISO19650 numbering
- Project tracking and management
- BIM Execution Plan (BEP) generator
- Mobilisation plan templates

### 📊 RACI Matrix Generator
- Pre-configured templates for Lead Appointed Party and Appointed Party roles
- ISO 19650-2 clause references
- Customizable for all project phases
- Export to CSV functionality

### 💾 Data Management
- Local storage database (browser-based)
- Export/import functionality for backups
- No server required - fully client-side
- Privacy-focused - data never leaves your browser

### 🎨 Professional Design
- Based on Claude Code Dashboard Design System
- Responsive layout for desktop and mobile
- Print-ready styling for reports and policies
- Accessible and user-friendly interface

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required

### Access
This dashboard is designed to be hosted on **GitHub Pages**:

1. The dashboard will be available at: `https://[username].github.io/BaileyISO19650Dashboard/`
2. No server setup or database configuration needed
3. All data is stored locally in your browser

### Usage

1. **View Policies**: Navigate through policies in the sidebar
2. **Create Project**: Use "New Project Setup" to register a project
3. **Generate RACI Matrix**: Select project type and phase to generate matrices
4. **Export Data**: Regularly export your data for backup

## Project Structure

```
BaileyISO19650Dashboard/
├── index.html                 # Main dashboard homepage
├── _config.yml               # GitHub Pages configuration
├── assets/
│   ├── css/
│   │   └── dashboard.css     # Complete styling system
│   ├── js/
│   │   └── dashboard.js      # Core functionality and database
│   └── images/               # Images and logos
├── pages/
│   ├── policies/             # Policy documents
│   │   ├── information-management-policy.html
│   │   ├── capability-capacity-policy.html
│   │   └── quality-assurance.html
│   ├── tools/                # Interactive tools
│   │   ├── project-setup.html
│   │   ├── project-list.html
│   │   ├── raci-matrix.html
│   │   └── export-import.html
│   ├── templates/            # Template generators
│   └── guidance/             # Guidance documents
├── data/                     # Data storage (JSON)
└── OriginalDocs/            # Source documents (not published)
```

## ISO19650 Compliance

This dashboard implements:
- **BS EN ISO 19650-1**: Concepts and principles
- **BS EN ISO 19650-2**: Delivery phase requirements
- **UK BIM Framework**: National Annex requirements
- **Information Management Functions**: Container management, QA, security
- **Project Lifecycle Phases**: Tender through close-out

### ISO19650 Naming Convention

Documents follow the standard:
```
[Project]-[Originator]-[Functional]-[Spatial]-[Form]-[Discipline]-[Number]_[Status]_[Revision]

Example: 25001-BPG-XX-XX-T-O-0001_S0_P01
```

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **JavaScript** - Vanilla JS (no frameworks)
- **LocalStorage API** - Client-side database
- **Chart.js 4.4.1** - Data visualization (optional)
- **GitHub Pages** - Static hosting

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Data Storage

Data is stored using browser LocalStorage:
- **Capacity**: ~5-10MB per domain
- **Persistence**: Remains after browser closes
- **Privacy**: Never sent to servers
- **Limitations**: Browser and device specific

**Recommendation**: Export data regularly for backups

## Development

### Local Testing

To test locally:
```bash
# Clone repository
git clone https://github.com/[username]/BaileyISO19650Dashboard.git
cd BaileyISO19650Dashboard

# Open in browser
# Simply open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

### Customization

1. **Styling**: Edit `assets/css/dashboard.css`
2. **Functionality**: Modify `assets/js/dashboard.js`
3. **Content**: Update HTML files in `pages/`
4. **Branding**: Replace logos and colors in CSS variables

## Future Enhancements

Based on original requirements and document analysis, future additions may include:

- [ ] Complete BEP generator with form-based input
- [ ] Additional guidance pages from original documents
- [ ] CDE workflow visualizations
- [ ] Capability assessment questionnaire tool
- [ ] Lessons learned capture forms
- [ ] Document naming convention validator
- [ ] Risk register templates
- [ ] Training module tracking

## Important Notes

### IMI Transition
As noted in the policy documents, ISO 19650 standards are expected to be replaced by the Information Management Initiative (IMI) within 3-5 years. This dashboard is designed to be flexible and can be updated to align with new standards as they emerge.

### No Formal Certification
Bailey Partnership has strategically decided to defer formal ISO 19650 certification while building internal capability and monitoring the transition to IMI. This dashboard supports internal implementation without the pressure of certification requirements.

## Support & Maintenance

For questions or issues:
1. Check the guidance pages within the dashboard
2. Review original policy documents in `OriginalDocs/`
3. Consult the UK BIM Framework: https://www.ukbimframework.org/

## License

© 2025 Bailey Partnership Group Limited. All rights reserved.

This dashboard is for internal use by Bailey Partnership Group Limited and authorized personnel.

## References

- BS EN ISO 19650-1:2018 - Organization and digitization of information
- BS EN ISO 19650-2:2018 - Delivery phase of assets
- UK BIM Framework - https://www.ukbimframework.org/
- BSI ISO 19650 - https://www.bsigroup.com/en-GB/iso-19650/

---

**Version**: 1.0
**Last Updated**: February 2025
**Status**: Active Development
