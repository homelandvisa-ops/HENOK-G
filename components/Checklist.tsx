
import React from 'react';
import type { AnalysisResult, AnalysisCheck } from '../types';
import { CheckIcon, XIcon } from './icons';

interface ChecklistProps {
  analysis: AnalysisResult;
}

const checkOrder: (keyof AnalysisResult)[] = [
    'inColor', 'inFocus', 'neutralExpression', 'plainBackground', 'noShadows', 'noEyeglasses', 'headPosition', 'error'
];

const checkLabels: Record<keyof AnalysisResult, string> = {
    inColor: 'Photo is in color',
    inFocus: 'Image is in focus (not blurry)',
    neutralExpression: 'Neutral expression, eyes open',
    plainBackground: 'Plain white or off-white background',
    noShadows: 'No shadows on face or background',
    noEyeglasses: 'Subject is not wearing eyeglasses',
    headPosition: 'Head is correctly centered and sized',
    error: 'Analysis Status'
};


const ChecklistItem: React.FC<{ label: string; check: AnalysisCheck }> = ({ label, check }) => {
    const icon = check.passed ? <CheckIcon className="w-5 h-5 text-green-500" /> : <XIcon className="w-5 h-5 text-red-500" />;
    const textColor = check.passed ? 'text-slate-700' : 'text-red-700';
    
    return (
        <li className="py-3 border-b border-slate-200 last:border-b-0">
            <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">{icon}</div>
                <div className="ml-3">
                    <p className={`text-sm font-medium ${textColor}`}>{label}</p>
                    {!check.passed && <p className="text-xs text-slate-500 mt-1">{check.reason}</p>}
                </div>
            </div>
        </li>
    );
}

export const Checklist: React.FC<ChecklistProps> = ({ analysis }) => {
  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <ul className="divide-y divide-slate-200">
           {checkOrder.map(key => {
               const check = analysis[key];
               if (check) {
                   return <ChecklistItem key={key} label={checkLabels[key]} check={check} />
               }
               return null;
           })}
        </ul>
    </div>
  );
};
