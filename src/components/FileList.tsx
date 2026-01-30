import React from 'react';
import { PhotoFile } from '../types';
import { formatFileSize } from '../utils/photoOrganizer';
import { X, Image, Calendar, HardDrive } from 'lucide-react';

interface FileListProps {
  files: PhotoFile[];
  onRemoveFile: (fileId: string) => void;
}

function FileList({ files, onRemoveFile }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="card text-center py-8">
        <Image className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No photos uploaded yet</p>
      </div>
    );
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const filesByType = files.reduce((acc, file) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    acc[ext] = (acc[ext] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Upload Summary</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Image className="h-4 w-4" />
              <span>{files.length} files</span>
            </div>
            <div className="flex items-center space-x-1">
              <HardDrive className="h-4 w-4" />
              <span>{formatFileSize(totalSize)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {Object.entries(filesByType).map(([type, count]) => (
            <span
              key={type}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {type.toUpperCase()}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="card">
        <div className="max-h-96 overflow-y-auto space-y-2">
          {files.map((file) => (
            <div key={file.id} className="file-item">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                    <Image className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    {file.organizationFolder && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        → {file.organizationFolder}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span className="flex items-center space-x-1">
                      <HardDrive className="h-3 w-3" />
                      <span>{formatFileSize(file.size)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{file.lastModified.toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => onRemoveFile(file.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FileList;
