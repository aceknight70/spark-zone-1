
import React, { useMemo, useRef, useState } from 'react';
import { Chapter, StoryCharacter, Character } from '../types';
import { characters as allCharacters } from '../mockData';
import UserAvatar from './UserAvatar';
import { GoogleGenAI } from '@google/genai';
import LightningBoltIcon from './icons/LightningBoltIcon';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const BoldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5zm0 4a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5zm0 4a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5zM12.5 5a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0v-8.5a.75.75 0 01.75-.75z" clipRule="evenodd" transform="skewX(-15)" /></svg>;
const ItalicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M7 4.75A.75.75 0 017.75 4h5.5a.75.75 0 010 1.5h-1.37l-2.023 8.5H12a.75.75 0 010 1.5H6.25a.75.75 0 010-1.5h1.37l2.023-8.5H8a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;

interface StoryEditorViewProps {
    chapter: Chapter;
    cast: StoryCharacter[];
    onChapterUpdate: (field: 'title' | 'content', value: string) => void;
    onBack?: () => void;
    onSave: () => void;
}

const StoryEditorView: React.FC<StoryEditorViewProps> = ({ chapter, cast, onChapterUpdate, onBack, onSave }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showCastSidebar, setShowCastSidebar] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const { wordCount, charCount } = useMemo(() => {
        const content = chapter.content || '';
        const words = content.trim().split(/\s+/).filter(Boolean).length;
        return {
            wordCount: content.trim() === '' ? 0 : words,
            charCount: content.length,
        };
    }, [chapter.content]);

    const applyMarkdown = (format: 'bold' | 'italic') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const markers = format === 'bold' ? '**' : '*';
        const newText = `${textarea.value.substring(0, start)}${markers}${selectedText}${markers}${textarea.value.substring(end)}`;

        onChapterUpdate('content', newText);

        // Re-focus and set cursor position after state update
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + markers.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
        }, 0);
    };

    const insertText = (text: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = `${textarea.value.substring(0, start)}${text}${textarea.value.substring(end)}`;
        onChapterUpdate('content', newText);
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };

    const handleAiContinue = async () => {
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            // Gather context
            const context = chapter.content.slice(-2000); // Last 2000 chars
            const prompt = `You are a creative writing assistant helping to write a story chapter. 
            Here is the recent context of the story:
            "${context}"
            
            Continue the story naturally from where it left off. Keep the tone and style consistent. Do not repeat the last sentence. Write about 100-200 words.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            const continuedText = response.text;
            if (continuedText) {
                // Append with a space if needed
                const separator = chapter.content.endsWith(' ') || chapter.content.endsWith('\n') ? '' : ' ';
                insertText(`${separator}${continuedText}`);
            }
        } catch (e) {
            console.error("AI Write failed", e);
            alert("AI Writer failed. Please try again.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const castMembers = cast.map(c => ({
        ...c,
        character: allCharacters.find(char => char.id === c.characterId)
    })).filter(c => c.character);

    return (
        <main className="flex-1 flex min-w-0 h-full bg-black/20 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
                <header className="p-3 border-b border-violet-500/30 flex-shrink-0 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-grow min-w-0">
                        {onBack && (
                            <button onClick={onBack} className="p-2 -ml-2 rounded-md text-gray-300 hover:text-white transition-colors" aria-label="Back">
                                <ArrowLeftIcon />
                            </button>
                        )}
                        <input
                            type="text"
                            value={chapter.title}
                            onChange={(e) => onChapterUpdate('title', e.target.value)}
                            placeholder="Chapter Title"
                            className="w-full bg-transparent text-2xl font-bold text-white focus:outline-none truncate"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button 
                            onClick={handleAiContinue} 
                            disabled={isAiLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-md border border-cyan-500/30 hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-wait transition-colors"
                            title="AI Continue"
                        >
                            <LightningBoltIcon className={`w-3 h-3 ${isAiLoading ? 'animate-pulse' : ''}`} />
                            {isAiLoading ? 'Writing...' : 'Continue'}
                        </button>
                        <div className="w-px h-6 bg-gray-700 mx-1"></div>
                        <button onClick={() => setShowCastSidebar(!showCastSidebar)} className={`p-2 rounded-md transition-colors ${showCastSidebar ? 'text-cyan-400 bg-cyan-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`} title="Toggle Cast Reference">
                            <UsersIcon />
                        </button>
                        <div className="w-px h-6 bg-gray-700 mx-1"></div>
                        <button onClick={() => applyMarkdown('bold')} className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white" title="Bold">
                            <BoldIcon />
                        </button>
                        <button onClick={() => applyMarkdown('italic')} className="p-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white" title="Italic">
                            <ItalicIcon />
                        </button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <textarea
                        ref={textareaRef}
                        value={chapter.content}
                        onChange={(e) => onChapterUpdate('content', e.target.value)}
                        placeholder="Let the story flow..."
                        className="w-full h-full bg-transparent text-lg text-gray-300 focus:outline-none resize-none leading-relaxed"
                    />
                </div>
                <footer className="p-3 border-t border-violet-500/30 flex-shrink-0 bg-gray-900/50 flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                        <span>{wordCount} words</span>
                        <span className="mx-2">|</span>
                        <span>{charCount} characters</span>
                    </div>
                    <button
                        onClick={onSave}
                        className="px-5 py-2.5 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                        Save & Exit
                    </button>
                </footer>
            </div>

            {/* Cast Sidebar */}
            {showCastSidebar && (
                <aside className="w-64 bg-gray-900/95 border-l border-violet-500/30 flex flex-col animate-slideInRight">
                    <div className="p-3 border-b border-violet-500/30 font-bold text-gray-400 uppercase text-xs tracking-wider">
                        Quick Insert
                    </div>
                    <div className="flex-grow overflow-y-auto p-2 space-y-2">
                        {castMembers.map(({ character, role }) => (
                            <div key={character!.id} className="bg-black/40 rounded-lg p-2 flex items-center gap-3 hover:bg-violet-900/20 transition-colors group">
                                <UserAvatar src={character!.imageUrl} size="8" />
                                <div className="min-w-0 flex-grow">
                                    <p className="font-bold text-white text-sm truncate">{character!.name}</p>
                                    <div className="flex gap-2 mt-1">
                                        <button onClick={() => insertText(`${character!.name}: `)} className="text-[10px] px-2 py-0.5 bg-cyan-900/50 text-cyan-300 rounded hover:bg-cyan-500 hover:text-white transition-colors">
                                            Dialogue
                                        </button>
                                        <button onClick={() => insertText(character!.name)} className="text-[10px] px-2 py-0.5 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 hover:text-white transition-colors">
                                            Name
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {castMembers.length === 0 && <p className="text-xs text-gray-500 text-center p-4">Add characters in the Cast tab.</p>}
                    </div>
                </aside>
            )}
        </main>
    );
};

export default StoryEditorView;
