
import React, { useState } from 'react';
import { Checklist } from './Checklist';
import { Loader } from './Loader';
import { cropAndDownloadImage } from '../utils/imageUtils';
import type { Photo } from '../types';
import { AnalysisStatus } from '../types';
import { DownloadIcon, CheckCircleIcon, XCircleIcon, ExclamationIcon } from './icons';

interface PhotoCardProps {
  photo: Photo;
}

const StatusIndicator: React.FC<{ status: AnalysisStatus }> = ({ status }) => {
    switch (status) {
        case AnalysisStatus.ANALYZING:
            return (
                <div className="flex items-center text-sm font-semibold text-blue-600">
                    <Loader className="w-5 h-5 mr-2" />
                    Analyzing...
                </div>
            );
        case AnalysisStatus.PASSED:
            return (
                <div className="flex items-center text-sm font-semibold text-green-600">
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    All Checks Passed
                </div>
            );
        case AnalysisStatus.FAILED:
            return (
                <div className="flex items-center text-sm font-semibold text-red-600">
                    <XCircleIcon className="w-5 h-5 mr-2" />
                    Checks Failed
                </div>
            );
        case AnalysisStatus.ERROR:
            return (
                <div className="flex items-center text-sm font-semibold text-yellow-600">
                    <ExclamationIcon className="w-5 h-5 mr-2" />
                    Analysis Error
                </div>
            );
        default:
            return null;
    }
};


export const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await cropAndDownloadImage(photo.previewUrl, photo.file.name);
        } catch (error) {
            console.error("Failed to crop and download image:", error);
        } finally {
            setIsDownloading(false);
        }
    };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col items-center">
            <img 
                src={photo.previewUrl} 
                alt={photo.file.name} 
                className="w-full max-w-[250px] h-auto rounded-lg shadow-md aspect-square object-cover" 
            />
            <p className="text-xs text-slate-500 mt-2 truncate w-full text-center max-w-[250px]" title={photo.file.name}>
                {photo.file.name}
            </p>
        </div>
        
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-700">Analysis Results</h3>
                <StatusIndicator status={photo.status} />
            </div>
            {photo.analysis ? (
                <Checklist analysis={photo.analysis} />
            ) : (
                <div className="flex items-center justify-center p-8">
                     <Loader className="w-8 h-8 text-blue-500" />
                </div>
            )}

            {photo.status === AnalysisStatus.PASSED && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center disabled:bg-slate-400"
                    >
                        {isDownloading ? (
                           <>
                           <Loader className="w-5 h-5 mr-2"/>
                           Processing...
                           </>
                        ) : (
                            <>
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            Auto-Crop & Download (600x600px)
                            </>
                        )}
                    </button>
                    <p className="text-xs text-slate-500 mt-2">
                        Automatically crops your photo to be perfectly centered and square.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
