import { Client } from 'appwrite'
import { appwrite } from '../config/appwrite'

/**
 * Service for handling real-time subscriptions with Appwrite.
 */
export const realtimeService = {
  /**
   * Subscribes to a specific channel for real-time updates.
   * @param channel The channel to subscribe to (e.g., 'documents').
   * @param callback The function to call when an event is received.
   */
  subscribe(channel: string, callback: (response: any) => void) {
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
      .setProject(process.env.APPWRITE_PROJECT_ID as string)

    client.subscribe(channel, callback)
  }
}
