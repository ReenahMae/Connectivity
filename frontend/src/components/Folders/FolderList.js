import React, { useState, useEffect } from 'react';
import { folderApi } from '../../api/folderApi';

const FolderList = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);

  // Fetch folders on component mount
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      const data = await folderApi.getAllFolders();
      setFolders(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch folders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const newFolder = {
        folderName: newFolderName,
        dateCreated: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      };
      await folderApi.createFolder(newFolder);
      setNewFolderName('');
      fetchFolders(); // Refresh the list
    } catch (err) {
      setError('Failed to create folder');
      console.error(err);
    }
  };

  const handleUpdateFolder = async (folderId, newName) => {
    try {
      const updatedFolder = {
        folderName: newName,
        dateCreated: new Date().toISOString().split('T')[0],
      };
      await folderApi.updateFolder(folderId, updatedFolder);
      setEditingFolder(null);
      fetchFolders();
    } catch (err) {
      setError('Failed to update folder');
      console.error(err);
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm('Are you sure you want to delete this folder?')) {
      try {
        await folderApi.deleteFolder(folderId);
        fetchFolders();
      } catch (err) {
        setError('Failed to delete folder');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading folders...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Folders</h2>

      {/* Create Folder Form */}
      <form onSubmit={handleCreateFolder} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Enter folder name"
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Create Folder
        </button>
      </form>

      {/* Folders List */}
      <div>
        {folders.length === 0 ? (
          <p>No folders yet. Create your first folder!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {folders.map((folder) => (
              <li
                key={folder.folderId}
                style={{
                  border: '1px solid #ddd',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                }}
              >
                {editingFolder === folder.folderId ? (
                  <div>
                    <input
                      type="text"
                      defaultValue={folder.folderName}
                      onBlur={(e) =>
                        handleUpdateFolder(folder.folderId, e.target.value)
                      }
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateFolder(folder.folderId, e.target.value);
                        }
                      }}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{folder.folderName}</strong>
                      <br />
                      <small>Created: {folder.dateCreated}</small>
                    </div>
                    <div>
                      <button
                        onClick={() => setEditingFolder(folder.folderId)}
                        style={{ marginRight: '10px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFolder(folder.folderId)}
                        style={{ backgroundColor: '#ff4444', color: 'white' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FolderList;