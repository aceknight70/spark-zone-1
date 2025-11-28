
import React, { useState, useRef } from 'react';
import { Character, AgeRating, ContentWarning } from '../types';
import LightningBoltIcon from '../components/icons/LightningBoltIcon';
import CharacterAiGeneratorModal from '../components/CharacterAiGeneratorModal';
import ContentRatingSelector from '../components/ContentRatingSelector';
import { GoogleGenAI, Modality } from '@google/genai';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-gray-500"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const RectangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" /></svg>;

// --- Helper Components ---

type KeyValue = { key: string; value: string };

const FormInput: React.FC<{ id: string; label: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = 
({ id, label, placeholder, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input type="text" id={id} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
);

const FormTextarea: React.FC<{ id: string; label: string; placeholder?: string; value: string; rows?: number; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }> =
({ id, label, placeholder, value, rows=3, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
    </div>
);

const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; rightContent?: React.ReactNode; }> = ({ title, children, isOpen, onToggle, rightContent }) => (
    <div className="border-b border-violet-500/30 last:border-b-0">
        <div 
            onClick={onToggle} 
            className="w-full flex justify-between items-center p-4 text-left hover:bg-violet-500/10 transition-colors cursor-pointer select-none"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } }}
        >
            <h3 className="text-xl font-bold text-cyan-400">{title}</h3>
            <div className="flex items-center gap-4">
                {rightContent}
                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
        </div>
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
            <div className="p-6 bg-black/20 space-y-6">
                {children}
            </div>
        </div>
    </div>
);


const defaultCharacter: Partial<Character> = {
    type: 'Character',
    name: '',
    epithet: '',
    tagline: '',
    archetypeTags: [],
    imageUrl: 'https://images.unsplash.com/photo-1518584346522-3e3203b45e5a?q=80&w=800&auto=format&fit=crop',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
    appearance: '',
    physicalDetails: {},
    personality: {
        description: '',
        traits: [],
        quirks: []
    },
    backstory: '',
    abilities: [],
    gallery: { images: [] },
    contentMetadata: { ageRating: 'Everyone', warnings: [] }
};

const commonArchetypes = [
    'Hero', 'Villain', 'Anti-Hero', 'Rogue', 'Mage', 'Warrior', 'Healer', 
    'Support', 'Tank', 'Leader', 'Sidekick', 'Mentor', 'Chosen One', 
    'Rebel', 'Explorer', 'Scientist', 'Detective', 'Diplomat', 
    'Trickster', 'Guardian', 'Merchant', 'Mercenary', 'Pirate', 
    'Ninja', 'Samurai', 'Knight', 'Paladin', 'Bard', 'Druid', 
    'Monk', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer',
    'Cyberpunk', 'Steampunk', 'Sci-Fi', 'Fantasy', 'Horror', 'Noir'
];

interface CharacterCreationPageProps {
    characterToEdit?: Character;
    onExit: () => void;
    onSave: (characterData: Omit<Character, 'id' | 'status'> | Character) => void;
}

