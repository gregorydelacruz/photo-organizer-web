import * as faceapi from '@vladmandic/face-api';
import { PhotoFile } from '../types';

// Lazy load models once
let modelsLoaded = false;

export async function loadFaceModels() {
  if (modelsLoaded) return;
  
  const MODEL_URL = '/models'; // your public/models folder
  
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  // Optional: faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
  
  modelsLoaded = true;
  console.log('Face models loaded');
}

export interface FaceCluster {
  id: string;
  label: string;       // user can rename later → "Mom", "Alex", etc.
  faces: Array<{
    photoId: string;
    descriptor: Float32Array;
    thumbnailUrl?: string; // we'll generate later
  }>;
  bestThumbnail?: string;
}

export async function analyzeFacesInPhotos(photos: PhotoFile[]): Promise<Map<string, FaceCluster>> {
  await loadFaceModels();
  
  const faceMap = new Map<string, FaceCluster>(); // label → cluster
  let nextLabelId = 1;
  
  for (const photo of photos) {
    try {
      const img = await faceapi.bufferToImage(photo.file);
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({ inputSize: 416 }))
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      if (detections.length === 0) continue;
      
      for (const det of detections) {
        const descriptor = det.descriptor;
        
        // Find best match or create new cluster
        let bestMatch: FaceCluster | null = null;
        let minDistance = 0.6; // common threshold (lower = stricter)
        
        for (const cluster of faceMap.values()) {
          // Average cluster descriptor (simple but effective for small sets)
          const avgDesc = averageDescriptors(cluster.faces.map(f => f.descriptor));
          const distance = faceapi.euclideanDistance(descriptor, avgDesc);
          
          if (distance < minDistance) {
            minDistance = distance;
            bestMatch = cluster;
          }
        }
        
        if (bestMatch) {
          // Add to existing person
          bestMatch.faces.push({
            photoId: photo.id,
            descriptor,
            // thumbnailUrl: we'll add in UI phase
          });
        } else {
          // New person!
          const newCluster: FaceCluster = {
            id: `person-${nextLabelId++}`,
            label: `Person ${nextLabelId}`,
            faces: [{ photoId: photo.id, descriptor }],
          };
          faceMap.set(newCluster.id, newCluster);
        }
      }
    } catch (err) {
      console.warn(`Face analysis failed for ${photo.name}:`, err);
    }
  }
  
  return faceMap;
}

function averageDescriptors(descs: Float32Array[]): Float32Array {
  if (descs.length === 0) throw new Error('No descriptors');
  const dim = descs[0].length;
  const avg = new Float32Array(dim).fill(0);
  for (const d of descs) {
    for (let i = 0; i < dim; i++) avg[i] += d[i];
  }
  for (let i = 0; i < dim; i++) avg[i] /= descs.length;
  return avg;
}
