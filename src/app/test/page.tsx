"use client";

import React, { useState, useEffect } from 'react';
import { Share2, X, Download } from 'lucide-react';
import { BsFacebook, BsWhatsapp, BsInstagram, BsTwitterX } from 'react-icons/bs';
import Image from 'next/image';

// Mock ResultCard component
function ResultCard({ label, value, type = "text", color }: { label: string; value: string | React.ReactNode; type?: "text" | "node"; color?: string }) {
  return (
    <div className="rounded-lg px-6 py-4 border border-neutral-700 bg-neutral-800 w-full grow lg:max-w-40">
      <h3 className="text-neutral-400 text-xl">{label}:</h3>
      <h2 className={`text-2xl font-bold ${color ? color : 'text-white'}`}>{(type === 'text' || type === 'node') && value}</h2>
    </div>
  );
}

// Share Modal Component
function ShareModal({ isOpen, onClose, imageUrl, onShare, isGenerating }: { 
  isOpen: boolean; 
  onClose: () => void; 
  imageUrl: string | null;
  onShare: (platform: string) => void; 
  isGenerating: boolean;
}) {
  if (!isOpen) return null;

  const shareOptions = [
    { name: 'Facebook', icon: <BsFacebook size={24} />, color: 'border-blue-600 hover:bg-blue-600', platform: 'facebook' },
    { name: 'Twitter', icon: <BsTwitterX size={24} />, color: 'border-sky-500 hover:bg-sky-500', platform: 'twitter' },
    { name: 'WhatsApp', icon: <BsWhatsapp size={24} />, color: 'border-green-600 hover:bg-green-600', platform: 'whatsapp' },
    { name: 'Instagram', icon: <BsInstagram size={24} />, color: 'border-pink-600 hover:bg-pink-600', platform: 'instagram' },
    { name: 'Download', icon: <Download size={24} />, color: 'border-purple-600 hover:bg-purple-600', platform: 'download' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-neutral-800 rounded-2xl p-6 max-w-2xl w-full border border-neutral-700 shadow-2xl max-h-[90vh] overflow-y-auto tiny-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-neutral-400 hover:text-white transition-colors bg-neutral-900/80 rounded-full p-2 cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-4 text-center pr-8">Share Your Results</h2>
        
        {/* Image Preview */}
        <div className="mb-6 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-700">
          {isGenerating ? (
            <div className="aspect-3/2 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-neutral-400">Generating image...</p>
              </div>
            </div>
          ) : imageUrl ? (
            <div className="relative overflow-hidden">
              <Image
                src={imageUrl}
                alt="Typing test results"
                height={0}
                width={0}
                className="h-full w-full object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="aspect-3/2 flex items-center justify-center">
              <p className="text-neutral-400">Failed to load image</p>
            </div>
          )}
        </div>

        {/* Share Options - Horizontal Scroll */}
        <div className="border-t border-neutral-700 pt-4">
          <p className="text-sm text-neutral-400 mb-3 text-center">Share on:</p>
          <div className="overflow-x-auto pb-2 -mx-2 px-2 tiny-scrollbar">
            <div className="flex gap-3 min-w-max justify-center">
              {shareOptions.map((option) => (
                <button
                  key={option.platform}
                  onClick={() => onShare(option.platform)}
                  disabled={isGenerating || !imageUrl}
                  className={`${option.color} border text-white rounded-lg px-1.5 md:px-2.5 xl:px-3 py-2.5 md:py-3 transition-all transform hover:scale-105 active:scale-95 flex flex-col items-center gap-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-20 cursor-pointer`}
                  title={option.name}
                >
                  <span>{option.icon}</span>
                  <span className="font-medium text-[10px] md:text-xs">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function TypingTestResults() {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  // Mock data
  const wpm = "75";
  const accuracy = "94.5%";
  const characters = (
    <span>
      <span className="text-green-500">284</span> / <span className="text-red-500">18</span>
    </span>
  );

  const generateAndFetchImage = async (): Promise<void> => {
    setIsGenerating(true);
    
    try {
      // Call your Next.js API route to generate the image
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wpm,
          accuracy,
          correct: 284,
          incorrect: 18,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      setImageBlob(blob);
      setImageUrl(url);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating image:', error);
      setIsGenerating(false);
      setImageUrl(null);
    }
  };

  const handleOpenShareModal = () => {
    setIsShareModalOpen(true);
    if (!imageUrl && !isGenerating) {
      generateAndFetchImage();
    }
  };

  const handleShare = async (platform: string) => {
    if (!imageBlob) {
      alert('Image not ready yet');
      return;
    }

    const text = `I just scored ${wpm} WPM with ${accuracy} accuracy! 🎯`;

    switch (platform) {
      case 'whatsapp':
      case 'instagram':
      case 'facebook':
      case 'twitter':
        // Use Web Share API if available
        if (navigator.share) { // && navigator.canShare
          const file = new File([imageBlob], 'typing-results.png', { type: 'image/png' });
          
          try {
            await navigator.share({
              title: 'My Typing Test Results',
              text: text,
              files: [file]
            });
            setIsShareModalOpen(false);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error.name !== 'AbortError') {
              console.error('Error sharing:', error);
              handleDownloadBlob(imageBlob);
            }
          }
        } else {
          alert('Your browser doesn\'t support direct sharing. The image will be downloaded instead.');
          handleDownloadBlob(imageBlob);
        }
        break;
        
      case 'download':
        handleDownloadBlob(imageBlob);
        setIsShareModalOpen(false);
        break;
    }
  };

  const handleDownloadBlob = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `typing-test-results-${Date.now()}.png`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Results Display */}
        <div className="bg-neutral-800 rounded-2xl p-8 mb-6 border border-neutral-700">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">Your Results</h1>
          
          <div className="w-full flex flex-col justify-center items-center gap-4 md:flex-row md:gap-5">
            <ResultCard label="WPM" value={wpm} />
            <ResultCard label="Accuracy" value={accuracy} color={parseFloat(accuracy) >= 50 ? 'text-green-500' : 'text-red-500'} />
            <ResultCard label="Characters" value={characters} type="node" />
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleOpenShareModal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg cursor-pointer"
        >
          <Share2 size={24} />
          <span className="text-lg">Share Results</span>
        </button>

        {/* Share Modal */}
        <ShareModal 
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          imageUrl={imageUrl}
          onShare={handleShare}
          isGenerating={isGenerating}
        />
      </div>
    </div>
  );
}