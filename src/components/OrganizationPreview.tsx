import React, { useState } from 'react';
import { OrganizedFolder } from '../types';
import { formatFileSize } from '../utils/photoOrganizer';
import { 
  Folder, 
  ChevronDown, 
  ChevronRight, 
  Image, 
  BarChart3,
  Calendar,
  Camera,
  Monitor,
  FileImage
} from 'lucide-react';

interface OrganizationPreviewProps {
  folders: OrganizedFolder[];
}

function OrganizationPreview({ folders }: OrganizationPreviewProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const getFolderIcon = (folderName: string) => {
    const name = folderName.toLowerCase();
    if (name.includes('screenshot') || name.includes('png')) return Monitor;
    if (name.includes('camera') || name.includes('img')) return Camera;
    if (name.includes('201') || name.includes('202')) return Calendar;
    if (name.includes('raw') || name.includes('tiff')) return FileImage;
    return Folder;
  };

  const getFolderColor = (folderName: string) => {
    const name = folderName.toLowerCase();
    if (name.includes('screenshot')) return 'text-purple-600 bg-purple-100';
    if (name.includes('camera')) return 'text-green-600 bg-green-100';
    if (name.includes('201') || name.includes('202')) return 'text-blue-600 bg-blue-100';
    if (name.includes('raw')) return 'text-orange-600 bg-orange-100';
    if (name.includes('unorganized')) return 'text-gray-600 bg-gray-100';
    return 'text-indigo-600 bg-indigo-100';
  };

  if (folders.length === 0) {
    return (
      <div className="card text-center py-8">
        <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Upload photos to see organization preview</p>
      </div>
    );
  }

  const totalFiles = folders.reduce((sum, folder) => sum + folder.count, 0);
  const totalSize = folders.reduce((sum, folder) => 
    sum + folder.files.reduce((fileSum, file) => fileSum + file.size, 0), 0);

  return (
    <div className="space-y-4">
      {/* Organization Summary */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Organization Preview</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Folder className="h-4 w-4" />
              <span>{folders.length} folders</span>
            </div>
            <div className="flex items-center space-x-1">
              <Image className="h-4 w-4" />
              <span>{totalFiles} files</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Organization Progress</span>
            <span>{Math.round((totalFiles / totalFiles) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill bg-green-500" 
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        {/* Folder Distribution */}
        <div className="grid grid-cols-2 gap-4">
          {folders.slice(0, 4).map((folder) => {
            const percentage = Math.round((folder.count / totalFiles) * 100);
            return (
              <div key={folder.name} className="text-center">
                <div className="text-lg font-semibold text-gray-900">{folder.count}</div>
                <div className="text-xs text-gray-500">{folder.name}</div>
                <div className="text-xs text-green-600">{percentage}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Folder Tree */}
      <div className="card">
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {folders.map((folder) => {
            const isExpanded = expandedFolders.has(folder.name);
            const Icon = getFolderIcon(folder.name);
            const colorClass = getFolderColor(folder.name);
            const folderSize = folder.files.reduce((sum, file) => sum + file.size, 0);

            return (
              <div key={folder.name} className="border border-gray-100 rounded-lg">
                <button
                  onClick={() => toggleFolder(folder.name)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{folder.name}</div>
                      <div className="text-sm text-gray-500">
                        {folder.count} files • {formatFileSize(folderSize)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      {folder.count}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3">
                    <div className="ml-12 space-y-1 max-h-40 overflow-y-auto">
                      {folder.files.slice(0, 10).map((file) => (
                        <div key={file.id} className="flex items-center justify-between text-sm py-1">
                          <span className="text-gray-700 truncate flex-1">{file.name}</span>
                          <span className="text-gray-500 ml-2">{formatFileSize(file.size)}</span>
                        </div>
                      ))}
                      {folder.files.length > 10 && (
                        <div className="text-sm text-gray-500 italic">
                          ... and {folder.files.length - 10} more files
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Organization Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h5 className="font-semibold text-blue-900 mb-2">💡 Organization Tips</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Photos are sorted by priority: Date-stamped → RAW → Camera → Mobile → Screenshots</li>
          <li>• Files matching multiple rules go to the highest priority folder</li>
          <li>• Unknown files are placed in "Unorganized" for manual sorting</li>
          <li>• Customize rules in Settings to match your naming conventions</li>
        </ul>
      </div>
    </div>
  );
}

export default OrganizationPreview;