const CharacterCreationPage: React.FC<CharacterCreationPageProps> = ({ characterToEdit, onExit, onSave }) => {
    const isEditing = !!characterToEdit;
    const [character, setCharacter] = useState<Partial<Character>>(
        characterToEdit ? { ...defaultCharacter, ...characterToEdit } : defaultCharacter
    );
    const [physicalDetails, setPhysicalDetails] = useState<KeyValue[]>(
        characterToEdit ? Object.entries(characterToEdit.physicalDetails || {}).map(([key, value]) => ({ key, value })) : []
    );
    const [openSections, setOpenSections] = useState<string[]>(['spark']);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    // --- Tag Inputs ---
    const [currentArchetypeTag, setCurrentArchetypeTag] = useState('');
    const [currentQuirk, setCurrentQuirk] = useState('');
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    
    const filteredArchetypes = currentArchetypeTag 
        ? commonArchetypes.filter(t => 
            t.toLowerCase().includes(currentArchetypeTag.toLowerCase()) && 
            !(character.archetypeTags || []).includes(t)
          )
        : [];

    // --- Generic Handlers ---
    const handleNestedChange = <T,>(section: keyof Character, field: keyof T, value: any) => {
        setCharacter(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [field]: value,
            }
        }));
    };
    
    // --- Section Toggling ---
    const toggleSection = (sectionName: string) => {
        setOpenSections(prev => 
            prev.includes(sectionName)
                ? prev.filter(s => s !== sectionName)
                : [...prev, sectionName]
        );
    };

    // --- Tag Handlers ---
    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, tagType: 'archetypeTags' | 'quirks') => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = (e.target as HTMLInputElement).value.trim();
            if (tagType === 'archetypeTags') {
                if (value && !(character.archetypeTags || []).includes(value)) {
                    setCharacter(p => ({ ...p, archetypeTags: [...(p.archetypeTags || []), value] }));
                }
                setCurrentArchetypeTag('');
                setShowTagSuggestions(false);
            } else if (tagType === 'quirks') {
                 if (value && !(character.personality?.quirks || []).includes(value)) {
                    handleNestedChange('personality', 'quirks', [...(character.personality?.quirks || []), value]);
                 }
                 setCurrentQuirk('');
            }
        }
    };

    const addTag = (tag: string) => {
        setCharacter(p => ({ ...p, archetypeTags: [...(p.archetypeTags || []), tag] }));
        setCurrentArchetypeTag('');
        setShowTagSuggestions(false);
    };

    const removeTag = (tagToRemove: string, tagType: 'archetypeTags' | 'quirks') => {
         if (tagType === 'archetypeTags') {
            setCharacter(p => ({...p, archetypeTags: (p.archetypeTags || []).filter(tag => tag !== tagToRemove)}));
         } else if (tagType === 'quirks') {
            handleNestedChange('personality', 'quirks', (character.personality?.quirks || []).filter(q => q !== tagToRemove));
         }
    };

    // --- Image Handlers ---
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, target: 'gallery' | 'avatar' | 'banner' = 'gallery') => {
        const files = event.target.files;
        if (!files || files.length === 0) return;
        
        if (target === 'gallery') {
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        handleNestedChange('gallery', 'images', [...(character.gallery?.images || []), reader.result]);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    if (target === 'avatar') {
                        setCharacter(prev => ({ ...prev, imageUrl: reader.result as string }));
                    } else if (target === 'banner') {
                        setCharacter(prev => ({ ...prev, bannerUrl: reader.result as string }));
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- AI Image Gen ---
    const handleGeneratePortrait = async () => {
        if (!character.name) {
            alert("Please name your character first.");
            return;
        }
        setIsGeneratingImage(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `A portrait of a character named ${character.name}, ${character.epithet}. 
            Description: ${character.appearance || 'A fantasy character'}. 
            Archetype: ${character.archetypeTags?.join(', ')}.
            High quality, detailed, digital art style.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: [{ text: prompt }] },
                config: { responseModalities: [Modality.IMAGE] },
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                    handleNestedChange('gallery', 'images', [...(character.gallery?.images || []), imageUrl]);
                    if (character.imageUrl?.includes('unsplash')) {
                        setCharacter(prev => ({...prev, imageUrl}));
                    }
                    break;
                }
            }
        } catch (e) {
            console.error("Image Gen Failed", e);
            alert("Failed to generate image.");
        } finally {
            setIsGeneratingImage(false);
        }
    };


    const handleSave = () => {
        if (!character.name) {
            alert("Character name is required.");
            toggleSection('spark');
            return;
        }
        
        const finalCharacterData = {
            ...character,
            physicalDetails: physicalDetails.reduce((acc, { key, value }) => {
                if (key) acc[key] = value;
                return acc;
            }, {} as { [key: string]: string }),
        };

        onSave(finalCharacterData as Character);
    };

    const handleAiGenerate = (data: { name: string; epithet: string; tagline: string; archetypeTags: string[] }) => {
        setCharacter(prev => ({...prev, ...data}));
    };

    return (
        <div className="min-h-screen container mx-auto px-0 md:px-4 py-8 animate-fadeIn h-full overflow-y-auto pb-20 md:pb-4">
             <div className="flex items-center mb-6 px-4">
                <button onClick={onExit} className="p-2 mr-2 rounded-full hover:bg-gray-800 transition-colors" aria-label="Back to workshop">
                    <ArrowLeftIcon />
                </button>
                <h1 className="text-3xl font-bold text-white">{isEditing ? 'Character Workshop' : 'Create New Character'}</h1>
            </div>

            <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg max-w-4xl mx-auto overflow-hidden mb-16">
                
                {/* --- VISUAL IDENTITY --- */}
                <div className="relative group">
                    <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner')} />
                    <div 
                        onClick={() => bannerInputRef.current?.click()}
                        className="h-48 w-full bg-gray-800 bg-cover bg-center relative cursor-pointer group/banner" 
                        style={{ backgroundImage: `url(${character.bannerUrl || character.imageUrl})` }}
                    >
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/banner:opacity-100 flex items-center justify-center transition-opacity duration-300">
                            <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm flex items-center gap-2">
                                <PhotoIcon className="w-4 h-4"/> Change Banner
                            </span>
                        </div>
                    </div>
                    
                    <div className="absolute -bottom-16 left-6 flex items-end">
                        <div className="relative group/avatar">
                            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                            <div 
                                onClick={() => avatarInputRef.current?.click()}
                                className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gray-800 overflow-hidden cursor-pointer relative"
                            >
                                <img src={character.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                                    <PhotoIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 mb-4 space-y-1">
                            <button 
                                onClick={() => setIsAiModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider rounded-full border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
                            >
                                <LightningBoltIcon className="w-3 h-3" /> Generate Profile
                            </button>
                            {character.name && (
                                <button 
                                    onClick={handleGeneratePortrait}
                                    disabled={isGeneratingImage}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/20 text-violet-300 text-xs font-bold uppercase tracking-wider rounded-full border border-violet-500/30 hover:bg-violet-500/30 transition-colors disabled:opacity-50"
                                >
                                    {isGeneratingImage ? 'Painting...' : 'Generate Portrait'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-20 px-6 pb-6 space-y-6">
                    
                    {/* --- NAME & IDENTITY --- */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormInput id="name" label="Character Name" placeholder="e.g., Kaelen" value={character.name || ''} onChange={(e) => setCharacter(p => ({...p, name: e.target.value}))} />
                        <FormInput id="epithet" label="Epithet (Title)" placeholder="e.g., the Shadow Rogue" value={character.epithet || ''} onChange={(e) => setCharacter(p => ({...p, epithet: e.target.value}))} />
                    </div>
                    <FormTextarea id="tagline" label="Tagline / Catchphrase" placeholder="e.g., Trust is a currency I don't spend." value={character.tagline || ''} rows={2} onChange={(e) => setCharacter(p => ({...p, tagline: e.target.value}))} />

                    {/* --- ACCORDION SECTIONS --- */}
                    <div className="space-y-1 border-t border-violet-500/30 pt-4">
                        
                        {/* 1. THE SPARK (Archetypes & Personality) */}
                        <AccordionItem title="The Spark" isOpen={openSections.includes('spark')} onToggle={() => toggleSection('spark')} rightContent={<LightningBoltIcon className="w-5 h-5 text-yellow-400"/>}>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Archetype Tags</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {character.archetypeTags?.map(tag => (
                                        <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full border border-cyan-500/30">
                                            {tag}
                                            <button onClick={() => removeTag(tag, 'archetypeTags')} className="text-cyan-200 hover:text-white"><XMarkIcon /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={currentArchetypeTag} 
                                        onChange={(e) => { setCurrentArchetypeTag(e.target.value); setShowTagSuggestions(true); }} 
                                        onKeyDown={(e) => handleTagKeyDown(e, 'archetypeTags')}
                                        onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                                        placeholder="e.g., Hero, Rogue, Sci-Fi" 
                                        className="w-full bg-gray-800 border border-violet-500/30 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                                    />
                                    {showTagSuggestions && filteredArchetypes.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                                            {filteredArchetypes.map(tag => (
                                                <button key={tag} onClick={() => addTag(tag)} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <FormTextarea id="personalityDesc" label="Personality Description" placeholder="Describe their demeanor, fears, and motivations..." value={character.personality?.description || ''} rows={4} onChange={(e) => handleNestedChange('personality', 'description', e.target.value)} />
                        </AccordionItem>

                        {/* 2. BLUEPRINT (Physical & Backstory) */}
                        <AccordionItem title="Blueprint" isOpen={openSections.includes('blueprint')} onToggle={() => toggleSection('blueprint')} rightContent={<UserIcon />}>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormInput id="age" label="Age" placeholder="e.g., 28" value={physicalDetails.find(p => p.key === 'Age')?.value || ''} onChange={(e) => {
                                    const newDetails = [...physicalDetails];
                                    const idx = newDetails.findIndex(p => p.key === 'Age');
                                    if (idx >= 0) newDetails[idx].value = e.target.value;
                                    else newDetails.push({ key: 'Age', value: e.target.value });
                                    setPhysicalDetails(newDetails);
                                }} />
                                <FormInput id="height" label="Height" placeholder="e.g., 6'1" value={physicalDetails.find(p => p.key === 'Height')?.value || ''} onChange={(e) => {
                                    const newDetails = [...physicalDetails];
                                    const idx = newDetails.findIndex(p => p.key === 'Height');
                                    if (idx >= 0) newDetails[idx].value = e.target.value;
                                    else newDetails.push({ key: 'Height', value: e.target.value });
                                    setPhysicalDetails(newDetails);
                                }} />
                            </div>
                            <FormTextarea id="appearance" label="Appearance Description" placeholder="Describe their look, clothing, and distinctive features..." value={character.appearance || ''} rows={4} onChange={(e) => setCharacter(p => ({...p, appearance: e.target.value}))} />
                            <FormTextarea id="backstory" label="Backstory" placeholder="Where do they come from? What is their history?" value={character.backstory || ''} rows={6} onChange={(e) => setCharacter(p => ({...p, backstory: e.target.value}))} />
                        </AccordionItem>

                        {/* 3. ABILITIES */}
                        <AccordionItem title="Abilities" isOpen={openSections.includes('abilities')} onToggle={() => toggleSection('abilities')} rightContent={<RectangleIcon />}>
                            {character.abilities?.map((ability, index) => (
                                <div key={index} className="bg-gray-800/50 p-3 rounded-md border border-gray-700 space-y-2 relative group">
                                    <button onClick={() => {
                                        const newAbilities = character.abilities?.filter((_, i) => i !== index);
                                        setCharacter(p => ({...p, abilities: newAbilities}));
                                    }} className="absolute top-2 right-2 text-gray-500 hover:text-red-400"><XMarkIcon /></button>
                                    <input 
                                        type="text" 
                                        value={ability.name} 
                                        onChange={(e) => {
                                            const newAbilities = [...(character.abilities || [])];
                                            newAbilities[index].name = e.target.value;
                                            setCharacter(p => ({...p, abilities: newAbilities}));
                                        }}
                                        placeholder="Ability Name" 
                                        className="w-full bg-transparent text-white font-bold border-b border-gray-600 focus:border-cyan-500 outline-none pb-1" 
                                    />
                                    <textarea 
                                        value={ability.description} 
                                        onChange={(e) => {
                                            const newAbilities = [...(character.abilities || [])];
                                            newAbilities[index].description = e.target.value;
                                            setCharacter(p => ({...p, abilities: newAbilities}));
                                        }}
                                        placeholder="Description..." 
                                        rows={2} 
                                        className="w-full bg-transparent text-sm text-gray-300 resize-none focus:outline-none" 
                                    />
                                </div>
                            ))}
                            <button 
                                onClick={() => setCharacter(p => ({...p, abilities: [...(p.abilities || []), { name: '', description: '' }] }))}
                                className="w-full py-2 border-2 border-dashed border-gray-700 text-gray-400 rounded-md hover:border-cyan-500 hover:text-cyan-400 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <PlusIcon /> Add Ability
                            </button>
                        </AccordionItem>

                        {/* 4. DEFENSE SYSTEM */}
                        <AccordionItem title="Defense System" isOpen={openSections.includes('defense')} onToggle={() => toggleSection('defense')} rightContent={<span className="text-xs text-gray-500 uppercase tracking-wider">Safety</span>}>
                            <ContentRatingSelector 
                                rating={character.contentMetadata?.ageRating || 'Everyone'} 
                                setRating={(r) => handleNestedChange('contentMetadata', 'ageRating', r)}
                                warnings={character.contentMetadata?.warnings || []}
                                setWarnings={(w) => handleNestedChange('contentMetadata', 'warnings', w)}
                            />
                        </AccordionItem>
                    </div>
                </div>
                
                {/* Footer Actions */}
                <div className="p-4 border-t border-violet-500/30 flex justify-end gap-4 bg-gray-900/80 backdrop-blur-sm sticky bottom-0 z-10">
                    <button onClick={onExit} className="px-6 py-2 text-gray-400 font-bold hover:text-white transition-colors">Cancel</button>
                    <button 
                        onClick={handleSave} 
                        className="px-8 py-2 bg-cyan-500 text-white font-bold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all"
                    >
                        Save Character
                    </button>
                </div>
            </div>

            <CharacterAiGeneratorModal 
                isOpen={isAiModalOpen} 
                onClose={() => setIsAiModalOpen(false)} 
                onGenerate={handleAiGenerate} 
            />
        </div>
    );
};

export default CharacterCreationPage;
