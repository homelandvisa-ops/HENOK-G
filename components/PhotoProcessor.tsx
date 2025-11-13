
import React from 'react';
import { PhotoCard } from './PhotoCard';
import type { Photo } from '../types';

interface PhotoProcessorProps {
  photos: Photo[];
}

export const PhotoProcessor: React.FC<PhotoProcessorProps> = ({ photos }) => {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 space-y-6">
      {photos.map(photo => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
};
