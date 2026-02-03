/**
 * Bailey Partnership ISO19650 Dashboard
 * Core JavaScript functionality
 */

// ==========================================
// DATABASE MANAGEMENT (LocalStorage)
// ==========================================

const BaileyDB = {
  /**
   * Initialize database structure
   */
  init() {
    if (!localStorage.getItem('bailey_projects')) {
      localStorage.setItem('bailey_projects', JSON.stringify([]));
    }
    if (!localStorage.getItem('bailey_templates')) {
      localStorage.setItem('bailey_templates', JSON.stringify([]));
    }
    if (!localStorage.getItem('bailey_raci_matrices')) {
      localStorage.setItem('bailey_raci_matrices', JSON.stringify([]));
    }
  },

  /**
   * Save a project to the database
   * @param {Object} project - Project object
   */
  saveProject(project) {
    const projects = this.getProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);

    if (existingIndex >= 0) {
      projects[existingIndex] = { ...projects[existingIndex], ...project, updatedAt: new Date().toISOString() };
    } else {
      project.id = project.id || this.generateId();
      project.createdAt = new Date().toISOString();
      project.updatedAt = new Date().toISOString();
      projects.push(project);
    }

    localStorage.setItem('bailey_projects', JSON.stringify(projects));
    return project;
  },

  /**
   * Get all projects
   */
  getProjects() {
    return JSON.parse(localStorage.getItem('bailey_projects') || '[]');
  },

  /**
   * Get project by ID
   * @param {string} id - Project ID
   */
  getProject(id) {
    const projects = this.getProjects();
    return projects.find(p => p.id === id);
  },

  /**
   * Get project by ISO19650 number
   * @param {string} isoNumber - ISO19650 project number
   */
  getProjectByISONumber(isoNumber) {
    const projects = this.getProjects();
    return projects.find(p => p.isoNumber === isoNumber);
  },

  /**
   * Delete project
   * @param {string} id - Project ID
   */
  deleteProject(id) {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem('bailey_projects', JSON.stringify(filtered));
  },

  /**
   * Save a template/document
   * @param {Object} template - Template object
   */
  saveTemplate(template) {
    const templates = this.getTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);

    if (existingIndex >= 0) {
      templates[existingIndex] = { ...templates[existingIndex], ...template, updatedAt: new Date().toISOString() };
    } else {
      template.id = template.id || this.generateId();
      template.createdAt = new Date().toISOString();
      template.updatedAt = new Date().toISOString();
      templates.push(template);
    }

    localStorage.setItem('bailey_templates', JSON.stringify(templates));
    return template;
  },

  /**
   * Get all templates
   */
  getTemplates() {
    return JSON.parse(localStorage.getItem('bailey_templates') || '[]');
  },

  /**
   * Get template by ID
   * @param {string} id - Template ID
   */
  getTemplate(id) {
    const templates = this.getTemplates();
    return templates.find(t => t.id === id);
  },

  /**
   * Save RACI matrix
   * @param {Object} raci - RACI matrix object
   */
  saveRACIMatrix(raci) {
    const matrices = this.getRACIMatrices();
    const existingIndex = matrices.findIndex(r => r.id === raci.id);

    if (existingIndex >= 0) {
      matrices[existingIndex] = { ...matrices[existingIndex], ...raci, updatedAt: new Date().toISOString() };
    } else {
      raci.id = raci.id || this.generateId();
      raci.createdAt = new Date().toISOString();
      raci.updatedAt = new Date().toISOString();
      matrices.push(raci);
    }

    localStorage.setItem('bailey_raci_matrices', JSON.stringify(matrices));
    return raci;
  },

  /**
   * Get all RACI matrices
   */
  getRACIMatrices() {
    return JSON.parse(localStorage.getItem('bailey_raci_matrices') || '[]');
  },

  /**
   * Get RACI matrix by project ID
   * @param {string} projectId - Project ID
   */
  getRACIMatrixByProject(projectId) {
    const matrices = this.getRACIMatrices();
    return matrices.filter(r => r.projectId === projectId);
  },

  /**
   * Generate unique ID
   */
  generateId() {
    return 'bp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  },

  /**
   * Export all data as JSON
   */
  exportData() {
    return {
      projects: this.getProjects(),
      templates: this.getTemplates(),
      raciMatrices: this.getRACIMatrices(),
      exportedAt: new Date().toISOString()
    };
  },

  /**
   * Import data from JSON
   * @param {Object} data - Data to import
   */
  importData(data) {
    if (data.projects) {
      localStorage.setItem('bailey_projects', JSON.stringify(data.projects));
    }
    if (data.templates) {
      localStorage.setItem('bailey_templates', JSON.stringify(data.templates));
    }
    if (data.raciMatrices) {
      localStorage.setItem('bailey_raci_matrices', JSON.stringify(data.raciMatrices));
    }
  }
};

