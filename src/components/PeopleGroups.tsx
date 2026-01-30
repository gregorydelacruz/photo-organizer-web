// src/components/PeopleGroups.tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaceCluster } from '../utils/faceAnalyzer'; // adjust path
import { PhotoFile } from '../types';
import { 
  User, Edit2, Check, X, Image as ImageIcon, Users, 
  FolderPlus, ChevronDown, ChevronRight 
} from 'lucide-react';
import { formatFileSize } from '../utils/photoOrganizer';

interface PeopleGroupsProps {
  faceClusters: Map<string, FaceCluster>;
  files: PhotoFile[];                    // to lookup original photos
  onCreatePeopleFolders: (clusters: FaceCluster[]) => void; // callback to inject rules
  isAnalyzing?: boolean;
}

function PeopleGroups({ 
  faceClusters, 
  files, 
  onCreatePeopleFolders, 
  isAnalyzing = false 
}: PeopleGroupsProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const clustersArray = useMemo(() => 
    Array.from(faceClusters.values())
      .sort((a, b) => b.faces.length - a.faces.length), 
  [faceClusters]);

  const toggleExpand = (id: string) => {
    const newSet = new Set(expanded);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpanded(newSet);
  };

  const startEdit = (cluster: FaceCluster) => {
    setEditingId(cluster.id);
    setEditValue(cluster.label);
  };

  const saveEdit = (id: string) => {
    // In real app: update the cluster label in state / parent
    // For MVP: we can just log or use a callback
    console.log(`Renamed ${id} to ${editValue}`);
    // TODO: call parent setter to update label persistently
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  // Simple helper to get photo by id
  const getPhotoById = (photoId: string) => 
    files.find(f => f.id === photoId);

  // Placeholder: in real version generate real cropped face thumbnails
  const getThumbnailUrl = (photoId: string): string | undefined => {
    const photo = getPhotoById(photoId);
    if (!photo) return undefined;
    
    // For MVP: just use the full photo (later → crop to face box)
    return URL.createObjectURL(photo.file);
  };

  if (isAnalyzing) {
    return (
      <div className="card text-center py-12 bg-blue-50 border-blue-200">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <Users className="h-12 w-12 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900">Discovering People...</h3>
          <p className="text-gray-600 max-w-md">
            Scanning your photos for faces. This runs 100% locally on your device.
          </p>
          {/* You can add a real progress bar here later */}
        </div>
      </div>
    );
  }

  if (clustersArray.length === 0) {
    return (
      <div className="card text-center py-12">
        <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No People Detected Yet</h3>
        <p className="text-gray-600">
          Upload more photos or try the "Find People & Group Photos" button.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="h-7 w-7 text-indigo-600" />
            {clustersArray.length} People Found
          </h2>
          <p className="text-gray-600 mt-1">
            {clustersArray.reduce((sum, c) => sum + c.faces.length, 0)} photos grouped
          </p>
        </div>

        <button
          onClick={() => onCreatePeopleFolders(clustersArray)}
          className="btn-primary flex items-center gap-2 px-6 py-3"
          disabled={clustersArray.length === 0}
        >
          <FolderPlus className="h-5 w-5" />
          Create People Folders
        </button>
      </div>

      {/* Grid of People Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clustersArray.map(cluster => {
          const isExpanded = expanded.has(cluster.id);
          const isEditing = editingId === cluster.id;
          const count = cluster.faces.length;
          const samplePhoto = cluster.faces[0]?.photoId 
            ? getThumbnailUrl(cluster.faces[0].photoId) 
            : undefined;

          return (
            <div 
              key={cluster.id}
              className="card overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header / Avatar */}
              <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-2 border-white shadow-sm">
                    {samplePhoto ? (
                      <img 
                        src={samplePhoto} 
                        alt={cluster.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="flex-1 px-2 py-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                        <button onClick={() => saveEdit(cluster.id)} className="text-green-600 hover:text-green-800">
                          <Check className="h-5 w-5" />
                        </button>
                        <button onClick={cancelEdit} className="text-red-600 hover:text-red-800">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {cluster.label}
                        </h3>
                        <button 
                          onClick={() => startEdit(cluster)}
                          className="text-gray-400 hover:text-indigo-600"
                          title="Rename person"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mt-1">
                      {count} {count === 1 ? 'photo' : 'photos'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expandable photo grid */}
              <div className="p-4">
                <button
                  onClick={() => toggleExpand(cluster.id)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  <span>{isExpanded ? 'Hide' : 'Show'} photos</span>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                {isExpanded && (
                  <div className="mt-4 grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {cluster.faces.slice(0, 12).map((face, idx) => {  // limit to avoid lag
                      const thumb = getThumbnailUrl(face.photoId);
                      return thumb ? (
                        <div key={idx} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={thumb}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform"
                          />
                        </div>
                      ) : (
                        <div key={idx} className="aspect-square bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      );
                    })}

                    {cluster.faces.length > 12 && (
                      <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-500">
                        +{cluster.faces.length - 12} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips card */}
      <div className="card bg-indigo-50 border-indigo-200 mt-8">
        <h4 className="font-semibold text-indigo-900 mb-2">💡 How this helps</h4>
        <ul className="text-sm text-indigo-800 space-y-1.5">
          <li>• Groups photos of the same person across years</li>
          <li>• Rename to "Mom", "Kids", "Grandpa 2020s" etc.</li>
          <li>• Click "Create People Folders" to add them to your organized structure</li>
          <li>• Everything stays on your device — 100% private</li>
        </ul>
      </div>
    </div>
  );
}

export default PeopleGroups;
