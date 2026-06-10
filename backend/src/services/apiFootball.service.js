/**
 * PRODE-3: Cliente API-Football v3
 * T-Shirt: M
 */
import { env } from '../config/env.js';

export class ApiFootballClient {
  constructor(apiKey = env.apiFootballKey, baseUrl = env.apiFootballBaseUrl) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async request(path, params = {}) {
    if (!this.apiKey) {
      throw Object.assign(new Error('API_FOOTBALL_KEY is not configured'), { status: 503 });
    }

    const url = new URL(`${this.baseUrl}${path}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });

    const response = await fetch(url, {
      headers: {
        'x-apisports-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw Object.assign(new Error(`API-Football error: ${response.status}`), {
        status: response.status,
      });
    }

    return response.json();
  }

  getFixtures({ league, season, date }) {
    return this.request('/fixtures', { league, season, date });
  }

  getTeams({ league, season }) {
    return this.request('/teams', { league, season });
  }
}

export const apiFootballClient = new ApiFootballClient();
