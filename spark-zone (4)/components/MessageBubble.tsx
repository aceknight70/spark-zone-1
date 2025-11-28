
import React from 'react';
// FIX: Imported Message and User types from ../types as they are not exported from mockData.
import { currentUser } from '../mockData';
import { Message, User } from '../types';
import UserAvatar from './UserAvatar';

interface MessageBubbleProps {
    message: Message;
    participant: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, participant }) => {
    const isOwnMessage = message.senderId === currentUser.id;
    const isRP = !!message.character;
    
    const sender = isOwnMessage ? currentUser : participant;
    const avatarSrc = isRP ? message.character?.imageUrl : sender.avatarUrl;

    const bubbleClasses = isOwnMessage
        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl rounded-br-md'
        : 'bg-slate-800 rounded-2xl rounded-bl-md';

    // Function to check for YouTube links
    const getYoutubeEmbed = (text: string) => {
        const match = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]*)/);
        return match ? match[1] : null;
    };

    const videoId = getYoutubeEmbed(message.text);

    return (
       <div className={`flex items-start gap-3 w-full max-w-lg ${isOwnMessage ? 'self-end flex-row-reverse' : 'self-start'}`}>
            {!isOwnMessage && (
                <UserAvatar src={avatarSrc} size="10" className="flex-shrink-0" />
            )}
            <div className={`flex flex-col flex-grow ${isOwnMessage ? 'items-end' : 'items-start'} max-w-full`}>
                <div className={`p-3 text-white ${bubbleClasses} shadow-md overflow-hidden`}>
                    {isRP && (
                        <p className={`font-bold text-sm mb-1 ${isOwnMessage ? 'text-cyan-200' : 'text-cyan-400'}`}>
                            {message.character?.name}
                        </p>
                    )}
                    {message.imageUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-black/20 max-w-xs">
                            <img src={message.imageUrl} alt="Attachment" className="w-full h-auto block" />
                        </div>
                    )}
                    {message.audioUrl && (
                        <div className="mb-2">
                            <audio controls src={message.audioUrl} className="max-w-[200px] h-8" />
                        </div>
                    )}
                    <p className="whitespace-pre-wrap break-words text-sm md:text-base">{message.text}</p>
                    
                    {videoId && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-black/20 w-full aspect-video">
                            <iframe 
                                src={`https://www.youtube.com/embed/${videoId}`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    )}
                </div>
                <p className="text-xs text-gray-500 mt-1 px-2">{message.timestamp}</p>
            </div>
             {isOwnMessage && (
                <div className="w-10 flex-shrink-0"></div>
            )}
       </div>
    );
};

export default React.memo(MessageBubble);
