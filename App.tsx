

import React, { useState, useCallback, useEffect } from 'react';
import { PoemType } from './types';
import { POEM_TYPES } from './constants';
import { generatePoemFromImage, generateQuotesFromImage, generateTitleFromImage, generateCaptionFromImage, generateLiteraryTextFromImage } from './services/geminiService';

declare const ExifReader: any;

const logoBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDk2IDk2Ij4KICA8Y2lyY2xlIGN4PSI0OCIgY3k9IjQ4IiByPSI0NiIgZmlsbD0iIzYzNjZmMSIgLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkNvcm1vcmFudCBHYXJhbW9uZCwgc2VyaWYiIGZvbnQtc2l6ZT0iNTAiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+CiAgICBBTQogIDwvdGV4dD4KPC9zdmc+Cg==";

const PhotoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v2.586l1.707-1.707a1 1 0 011.414 1.414L12.414 8H15a1 1 0 110 2h-2.586l1.707 1.707a1 1 0 01-1.414 1.414L11 11.414V14a1 1 0 11-2 0v-2.586l-1.707 1.707a1 1 0 01-1.414-1.414L7.586 10H5a1 1 0 110-2h2.586L5.793 6.293a1 1 0 011.414-1.414L9 6.586V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const QuoteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.757 1.628l-3.235 4.852A1 1 0 006 10h3a1 1 0 110 2H6a3 3 0 01-2.829-4.148l3.235-4.852a1 1 0 011.837-.122zM15.243 3.03a1 1 0 01.757 1.628l-3.235 4.852A1 1 0 0012 10h3a1 1 0 110 2h-3a3 3 0 01-2.829-4.148l3.235-4.852a1 1 0 011.837-.122z" clipRule="evenodd" />
    </svg>
);

const TitleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.25 3a.75.75 0 01.75.75v.25h1.25a.75.75 0 010 1.5H9.75v10.5h.75a.75.75 0 010 1.5H7.5a.75.75 0 010-1.5h.75V5.5H7a.75.75 0 010-1.5h1.25V3.75a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

const CaptionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2 5a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm0 6a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1zm1 5a1 1 0 100 2h10a1 1 0 100-2H3z" clipRule="evenodd" />
    </svg>
);

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" />
    </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
    </div>
);

interface ImageUploaderProps {
    onFileSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="w-full">
            <label htmlFor="file-upload" className="cursor-pointer">
                <div className="relative border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg h-64 flex justify-center items-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors duration-300 bg-slate-50 dark:bg-gray-700">
                    <div className="text-center">
                        <PhotoIcon />
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Cliquez ou déposez une image ici</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, GIF jusqu'à 10 Mo</p>
                    </div>
                </div>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
        </div>
    );
};

interface PoemSelectorProps {
    value: PoemType;
    onChange: (value: PoemType) => void;
}

const PoemSelector: React.FC<PoemSelectorProps> = ({ value, onChange }) => (
    <div className='w-full'>
        <label htmlFor="poem-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Forme du poème
        </label>
        <div className="relative mt-1">
            <select
                id="poem-type"
                name="poem-type"
                value={value}
                onChange={(e) => onChange(e.target.value as PoemType)}
                className="block w-full appearance-none cursor-pointer rounded-lg bg-indigo-600 py-3 pl-4 pr-10 font-bold text-white shadow-md transition-colors duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                {POEM_TYPES.map(type => (
                    <option key={type.value} value={type.value} className="bg-white text-black dark:bg-gray-800 dark:text-slate-200 font-normal">{type.label}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
);


