import { Databases, ID, Query } from 'appwrite';
import { appwrite } from '../config/appwrite';
import ClientError from '../utils/ClientError';
import NotFoundError from '../utils/NotFoundError';
import { Todo } from '../models/todo.model'; // Import Todo interface

const databases = new Databases(appwrite);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID as string;
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID as string;

/**
 * Service for handling Todo operations with Appwrite Databases.
 */
export const todoService = {
    /**
     * Creates a new Todo item.
     * @param title The title of the todo.
     * @param userId The ID of the user who owns the todo.
     * @returns A promise that resolves to the created Todo item.
     * @throws {ClientError} If the todo creation fails.
     */
    async createTodo(title: string, userId: string): Promise<Todo> {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                { title, completed: false, userId }
            );
            return response as unknown as Todo;
        } catch (error: any) {
            console.error('Error creating todo:', error);
            throw new ClientError(error.message || 'Failed to create todo.');
        }
    },

    /**
     * Retrieves all Todo items for a specific user.
     * @param userId The ID of the user whose todos are to be retrieved.
     * @returns A promise that resolves to an array of Todo items.
     * @throws {ClientError} If the retrieval of todos fails.
     */
    async getTodos(userId: string): Promise<Todo[]> {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal('userId', userId)]
            );
            return response.documents as unknown as Todo[];
        } catch (error: any) {
            console.error('Error getting todos:', error);
            throw new ClientError(error.message || 'Failed to retrieve todos.');
        }
    },

    /**
     * Updates an existing Todo item.
     * @param id The ID of the todo item to update.
     * @param completed The new completion status of the todo.
     * @returns A promise that resolves to the updated Todo item.
     * @throws {ClientError} If the todo update fails.
     */
    async updateTodo(id: string, completed: boolean): Promise<Todo> {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id,
                { completed }
            );
            return response as unknown as Todo;
        } catch (error: any) {
            console.error('Error updating todo:', error);
            // Appwrite might throw a generic error if document not found.
            // We can check error.code if Appwrite SDK provides it for specific error types.
            throw new ClientError(error.message || 'Failed to update todo.');
        }
    },

    /**
     * Deletes a Todo item.
     * @param id The ID of the todo item to delete.
     * @returns A promise that resolves when the todo item is deleted.
     * @throws {ClientError} If the todo deletion fails.
     */
    async deleteTodo(id: string): Promise<void> {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTION_ID,
                id
            );
        } catch (error: any) {
            console.error('Error deleting todo:', error);
            // Appwrite might throw a generic error if document not found.
            throw new ClientError(error.message || 'Failed to delete todo.');
        }
    }
};
