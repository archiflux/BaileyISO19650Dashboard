/**
 * Netlify Function: WorkflowMax OAuth Token Exchange Proxy
 *
 * This serverless function handles the OAuth token exchange to avoid CORS issues.
 * It's a simple proxy that exchanges the authorization code for access tokens.
 *
 * Security: Read-only, doesn't store tokens, validates requests
 */

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: ''
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const { grant_type, client_id, code, redirect_uri, code_verifier, client_secret, refresh_token } = body;

    // Validate required fields
    if (!grant_type || !client_id) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Build request body for Xero token endpoint
    const tokenRequestBody = new URLSearchParams();
    tokenRequestBody.append('grant_type', grant_type);
    tokenRequestBody.append('client_id', client_id);

    if (client_secret) {
      tokenRequestBody.append('client_secret', client_secret);
    }

    if (grant_type === 'authorization_code') {
      if (!code || !redirect_uri || !code_verifier) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Missing authorization code parameters' })
        };
      }
      tokenRequestBody.append('code', code);
      tokenRequestBody.append('redirect_uri', redirect_uri);
      tokenRequestBody.append('code_verifier', code_verifier);
    } else if (grant_type === 'refresh_token') {
      if (!refresh_token) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ error: 'Missing refresh token' })
        };
      }
      tokenRequestBody.append('refresh_token', refresh_token);
    }

    // Exchange code/refresh token for access token with Xero
    const tokenResponse = await fetch('https://identity.xero.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenRequestBody.toString()
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return {
        statusCode: tokenResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: tokenData.error || 'Token exchange failed',
          error_description: tokenData.error_description || 'Unknown error'
        })
      };
    }

    // Return successful token response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tokenData)
    };

  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        error_description: error.message
      })
    };
  }
};
