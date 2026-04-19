export interface ProcessingState {
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
  progress?: number;
}

export interface IRCResult {
  content: string;
  filename: string;
}

export enum FileType {
  AUDIO = 'audio',
  VIDEO = 'video'
}