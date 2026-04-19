import React, { useState } from 'react';
import { AudioUploader } from './components/AudioUploader';
import { ResultViewer } from './components/ResultViewer';
import { ProcessingState, IRCResult } from './types';
import { generateIRCFromAudio } from './services/geminiService';

const App: React.FC = () => {
  const [processingState, setProcessingState] = useState<ProcessingState>({ status: 'idle' });
  const [result, setResult] = useState<IRCResult | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setProcessingState({ status: 'uploading', message: 'Analyzing audio...' });
    
    try {
      // Simulate a small delay for UX so status isn't too flashy
      setProcessingState({ status: 'processing', message: 'Generating .irc lyrics...' });
      
      const ircContent = await generateIRCFromAudio(selectedFile);
      
      const fileNameWithoutExt = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
      const newFileName = `${fileNameWithoutExt}.irc`;

      setResult({
        content: ircContent,
        filename: newFileName
      });
      setProcessingState({ status: 'success' });
    } catch (error: any) {
      console.error(error);
      setProcessingState({ 
        status: 'error', 
        message: error.message || 'Something went wrong. Please try again.' 
      });
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setProcessingState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                I
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">IRC Converter</h1>
          </div>
          <div className="text-sm font-medium text-slate-500">
            Powered by Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {/* Intro */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
            Convert Audio to .irc Lyrics
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Upload your audio or video file, and our AI will transcribe and timestamp it into an IRC/LRC format, separating lines every 5-6 words.
          </p>
        </div>

        {/* Dynamic Content Area */}
        <div className="transition-all duration-500 ease-in-out">
            {processingState.status === 'error' && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-red-800">Processing Error</h3>
                        <p className="text-sm text-red-700 mt-1">{processingState.message}</p>
                        <button 
                            onClick={reset}
                            className="mt-3 text-sm font-medium text-red-800 hover:text-red-900 underline"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {!result && processingState.status !== 'error' && (
                <div className="max-w-xl mx-auto">
                    <AudioUploader 
                        onFileSelect={handleFileSelect} 
                        isLoading={processingState.status === 'uploading' || processingState.status === 'processing'}
                    />
                    
                    {/* Loading State Overlay/Indicator */}
                    {(processingState.status === 'uploading' || processingState.status === 'processing') && (
                        <div className="mt-8 flex flex-col items-center">
                            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 animate-progress"></div>
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-600 animate-pulse">
                                {processingState.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">This may take a minute depending on file size.</p>
                        </div>
                    )}
                </div>
            )}

            {result && (
                <div className="animate-fade-in-up">
                    <ResultViewer result={result} onReset={reset} />
                </div>
            )}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Audio to IRC Converter. 
        </div>
      </footer>

      <style>{`
        @keyframes progress {
          0% { width: 0%; margin-left: 0; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 100%; margin-left: 0; }
        }
        .animate-progress {
          animation: progress 2s infinite ease-in-out;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;