
import React from 'react';
import { CameraIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <CameraIcon className="w-12 h-12 text-blue-600 mr-4" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              AI DV Lottery Photo Checker
            </h1>
            <p className="text-sm md:text-md text-slate-500 mt-1">
              Check your Green Card Lottery photos against official requirements instantly.
            </p>
          </div>
        </div>
        <div className="text-center md:text-right">
             <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded-md" role="alert">
                <p className="font-bold">Privacy First</p>
                <p className="text-sm">Your photos are processed in your browser and sent to the AI for analysis. They are not stored on our servers.</p>
            </div>
        </div>
      </div>
    </header>
  );
};
