// utils/appwrite.js - Appwrite API Utility Functions

import { Client, Account, Databases, Storage, Functions, Teams, Avatars, Locale, Query, ID, Permission, Role } from 'appwrite';

// Configuration
const APPWRITE_ENDPOINT = process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.REACT_APP_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID;
const APPWRITE_STORAGE_BUCKET_ID = process.env.REACT_APP_APPWRITE_STORAGE_BUCKET_ID;

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize Services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const functions = new Functions(client);
const teams = new Teams(client);
const avatars = new Avatars(client);
const locale = new Locale(client);

class AppwriteService {
  // Client and Service Getters
  static getClient() {
    return client;
  }

  static getAccount() {
    return account;
  }

  static getDatabases() {
    return databases;
  }

  static getStorage() {
    return storage;
  }

  static getFunctions() {
    return functions;
  }

  static getTeams() {
    return teams;
  }

  static getAvatars() {
    return avatars;
  }

  static getLocale() {
    return locale;
  }

  // Authentication Methods
  static async createAccount(email, password, name) {
    try {
      const response = await account.create(ID.unique(), email, password, name);
      return { success: true, data: response };
    } catch (error) {
      console.error('Create account failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async login(email, password) {
    try {
      const response = await account.createEmailSession(email, password);
      return { success: true, data: response };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async loginWithOAuth2(provider, successUrl, failureUrl) {
    try {
      account.createOAuth2Session(provider, successUrl, failureUrl);
      return { success: true };
    } catch (error) {
      console.error('OAuth2 login failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async logout() {
    try {
      await account.deleteSession('current');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async logoutAll() {
    try {
      await account.deleteSessions();
      return { success: true };
    } catch (error) {
      console.error('Logout all failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getCurrentUser() {
    try {
      const user = await account.get();
      return { success: true, data: user };
    } catch (error) {
      console.error('Get current user failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateName(name) {
    try {
      const response = await account.updateName(name);
      return { success: true, data: response };
    } catch (error) {
      console.error('Update name failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateEmail(email, password) {
    try {
      const response = await account.updateEmail(email, password);
      return { success: true, data: response };
    } catch (error) {
      console.error('Update email failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async updatePassword(newPassword, oldPassword) {
    try {
      const response = await account.updatePassword(newPassword, oldPassword);
      return { success: true, data: response };
    } catch (error) {
      console.error('Update password failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendPasswordRecovery(email, url) {
    try {
      const response = await account.createRecovery(email, url);
      return { success: true, data: response };
    } catch (error) {
      console.error('Send password recovery failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async confirmPasswordRecovery(userId, secret, password, passwordAgain) {
    try {
      const response = await account.updateRecovery(userId, secret, password, passwordAgain);
      return { success: true, data: response };
    } catch (error) {
      console.error('Confirm password recovery failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendEmailVerification(url) {
    try {
      const response = await account.createVerification(url);
      return { success: true, data: response };
    } catch (error) {
      console.error('Send email verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async confirmEmailVerification(userId, secret) {
    try {
      const response = await account.updateVerification(userId, secret);
      return { success: true, data: response };
    } catch (error) {
      console.error('Confirm email verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Session Management
  static async getSessions() {
    try {
      const response = await account.listSessions();
      return { success: true, data: response };
    } catch (error) {
      console.error('Get sessions failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteSession(sessionId) {
    try {
      await account.deleteSession(sessionId);
      return { success: true };
    } catch (error) {
      console.error('Delete session failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Database Methods
  static async createDocument(collectionId, data, documentId = ID.unique(), permissions = []) {
    try {
      const response = await databases.createDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId,
        data,
        permissions
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('Create document failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getDocument(collectionId, documentId) {
    try {
      const response = await databases.getDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('Get document failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateDocument(collectionId, documentId, data, permissions = []) {
    try {
      const response = await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId,
        data,
        permissions
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('Update document failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteDocument(collectionId, documentId) {
    try {
      await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        collectionId,
        documentId
      );
      return { success: true };
    } catch (error) {
      console.error('Delete document failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async listDocuments(collectionId, queries = [], offset = 0, limit = 25) {
    try {
      const response = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        collectionId,
        queries,
        offset,
        limit
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('List documents failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Query Builder Helpers
  static equal(attribute, value) {
    return Query.equal(attribute, value);
  }

  static notEqual(attribute, value) {
    return Query.notEqual(attribute, value);
  }

  static lessThan(attribute, value) {
    return Query.lessThan(attribute, value);
  }

  static lessThanEqual(attribute, value) {
    return Query.lessThanEqual(attribute, value);
  }

  static greaterThan(attribute, value) {
    return Query.greaterThan(attribute, value);
  }

  static greaterThanEqual(attribute, value) {
    return Query.greaterThanEqual(attribute, value);
  }

  static search(attribute, value) {
    return Query.search(attribute, value);
  }

  static orderAsc(attribute) {
    return Query.orderAsc(attribute);
  }

  static orderDesc(attribute) {
    return Query.orderDesc(attribute);
  }

  static limit(value) {
    return Query.limit(value);
  }

  static offset(value) {
    return Query.offset(value);
  }

  // Storage Methods
  static async uploadFile(file, fileId = ID.unique(), permissions = []) {
    try {
      const response = await storage.createFile(
        APPWRITE_STORAGE_BUCKET_ID,
        fileId,
        file,
        permissions
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('Upload file failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getFile(fileId) {
    try {
      const response = await storage.getFile(APPWRITE_STORAGE_BUCKET_ID, fileId);
      return { success: true, data: response };
    } catch (error) {
      console.error('Get file failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteFile(fileId) {
    try {
      await storage.deleteFile(APPWRITE_STORAGE_BUCKET_ID, fileId);
      return { success: true };
    } catch (error) {
      console.error('Delete file failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async listFiles(search = '', limit = 25, offset = 0) {
    try {
      const response = await storage.listFiles(
        APPWRITE_STORAGE_BUCKET_ID,
        search,
        limit,
        offset
      );
      return { success: true, data: response };
    } catch (error) {
      console.error('List files failed:', error);
      return { success: false, error: error.message };
    }
  }

  static getFilePreview(fileId, width = 0, height = 0, gravity = 'center', quality = 100, borderWidth = 0, borderColor = '', borderRadius = 0, opacity = 1, rotation = 0, background = '', output = '') {
    return storage.getFilePreview(
      APPWRITE_STORAGE_BUCKET_ID,
      fileId,
      width,
      height,
      gravity,
      quality,
      borderWidth,
      borderColor,
      borderRadius,
      opacity,
      rotation,
      background,
      output
    );
  }

  static getFileDownload(fileId) {
    return storage.getFileDownload(APPWRITE_STORAGE_BUCKET_ID, fileId);
  }

  static getFileView(fileId) {
    return storage.getFileView(APPWRITE_STORAGE_BUCKET_ID, fileId);
  }

  // Functions Methods
  static async executeFunction(functionId, data = '') {
    try {
      const response = await functions.createExecution(functionId, data);
      return { success: true, data: response };
    } catch (error) {
      console.error('Execute function failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getFunctionExecution(functionId, executionId) {
    try {
      const response = await functions.getExecution(functionId, executionId);
      return { success: true, data: response };
    } catch (error) {
      console.error('Get function execution failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async listFunctionExecutions(functionId, limit = 25, offset = 0) {
    try {
      const response = await functions.listExecutions(functionId, limit, offset);
      return { success: true, data: response };
    } catch (error) {
      console.error('List function executions failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Teams Methods
  static async createTeam(teamId, name, roles = []) {
    try {
      const response = await teams.create(teamId, name, roles);
      return { success: true, data: response };
    } catch (error) {
      console.error('Create team failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getTeam(teamId) {
    try {
      const response = await teams.get(teamId);
      return { success: true, data: response };
    } catch (error) {
      console.error('Get team failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async listTeams(search = '', limit = 25, offset = 0) {
    try {
      const response = await teams.list(search, limit, offset);
      return { success: true, data: response };
    } catch (error) {
      console.error('List teams failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateTeam(teamId, name) {
    try {
      const response = await teams.update(teamId, name);
      return { success: true, data: response };
    } catch (error) {
      console.error('Update team failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteTeam(teamId) {
    try {
      await teams.delete(teamId);
      return { success: true };
    } catch (error) {
      console.error('Delete team failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async createTeamMembership(teamId, email, roles, url, name = '') {
    try {
      const response = await teams.createMembership(teamId, email, roles, url, name);
      return { success: true, data: response };
    } catch (error) {
      console.error('Create team membership failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getTeamMemberships(teamId, search = '', limit = 25, offset = 0) {
    try {
      const response = await teams.listMemberships(teamId, search, limit, offset);
      return { success: true, data: response };
    } catch (error) {
      console.error('Get team memberships failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateTeamMembershipRoles(teamId, membershipId, roles) {
    try {
      const response = await teams.updateMembershipRoles(teamId, membershipId, roles);
      return { success: true, data: response };
    } catch (error) {
      console.error('Update team membership roles failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteTeamMembership(teamId, membershipId) {
    try {
      await teams.deleteMembership(teamId, membershipId);
      return { success: true };
    } catch (error) {
      console.error('Delete team membership failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Avatar Methods
  static getBrowserIcon(code, width = 100, height = 100, quality = 100) {
    return avatars.getBrowser(code, width, height, quality);
  }

  static getCreditCardIcon(code, width = 100, height = 100, quality = 100) {
    return avatars.getCreditCard(code, width, height, quality);
  }

  static getFaviconIcon(url) {
    return avatars.getFavicon(url);
  }

  static getFlagIcon(code, width = 100, height = 100, quality = 100) {
    return avatars.getFlag(code, width, height, quality);
  }

  static getImageFromUrl(url, width = 400, height = 400) {
    return avatars.getImage(url, width, height);
  }

  static getInitialsAvatar(name = '', width = 500, height = 500, background = '') {
    return avatars.getInitials(name, width, height, background);
  }

  static getQRCode(text, size = 400, margin = 1, download = false) {
    return avatars.getQR(text, size, margin, download);
  }

  // Locale Methods
  static async getLocaleInfo() {
    try {
      const response = await locale.get();
      return { success: true, data: response };
    } catch (error) {
      console.error('Get locale info failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getCountries() {
    try {
      const response = await locale.listCountries();
      return { success: true, data: response };
    } catch (error) {
      console.error('Get countries failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getContinents() {
    try {
      const response = await locale.listContinents();
      return { success: true, data: response };
    } catch (error) {
      console.error('Get continents failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getCurrencies() {
    try {
      const response = await locale.listCurrencies();
      return { success: true, data: response };
    } catch (error) {
      console.error('Get currencies failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async getLanguages() {
    try {
      const response = await locale.listLanguages();
      return { success: true, data: response };
    } catch (error) {
      console.error('Get languages failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Utility Methods
  static generateId() {
    return ID.unique();
  }

  // Permission Helpers
  static readPermission(role) {
    return Permission.read(role);
  }

  static writePermission(role) {
    return Permission.write(role);
  }

  static createPermission(role) {
    return Permission.create(role);
  }

  static updatePermission(role) {
    return Permission.update(role);
  }

  static deletePermission(role) {
    return Permission.delete(role);
  }

  // Role Helpers
  static anyRole() {
    return Role.any();
  }

  static userRole(userId) {
    return Role.user(userId);
  }

  static usersRole() {
    return Role.users();
  }

  static guestsRole() {
    return Role.guests();
  }

  static teamRole(teamId, role = '') {
    return Role.team(teamId, role);
  }

  static memberRole(membershipId) {
    return Role.member(membershipId);
  }

  // Real-time Subscriptions
  static subscribe(channels, callback) {
    return client.subscribe(channels, callback);
  }

  static unsubscribe(subscription) {
    if (subscription && typeof subscription === 'function') {
      subscription();
    }
  }

  // Error Handler
  static handleError(error) {
    console.error('Appwrite Error:', error);
    
    if (error.code === 401) {
      return 'Unauthorized. Please log in again.';
    } else if (error.code === 403) {
      return 'Permission denied.';
    } else if (error.code === 404) {
      return 'Resource not found.';
    } else if (error.code === 409) {
      return 'Resource already exists.';
    } else if (error.code === 429) {
      return 'Too many requests. Please try again later.';
    } else if (error.code >= 500) {
      return 'Server error. Please try again later.';
    }
    
    return error.message || 'An unknown error occurred.';
  }

  // Batch Operations
  static async batchCreateDocuments(collectionId, documents) {
    const results = [];
    for (const doc of documents) {
      try {
        const result = await this.createDocument(collectionId, doc.data, doc.id, doc.permissions);
        results.push({ success: true, data: result.data, originalDoc: doc });
      } catch (error) {
        results.push({ success: false, error: error.message, originalDoc: doc });
      }
    }
    return results;
  }

  static async batchUploadFiles(files) {
    const results = [];
    for (const file of files) {
      try {
        const result = await this.uploadFile(file.file, file.id, file.permissions);
        results.push({ success: true, data: result.data, originalFile: file });
      } catch (error) {
        results.push({ success: false, error: error.message, originalFile: file });
      }
    }
    return results;
  }

  // Cache Management (basic implementation)
  static cache = new Map();
  static cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static setCacheItem(key, data, timeout = this.cacheTimeout) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      timeout
    });
  }

  static getCacheItem(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.timeout) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static clearCache() {
    this.cache.clear();
  }

  static removeCacheItem(key) {
    this.cache.delete(key);
  }
}

export default AppwriteService;