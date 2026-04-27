import { Account, ID } from 'appwrite'
import { appwrite } from '../config/appwrite'
import AuthenticationError from '../utils/AuthenticationError'
import AuthorizationError from '../utils/AuthorizationError' // Import AuthorizationError

const account = new Account(appwrite)

/**
 * Service for handling user authentication with Appwrite.
 */
export const authService = {
  /**
   * Registers a new user with email and password.
   * @param email The user's email address.
   * @param password The user's password.
   * @param name (Optional) The user's name.
   * @returns A promise that resolves to the created user object.
   * @throws {AuthenticationError} If registration fails.
   */
  async register(email: string, password: string, name?: string) {
    try {
      const user = await account.create(ID.unique(), email, password, name)
      return user
    } catch (error: any) {
      console.error('Error registering user:', error)
      throw new AuthenticationError(error.message || 'Failed to register user.')
    }
  },

  /**
   * Logs in a user with email and password.
   * @param email The user's email address.
   * @param password The user's password.
   * @returns A promise that resolves to the user's session object.
   * @throws {AuthenticationError} If login fails.
   */
  async login(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password)
      return session
    } catch (error: any) {
      console.error('Error logging in user:', error)
      throw new AuthenticationError(error.message || 'Failed to log in.')
    }
  },

  /**
   * Logs out the current user.
   * @returns A promise that resolves when the user is logged out.
   * @throws {AuthorizationError} If logout fails (e.g., no active session).
   */
  async logout() {
    try {
      await account.deleteSession('current')
    } catch (error: any) {
      console.error('Error logging out user:', error)
      throw new AuthorizationError(error.message || 'Failed to log out.')
    }
  },

  /**
   * Retrieves the currently logged-in user's information.
   * @returns A promise that resolves to the current user object, or null if no user is logged in.
   */
  async getCurrentUser() {
    try {
      const user = await account.get()
      return user
    } catch (error: any) {
      console.error('Error getting current user:', error)
      // Appwrite throws an error if no user is logged in, which is a valid scenario
      // We can return null or throw a specific error if needed.
      // For now, returning null as it's handled in the catch block.
      return null
    }
  }
}
