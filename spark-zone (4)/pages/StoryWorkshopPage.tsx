
import React, { useState } from 'react';
import { Story, Chapter, UserCreation, User, LoreEntry } from '../types';
import StoryOutlineSidebar from '../components/StoryOutlineSidebar';
import StoryEditorView from '../components/StoryEditorView';
import { currentUser, initialUserCreations } from '../mockData'; // Import mock data for context

interface StoryWorkshopPageProps {
    story: Story;
    onExit: () => void;
    onSave: (story: Story) => void;
}

const EmptyEditorView: React.FC<{ onAddChapter: () => void }> = ({ onAddChapter }) => (
    <div className="flex-grow flex flex-col items-center justify-center text-gray-400 h-full bg-black/20">
        <p className="text-lg">Select a chapter to begin writing</p>
        <p className="text-sm my-1">or</p>
        <button onClick={onAddChapter} className="text-cyan-400 font-semibold hover:underline">
            Create your first chapter
        </button>
    </div>
);

const StoryWorkshopPage: React.FC<StoryWorkshopPageProps> = ({ story: initialStory, onExit, onSave }) => {
    const [story, setStory] = useState<Story>(initialStory);
    const [activeChapterId, setActiveChapterId] = useState<number | null>(story.chapters[0]?.id ?? null);
    const [isEditorVisible, setIsEditorVisible] = useState(!!story.chapters[0]);

    const activeChapter = story.chapters.find(c => c.id === activeChapterId);

    // --- Story Level Handlers ---

    const handleStoryUpdate = (updates: Partial<Story>) => {
        setStory(prev => ({ ...prev, ...updates }));
    };

    const handleAddCastMember = (characterId: number) => {
        if (story.cast.some(c => c.characterId === characterId)) return;
        
        const newCastMember = { characterId, role: 'Supporting Character' };
        setStory(prev => ({ ...prev, cast: [...prev.cast, newCastMember] }));
    };

    const handleRemoveCastMember = (characterId: number) => {
        setStory(prev => ({ ...prev, cast: prev.cast.filter(c => c.characterId !== characterId) }));
    };

    const handleUpdateCastRole = (characterId: number, newRole: string) => {
        setStory(prev => ({
            ...prev,
            cast: prev.cast.map(c => c.characterId === characterId ? { ...c, role: newRole } : c)
        }));
    };

    // --- Lore Handlers ---
    const handleAddLore = (entry: Omit<LoreEntry, 'id'>) => {
        const newEntry: LoreEntry = { ...entry, id: Date.now() };
        setStory(prev => ({ ...prev, lorebook: [...prev.lorebook, newEntry] }));
    };

    const handleDeleteLore = (id: number) => {
        setStory(prev => ({ ...prev, lorebook: prev.lorebook.filter(l => l.id !== id) }));
    };

    // --- Chapter Level Handlers ---

    const handleSelectChapter = (chapter: Chapter) => {
        setActiveChapterId(chapter.id);
        setIsEditorVisible(true);
    };

    const handleChapterUpdate = (field: 'title' | 'content', value: string) => {
        setStory(prevStory => ({
            ...prevStory,
            chapters: prevStory.chapters.map(chapter =>
                chapter.id === activeChapterId ? { ...chapter, [field]: value } : chapter
            ),
        }));
    };

    const handleChapterStatusChange = (chapterId: number, newStatus: 'Draft' | 'Published') => {
        setStory(prev => ({
            ...prev,
            chapters: prev.chapters.map(c => 
                c.id === chapterId ? { ...c, status: newStatus } : c
            )
        }));
    };

    const addChapter = () => {
        const newChapter: Chapter = {
            id: Date.now(),
            title: `Chapter ${story.chapters.length + 1}`,
            content: '',
            status: 'Draft',
        };
        setStory(prev => ({ ...prev, chapters: [...prev.chapters, newChapter] }));
        setActiveChapterId(newChapter.id);
        setIsEditorVisible(true);
    };
    
    const handleSaveAndExit = () => {
        onSave(story);
    };

    // Filter for user creations to pass to character selector
    const userCharacters = initialUserCreations.filter(c => c.type === 'Character' || c.type === 'AI Character');

    return (
        <div className="flex h-full w-full bg-black bg-gradient-to-tr from-black via-[#010619] to-blue-900/20 text-gray-100 font-sans">
            {/* Mobile View */}
            <div className="md:hidden w-full h-full">
                {isEditorVisible && activeChapter ? (
                    <StoryEditorView
                        chapter={activeChapter}
                        cast={story.cast}
                        onChapterUpdate={handleChapterUpdate}
                        onBack={() => setIsEditorVisible(false)}
                        onSave={handleSaveAndExit}
                    />
                ) : (
                    <StoryOutlineSidebar
                        story={story}
                        activeChapterId={activeChapterId}
                        onSelectChapter={handleSelectChapter}
                        onAddChapter={addChapter}
                        onExit={onExit}
                        onChapterStatusChange={handleChapterStatusChange}
                        onStoryUpdate={handleStoryUpdate}
                        onAddCastMember={handleAddCastMember}
                        onRemoveCastMember={handleRemoveCastMember}
                        onUpdateCastRole={handleUpdateCastRole}
                        onAddLore={handleAddLore}
                        onDeleteLore={handleDeleteLore}
                        userCreations={userCharacters}
                        currentUser={currentUser}
                    />
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex flex-1 min-w-0 h-full">
                <StoryOutlineSidebar
                    story={story}
                    activeChapterId={activeChapterId}
                    onSelectChapter={handleSelectChapter}
                    onAddChapter={addChapter}
                    onExit={onExit}
                    onChapterStatusChange={handleChapterStatusChange}
                    onStoryUpdate={handleStoryUpdate}
                    onAddCastMember={handleAddCastMember}
                    onRemoveCastMember={handleRemoveCastMember}
                    onUpdateCastRole={handleUpdateCastRole}
                    onAddLore={handleAddLore}
                    onDeleteLore={handleDeleteLore}
                    userCreations={userCharacters}
                    currentUser={currentUser}
                />
                <div className="flex-1 flex flex-col min-w-0">
                    {activeChapter ? (
                        <StoryEditorView
                            chapter={activeChapter}
                            cast={story.cast}
                            onChapterUpdate={handleChapterUpdate}
                            onSave={handleSaveAndExit}
                        />
                    ) : (
                        <EmptyEditorView onAddChapter={addChapter} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryWorkshopPage;
