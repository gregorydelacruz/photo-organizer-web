import React from 'react';
import { ProcessingStatus } from '../types';
import { 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Package,
  FileArchive
} from 'lucide-react';

interface ProcessingViewProps {
  status: ProcessingStatus;
}

function ProcessingView({ status }: ProcessingViewProps) {
  const {
    isProcessing,
    progress,
    currentFile,
    completedFiles,
    totalFiles,
    errors
  } = status;

  if (!isProcessing && progress === 100 && errors.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Complete!</h2>
          <p className="text-gray-600">
            Your photos have been organized and packaged for download.
          </p>
        </div>
      </div>
    );
  }

  if (errors.length > 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Error</h2>
          <p className="text-gray-600 mb-6">
            There was an issue processing your photos.
          </p>
        </div>

        <div className="card bg-red-50 border-red-200">
          <h3 className="font-semibold text-red-900 mb-3">Errors:</h3>
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Processing Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {isProcessing ? (
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          ) : (
            <Package className="h-10 w-10 text-blue-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isProcessing ? 'Organizing Your Photos' : 'Preparing Download'}
        </h2>
        <p className="text-gray-600">
          {isProcessing 
            ? 'Please wait while we organize and package your photos...'
            : 'Setting up your organized photo archive...'
          }
        </p>
      </div>

      {/* Progress Section */}
      <div className="card">
        <div className="space-y-6">
          {/* Main Progress Bar */}
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* File Counter */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FileArchive className="h-4 w-4" />
              <span>Files Processed</span>
            </div>
            <span className="font-medium">
              {completedFiles} / {totalFiles}
            </span>
          </div>

          {/* Current File */}
          {currentFile && (
            <div className="border-t pt-4">
              <div className="text-sm text-gray-600 mb-1">Currently processing:</div>
              <div className="text-sm font-medium text-gray-900 truncate">
                {currentFile}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Processing Steps */}
      <div className="card bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">Processing Steps</h3>
        <div className="space-y-3">
          <div className={`flex items-center space-x-3 ${progress > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${progress > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">Analyzing file patterns</span>
            {progress > 0 && <CheckCircle className="h-4 w-4" />}
          </div>
          
          <div className={`flex items-center space-x-3 ${progress > 25 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${progress > 25 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">Applying organization rules</span>
            {progress > 25 && <CheckCircle className="h-4 w-4" />}
          </div>
          
          <div className={`flex items-center space-x-3 ${progress > 50 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${progress > 50 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">Creating folder structure</span>
            {progress > 50 && <CheckCircle className="h-4 w-4" />}
          </div>
          
          <div className={`flex items-center space-x-3 ${progress > 75 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${progress > 75 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">Packaging files</span>
            {progress > 75 && <CheckCircle className="h-4 w-4" />}
          </div>
          
          <div className={`flex items-center space-x-3 ${progress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <span className="text-sm">Finalizing download</span>
            {progress >= 100 && <CheckCircle className="h-4 w-4" />}
          </div>
        </div>
      </div>

      {/* Tips While Waiting */}
      <div className="card bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 While You Wait</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your photos are being organized into logical folders</li>
          <li>• Files are grouped by date, type, and naming patterns</li>
          <li>• The download will be a ZIP file with organized folders</li>
          <li>• You can bookmark this tool for future use!</li>
        </ul>
      </div>
    </div>
  );
}

export default ProcessingView;
