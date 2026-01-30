import { PhotoFile, OrganizationRule, OrganizedFolder } from '../types';
import { format, parse } from 'date-fns';

export const DEFAULT_RULES: OrganizationRule[] = [
  {
    id: 'date-2015',
    name: '2015 Photos',
    pattern: /^2015\d{4}_\d{6}_.*\.(jpg|jpeg|png)$/i,
    folder: '2015 Photos',
    priority: 10,
    description: 'Photos with 2015 date prefix (YYYYMMDD_HHMMSS format)'
  },
  {
    id: 'date-2016',
    name: '2016 Photos', 
    pattern: /^2016\d{4}_\d{6}_.*\.(jpg|jpeg|png)$/i,
    folder: '2016 Photos',
    priority: 10,
    description: 'Photos with 2016 date prefix (YYYYMMDD_HHMMSS format)'
  },
  {
    id: 'date-2017',
    name: '2017 Photos',
    pattern: /^2017\d{4}_\d{6}_.*\.(jpg|jpeg|png)$/i,
    folder: '2017 Photos', 
    priority: 10,
    description: 'Photos with 2017 date prefix (YYYYMMDD_HHMMSS format)'
  },
  {
    id: 'date-2018-2025',
    name: 'Recent Photos (2018+)',
    pattern: /^(201[8-9]|202[0-5])\d{4}_\d{6}_.*\.(jpg|jpeg|png)$/i,
    folder: 'Recent Photos',
    priority: 10,
    description: 'Photos with 2018-2025 date prefix'
  },
  {
    id: 'img-camera',
    name: 'Camera Photos',
    pattern: /^(img|image)_\d+.*\.(jpg|jpeg)$/i,
    folder: 'Camera Photos',
    priority: 5,
    description: 'Camera-style IMG_#### numbered photos (JPG format)'
  },
  {
    id: 'screenshots',
    name: 'Screenshots',
    pattern: /.*\.(png|gif|bmp|webp)$/i,
    folder: 'Screenshots',
    priority: 1,
    description: 'PNG, GIF, BMP, WebP files (likely screenshots/graphics)'
  },
  {
    id: 'raw-photos',
    name: 'RAW Photos',
    pattern: /.*\.(raw|cr2|nef|arw|dng|tiff|tif)$/i,
    folder: 'RAW Photos',
    priority: 15,
    description: 'RAW camera files and professional formats'
  },
  {
    id: 'mobile-photos',
    name: 'Mobile Photos',
    pattern: /^(photo|pic|snap|img).*\.(jpg|jpeg|heic|heif)$/i,
    folder: 'Mobile Photos',
    priority: 3,
    description: 'Mobile phone style photo names'
  }
];

export function organizeFiles(files: PhotoFile[], rules: OrganizationRule[]): OrganizedFolder[] {
  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);
  const folders: Record<string, PhotoFile[]> = {};
  const unorganized: PhotoFile[] = [];

  files.forEach(file => {
    let organized = false;
    
    for (const rule of sortedRules) {
      if (rule.pattern.test(file.name)) {
        if (!folders[rule.folder]) {
          folders[rule.folder] = [];
        }
        file.organizationFolder = rule.folder;
        folders[rule.folder].push(file);
        organized = true;
        break;
      }
    }
    
    if (!organized) {
      unorganized.push(file);
    }
  });

  // Add unorganized files to a separate folder
  if (unorganized.length > 0) {
    folders['Unorganized'] = unorganized;
  }

  return Object.entries(folders).map(([name, files]) => ({
    name,
    files,
    count: files.length
  })).sort((a, b) => b.count - a.count);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
