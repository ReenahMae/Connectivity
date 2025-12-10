// activityTracker.js - Central activity tracking utility
import { activityApi } from '../../api/activityApi';

/**
 * Activity Tracker Utility
 * Automatically logs all CRUD operations across the application
 */
class ActivityTracker {
  // We removed the constructor to prevent stale data.
  // We will fetch the user directly from localStorage whenever we need it.

  getUserName() {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.fname || user.firstName || 'User';
    } catch {
      return 'User';
    }
  }

  async log(action, entityType, entityName, details = '') {
    try {
      const userName = this.getUserName();
      const activityType = `${userName} ${action} ${entityType}: ${entityName}${details ? ` - ${details}` : ''}`;
      
      await activityApi.createLog({
        activityType,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Activity logged: ${activityType}`);
    } catch (err) {
      console.warn('Activity tracking failed:', err);
    }
  }

  // Note Activities
  async logNoteCreated(noteTitle) {
    await this.log('Added', 'note', noteTitle || 'Untitled Note');
  }

  async logNoteUpdated(noteTitle, changes = '') {
    await this.log('edited', 'note', noteTitle || 'Untitled Note', changes);
  }

  async logNoteDeleted(noteTitle) {
    await this.log('deleted', 'note', noteTitle || 'Untitled Note');
  }

  // Folder Activities
  async logFolderCreated(folderName) {
    await this.log('created', 'folder', folderName);
  }

  async logFolderUpdated(oldName, newName) {
    await this.log('renamed', 'folder', `"${oldName}" to "${newName}"`);
  }

  async logFolderDeleted(folderName) {
    await this.log('deleted', 'folder', folderName);
  }

  async logNotesAddedToFolder(folderName, count) {
    await this.log('added', `${count} note(s) to folder`, folderName);
  }

  async logNoteRemovedFromFolder(folderName, noteTitle) {
    await this.log('removed', 'note from folder', folderName, `"${noteTitle}"`);
  }

  // Profile Activities
  async logProfileUpdated(fields = []) {
    const fieldsList = fields.length > 0 ? fields.join(', ') : 'profile information';
    await this.log('updated', 'profile', fieldsList);
  }

  async logAvatarChanged() {
    await this.log('changed', 'profile avatar', 'photo');
  }

  async logAvatarRemoved() {
    await this.log('removed', 'profile avatar', 'photo');
  }

  // Settings Activities
  async logPreferenceChanged(prefName, value) {
    await this.log('changed', 'preference', prefName, `to ${value}`);
  }
}

// Export singleton instance
export const activityTracker = new ActivityTracker();