interface ContentDisplayProps {
    content: string | null;
    isLoading: boolean;
    error: string | null;
    contentType: 'poem' | 'quote' | 'title' | 'caption' | 'literaryText' | null;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({ content, isLoading, error, contentType }) => {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

    const handleCopy = useCallback(() => {
        if (!content || copyStatus === 'copied') return;

        let textToCopy = content;
        if (contentType === 'quote' || contentType === 'literaryText') {
            // Format for better plain text representation
            textToCopy = content.split('---').map(block => block.trim()).join('\n\n');
        }
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopyStatus('copied');
            const timer = setTimeout(() => setCopyStatus('idle'), 2000);
            return () => clearTimeout(timer);
        }).catch(err => {
            console.error("Échec de la copie du texte : ", err);
        });
    }, [content, contentType, copyStatus]);
    
    const contentTitles: { [key: string]: string } = {
        poem: 'Poème Inspiré',
        quote: 'Citations Pertinentes',
        title: 'Titre Suggéré',
        caption: 'Légende Proposée',
        literaryText: 'Textes Littéraires en Résonance'
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center text-slate-600 dark:text-slate-400">
                    <Spinner />
                    <p className="mt-4 font-serif-display text-xl">L'IA compose votre création...</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="text-center text-red-600 dark:text-red-400">
                    <h3 className="font-bold text-lg">Erreur</h3>
                    <p className="mt-2">{error}</p>
                </div>
            );
        }
        if (!content) {
            return (
                <div className="text-center text-slate-500 dark:text-slate-400">
                    <p className="font-serif-display text-2xl">Votre création inspirée apparaîtra ici...</p>
                </div>
            );
        }
        
        const title = contentType ? contentTitles[contentType] : '';

        if (contentType === 'quote' || contentType === 'literaryText') {
            const blocks = content.split('---').filter(block => block.trim() !== '');
            return (
                <div className="w-full">
                    <h2 className="text-2xl font-bold font-serif-display text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
                    <div className="space-y-4 text-left">
                        {blocks.map((block, index) => {
                            const parts = block.trim().split('\n');
                            const text = parts[0].trim().replace(/^"|"$/g, '');
                            const author = parts.length > 1 ? parts[1].trim() : null;
                            const workTitle = contentType === 'literaryText' && parts.length > 2 ? parts[2].trim() : null;

                            return (
                                <blockquote key={index} className={`p-4 rounded-lg border-l-4 ${contentType === 'quote' ? 'border-teal-500 dark:border-teal-400' : 'border-amber-500 dark:border-amber-400'} transition-colors duration-300 ${index % 2 === 0 ? 'bg-slate-100 dark:bg-gray-700' : 'bg-slate-50 dark:bg-gray-700/50'}`}>
                                    <p className="italic text-lg text-slate-800 dark:text-slate-200">
                                        “{text}”
                                    </p>
                                    {(author || workTitle) && (
                                        <footer className="mt-2 text-right text-slate-600 dark:text-slate-400 font-medium">
                                            {author}
                                            {workTitle && <cite className="block not-italic text-sm">{workTitle}</cite>}
                                        </footer>
                                    )}
                                </blockquote>
                            );
                        })}
                    </div>
                </div>
            );
        }

        return (
            <div className="w-full text-center">
                 <h2 className="text-2xl font-bold font-serif-display text-slate-800 dark:text-slate-100 mb-4">{title}</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap font-serif-display text-slate-800 dark:text-slate-200 text-xl">{content}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg h-full min-h-[400px] flex flex-col justify-center items-center relative">
            {content && !isLoading && !error && (
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleCopy}
                        disabled={copyStatus === 'copied'}
                        className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${
                            copyStatus === 'copied' 
                            ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 cursor-default' 
                            : 'bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                        }`}
                        aria-label={copyStatus === 'copied' ? 'Texte copié' : 'Copier le texte'}
                    >
                        {copyStatus === 'copied' ? (
                            <>
                                <CheckIcon className="h-5 w-5 mr-2" />
                                <span>Copié!</span>
                            </>
                        ) : (
                             <>
                                <CopyIcon className="h-5 w-5 mr-2" />
                                <span>Copier</span>
                             </>
                        )}
                    </button>
                </div>
            )}
            <div className="w-full h-full flex flex-col justify-center items-center">
                {renderContent()}
            </div>
        </div>
    );
};

