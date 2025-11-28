
import React, { useState, useRef } from 'react';
import { Story, Chapter, LoreEntry, UserCreation, User, StoryLoreCategory } from '../types';
import { allUsers, characters as allCharacters } from '../mockData';
import UserAvatar from './UserAvatar';
import CharacterSelectorModal from './CharacterSelectorModal';


// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const ChapterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const CastIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;
const LoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V2.75z" /><path fillRule="evenodd" d="M3.25 3A2.25 2.25 0 001 5.25v9.5A2.25 2.25 0 003.25 17h13.5A2.25 2.25 0 0019 14.75v-9.5A2.25 2.25 0 0016.75 3H3.25zM2.5 5.25c0-.414.336-.75.75-.75h13.5c.414 0 .75.336.75.75v9.5c0 .414-.336.75-.75.75H3.25c-.414 0-.75-.336-.75-.75v-9.5z" clipRule="evenodd" /></svg>;
const GearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.05 7.05 0 010-2.227L1.821 7.773a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const PhotoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>;
const XMarkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>;
const AdjustmentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 3.75a2 2 0 10-4 0 2 2 0 004 0zM17.25 4.5a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM5 3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM4.25 17a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM17.25 17a.75.75 0 000-1.5h-5.5a.75.75 0 000 1.5h5.5zM9 10a.75.75 0 01-.75.75h-5.5a.75.75 0 010-1.5h5.5A.75.75 0 019 10zM17.25 10.75a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5h1.5zM14 10a2 2 0 10-4 0 2 2 0 004 0zM10 16.25a2 2 0 10-4 0 2 2 0 004 0z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>;

// --- Sub-components for Tabs ---

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <button onClick={(e) => { e.stopPropagation(); onChange(); }} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-cyan-500' : 'bg-gray-600'}`}>
        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
);


