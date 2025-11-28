
import React, { useState, useEffect } from 'react';
import { Conversation, Message, UserCreation, User } from '../types';
import { currentUser } from '../mockData';
import ConversationListItem from '../components/ConversationListItem';
import ChatView from '../components/ChatView';
import NewConversationModal from '../components/NewConversationModal';

const PencilSquareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>;
const EmptyMessagesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>

interface MessengerPageProps {
    conversations: Conversation[];
    onSendMessage: (conversationId: number, text: string, character?: UserCreation, imageUrl?: string) => void;
    onCreateConversation: (participantId: number) => number;
    userCreations: UserCreation[];
    allUsers: User[];
    initialConversationId: number | null;
    onClearInitialConversation: () => void;
    onSaveMeme?: (meme: { name: string, imageUrl: string }) => void;
}

const MessengerPage: React.FC<MessengerPageProps> = ({ conversations, onSendMessage, onCreateConversation, userCreations, allUsers, initialConversationId, onClearInitialConversation, onSaveMeme }) => {
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(initialConversationId ?? conversations[0]?.id ?? null);
    const [isNewConvoModalOpen, setIsNewConvoModalOpen] = useState(false);
    
    useEffect(() => {
        if (initialConversationId) {
            setSelectedConversationId(initialConversationId);
            onClearInitialConversation();
        }
    }, [initialConversationId, onClearInitialConversation]);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    const handleStartConversation = (participantId: number) => {
        const convoId = onCreateConversation(participantId);
        if (convoId) {
            setSelectedConversationId(convoId);
            setIsNewConvoModalOpen(false);
        }
    };

    return (
        <div className="flex h-full bg-black bg-gradient-to-tr from-black via-[#010619] to-blue-900/20 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 transition-all">
            {/* Sidebar Conversation List */}
            <aside className={`
                w-full md:w-1/3 lg:w-1/4 flex-shrink-0 bg-gray-900/70 border-r border-violet-500/30 
                flex flex-col
                ${selectedConversationId && 'hidden md:flex'}
            `}>
                <div className="p-4 border-b border-violet-500/30 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-cyan-400">Messenger</h1>
                    <button onClick={() => setIsNewConvoModalOpen(true)} className="p-2 rounded-full text-cyan-400 hover:bg-cyan-500/20 transition-colors" aria-label="New message">
                        <PencilSquareIcon />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {conversations.map(convo => (
                        <ConversationListItem 
                            key={convo.id}
                            conversation={convo}
                            isSelected={selectedConversationId === convo.id}
                            onClick={() => setSelectedConversationId(convo.id)}
                        />
                    ))}
                </div>
            </aside>
            
            {/* Main Chat View */}
            <main className={`w-full flex-grow flex flex-col ${!selectedConversationId && 'hidden md:flex'}`}>
                {selectedConversation ? (
                    <ChatView 
                        conversation={selectedConversation} 
                        onBack={() => setSelectedConversationId(null)}
                        onSendMessage={onSendMessage}
                        userCreations={userCreations}
                        onSaveMeme={onSaveMeme}
                    />
                ) : (
                    <div className="hidden md:flex flex-grow flex-col items-center justify-center text-gray-500 bg-gray-900/30 p-8 text-center">
                        <EmptyMessagesIcon />
                        <h2 className="text-2xl font-bold text-gray-300">Your Messages</h2>
                        <p className="mt-2 max-w-sm">Select a conversation from the sidebar to read messages, or start a new conversation with another user.</p>
                    </div>
                )}
            </main>
            {isNewConvoModalOpen && (
                <NewConversationModal
                    isOpen={isNewConvoModalOpen}
                    onClose={() => setIsNewConvoModalOpen(false)}
                    conversations={conversations}
                    onStartConversation={handleStartConversation}
                    allUsers={allUsers}
                />
            )}
        </div>
    );
};

export default MessengerPage;
