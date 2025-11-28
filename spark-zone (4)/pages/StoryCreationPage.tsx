
import React, { useState } from 'react';
import { Story, AgeRating, ContentWarning } from '../types';
import ContentRatingSelector from '../components/ContentRatingSelector';
import { GoogleGenAI, Modality } from '@google/genai';
import LightningBoltIcon from '../components/icons/LightningBoltIcon';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-500"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;

interface StoryCreationPageProps {
    onExit: () => void;
    onCreate: (newStory: Omit<Story, 'id' | 'status' | 'chapters'>) => void;
}

const FormInput: React.FC<{ id: string; label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = 
({ id, label, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
    </div>
);

const FormTextarea: React.FC<{ id: string; label: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> =
({ id, label, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        />
    </div>
);


const StoryCreationPage: React.FC<StoryCreationPageProps> = ({ onExit, onCreate }) => {
    const [title, setTitle] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [ageRating, setAgeRating] = useState<AgeRating>('Everyone');
    const [warnings, setWarnings] = useState<ContentWarning[]>([]);
    const [coverUrl, setCoverUrl] = useState('https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = currentTag.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setCurrentTag('');
        }
    };
    
    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleCreate = () => {
        if (!title) {
            alert("Story title is required.");
            return;
        }
        onCreate({
            type: 'Story',
            name: title,
            synopsis,
            genreTags: tags,
            mainCharacterIds: [], 
            imageUrl: coverUrl,
            contentMetadata: {
                ageRating,
                warnings
            }
        });
    };

    const handleGenerateCover = async () => {
        if (!title) {
            alert("Please enter a title first.");
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Book cover art for a story titled "${title}". 
            Genre: ${tags.join(', ')}. 
            Synopsis: ${synopsis || 'A mysterious adventure'}. 
            Cinematic, atmospheric, digital art, no text.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    setCoverUrl(imageUrl);
                    break;
                }
            }
        } catch (e) {
            console.error("Cover Gen Failed", e);
            alert("Failed to generate cover.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen container mx-auto px-4 py-8 animate-fadeIn">
             <div className="flex items-center mb-6">
                <button onClick={onExit} className="p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Back to workshop">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-3xl font-bold text-white">Create a New Story</h1>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="md:col-span-2 bg-gray-900/50 border border-violet-500/30 rounded-lg p-6">
                    <h2 className="text-xl font-bold text-cyan-400 mb-6 border-b border-violet-500/30 pb-4">The Story Seed</h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                            <div className="mt-2 flex flex-col md:flex-row gap-4">
                                <div className="flex-grow flex justify-center rounded-lg border border-dashed border-violet-500/50 px-6 py-10 bg-gray-800/40 hover:border-violet-400 transition-colors cursor-pointer bg-cover bg-center" style={{ backgroundImage: `url(${coverUrl})` }}>
                                    <div className="text-center bg-black/50 p-2 rounded">
                                        <PhotoIcon className="mx-auto" />
                                        <div className="mt-2 flex text-sm leading-6 text-gray-400">
                                            <p className="pl-1">Upload custom cover</p>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleGenerateCover}
                                    disabled={isGenerating}
                                    className="flex flex-col items-center justify-center p-6 border border-cyan-500/50 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-wait"
                                >
                                    <LightningBoltIcon className={`w-8 h-8 text-cyan-400 ${isGenerating ? 'animate-pulse' : ''}`} />
                                    <span className="mt-2 text-sm font-bold text-cyan-300">{isGenerating ? 'Dreaming...' : 'Generate Cover'}</span>
                                </button>
                            </div>
                        </div>

                        <FormInput id="story-title" label="Title" placeholder="The Serpent's Heir" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <FormTextarea id="story-synopsis" label="Synopsis / Logline" placeholder="A short, catchy summary of your story." value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
                        
                        <div>
                            <label htmlFor="story-tags" className="block text-sm font-medium text-gray-300 mb-2">Genre Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="text-cyan-200 hover:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M2.22 2.22a.75.75 0 011.06 0L8 7.94l4.72-4.72a.75.75 0 111.06 1.06L9.06 8l4.72 4.72a.75.75 0 11-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 01-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 010-1.06z" /></svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                id="story-tags"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="e.g., Fantasy Adventure Mystery"
                                className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <p className="text-xs text-gray-500 mt-2">Press Space, Enter, or Comma to add a tag.</p>
                        </div>

                    </div>
                </div>

                <div className="md:col-span-1 space-y-6">
                    <ContentRatingSelector 
                        rating={ageRating} 
                        setRating={setAgeRating} 
                        warnings={warnings} 
                        setWarnings={setWarnings} 
                    />
                    
                    <button 
                        onClick={handleCreate}
                        className="w-full px-6 py-4 bg-cyan-500 text-white font-bold text-lg rounded-lg shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                        Create Story
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryCreationPage;
