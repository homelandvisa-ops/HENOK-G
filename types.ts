
export enum AnalysisStatus {
  PENDING = 'PENDING',
  ANALYZING = 'ANALYZING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  ERROR = 'ERROR',
}

export interface AnalysisCheck {
  passed: boolean;
  reason: string;
}

export interface AnalysisResult {
  inColor?: AnalysisCheck;
  inFocus?: AnalysisCheck;
  neutralExpression?: AnalysisCheck;
  plainBackground?: AnalysisCheck;
  noShadows?: AnalysisCheck;
  noEyeglasses?: AnalysisCheck;
  headPosition?: AnalysisCheck;
  error?: AnalysisCheck;
}

export interface Photo {
  id: string;
  file: File;
  previewUrl: string;
  status: AnalysisStatus;
  analysis: AnalysisResult | null;
}
