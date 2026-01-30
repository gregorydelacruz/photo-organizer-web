import React, { useState, useCallback } from 'react';
import { PhotoFile, OrganizedFolder, OrganizationRule, ViewMode, ProcessingStatus } from './types';
import { DEFAULT_RULES, organizeFiles, formatFileSize } from './utils/photoOrganizer';
import DropZone from './components/DropZone';
import FileList from './components/FileList';
import OrganizationPreview from './components/OrganizationPreview';
import RuleManager from './components/RuleManager';
import ProcessingView from './components/ProcessingView';
import { Download, Settings, Share2, Upload, FolderOpen } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function App() {
  const [files, setFiles] = useState<PhotoFile[]>([]);
  const [organizedFolders, setOrganizedFolders] = useState<OrganizedFolder[]>([]);
  const [selectedRules, setSelectedRules] = useState<OrganizationRule[]>(DEFAULT_RULES);
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    isProcessing: false,
    progress: 0,
    completedFiles: 0,
    totalFiles: 0,
    errors: []
  });
  const [showRuleManager, setShowRuleManager] = useState(false);

  const handleFilesSelected = useCallback((newFiles: File[]) => {
    const photoFiles: PhotoFile[] = newFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified)
    }));

    setFiles(prev => [...prev, ...photoFiles]);
    setViewMode('preview');
  }, []);
const [faceClusters, setFaceClusters] = useState<Map<string, FaceCluster>>(new Map());
const [analyzingFaces, setAnalyzingFaces] = useState(false);
  
  const handleRemoveFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const handleOrganize = useCallback(() => {
    const organized = organizeFiles(files, selectedRules);
    setOrganizedFolders(organized);
  }, [files, selectedRules]);

  const handleDownload = useCallback(async () => {
    if (organizedFolders.length === 0) return;

    setViewMode('processing');
    setProcessingStatus({
      isProcessing: true,
      progress: 0,
      completedFiles: 0,
      totalFiles: files.length,
      errors: []
    });

    const zip = new JSZip();

    try {
      for (let i = 0; i < organizedFolders.length; i++) {
        const folder = organizedFolders[i];
        const folderInZip = zip.folder(folder.name);

        for (let j = 0; j < folder.files.length; j++) {
          const file = folder.files[j];
          folderInZip?.file(file.name, file.file);

          const completed = i * folder.files.length + j + 1;
          setProcessingStatus(prev => ({
            ...prev,
            progress: (completed / files.length) * 100,
            completedFiles: completed,
            currentFile: file.name
          }));

          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `organized-photos-${Date.now()}.zip`);

      setProcessingStatus(prev => ({
        ...prev,
        isProcessing: false,
        progress: 100
      }));

      setViewMode('complete');

    } catch (error) {
      setProcessingStatus(prev => ({
        ...prev,
        isProcessing: false,
        errors: [...prev.errors, `Download failed: ${error}`]
      }));
    }
  }, [organizedFolders, files.length]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setOrganizedFolders([]);
    setViewMode('upload');
    setProcessingStatus({
      isProcessing: false,
      progress: 0,
      completedFiles: 0,
      totalFiles: 0,
      errors: []
    });
  }, []);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Photo Organizer',
        text: 'Organize your photos automatically!',
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  }, []);

  // Auto-organize when files or rules change
  React.useEffect(() => {
    if (files.length > 0 && selectedRules.length > 0) {
      handleOrganize();
    }
  }, [files, selectedRules, handleOrganize]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FolderOpen className="h-8 w-8 text-primary-500" />
              <h1 className="text-2xl font-bold text-gray-900">Photo Organizer</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">v1.0</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowRuleManager(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Rules</span>
              </button>
              <button
                onClick={handleShare}
                className="btn-secondary flex items-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Organize Your Photos Automatically
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Drop your photos here and let our smart organizer sort them by date, type, and content. 
                Perfect for organizing downloads, camera backups, and mixed photo collections.
              </p>
            </div>
            <DropZone onFilesSelected={handleFilesSelected} />
          </div>
        )}
<button
  onClick={async () => {
    setAnalyzingFaces(true);
    try {
      const clusters = await analyzeFacesInPhotos(files);
      setFaceClusters(clusters);
      // Later: auto-create folders like "People → Mom"
    } catch (err) {
      console.error(err);
    }
    setAnalyzingFaces(false);
  }}
  disabled={analyzingFaces || files.length === 0}
  className="btn-primary"
>
  {analyzingFaces ? 'Discovering People…' : 'Find People & Group Photos'}
</button>
        {viewMode === 'preview' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {files.length} Photos Ready to Organize
              </h2>
              <div className="flex space-x-3">
                <button onClick={handleReset} className="btn-secondary">
                  <Upload className="h-4 w-4 mr-2" />
                  Add More
                </button>
                <button 
                  onClick={handleDownload}
                  disabled={organizedFolders.length === 0}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Organized</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                <FileList files={files} onRemoveFile={handleRemoveFile} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Preview</h3>
                <OrganizationPreview folders={organizedFolders} />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'processing' && (
          <ProcessingView status={processingStatus} />
        )}

        {viewMode === 'complete' && (
          <div className="text-center space-y-6">
            <div className="animate-fade-in">
              <div className="mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                <Download className="h-8 w-8 text-success-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Download Complete!</h2>
              <p className="text-gray-600 mb-8">
                Your photos have been organized and downloaded successfully.
              </p>
              <div className="space-x-4">
                <button onClick={handleReset} className="btn-primary">
                  Organize More Photos
                </button>
                <button onClick={handleShare} className="btn-secondary">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share This Tool
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Rule Manager Modal */}
      {showRuleManager && (
        <RuleManager
          rules={selectedRules}
          onRulesChange={setSelectedRules}
          onClose={() => setShowRuleManager(false)}
        />
      )}
    </div>
  );
}


export default App;

