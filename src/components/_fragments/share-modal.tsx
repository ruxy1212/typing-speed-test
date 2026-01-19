"use client";

import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { BsFacebook, BsWhatsapp, BsInstagram, BsTwitterX } from 'react-icons/bs';
import Image from 'next/image';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  wpm: string;
  accuracy: string;
  correct: number;
  incorrect: number;
}

export default function ShareModal({ isOpen, onClose, wpm, accuracy, correct, incorrect }: ShareModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);

  const shareOptions = [
    { name: 'Facebook', icon: <BsFacebook size={24} />, color: 'border-blue-600 hover:bg-blue-600', platform: 'facebook' },
    { name: 'Twitter', icon: <BsTwitterX size={24} />, color: 'border-sky-500 hover:bg-sky-500', platform: 'twitter' },
    { name: 'WhatsApp', icon: <BsWhatsapp size={24} />, color: 'border-green-600 hover:bg-green-600', platform: 'whatsapp' },
    { name: 'Instagram', icon: <BsInstagram size={24} />, color: 'border-pink-600 hover:bg-pink-600', platform: 'instagram' },
    { name: 'Download', icon: <Download size={24} />, color: 'border-purple-600 hover:bg-purple-600', platform: 'download' },
  ];

  const generateAndFetchImage = async (): Promise<void> => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wpm,
          accuracy,
          correct,
          incorrect,
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
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      setIsGenerating(false);
      setImageUrl(null);
      toast.error('Failed to generate image. Please try again.');
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

  const handleShare = async (platform: string) => {
    if (!imageBlob) {
      toast.warning('Image not ready yet');
      return;
    }

    const text = `I just scored ${wpm} WPM with ${accuracy} accuracy! 🎯`;

    switch (platform) {
      case 'whatsapp':
      case 'instagram':
      case 'facebook':
      case 'twitter':
        if (navigator.share) {
          const file = new File([imageBlob], 'typing-results.png', { type: 'image/png' });
          
          try {
            await navigator.share({
              title: 'My Typing Test Results',
              text: text,
              files: [file]
            });
            toast.success('Results shared successfully!');
            onClose();
          } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
              console.error('Error sharing:', error);
              toast.info('Sharing failed. Downloading image instead.');
              handleDownloadBlob(imageBlob);
            }
          }
        } else {
          toast.info('Direct sharing not supported. Downloading image instead.');
          handleDownloadBlob(imageBlob);
        }
        break;
        
      case 'download':
        handleDownloadBlob(imageBlob);
        toast.success('Image downloaded successfully!');
        onClose();
        break;
    }
  };

  useEffect(() => {
    if (isOpen && !imageUrl && !isGenerating) {
      generateAndFetchImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (!isOpen) return null;

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

        {/* Share Options */}
        <div className="border-t border-neutral-700 pt-4">
          <p className="text-sm text-neutral-400 mb-3 text-center">Share on:</p>
          <div className="overflow-x-auto pb-2 -mx-2 px-2 tiny-scrollbar">
            <div className="flex gap-3 min-w-max justify-center">
              {shareOptions.map((option) => (
                <button
                  key={option.platform}
                  onClick={() => handleShare(option.platform)}
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
