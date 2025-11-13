
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PhotoUpload } from './components/PhotoUpload';
import { PhotoProcessor } from './components/PhotoProcessor';
import { analyzePhoto } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';
import type { Photo, AnalysisResult } from './types';
import { AnalysisStatus } from './types';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  const handleFilesChange = (files: FileList) => {
    const newPhotos: Photo[] = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => ({
        id: `${file.name}-${Date.now()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: AnalysisStatus.PENDING,
        analysis: null,
      }));
    setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
  };

  const processPhotos = useCallback(async () => {
    const photosToProcess = photos.filter(p => p.status === AnalysisStatus.PENDING);
    if (photosToProcess.length === 0) return;

    setPhotos(prevPhotos =>
      prevPhotos.map(p =>
        p.status === AnalysisStatus.PENDING ? { ...p, status: AnalysisStatus.ANALYZING } : p
      )
    );

    const analysisPromises = photosToProcess.map(async (photo) => {
      try {
        const base64Image = await fileToBase64(photo.file);
        const analysisResult = await analyzePhoto(base64Image);

        const allPassed = Object.values(analysisResult).every(result => result.passed);

        return {
          id: photo.id,
          status: allPassed ? AnalysisStatus.PASSED : AnalysisStatus.FAILED,
          analysis: analysisResult,
        };
      } catch (error) {
        console.error('Error analyzing photo:', error);
        return {
          id: photo.id,
          status: AnalysisStatus.ERROR,
          analysis: {
            error: {
              passed: false,
              reason: 'An error occurred during analysis. Please try again.'
            }
          }
        };
      }
    });

    const results = await Promise.all(analysisPromises);

    setPhotos(prevPhotos =>
      prevPhotos.map(photo => {
        const result = results.find(r => r.id === photo.id);
        return result ? { ...photo, status: result.status, analysis: result.analysis } : photo;
      })
    );
  }, [photos]);

  useEffect(() => {
    processPhotos();
  }, [processPhotos]);
  
  const handleClearAll = () => {
    photos.forEach(photo => URL.revokeObjectURL(photo.previewUrl));
    setPhotos([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <PhotoUpload onFilesChange={handleFilesChange} />
          {photos.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleClearAll}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Clear All
              </button>
            </div>
          )}
          <PhotoProcessor photos={photos} />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} DV Lottery Photo Checker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
