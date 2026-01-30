// src/utils/faceGrouping.ts
import * as faceapi from 'face-api.js';

export async function loadFaceModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}

export async function detectAndDescribeFaces(file: File): Promise<{ descriptor: Float32Array; box: any }[]> {
  const img = await faceapi.bufferToImage(file);
  const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();
  return detections.map(d => ({ descriptor: d.descriptor, box: d.detection.box }));
}

// In your PhotoFile type → add optional faces?: { descriptor: Float32Array }[]
