// src/mastra/domains/weather-forecast-fortaleza/services/api-service.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiCallOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

export class ApiService {
  private rateLimiter: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxRequests = parseInt(process.env.API_RATE_LIMIT || '100');
  private readonly windowMs = 60000; // 1 minute

  async call(options: ApiCallOptions): Promise<{ data: any; status: number }> {
    const { url, method, headers, body, timeout } = options;
    
    // Rate limiting check
    if (!this.checkRateLimit(url)) {
      throw new Error('Rate limit exceeded');
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: timeout || parseInt(process.env.API_TIMEOUT || '30000'),
      data: body
    };

    try {
      const response: AxiosResponse = await axios(config);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`API call failed: ${error.message}`);
      }
      throw error;
    }
  }

  private checkRateLimit(url: string): boolean {
    const now = Date.now();
    const key = new URL(url).hostname;
    const userLimit = this.rateLimiter.get(key);

    if (!userLimit || now > userLimit.resetTime) {
      this.rateLimiter.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (userLimit.count >= this.maxRequests) {
      return false;
    }

    userLimit.count++;
    return true;
  }
}
