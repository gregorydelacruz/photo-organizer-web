export interface PhotoFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: Date;
  preview?: string;
  organizationFolder?: string;
}

export interface OrganizationRule {
  id: string;
  name: string;
  pattern: RegExp;
  folder: string;
  priority: number;
  description: string;
}

export interface OrganizationPreset {
  id: string;
  name: string;
  description: string;
  rules: OrganizationRule[];
  createdAt: Date;
}

export interface OrganizedFolder {
  name: string;
  files: PhotoFile[];
  count: number;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  progress: number;
  currentFile?: string;
  completedFiles: number;
  totalFiles: number;
  errors: string[];
}

export type ViewMode = 'upload' | 'preview' | 'processing' | 'complete';

export interface AppState {
  files: PhotoFile[];
  organizedFolders: OrganizedFolder[];
  selectedRules: OrganizationRule[];
  processingStatus: ProcessingStatus;
  viewMode: ViewMode;
  presets: OrganizationPreset[];
}
