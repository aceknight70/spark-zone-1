
import React from 'react';
// FIX: Imported GroupMessage type from ../types as it is not exported from mockData.
import { currentUser } from '../mockData';
import { GroupMessage } from '../types';
import UserAvatar from './UserAvatar';

interface GroupMessageBubbleProps {
    message: GroupMessage;
}

const GroupMessageBubble: React.FC<GroupMessageBubbleProps> = ({ message }) => {
    const isOwnMessage = message.sender.id === currentUser.id;
    const isRP = !!message.character;
    
    const avatarSrc = isRP ? message.character?.imageUrl : message.sender.avatarUrl;
    const senderName = isRP ? message.character?.name : message.sender.name;

    const getYoutubeEmbed = (text: string) => {
        const match = text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n<]+)(?:[^ \n<]*)/);
        return match ? match[1] : null;
    };

    const videoId = getYoutubeEmbed(message.text);

    return (
       <div className={`group flex items-start gap-3 max-w-full ${isOwnMessage ? 'flex-row-reverse' : ''} hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2`}>
           <div className="flex-shrink-0 mt-1">
                <UserAvatar src={avatarSrc} size="10" className="ring-2 ring-transparent group-hover:ring-white/20 transition-all" />
           </div>
           <div className={`flex-grow min-w-0 flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={`text-sm font-bold ${isOwnMessage ? 'text-cyan-400' : 'text-white'} ${isRP ? 'italic' : ''}`}>
                        {senderName}
                    </span>
                    <span className="text-[10px] text-gray-500">{message.timestamp}</span>
                </div>
                
                <div className={`relative text-sm md:text-base text-gray-200 whitespace-pre-wrap break-words leading-relaxed max-w-3xl ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                    {message.text}
                </div>

                {message.imageUrl && (
                    <div className="mt-2 mb-1 rounded-lg overflow-hidden border border-white/10 max-w-sm shadow-md">
                        <img src={message.imageUrl} alt="Attachment" className="w-full h-auto block" loading="lazy" />
                    </div>
                )}
                
                {message.audioUrl && (
                    <div className="mt-2 mb-1">
                        <audio controls src={message.audioUrl} className="h-8 max-w-xs opacity-80 hover:opacity-100 transition-opacity" />
                    </div>
                )}
                
                {videoId && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10 w-full max-w-md aspect-video bg-black shadow-md">
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
       </div>
    );
};

export default GroupMessageBubble;
