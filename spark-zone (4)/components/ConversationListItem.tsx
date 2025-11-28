

import React from 'react';
// FIX: Imported Conversation type from ../types as it is not exported from mockData.
import { Conversation } from '../types';
import UserAvatar from './UserAvatar';

interface ConversationListItemProps {
    conversation: Conversation;
    isSelected: boolean;
    onClick: () => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({ conversation, isSelected, onClick }) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    const hasUnread = conversation.unreadCount && conversation.unreadCount > 0;

    return (
        <button 
            onClick={onClick}
            className={`relative w-full flex items-center gap-4 p-4 text-left transition-colors duration-200 border-l-4 ${isSelected ? 'border-cyan-400 bg-gray-800/80' : 'border-transparent hover:bg-gray-800/60'}`}
        >
            <UserAvatar src={conversation.participant.avatarUrl} size="12" />
            <div className="flex-grow overflow-hidden">
                <div className="flex justify-between items-baseline">
                    <p className={`font-bold text-white truncate ${hasUnread ? 'font-extrabold' : ''}`}>{conversation.participant.name}</p>
                    <p className="text-xs text-gray-500 flex-shrink-0">{lastMessage?.timestamp}</p>
                </div>
                <div className="flex justify-between items-center mt-1">
                    <p className={`text-sm truncate ${hasUnread ? 'text-gray-200' : 'text-gray-400'}`}>
                        {lastMessage ? (lastMessage.character ? `${lastMessage.character.name}: ` : '') + lastMessage.text : 'No messages yet'}
                    </p>
                    {hasUnread && (
                        <span className="flex-shrink-0 ml-2 bg-cyan-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {conversation.unreadCount}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ConversationListItem;