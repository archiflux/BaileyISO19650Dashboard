/**
 * WorkflowMax API Integration
 * Read-only access to WorkflowMax project data
 *
 * IMPORTANT: This integration is READ-ONLY and will never modify WorkflowMax data
 */

const WorkflowMaxAPI = {
  // Configuration
  config: {
    clientId: '', // Will be set by user after creating the app
    redirectUri: window.location.origin + '/BaileyISO19650Dashboard/oauth-callback.html',
    authEndpoint: 'https://login.xero.com/identity/connect/authorize',
    tokenEndpoint: 'https://identity.xero.com/connect/token',
    apiBase: 'https://api.xero.com/workflowmax/3.0',
    scope: 'workflowmax offline_access', // Read-only scope
  },

  /**
   * Initialize with client credentials
   */
  init(clientId, clientSecret = null) {
    this.config.clientId = clientId;
    if (clientSecret) {
      // Store securely in sessionStorage (better than localStorage for secrets)
      sessionStorage.setItem('wfm_client_secret', clientSecret);
    }

    // Load stored tokens if they exist
    this.loadTokens();
  },

  /**
   * Generate a random state for CSRF protection
   */
  generateState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },

  /**
   * Generate PKCE code verifier and challenge
   */
  async generatePKCE() {
    const verifier = this.generateRandomString(128);
    const challenge = await this.generateCodeChallenge(verifier);
    return { verifier, challenge };
  },

  generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let text = '';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },

  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(hash);
  },

  base64URLEncode(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  },

  /**
   * Start OAuth authorization flow
   */
  async authorize() {
    if (!this.config.clientId) {
      throw new Error('Client ID not configured. Please set up WorkflowMax app credentials.');
    }

    // Generate state for CSRF protection
    const state = this.generateState();
    sessionStorage.setItem('wfm_oauth_state', state);

    // Generate PKCE (recommended for public clients like browser apps)
    const pkce = await this.generatePKCE();
    sessionStorage.setItem('wfm_code_verifier', pkce.verifier);

    // Build authorization URL
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scope,
      state: state,
      code_challenge: pkce.challenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `${this.config.authEndpoint}?${params.toString()}`;

    // Redirect to authorization page
    window.location.href = authUrl;
  },

  /**
   * Exchange authorization code for access token
   * Note: This typically requires a server-side proxy due to CORS
   */
  async exchangeCodeForToken(code) {
    const codeVerifier = sessionStorage.getItem('wfm_code_verifier');
    const clientSecret = sessionStorage.getItem('wfm_client_secret');

    if (!codeVerifier) {
      throw new Error('Code verifier not found. Please restart the authorization process.');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      code: code,
      redirect_uri: this.config.redirectUri,
      code_verifier: codeVerifier
    });

    // If client secret is provided, include it
    if (clientSecret) {
      body.append('client_secret', clientSecret);
    }

    try {
      // Note: This will likely fail due to CORS restrictions
      // You may need to use a serverless function or proxy
      const response = await fetch(this.config.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Token exchange failed');
      }

      const tokens = await response.json();
      this.saveTokens(tokens);
      sessionStorage.removeItem('wfm_code_verifier');

      return tokens;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw error;
    }
  },

  /**
   * Save tokens to localStorage
   */
  saveTokens(tokens) {
    localStorage.setItem('wfm_access_token', tokens.access_token);
    if (tokens.refresh_token) {
      localStorage.setItem('wfm_refresh_token', tokens.refresh_token);
    }
    if (tokens.expires_in) {
      const expiresAt = Date.now() + (tokens.expires_in * 1000);
      localStorage.setItem('wfm_token_expires_at', expiresAt.toString());
    }
    this.loadTokens();
  },

  /**
   * Load tokens from localStorage
   */
  loadTokens() {
    this.accessToken = localStorage.getItem('wfm_access_token');
    this.refreshToken = localStorage.getItem('wfm_refresh_token');
    this.tokenExpiresAt = parseInt(localStorage.getItem('wfm_token_expires_at') || '0');
  },

  /**
   * Check if we have valid tokens
   */
  isAuthorized() {
    this.loadTokens();
    return !!(this.accessToken && this.tokenExpiresAt > Date.now());
  },

  /**
   * Clear all stored tokens
   */
  clearTokens() {
    localStorage.removeItem('wfm_access_token');
    localStorage.removeItem('wfm_refresh_token');
    localStorage.removeItem('wfm_token_expires_at');
    sessionStorage.removeItem('wfm_client_secret');
    sessionStorage.removeItem('wfm_code_verifier');
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = 0;
  },

  /**
   * Make an API request to WorkflowMax
   * READ-ONLY: Only GET requests are allowed
   */
  async apiRequest(endpoint, options = {}) {
    if (!this.isAuthorized()) {
      throw new Error('Not authorized. Please connect to WorkflowMax first.');
    }

    // SECURITY: Only allow GET requests (read-only)
    if (options.method && options.method !== 'GET') {
      throw new Error('Only GET requests are allowed. This integration is read-only.');
    }

    const url = `${this.config.apiBase}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (response.status === 401) {
        // Token expired, need to re-authorize
        this.clearTokens();
        throw new Error('Authorization expired. Please reconnect to WorkflowMax.');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WorkflowMax API error:', error);
      throw error;
    }
  },

  /**
   * Get all jobs/projects
   * READ-ONLY
   */
  async getJobs(options = {}) {
    const params = new URLSearchParams();

    if (options.status) params.append('status', options.status);
    if (options.from) params.append('from', options.from);
    if (options.to) params.append('to', options.to);

    const query = params.toString() ? `?${params.toString()}` : '';
    return await this.apiRequest(`/job.api/list${query}`);
  },

  /**
   * Get a specific job by ID
   * READ-ONLY
   */
  async getJob(jobId) {
    return await this.apiRequest(`/job.api/get/${jobId}`);
  },

  /**
   * Get job details including custom fields
   * READ-ONLY
   */
  async getJobDetails(jobId) {
    const job = await this.getJob(jobId);
    return this.mapJobToProject(job);
  },

  /**
   * Get all active jobs (In Progress status)
   * READ-ONLY
   */
  async getActiveJobs() {
    return await this.getJobs({ status: 'InProgress' });
  },

  /**
   * Map WorkflowMax job to ISO19650 project format
   */
  mapJobToProject(wfmJob) {
    // Extract custom fields
    const customFields = {};
    if (wfmJob.CustomFields) {
      wfmJob.CustomFields.forEach(field => {
        customFields[field.Name] = field.Value;
      });
    }

    // Map to our project structure
    return {
      // Basic info
      projectName: wfmJob.Name,
      projectNumber: wfmJob.Number,
      clientName: wfmJob.Client?.Name,
      projectDescription: wfmJob.Description,
      projectStartDate: wfmJob.StartDate,
      projectValue: wfmJob.Budget || customFields['Works Value'],

      // ISO19650 specific
      isoNumber: customFields['ISO 19650 - Project Identifier'] || wfmJob.Number,

      // Team members
      projectLead: wfmJob.Manager?.Name,
      bimManager: customFields['Information Manager'],

      // WorkflowMax specific
      projectPhase: this.mapRIBAStage(customFields['RIBA Stage (Current)']),
      baileyRole: this.mapFrameworkRole(customFields['Framework Appointed (Under)']),
      projectType: this.mapProjectType(customFields['Project/Submission']),
      projectLocation: customFields['Site Address'],

      // Additional custom fields
      customFields: {
        accLink: customFields['ACC Link'],
        bsrRegistrationNumber: customFields['BSR Registration Number'],
        responsiblePerson: customFields['Responsible Person (RRO)'],
        buildingHeight: customFields['Building Height'],
        numberOfProperties: customFields['Number of Properties'],
        principalAccountablePerson: customFields['Principal Accountable Person'],
        ribaStage: customFields['RIBA Stage (Current)'],
        architecturalLead: customFields['Architectural Lead'],
        principalDesignerCDM: customFields['Principal Designer (CDM)'],
        principalDesignerBSA: customFields['Principal Designer (BSA)'],
        contractType: customFields['Contract Type'],
        contractor: customFields['Contractor'],
        funder: customFields['Funder'],
        projectSheet: customFields['Project Sheet'],
        worksValue: customFields['Works Value']
      },

      // Metadata
      wfmJobId: wfmJob.ID,
      wfmJobNumber: wfmJob.Number,
      wfmStatus: wfmJob.Status,
      syncedAt: new Date().toISOString(),
      source: 'WorkflowMax'
    };
  },

  /**
   * Map RIBA Stage to ISO19650 phase
   */
  mapRIBAStage(ribaStage) {
    if (!ribaStage) return 'production';

    const stage = ribaStage.toLowerCase();
    if (stage.includes('0') || stage.includes('strategic')) return 'tender';
    if (stage.includes('1') || stage.includes('preparation')) return 'appointment';
    if (stage.includes('2') || stage.includes('concept')) return 'mobilisation';
    if (stage.includes('3') || stage.includes('spatial')) return 'production';
    if (stage.includes('4') || stage.includes('technical')) return 'production';
    if (stage.includes('5') || stage.includes('manufacturing')) return 'delivery';
    if (stage.includes('6') || stage.includes('handover')) return 'closeout';
    if (stage.includes('7') || stage.includes('use')) return 'closeout';

    return 'production';
  },

  /**
   * Map Framework Appointed to Bailey role
   */
  mapFrameworkRole(framework) {
    if (!framework) return 'appointed';

    const fw = framework.toLowerCase();
    if (fw.includes('lead') || fw.includes('principal')) return 'lead_appointed';
    if (fw.includes('consultant')) return 'consultant';

    return 'appointed';
  },

  /**
   * Map Project/Submission to project type
   */
  mapProjectType(projectSubmission) {
    if (!projectSubmission) return 'other';

    const type = projectSubmission.toLowerCase();
    if (type.includes('new build')) return 'newbuild';
    if (type.includes('refurb')) return 'refurbishment';
    if (type.includes('extension')) return 'extension';
    if (type.includes('fit') || type.includes('fitout')) return 'fitout';
    if (type.includes('infrastructure')) return 'infrastructure';

    return 'other';
  },

  /**
   * Sync a specific job to local database
   */
  async syncJobToLocal(jobId) {
    const projectData = await this.getJobDetails(jobId);

    // Save to local database
    return BaileyDB.saveProject(projectData);
  },

  /**
   * Sync all active jobs to local database
   */
  async syncAllActiveJobs() {
    const jobs = await this.getActiveJobs();
    const syncedProjects = [];

    for (const job of jobs.Jobs || []) {
      try {
        const project = await this.syncJobToLocal(job.ID);
        syncedProjects.push(project);
      } catch (error) {
        console.error(`Failed to sync job ${job.ID}:`, error);
      }
    }

    return syncedProjects;
  },

  /**
   * Get sync status
   */
  getSyncStatus() {
    const lastSync = localStorage.getItem('wfm_last_sync');
    const isAuthorized = this.isAuthorized();

    return {
      isAuthorized,
      lastSync: lastSync ? new Date(lastSync) : null,
      hasCredentials: !!this.config.clientId
    };
  },

  /**
   * Update last sync timestamp
   */
  updateLastSync() {
    localStorage.setItem('wfm_last_sync', new Date().toISOString());
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WorkflowMaxAPI;
}
