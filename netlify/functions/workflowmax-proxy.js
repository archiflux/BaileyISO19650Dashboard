/**
 * Netlify Function: WorkflowMax API Proxy
 *
 * This serverless function proxies API requests to WorkflowMax to avoid CORS issues.
 * It forwards the Authorization header and returns the API response.
 *
 * Security: Read-only (only allows GET requests), validates Bearer token
 */

const https = require('https');
const url = require('url');

function httpsRequest(requestUrl, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(requestUrl, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data, headers: res.headers });
      });
    });
    req.on('error', reject);
    req.end();
  });
}

exports.handler = async (event, context) => {
  // Only allow GET requests (read-only)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Only GET requests allowed (read-only)' })
    };
  }

  try {
    // Get the API endpoint from query parameter
    const endpoint = event.queryStringParameters?.endpoint;
    const authorization = event.headers.authorization;

    if (!endpoint) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing endpoint parameter' })
      };
    }

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing or invalid authorization header' })
      };
    }

    // Build the full WorkflowMax API URL
    const apiUrl = `https://api.workflowmax.com${endpoint}`;

    // Make request to WorkflowMax API
    const response = await httpsRequest(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    // Return the response
    return {
      statusCode: response.statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: response.body
    };

  } catch (error) {
    console.error('WorkflowMax API proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Proxy error',
        error_description: error.message
      })
    };
  }
};