// ==========================================
// NAVIGATION
// ==========================================

const Navigation = {
  /**
   * Initialize navigation
   */
  init() {
    this.updateActiveLink();
    window.addEventListener('scroll', () => this.updateActiveLink());

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.nav-sidebar');

    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }
  },

  /**
   * Update active navigation link based on scroll position
   */
  updateActiveLink() {
    const sections = document.querySelectorAll('.report-section, .subsection[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const offset = 100; // Offset for fixed header

      if (rect.top <= offset && rect.bottom >= offset) {
        currentSection = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
};

// ==========================================
// FORM UTILITIES
// ==========================================

const FormUtils = {
  /**
   * Validate required fields
   * @param {HTMLFormElement} form - Form to validate
   */
  validateRequired(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });

    return isValid;
  },

  /**
   * Get form data as object
   * @param {HTMLFormElement} form - Form element
   */
  getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      // Handle multiple values (checkboxes)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    return data;
  },

  /**
   * Populate form with data
   * @param {HTMLFormElement} form - Form element
   * @param {Object} data - Data to populate
   */
  populateForm(form, data) {
    Object.keys(data).forEach(key => {
      const field = form.elements[key];
      if (field) {
        if (field.type === 'checkbox') {
          field.checked = data[key];
        } else if (field.type === 'radio') {
          const radio = form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
          if (radio) radio.checked = true;
        } else {
          field.value = data[key];
        }
      }
    });
  }
};

// ==========================================
// TABLE UTILITIES
// ==========================================

const TableUtils = {
  /**
   * Make table sortable
   * @param {HTMLTableElement} table - Table element
   */
  makeSortable(table) {
    const headers = table.querySelectorAll('th.sortable');

    headers.forEach((header, index) => {
      header.addEventListener('click', () => {
        this.sortTable(table, index, header);
      });
    });
  },

  /**
   * Sort table by column
   * @param {HTMLTableElement} table - Table element
   * @param {number} column - Column index
   * @param {HTMLElement} header - Header element
   */
  sortTable(table, column, header) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Determine sort direction
    const isAscending = !header.classList.contains('sorted-asc');

    // Remove all sort classes
    table.querySelectorAll('th').forEach(th => {
      th.classList.remove('sorted-asc', 'sorted-desc');
    });

    // Add appropriate class
    header.classList.add(isAscending ? 'sorted-asc' : 'sorted-desc');

    // Sort rows
    rows.sort((a, b) => {
      const aValue = a.cells[column].textContent.trim();
      const bValue = b.cells[column].textContent.trim();

      // Try to parse as number
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return isAscending ? aNum - bNum : bNum - aNum;
      }

      // String comparison
      return isAscending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
  },

  /**
   * Filter table rows
   * @param {HTMLTableElement} table - Table element
   * @param {string} searchText - Search text
   */
  filterTable(table, searchText) {
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const search = searchText.toLowerCase();

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(search) ? '' : 'none';
    });
  }
};

// ==========================================
// MODAL UTILITIES
// ==========================================

