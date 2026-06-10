/**
 * PRODE-2: Conexión MongoDB con patrón Singleton
 * T-Shirt: S
 */
import mongoose from 'mongoose';
import { env } from './env.js';

class DatabaseConnection {
  static #instance = null;
  #isConnected = false;

  constructor() {
    if (DatabaseConnection.#instance) {
      return DatabaseConnection.#instance;
    }
    DatabaseConnection.#instance = this;
  }

  static getInstance() {
    if (!DatabaseConnection.#instance) {
      DatabaseConnection.#instance = new DatabaseConnection();
    }
    return DatabaseConnection.#instance;
  }

  async connect() {
    if (this.#isConnected) {
      return mongoose.connection;
    }

    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongodbUri);
    this.#isConnected = true;
    console.log('MongoDB connected (Singleton)');
    return mongoose.connection;
  }

  async disconnect() {
    if (!this.#isConnected) return;
    await mongoose.disconnect();
    this.#isConnected = false;
  }

  getConnection() {
    return mongoose.connection;
  }
}

export const db = DatabaseConnection.getInstance();