const ChapterList: React.FC<{ chapters: Chapter[], activeChapterId: number | null, onSelectChapter: (c: Chapter) => void, onStatusChange: (chapterId: number, status: 'Draft' | 'Published') => void }> = ({ chapters, activeChapterId, onSelectChapter, onStatusChange }) => (
    <nav className="flex-grow overflow-y-auto p-2">
        {chapters.map(chapter => (
            <button
                key={chapter.id}
                onClick={() => onSelectChapter(chapter)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors flex justify-between items-center ${activeChapterId === chapter.id ? 'bg-violet-500/20 text-white' : 'text-gray-300 hover:bg-gray-800/60'}`}
            >
                <div className="min-w-0">
                    <span className="font-semibold block truncate">{chapter.title}</span>
                    <span className={`text-xs ${chapter.status === 'Published' ? 'text-green-400' : 'text-yellow-400'}`}>{chapter.status}</span>
                </div>
                <div className="flex-shrink-0 pl-2">
                    <Toggle checked={chapter.status === 'Published'} onChange={() => onStatusChange(chapter.id, chapter.status === 'Draft' ? 'Published' : 'Draft')} />
                </div>
            </button>
        ))}
    </nav>
);

interface CastListProps {
    cast: Story['cast'];
    coAuthorIds?: number[];
    onAdd: (charId: number) => void;
    onRemove: (charId: number) => void;
    onUpdateRole: (charId: number, role: string) => void;
    userCreations: UserCreation[];
    currentUser: User;
}

const CastList: React.FC<CastListProps> = ({ cast, coAuthorIds, onAdd, onRemove, onUpdateRole, userCreations, currentUser }) => {
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    // Combine mock data with newly added characters not in mock data if any
    const castDetails = cast.map(c => {
        const char = allCharacters.find(char => char.id === c.characterId) || userCreations.find(uc => uc.id === c.characterId);
        return { ...c, character: char };
    }).filter(c => c.character);
    
    const coAuthors = (coAuthorIds || [])
        .map(id => allUsers.find(u => u.id === id))
        .filter(Boolean);

    return (
        <div className="p-4 space-y-6">
             <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Cast</h3>
                    <button onClick={() => setIsSelectorOpen(true)} className="text-xs text-cyan-400 hover:text-white flex items-center gap-1">
                        <PlusIcon /> Add Character
                    </button>
                </div>
                <div className="space-y-3">
                    {castDetails.map(({ character, role, characterId }) => (
                        <div key={characterId} className="bg-gray-800/40 p-3 rounded-md border border-gray-700 group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <UserAvatar src={character?.imageUrl} size="8" />
                                    <p className="font-bold text-white text-sm">{character?.name}</p>
                                </div>
                                <button onClick={() => onRemove(characterId)} className="text-gray-500 hover:text-red-400">
                                    <TrashIcon />
                                </button>
                            </div>
                            <input 
                                type="text" 
                                value={role} 
                                onChange={(e) => onUpdateRole(characterId, e.target.value)}
                                className="w-full bg-black/30 border border-gray-600 rounded px-2 py-1 text-xs text-cyan-300 focus:border-cyan-500 focus:outline-none"
                                placeholder="Role (e.g. Protagonist)"
                            />
                        </div>
                    ))}
                    {castDetails.length === 0 && <p className="text-xs text-gray-500 text-center py-4">No characters added.</p>}
                </div>
            </div>
             {coAuthors.length > 0 && (
                <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-2">Co-Authors</h3>
                    <div className="space-y-3">
                        {coAuthors.map(author => (
                            <div key={author!.id} className="flex items-center gap-3 bg-gray-800/40 p-2 rounded-md">
                                <UserAvatar src={author!.avatarUrl} size="10" />
                                <div>
                                    <p className="font-bold text-white">{author!.name}</p>
                                    <p className="text-sm text-gray-400">Author</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <CharacterSelectorModal 
                isOpen={isSelectorOpen}
                onClose={() => setIsSelectorOpen(false)}
                onSelect={(id) => { onAdd(id); setIsSelectorOpen(false); }}
                characters={userCreations}
                currentUser={currentUser}
                selectedId={-1}
            />
        </div>
    );
};

interface LorebookProps { 
    lorebook: LoreEntry[];
    customCategories?: string[];
    onAdd: (entry: Omit<LoreEntry, 'id'>) => void;
    onDelete: (id: number) => void;
    onManageCategories: (action: 'add' | 'delete' | 'rename', payload: any) => void;
}

const Lorebook: React.FC<LorebookProps> = ({ lorebook, customCategories = [], onAdd, onDelete, onManageCategories }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isManaging, setIsManaging] = useState(false);
    const [newEntry, setNewEntry] = useState<Omit<LoreEntry, 'id'>>({ name: '', category: 'History', description: '' });
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<{original: string, current: string} | null>(null);

    const defaultCategories = ['History', 'Concept', 'Location', 'Item', 'Element', 'Faction', 'Creature', 'Phenomenon'];
    const allCategories = Array.from(new Set([...defaultCategories, ...customCategories]));

    const loreByCategory = lorebook.reduce((acc, entry) => {
        const key = entry.category;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(entry);
        return acc;
    }, {} as Record<string, LoreEntry[]>);

    const handleSave = () => {
        if(!newEntry.name.trim()) return;
        onAdd(newEntry);
        setNewEntry({ name: '', category: 'History', description: '' });
        setIsCreating(false);
    };

    const handleAddCategory = () => {
        if (!newCategoryName.trim()) return;
        if (allCategories.includes(newCategoryName.trim())) {
            alert("Category already exists.");
            return;
        }
        onManageCategories('add', newCategoryName.trim());
        setNewCategoryName('');
    };

    const startRename = (cat: string) => {
        setEditingCategory({ original: cat, current: cat });
    };

    const confirmRename = () => {
        if (editingCategory && editingCategory.current.trim() !== '' && editingCategory.current !== editingCategory.original) {
            onManageCategories('rename', { oldName: editingCategory.original, newName: editingCategory.current.trim() });
        }
        setEditingCategory(null);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400">Lorebook</h3>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsManaging(!isManaging)} className={`text-gray-400 hover:text-white transition-colors ${isManaging ? 'text-cyan-400' : ''}`} title="Manage Categories">
                        <AdjustmentsIcon />
                    </button>
                    <button onClick={() => setIsCreating(!isCreating)} className="text-xs text-cyan-400 hover:text-white flex items-center gap-1">
                        <PlusIcon /> New Entry
                    </button>
                </div>
            </div>

            {/* Category Management View */}
            {isManaging && (
                <div className="bg-gray-800/60 border border-violet-500/30 p-3 rounded-md space-y-3 animate-fadeIn">
                    <h4 className="text-xs font-bold text-cyan-300 uppercase">Custom Categories</h4>
                    <div className="space-y-2">
                        {customCategories.map(cat => (
                            <div key={cat} className="flex items-center justify-between bg-black/30 rounded px-2 py-1">
                                {editingCategory?.original === cat ? (
                                    <input 
                                        autoFocus
                                        type="text" 
                                        value={editingCategory.current} 
                                        onChange={(e) => setEditingCategory({ ...editingCategory, current: e.target.value })}
                                        onBlur={confirmRename}
                                        onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
                                        className="bg-transparent text-xs text-white focus:outline-none w-full"
                                    />
                                ) : (
                                    <span className="text-xs text-gray-300">{cat}</span>
                                )}
                                <div className="flex items-center gap-1">
                                    <button onClick={() => startRename(cat)} className="text-gray-500 hover:text-white p-1"><PencilIcon /></button>
                                    <button onClick={() => onManageCategories('delete', cat)} className="text-gray-500 hover:text-red-400 p-1"><XMarkIcon /></button>
                                </div>
                            </div>
                        ))}
                        {customCategories.length === 0 && <p className="text-xs text-gray-500 italic">No custom categories defined.</p>}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-gray-700">
                        <input 
                            type="text" 
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="New Category..."
                            className="flex-grow bg-black/30 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:border-cyan-500 focus:outline-none"
                        />
                        <button onClick={handleAddCategory} className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/40 px-2 py-1 rounded text-xs font-bold"><PlusIcon /></button>
                    </div>
                </div>
            )}

            {/* New Entry Form */}
            {isCreating && (
                <div className="bg-gray-800/60 border border-violet-500/30 p-3 rounded-md space-y-3 animate-fadeIn">
                    <input 
                        type="text" 
                        placeholder="Entry Name" 
                        value={newEntry.name} 
                        onChange={e => setNewEntry({...newEntry, name: e.target.value})}
                        className="w-full bg-black/30 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <select 
                        value={newEntry.category} 
                        onChange={e => setNewEntry({...newEntry, category: e.target.value})}
                        className="w-full bg-black/30 border border-gray-600 rounded px-2 py-1 text-sm text-gray-300 focus:border-cyan-500 focus:outline-none"
                    >
                        {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <textarea 
                        placeholder="Description..." 
                        value={newEntry.description} 
                        onChange={e => setNewEntry({...newEntry, description: e.target.value})}
                        rows={3}
                        className="w-full bg-black/30 border border-gray-600 rounded px-2 py-1 text-sm text-gray-300 focus:border-cyan-500 focus:outline-none resize-none"
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsCreating(false)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                        <button onClick={handleSave} className="text-xs bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-400">Save</button>
                    </div>
                </div>
            )}

            {/* Lorebook Display */}
            {Object.entries(loreByCategory).map(([category, entries]) => (
                <div key={category}>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-2">{category}</h4>
                    <div className="space-y-1">
                        {(entries as LoreEntry[]).map(entry => (
                             <details key={entry.id} className="bg-gray-800/40 p-2 rounded-md cursor-pointer group">
                                <summary className="flex justify-between items-center font-semibold text-white text-sm">
                                    <span>{entry.name}</span>
                                    <button onClick={(e) => { e.preventDefault(); onDelete(entry.id); }} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <TrashIcon />
                                    </button>
                                </summary>
                                <p className="text-xs text-gray-300 pt-2 mt-2 border-t border-violet-500/20 whitespace-pre-wrap">{entry.description}</p>
                            </details>
                        ))}
                    </div>
                </div>
            ))}
            {lorebook.length === 0 && !isCreating && <p className="text-xs text-gray-500 text-center py-4">No lore entries yet.</p>}
        </div>
    );
};

const StorySettings: React.FC<{ story: Story; onUpdate: (updates: Partial<Story>) => void }> = ({ story, onUpdate }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [currentTag, setCurrentTag] = useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    onUpdate({ imageUrl: reader.result as string });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = currentTag.trim();
            if (newTag && !(story.genreTags || []).includes(newTag)) {
                onUpdate({ genreTags: [...(story.genreTags || []), newTag] });
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        onUpdate({ genreTags: (story.genreTags || []).filter(tag => tag !== tagToRemove) });
    };

    return (
        <div className="p-4 space-y-6">
            {/* Banner */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Story Banner</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="aspect-video rounded-lg border-2 border-dashed border-violet-500/30 bg-gray-800/40 hover:border-violet-400 hover:bg-gray-800/60 transition-all cursor-pointer bg-cover bg-center flex items-center justify-center group relative overflow-hidden"
                    style={{ backgroundImage: `url(${story.imageUrl})` }}
                >
                    {!story.imageUrl && (
                        <div className="text-center">
                            <PhotoIcon />
                            <span className="text-xs text-gray-400 mt-1 block">Upload</span>
                        </div>
                    )}
                    {story.imageUrl && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <PhotoIcon className="text-white w-8 h-8" />
                        </div>
                    )}
                </div>
            </div>

            {/* Metadata */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Title</label>
                <input 
                    type="text" 
                    value={story.name} 
                    onChange={(e) => onUpdate({ name: e.target.value })} 
                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Synopsis</label>
                <textarea 
                    value={story.synopsis} 
                    onChange={(e) => onUpdate({ synopsis: e.target.value })} 
                    rows={4}
                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-2 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none" 
                />
            </div>

            {/* Tags */}
            <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {(story.genreTags || []).map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-cyan-500/20 text-cyan-300 text-[10px] font-medium px-2 py-0.5 rounded-full">
                            {tag}
                            <button onClick={() => removeTag(tag)} className="text-cyan-200 hover:text-white"><XMarkIcon /></button>
                        </span>
                    ))}
                </div>
                <input 
                    type="text" 
                    value={currentTag} 
                    onChange={(e) => setCurrentTag(e.target.value)} 
                    onKeyDown={handleTagKeyDown} 
                    placeholder="Add tag..." 
                    className="w-full bg-gray-800/60 border border-violet-500/30 rounded-md py-1.5 px-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                />
            </div>
        </div>
    );
};


type ToolkitTab = 'chapters' | 'cast' | 'lorebook' | 'settings';

interface StoryOutlineSidebarProps {
    story: Story;
    activeChapterId: number | null;
    onSelectChapter: (chapter: Chapter) => void;
    onAddChapter: () => void;
    onExit: () => void;
    onChapterStatusChange: (chapterId: number, newStatus: 'Draft' | 'Published') => void;
    onStoryUpdate: (updates: Partial<Story>) => void;
    onAddCastMember: (charId: number) => void;
    onRemoveCastMember: (charId: number) => void;
    onUpdateCastRole: (charId: number, role: string) => void;
    onAddLore: (entry: Omit<LoreEntry, 'id'>) => void;
    onDeleteLore: (id: number) => void;
    userCreations: UserCreation[];
    currentUser: User;
}

const StoryOutlineSidebar: React.FC<StoryOutlineSidebarProps> = ({ 
    story, activeChapterId, onSelectChapter, onAddChapter, onExit, onChapterStatusChange,
    onStoryUpdate, onAddCastMember, onRemoveCastMember, onUpdateCastRole, onAddLore, onDeleteLore, userCreations, currentUser
}) => {
    const [activeTab, setActiveTab] = useState<ToolkitTab>('chapters');

    const TabButton: React.FC<{ tab: ToolkitTab, icon: React.ReactElement, label: string }> = ({ tab, icon, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 p-2 transition-colors duration-200 hover:bg-violet-500/10 ${activeTab === tab ? 'text-cyan-400' : 'text-gray-400'}`}
        >
            <div className="w-6 h-6">{icon}</div>
            <span className="text-xs font-bold">{label}</span>
        </button>
    );

    const handleManageCategories = (action: 'add' | 'delete' | 'rename', payload: any) => {
        const currentCustom = story.customLoreCategories || [];
        if (action === 'add') {
            onStoryUpdate({ customLoreCategories: [...currentCustom, payload] });
        } else if (action === 'delete') {
            onStoryUpdate({ customLoreCategories: currentCustom.filter(c => c !== payload) });
        } else if (action === 'rename') {
            const { oldName, newName } = payload;
            const newCustom = currentCustom.map(c => c === oldName ? newName : c);
            const newLorebook = story.lorebook.map(entry => entry.category === oldName ? { ...entry, category: newName } : entry);
            onStoryUpdate({ customLoreCategories: newCustom, lorebook: newLorebook });
        }
    };

    return (
        <aside className="w-full md:w-80 flex-shrink-0 bg-gray-900/80 backdrop-blur-sm border-r border-violet-500/30 flex flex-col h-full">
            <header className="p-4 border-b border-violet-500/30 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <button onClick={onExit} className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white" title="Exit Workshop">
                        <ArrowLeftIcon />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-lg font-bold text-white truncate">{story.name}</h1>
                        <p className="text-sm text-gray-400">Story Editor</p>
                    </div>
                </div>
                {activeTab === 'chapters' && (
                    <button onClick={onAddChapter} className="p-1 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white" title="Add New Chapter">
                        <PlusIcon />
                    </button>
                )}
            </header>
            
            <div className="flex border-b border-violet-500/30 flex-shrink-0">
                <TabButton tab="chapters" icon={<ChapterIcon />} label="Chapters" />
                <TabButton tab="cast" icon={<CastIcon />} label="Cast" />
                <TabButton tab="lorebook" icon={<LoreIcon />} label="Lorebook" />
                <TabButton tab="settings" icon={<GearIcon />} label="Settings" />
            </div>

            <div className="flex-grow overflow-y-auto">
                {activeTab === 'chapters' && <ChapterList chapters={story.chapters} activeChapterId={activeChapterId} onSelectChapter={onSelectChapter} onStatusChange={onChapterStatusChange} />}
                {activeTab === 'cast' && <CastList cast={story.cast} coAuthorIds={story.coAuthorIds} onAdd={onAddCastMember} onRemove={onRemoveCastMember} onUpdateRole={onUpdateCastRole} userCreations={userCreations} currentUser={currentUser} />}
                {activeTab === 'lorebook' && <Lorebook lorebook={story.lorebook} customCategories={story.customLoreCategories} onAdd={onAddLore} onDelete={onDeleteLore} onManageCategories={handleManageCategories} />}
                {activeTab === 'settings' && <StorySettings story={story} onUpdate={onStoryUpdate} />}
            </div>
        </aside>
    );
};

export default StoryOutlineSidebar;