const ExifModal: React.FC<{ isOpen: boolean; onClose: () => void; exifData: any | null }> = ({ isOpen, onClose, exifData }) => {
    if (!isOpen) return null;

    const convertDMSToDD = (dms: number[], ref: string): number => {
        if (!Array.isArray(dms) || dms.length < 3) return NaN;
        const [degrees, minutes, seconds] = dms;
        if (typeof degrees !== 'number' || typeof minutes !== 'number' || typeof seconds !== 'number') {
            return NaN;
        }
        let dd = degrees + minutes / 60 + seconds / 3600;
        if (ref === 'S' || ref === 'W') {
            dd = dd * -1;
        }
        return dd;
    };

    const renderContent = () => {
        if (!exifData) {
            return (
                <div className="text-center text-slate-600 dark:text-slate-400 py-8">
                    <InfoIcon className="h-10 w-10 mx-auto !mr-0 mb-4 text-slate-400 dark:text-gray-500" />
                    <p>Aucune donnée EXIF détaillée n'a été trouvée pour cette image.</p>
                </div>
            );
        }

        const make = exifData.Make?.description || 'Non disponible';
        const exposureTime = exifData.ExposureTime?.description || 'Non disponible';
        const iso = exifData.ISOSpeedRatings?.description || 'Non disponible';
        let googleMapsUrl: string | null = null;

        try {
            const latRef = exifData.GPSLatitudeRef?.value?.[0];
            const lonRef = exifData.GPSLongitudeRef?.value?.[0];

            if (exifData.GPSLatitude?.value && exifData.GPSLongitude?.value && latRef && lonRef) {
                const lat = convertDMSToDD(exifData.GPSLatitude.value, latRef);
                const lon = convertDMSToDD(exifData.GPSLongitude.value, lonRef);

                if (!isNaN(lat) && !isNaN(lon)) {
                    googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                }
            }
        } catch (e) {
            console.error("Error processing EXIF GPS data:", e);
            googleMapsUrl = null;
        }

        return (
            <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between border-b border-slate-200 dark:border-gray-700 py-2">
                    <span className="font-semibold">Marque :</span>
                    <span>{make}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-gray-700 py-2">
                    <span className="font-semibold">Vitesse d'obturation :</span>
                    <span>{exposureTime}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 dark:border-gray-700 py-2">
                    <span className="font-semibold">Sensibilité ISO :</span>
                    <span>{iso}</span>
                </div>
                {googleMapsUrl && (
                    <div className="pt-4 text-center">
                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Voir sur Google Maps
                        </a>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md transform transition-transform duration-300 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-serif-display text-slate-800 dark:text-slate-100">Détails (EXIF)</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors" aria-label="Fermer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};


export default function App() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [poemType, setPoemType] = useState<PoemType>(PoemType.VERS_LIBRES);
    const [generatedContent, setGeneratedContent] = useState<string | null>(null);
    const [contentType, setContentType] = useState<'poem' | 'quote' | 'title' | 'caption' | 'literaryText' | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [activeAction, setActiveAction] = useState<'poem' | 'quote' | 'title' | 'caption' | 'literaryText' | null>(null);
    const [exifData, setExifData] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const parseExifData = async (file: File) => {
        try {
            const tags = await ExifReader.load(file);
            delete tags['MakerNote'];
            
            // Explicitly check if the tags object has any meaningful keys.
            if (tags && Object.keys(tags).length > 0) {
                setExifData(tags);
            } else {
                // If no tags or empty object, ensure exifData is null.
                setExifData(null);
            }
        } catch (error) {
            console.error("Could not read EXIF data:", error);
            setExifData(null);
        }
    };
    

    const handleFileSelect = useCallback((file: File) => {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setGeneratedContent(null);
        setError(null);
        setContentType(null);
        parseExifData(file);
    }, []);
    
    const handleReset = () => {
        setImageFile(null);
        setImagePreview(null);
        setGeneratedContent(null);
        setError(null);
        setContentType(null);
        setIsLoading(false);
        setActiveAction(null);
        setExifData(null);
    };


    const handleGeneratePoem = async () => {
        if (!imageFile) {
            setError("Veuillez d'abord sélectionner une image.");
            return;
        }

        setIsLoading(true);
        setActiveAction('poem');
        setError(null);
        setGeneratedContent(null);
        setContentType('poem');

        try {
            const poem = await generatePoemFromImage(imageFile, poemType);
            setGeneratedContent(poem);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur inattendue est survenue.");
            }
            setContentType(null);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
        }
    };

    const handleGenerateQuotes = async () => {
        if (!imageFile) {
            setError("Veuillez d'abord sélectionner une image.");
            return;
        }

        setIsLoading(true);
        setActiveAction('quote');
        setError(null);
        setGeneratedContent(null);
        setContentType('quote');

        try {
            const quotes = await generateQuotesFromImage(imageFile);
            setGeneratedContent(quotes);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur inattendue est survenue.");
            }
             setContentType(null);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
        }
    };

    const handleGenerateTitle = async () => {
        if (!imageFile) {
            setError("Veuillez d'abord sélectionner une image.");
            return;
        }

        setIsLoading(true);
        setActiveAction('title');
        setError(null);
        setGeneratedContent(null);
        setContentType('title');

        try {
            const title = await generateTitleFromImage(imageFile);
            setGeneratedContent(title);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur inattendue est survenue.");
            }
            setContentType(null);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
        }
    };

    const handleGenerateCaption = async () => {
        if (!imageFile) {
            setError("Veuillez d'abord sélectionner une image.");
            return;
        }

        setIsLoading(true);
        setActiveAction('caption');
        setError(null);
        setGeneratedContent(null);
        setContentType('caption');

        try {
            const caption = await generateCaptionFromImage(imageFile);
            setGeneratedContent(caption);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur inattendue est survenue.");
            }
            setContentType(null);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
        }
    };

    const handleGenerateLiteraryText = async () => {
        if (!imageFile) {
            setError("Veuillez d'abord sélectionner une image.");
            return;
        }

        setIsLoading(true);
        setActiveAction('literaryText');
        setError(null);
        setGeneratedContent(null);
        setContentType('literaryText');

        try {
            const text = await generateLiteraryTextFromImage(imageFile);
            setGeneratedContent(text);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Une erreur inattendue est survenue.");
            }
            setContentType(null);
        } finally {
            setIsLoading(false);
            setActiveAction(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto relative">
                 <button
                    onClick={toggleTheme}
                    className="absolute top-0 right-0 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
                    aria-label="Changer de thème"
                >
                    {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6 text-yellow-300" />}
                </button>
                <header className="text-center mb-10">
                   <div className="flex flex-col justify-center items-center gap-4">
                        <img src={logoBase64} alt="Logo AM" className="h-24 w-24" />
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white font-serif-display">Enrichissez votre image</h1>
                            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Ajoutez un poème, une citation, un titre ou une légende</p>
                        </div>
                   </div>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                    <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                        {!imageFile ? (
                            <>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">1. Choisissez votre inspiration</h2>
                                <ImageUploader onFileSelect={handleFileSelect} />
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Votre Image</h2>
                                    <img src={imagePreview!} alt="Aperçu sélectionné" className="rounded-lg shadow-md w-full" />
                                </div>
                                
                                <div className="space-y-6 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-4 flex flex-col">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Créer un Poème</h2>
                                            <div className="flex-grow">
                                                <PoemSelector value={poemType} onChange={setPoemType} />
                                            </div>
                                            <button
                                                onClick={handleGeneratePoem}
                                                disabled={isLoading}
                                                className="w-full mt-4 flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <SparklesIcon />
                                                {isLoading && activeAction === 'poem' ? 'Génération...' : 'Générer le poème'}
                                            </button>
                                        </div>
                                        <div className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-4 flex flex-col justify-between">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Trouver des Citations</h2>
                                            <button
                                                onClick={handleGenerateQuotes}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center bg-teal-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-teal-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                                            >
                                                <QuoteIcon />
                                                {isLoading && activeAction === 'quote' ? 'Recherche...' : 'Obtenir des citations'}
                                            </button>
                                        </div>
                                        <div className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-4 flex flex-col justify-between">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Générer un titre</h2>
                                            <button
                                                onClick={handleGenerateTitle}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center bg-sky-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                            >
                                                <TitleIcon />
                                                {isLoading && activeAction === 'title' ? 'Génération...' : 'Obtenir un titre'}
                                            </button>
                                        </div>
                                        <div className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-4 flex flex-col justify-between">
                                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Générer une légende</h2>
                                            <button
                                                onClick={handleGenerateCaption}
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center bg-rose-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-rose-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                            >
                                                <CaptionIcon />
                                                {isLoading && activeAction === 'caption' ? 'Génération...' : 'Obtenir une légende'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-4 flex flex-col justify-between">
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Explorer la Littérature</h2>
                                        <button
                                            onClick={handleGenerateLiteraryText}
                                            disabled={isLoading}
                                            className="w-full flex items-center justify-center bg-amber-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-amber-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                        >
                                            <BookIcon />
                                            {isLoading && activeAction === 'literaryText' ? 'Recherche...' : 'Obtenir des textes littéraires'}
                                        </button>
                                    </div>
                                </div>
                                 <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={handleReset}
                                        className="w-full flex items-center justify-center bg-gray-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                    >
                                        Changer d'image
                                    </button>
                                     <button
                                        onClick={() => setIsModalOpen(true)}
                                        title={"Afficher les détails de l'image (EXIF)"}
                                        className="w-full flex items-center justify-center bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-purple-700 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        <InfoIcon />
                                        Détails
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full">
                        <ContentDisplay content={generatedContent} isLoading={isLoading} error={error} contentType={contentType} />
                    </div>
                </main>
                <ExifModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} exifData={exifData} />
            </div>
        </div>
    );
}