/**
 * Heartbeat utility for keeping the server alive
 * Can be used from client-side if needed
 */

import { getApiBaseUrl } from "../utils/envUtils";

export class HeartbeatService {
  private interval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(
    private serverUrl: string,
    private intervalMs: number = 5 * 60 * 1000 // 5 minutes default
  ) {}

  /**
   * Start pinging the server at regular intervals
   */
  start(): void {
    if (this.isRunning) {
      console.warn('Heartbeat service is already running');
      return;
    }

    console.log(`Starting heartbeat service - pinging every ${this.intervalMs / 1000}s`);
    
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.ping();
    }, this.intervalMs);

    // Send initial ping
    this.ping();
  }

  /**
   * Stop the heartbeat service
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('Heartbeat service stopped');
  }

  /**
   * Send a single ping to the server
   */
  private async ping(): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/api/heartbeat`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`Heartbeat ping successful - Server uptime: ${Math.floor(data.uptime)}s`);
      } else {
        console.warn(`Heartbeat ping failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Heartbeat ping error:', error);
    }
  }

  /**
   * Check if the service is currently running
   */
  get running(): boolean {
    return this.isRunning;
  }
}

// Export a default instance for easy use
export const heartbeat = new HeartbeatService(
  getApiBaseUrl()
);
