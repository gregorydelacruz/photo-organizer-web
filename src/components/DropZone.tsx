import React, { useCallback, useState } from 'react';
import { Upload, Image, AlertCircle } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/tiff',
  'image/heic',
  'image/heif'
];

const ACCEPTED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', 
  '.tiff', '.tif', '.heic', '.heif', '.raw', '.cr2', 
  '.nef', '.arw', '.dng'
];

function DropZone({ onFilesSelected }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const hasValidType = ACCEPTED_TYPES.includes(file.type.toLowerCase());
    const hasValidExtension = ACCEPTED_EXTENSIONS.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    return hasValidType || hasValidExtension;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    const invalidCount = fileArray.length - validFiles.length;

    if (invalidCount > 0) {
      setError(`${invalidCount} file(s) were skipped (not valid image files)`);
      setTimeout(() => setError(null), 5000);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [onFilesSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input value to allow selecting same files again
    e.target.value = '';
  }, [handleFiles]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-warning-50 border border-warning-200 rounded-lg flex items-center space-x-2 animate-slide-up">
          <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0" />
          <span className="text-warning-700">{error}</span>
        </div>
      )}
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`drop-zone ${isDragOver ? 'drop-zone-active' : ''} cursor-pointer relative`}
      >
        <input
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-6 rounded-full transition-colors ${
            isDragOver ? 'bg-primary-100' : 'bg-gray-100'
          }`}>
            {isDragOver ? (
              <Upload className="h-12 w-12 text-primary-500 animate-bounce" />
            ) : (
              <Image className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isDragOver ? 'Drop your photos here!' : 'Upload Your Photos'}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your photos here, or click to browse your files
            </p>
            <div className="text-sm text-gray-500">
              <p className="mb-1">Supported formats:</p>
              <p>JPG, PNG, GIF, BMP, WebP, TIFF, HEIC, RAW, CR2, NEF, ARW, DNG</p>
            </div>
          </div>
          
          <button className="btn-primary px-6 py-3">
            <Upload className="h-5 w-5 mr-2" />
            Choose Photos
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Secure - Files stay on your device</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Fast - Instant organization</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Smart - Auto-detects patterns</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DropZone;