const ModalUtils = {
  /**
   * Open modal
   * @param {string} modalId - Modal element ID
   */
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  /**
   * Close modal
   * @param {string} modalId - Modal element ID
   */
  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  /**
   * Initialize modal close handlers
   */
  init() {
    document.querySelectorAll('.modal__close, .modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = btn.closest('.modal');
        if (modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  }
};

// ==========================================
// ISO19650 NAMING CONVENTION
// ==========================================

const ISO19650Naming = {
  /**
   * Generate ISO19650 compliant filename
   * @param {Object} params - Naming parameters
   * @returns {string} - Formatted filename
   */
  generate(params) {
    const {
      project = 'XXXXX',
      originator = 'BPG',
      functional = 'XX',
      spatial = 'XX',
      form = 'T',
      discipline = 'O',
      number = '0001',
      status = 'S0',
      revision = 'P01'
    } = params;

    return `${project}-${originator}-${functional}-${spatial}-${form}-${discipline}-${number}_${status}_${revision}`;
  },

  /**
   * Parse ISO19650 filename
   * @param {string} filename - Filename to parse
   * @returns {Object} - Parsed components
   */
  parse(filename) {
    const pattern = /^([^-]+)-([^-]+)-([^-]+)-([^-]+)-([^-]+)-([^-]+)-([^_]+)_([^_]+)_(.+)$/;
    const match = filename.match(pattern);

    if (!match) return null;

    return {
      project: match[1],
      originator: match[2],
      functional: match[3],
      spatial: match[4],
      form: match[5],
      discipline: match[6],
      number: match[7],
      status: match[8],
      revision: match[9]
    };
  },

  /**
   * Get status code description
   * @param {string} code - Status code
   */
  getStatusDescription(code) {
    const statuses = {
      'S0': 'Work in Progress (WIP)',
      'S1': 'Suitable for Coordination',
      'S2': 'Suitable for Information',
      'S3': 'Suitable for Review and Comment',
      'S4': 'Suitable for Stage Approval',
      'S5': 'Suitable for Contractor Design',
      'A1': 'Published',
      'A2': 'Published - Amended'
    };
    return statuses[code] || 'Unknown';
  }
};

// ==========================================
// NOTIFICATION SYSTEM
// ==========================================

const Notifications = {
  /**
   * Show notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (success, warning, danger, info)
   */
  show(message, type = 'info') {
    const container = this.getContainer();

    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <span class="notification__message">${message}</span>
      <button class="notification__close">×</button>
    `;

    container.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('notification--fadeout');
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button
    notification.querySelector('.notification__close').addEventListener('click', () => {
      notification.classList.add('notification--fadeout');
      setTimeout(() => notification.remove(), 300);
    });
  },

  /**
   * Get or create notification container
   */
  getContainer() {
    let container = document.getElementById('notifications');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notifications';
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
    return container;
  }
};

// Add notification styles dynamically
const notificationStyles = `
.notification-container {
  position: fixed;
  top: calc(var(--metadata-height) + 1rem);
  right: 1rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
}

.notification {
  background: white;
  border-left: 4px solid;
  border-radius: var(--border-radius-sm);
  padding: 1rem;
  box-shadow: var(--shadow-md);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification--fadeout {
  animation: fadeOut 0.3s ease forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

.notification--success { border-color: var(--color-success); }
.notification--warning { border-color: var(--color-warning); }
.notification--danger { border-color: var(--color-danger); }
.notification--info { border-color: var(--color-primary-band); }

.notification__message {
  flex: 1;
  font-size: var(--text-small);
}

.notification__close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 0;
  line-height: 1;
}

.notification__close:hover {
  color: var(--color-text-primary);
}
`;

// Inject notification styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = notificationStyles;
  document.head.appendChild(style);
}

// ==========================================
// INITIALIZE ON DOM READY
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize database
  BaileyDB.init();

  // Initialize navigation
  Navigation.init();

  // Initialize modals
  ModalUtils.init();

  // Make all tables with .data-table sortable
  document.querySelectorAll('.data-table').forEach(table => {
    TableUtils.makeSortable(table);
  });

  console.log('Bailey Partnership ISO19650 Dashboard initialized');
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BaileyDB,
    Navigation,
    FormUtils,
    TableUtils,
    ModalUtils,
    ISO19650Naming,
    Notifications
  };
}
