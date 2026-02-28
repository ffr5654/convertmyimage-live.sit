'use client'

import React, { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { 
  Upload, 
  Image as ImageIcon, 
  ArrowRight, 
  CheckCircle2, 
  Download, 
  X, 
  Loader2,
  Maximize,
  Smartphone,
  Monitor,
  Square,
  ChevronDown,
  Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

// --- Types ---

type ConversionFormat = 'image/jpeg' | 'image/png' | 'image/webp'

interface ResizePreset {
  name: string
  ratio: number | null
  width?: number
  height?: number
  icon: React.ReactNode
}

interface ProcessedFile {
  id: string
  originalName: string
  originalSize: number
  originalType: string
  processedUrl: string
  processedName: string
  processedSize: number
  processedType: string
  width: number
  height: number
}

// --- Constants ---

const RESIZE_PRESETS: ResizePreset[] = [
  { name: 'Original', ratio: null, icon: <ImageIcon className="w-4 h-4" /> },
  { name: '9:16 (Story)', ratio: 9/16, icon: <Smartphone className="w-4 h-4" /> },
  { name: '1:1 (Post)', ratio: 1, icon: <Square className="w-4 h-4" /> },
  { name: '16:9 (Video)', ratio: 16/9, icon: <Monitor className="w-4 h-4" /> },
]

// --- Components ---

const AdPlaceholder = ({ 
  width, 
  height, 
  label, 
  slotId,
  className = "" 
}: { 
  width: string | number, 
  height: string | number, 
  label: string,
  slotId?: string,
  className?: string
}) => {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  React.useEffect(() => {
    if (adsenseId && slotId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [adsenseId, slotId]);

  if (adsenseId && slotId) {
    return (
      <div className={`overflow-hidden ${className}`} style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height, maxWidth: '100%' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={adsenseId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div 
      className={`bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs font-mono rounded-xl overflow-hidden ${className}`}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width, 
        height: typeof height === 'number' ? `${height}px` : height,
        maxWidth: '100%'
      }}
    >
      <div className="text-center p-2">
        <div className="font-bold uppercase tracking-widest mb-1 opacity-50">Advertisement</div>
        <div className="font-semibold">{label}</div>
        <div className="mt-1">{width} x {height}</div>
      </div>
    </div>
  );
};

const Header = () => (
  <header className="h-14 md:h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {/* Placeholder for the logo image. Replace src with your actual logo path */}
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center mr-2 shadow-sm">
          <ImageIcon className="text-white w-5 h-5 md:w-6 md:h-6" />
        </div>
        <span className="font-bold text-xl md:text-2xl tracking-tight flex">
          <span className="text-[#0056b3]">Convert</span>
          <span className="text-[#ff6600]">My</span>
          <span className="text-[#6610f2]">Image</span>
        </span>
      </div>
    </div>
  </header>
)

const Footer = () => (
  <footer className="bg-[#111827] text-slate-400 py-16 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center mr-2">
              <ImageIcon className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-2xl flex">
              <span className="text-white">Convert</span>
              <span className="text-[#ff6600]">My</span>
              <span className="text-[#6610f2]">Image</span>
            </span>
          </div>
        </div>
        <p className="text-lg max-w-md leading-relaxed">
          The ultimate suite of fast, free, and secure online tools for creators and professionals.
        </p>
      </div>
      <div>
        <h4 className="text-white font-bold text-lg mb-6">Legal</h4>
        <ul className="space-y-4 text-base">
          <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold text-lg mb-6">Support</h4>
        <ul className="space-y-4 text-base">
          <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
          <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
          <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
      <p>Convert My Image by golt</p>
      <div className="flex gap-6">
        <a href="#" className="hover:text-white">Twitter</a>
        <a href="#" className="hover:text-white">Instagram</a>
        <a href="#" className="hover:text-white">GitHub</a>
      </div>
    </div>
  </footer>
)

const StickyMobileAd = () => {
  const [isVisible, setIsVisible] = useState(true)
  if (!isVisible) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center md:hidden pointer-events-none">
      <div className="pointer-events-auto bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t border-slate-200 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute -top-8 right-0 bg-white border border-slate-200 rounded-t-lg p-1 text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>
        <AdPlaceholder width={320} height={50} label="Sticky Mobile Ad" slotId="REPLACE_WITH_YOUR_SLOT_ID" className="!rounded-none border-none" />
      </div>
    </div>
  )
}

export default function ConvertMyImagePage() {
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<ProcessedFile[]>([])
  const [targetFormat, setTargetFormat] = useState<ConversionFormat>('image/jpeg')
  const [resizePreset, setResizePreset] = useState<ResizePreset>(RESIZE_PRESETS[0])
  const [customWidth, setCustomWidth] = useState<string>('')
  const [customHeight, setCustomHeight] = useState<string>('')
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
    setResults([]) // Clear previous results when new files are added
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    }
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const processImages = async () => {
    if (files.length === 0) return
    
    setIsProcessing(true)
    setProgress(0)
    const newResults: ProcessedFile[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const processed = await convertAndResizeImage(file)
        newResults.push(processed)
        setProgress(Math.round(((i + 1) / files.length) * 100))
      } catch (err) {
        console.error('Error processing image:', err)
      }
    }

    setResults(newResults)
    setIsProcessing(false)
  }

  const downloadAll = () => {
    results.forEach(res => {
      const link = document.createElement('a');
      link.href = res.processedUrl;
      link.download = res.processedName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const convertAndResizeImage = (file: File): Promise<ProcessedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
          }

          let targetWidth = img.width
          let targetHeight = img.height

          // Handle Resizing
          if (customWidth && customHeight) {
            targetWidth = parseInt(customWidth)
            targetHeight = parseInt(customHeight)
          } else if (resizePreset.ratio) {
            // Fit to ratio
            const currentRatio = img.width / img.height
            if (currentRatio > resizePreset.ratio) {
              // Image is wider than target ratio
              targetHeight = img.height
              targetWidth = img.height * resizePreset.ratio
            } else {
              // Image is taller than target ratio
              targetWidth = img.width
              targetHeight = img.width / resizePreset.ratio
            }
          }

          canvas.width = targetWidth
          canvas.height = targetHeight

          // Draw image (centered crop if ratio changed)
          const sourceX = (img.width - targetWidth) / 2
          const sourceY = (img.height - targetHeight) / 2
          
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, targetWidth, targetHeight)

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Blob conversion failed'))
              return
            }

            const extension = targetFormat.split('/')[1]
            const processedName = `${file.name.split('.')[0]}_vibed.${extension}`
            const processedUrl = URL.createObjectURL(blob)

            resolve({
              id: Math.random().toString(36).substr(2, 9),
              originalName: file.name,
              originalSize: file.size,
              originalType: file.type,
              processedUrl,
              processedName,
              processedSize: blob.size,
              processedType: targetFormat,
              width: targetWidth,
              height: targetHeight
            })
          }, targetFormat, 0.9)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#3B82F6] selection:text-white">
      <Header />
      
      {/* Top Leaderboard Ad */}
      <div className="w-full flex justify-center py-6 bg-white border-b border-slate-50">
        <AdPlaceholder width={728} height={90} label="Top Leaderboard" slotId="REPLACE_WITH_YOUR_SLOT_ID" className="hidden md:flex" />
        <AdPlaceholder width={320} height={50} label="Mobile Leaderboard" slotId="REPLACE_WITH_YOUR_SLOT_ID" className="md:hidden" />
      </div>

      <main className="flex-grow">
        {/* Tool Section */}
        <section className="max-w-7xl mx-auto w-full px-4 py-4 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
            
            {/* Main Action Column */}
            <div className="flex-grow lg:w-2/3">
              <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl md:shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="p-5 md:p-12">
                  
                  {/* Dropzone */}
                  <div 
                    {...getRootProps()} 
                    className={`relative border-2 md:border-3 border-dashed rounded-xl md:rounded-2xl p-6 md:p-12 text-center transition-all cursor-pointer group
                      ${isDragActive ? 'border-[#3B82F6] bg-blue-50' : 'border-slate-200 hover:border-[#3B82F6] hover:bg-slate-50'}`}
                  >
                    <input {...getInputProps()} />
                    <div className="max-w-xs mx-auto">
                      <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 transition-all
                        ${isDragActive ? 'bg-[#3B82F6] text-white scale-110' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-[#3B82F6]'}`}>
                        <Upload className="w-7 h-7 md:w-10 md:h-10" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-[#1F2937] mb-1 md:mb-2">Choose Files</h3>
                      <p className="text-sm text-slate-500">Tap to browse or drag images here</p>
                    </div>
                  </div>

                  {/* File List */}
                  <AnimatePresence>
                    {files.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 space-y-3"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-slate-700">{files.length} Files Selected</h4>
                          <button onClick={() => setFiles([])} className="text-sm text-red-500 font-semibold hover:underline">Clear All</button>
                        </div>
                        {files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4 overflow-hidden">
                              <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                                <ImageIcon className="w-5 h-5 text-slate-400" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="font-semibold text-slate-900 truncate text-sm">{file.name}</p>
                                <p className="text-xs text-slate-500">{formatSize(file.size)} • {file.type.split('/')[1].toUpperCase()}</p>
                              </div>
                            </div>
                            <button onClick={() => removeFile(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Options Grid */}
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-slate-100">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Convert To</label>
                      <div className="relative">
                        <select 
                          value={targetFormat}
                          onChange={(e) => setTargetFormat(e.target.value as ConversionFormat)}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
                        >
                          <option value="image/jpeg">JPG (High Quality)</option>
                          <option value="image/png">PNG (Lossless)</option>
                          <option value="image/webp">WEBP (Modern Web)</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Resize Preset</label>
                      <div className="grid grid-cols-2 gap-2">
                        {RESIZE_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => {
                              setResizePreset(preset)
                              setCustomWidth('')
                              setCustomHeight('')
                            }}
                            className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-bold transition-all
                              ${resizePreset.name === preset.name && !customWidth 
                                ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg shadow-blue-100' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-[#3B82F6] hover:text-[#3B82F6]'}`}
                          >
                            {preset.icon}
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Custom Resize */}
                  <div className="mt-8">
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Custom Dimensions (Optional)</label>
                    <div className="flex items-center gap-4">
                      <div className="flex-grow">
                        <input 
                          type="number" 
                          placeholder="Width (px)" 
                          value={customWidth}
                          onChange={(e) => setCustomWidth(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                        />
                      </div>
                      <X className="w-5 h-5 text-slate-300" />
                      <div className="flex-grow">
                        <input 
                          type="number" 
                          placeholder="Height (px)" 
                          value={customHeight}
                          onChange={(e) => setCustomHeight(e.target.value)}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button 
                      onClick={processImages}
                      disabled={files.length === 0 || isProcessing}
                      className={`${results.length > 0 ? 'sm:w-1/2' : 'w-full'} py-4 md:py-5 rounded-xl md:rounded-2xl text-lg md:text-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg md:shadow-xl
                        ${files.length === 0 || isProcessing 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-[#3B82F6] text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-blue-200'}`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                          Processing ({progress}%)
                        </>
                      ) : (
                        <>
                          Convert & Resize <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                        </>
                      )}
                    </button>

                    {results.length > 0 && !isProcessing && (
                      <button 
                        onClick={downloadAll}
                        className="sm:w-1/2 py-4 md:py-5 bg-green-600 text-white rounded-xl md:rounded-2xl text-lg md:text-xl font-bold transition-all flex items-center justify-center gap-3 shadow-lg md:shadow-xl hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] shadow-green-200"
                      >
                        <Download className="w-5 h-5 md:w-6 md:h-6" /> Download All
                      </button>
                    )}
                  </div>

                  {/* Inline Ad */}
                  <div className="mt-12 flex justify-center">
                    <AdPlaceholder width={300} height={250} label="Inline Tool Ad" slotId="REPLACE_WITH_YOUR_SLOT_ID" />
                  </div>

                  {/* Results */}
                  <AnimatePresence>
                    {results.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 pt-12 border-t border-slate-100"
                      >
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-bold text-[#1F2937]">Conversion Successful!</h3>
                        </div>
                        
                        <div className="space-y-3 md:space-y-4">
                          {results.map((res) => (
                            <div key={res.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-blue-50/50 rounded-xl md:rounded-2xl border border-blue-100 gap-3 md:gap-4">
                              <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl border border-blue-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  <img src={res.processedUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-slate-900 text-xs md:text-sm truncate max-w-[140px] md:max-w-[200px]">{res.processedName}</p>
                                  <p className="text-[10px] md:text-xs text-slate-500">
                                    {formatSize(res.processedSize)} • {res.width}x{res.height} • {res.processedType.split('/')[1].toUpperCase()}
                                  </p>
                                </div>
                              </div>
                              <a 
                                href={res.processedUrl} 
                                download={res.processedName}
                                className="px-4 py-2 md:px-6 md:py-3 bg-white text-[#3B82F6] text-sm md:text-base font-bold rounded-lg md:rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                              >
                                <Download className="w-4 h-4 md:w-5 md:h-5" /> Download
                              </a>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

              {/* SEO Content Section */}
              <section className="mt-24 space-y-16">
                <div className="text-center max-w-2xl mx-auto">
                  <h2 className="text-4xl font-extrabold text-[#1F2937] mb-6">How to Use ConvertMyImage</h2>
                  <p className="text-lg text-slate-500">Fast, secure, and professional image processing in your browser. No software installation required.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="relative p-8 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-100">
                    <div className="absolute -top-6 left-8 w-12 h-12 bg-[#1F2937] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">1</div>
                    <h3 className="text-xl font-bold mb-4 mt-4">Upload Your Image</h3>
                    <p className="text-slate-500 leading-relaxed">Simply drag and drop your images into the upload zone or click to browse. We support multiple file uploads simultaneously to save you time.</p>
                  </div>
                  <div className="relative p-8 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-100">
                    <div className="absolute -top-6 left-8 w-12 h-12 bg-[#3B82F6] text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">2</div>
                    <h3 className="text-xl font-bold mb-4 mt-4">Select Settings</h3>
                    <p className="text-slate-500 leading-relaxed">Choose your target format (JPG, PNG, WEBP) and select a resize preset for social media or enter custom dimensions for precise control.</p>
                  </div>
                  <div className="relative p-8 bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-100">
                    <div className="absolute -top-6 left-8 w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">3</div>
                    <h3 className="text-xl font-bold mb-4 mt-4">Convert & Download</h3>
                    <p className="text-slate-500 leading-relaxed">Click the convert button and watch our engine process your files in seconds. Download your optimized images individually or all at once.</p>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl">
                  <div className="prose prose-slate max-w-none">
                    <h3 className="text-2xl font-bold mb-6">Why Choose ConvertMyImage for Your Image Conversion?</h3>
                    <p className="mb-4">ConvertMyImage is designed for speed and privacy. Unlike other online converters, our tool processes your images directly in your browser using advanced JavaScript Canvas APIs. This means your sensitive data never leaves your device, providing a level of security that cloud-based converters simply can&apos;t match.</p>
                    <p className="mb-4">Whether you&apos;re a social media manager needing to resize images for Instagram Stories (9:16) or a web developer looking to convert heavy PNGs into modern, lightweight WEBP files, ConvertMyImage has you covered. Our presets are optimized for the latest platform requirements, ensuring your content looks crisp and professional every time.</p>
                    <p>Our commitment to a clean, ad-optimized experience means you get the tools you need for free, supported by non-intrusive advertisements. We constantly update our algorithms to ensure the highest quality output with minimal file size, helping your websites load faster and your social media posts stand out.</p>
                  </div>
                </div>

                {/* Mid-Page Banner Ad */}
                <div className="w-full flex justify-center py-12 border-y border-slate-100">
                  <AdPlaceholder width={728} height={90} label="Mid-Page Banner" slotId="REPLACE_WITH_YOUR_SLOT_ID" className="hidden md:flex" />
                  <AdPlaceholder width={320} height={50} label="Mobile Banner" slotId="REPLACE_WITH_YOUR_SLOT_ID" className="md:hidden" />
                </div>
              </section>
            </div>

            {/* Money Sidebar */}
            <aside className="lg:w-[300px] flex-shrink-0 space-y-8">
              <div className="sticky top-24 space-y-8">
                <div className="space-y-4">
                  <AdPlaceholder width={300} height={250} label="Sidebar Square 1" slotId="REPLACE_WITH_YOUR_SLOT_ID" />
                  <AdPlaceholder width={300} height={250} label="Sidebar Square 2" slotId="REPLACE_WITH_YOUR_SLOT_ID" />
                  <AdPlaceholder width={300} height={250} label="Sidebar Square 3" slotId="REPLACE_WITH_YOUR_SLOT_ID" />
                </div>
                
                <AdPlaceholder width={300} height={600} label="The Skyscraper" slotId="REPLACE_WITH_YOUR_SLOT_ID" className="hidden lg:flex" />
              </div>
            </aside>

          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileAd />
      
      {/* Spacer for sticky ad */}
      <div className="h-[50px] md:hidden" />
    </div>
  )
}
