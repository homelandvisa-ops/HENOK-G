
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface PhotoUploadProps {
  onFilesChange: (files: FileList) => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ onFilesChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [onFilesChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesChange(e.target.files);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-2 text-slate-700">Upload Your Photos</h2>
        <p className="text-slate-500 mb-6">You can upload multiple photos for batch processing.</p>
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors duration-300 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept="image/png, image/jpeg, image/webp"
          onChange={handleChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <UploadIcon className="w-12 h-12 text-slate-400 mb-4" />
          <span className="text-blue-600 font-semibold">Click to upload</span>
          <span className="text-slate-500"> or drag and drop</span>
          <p className="text-xs text-slate-400 mt-2">PNG, JPG, WEBP</p>
        </label>
      </div>
    </div>
  );
};
