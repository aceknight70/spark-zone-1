
import React, { useState, useEffect } from 'react';
import { World, WorldLocation, UserCreation, User } from '../types';
import GroupChatView from '../components/GroupChatView';
import WorldSidebar from '../components/WorldSidebar';
import WorldMapView from '../components/WorldMapView';
import WorldTimelineView from '../components/WorldTimelineView';

interface WorldPageProps {
    world: World;
    onExit: () => void;
    onSendGroupMessage: (worldId: number, locationId: number, text: string, character?: UserCreation, imageUrl?: string) => void;
    userCreations: UserCreation[];
    onStartConversation: (userId: number) => void;
    currentUser: User;
    onSaveMeme?: (meme: { name: string, imageUrl: string }) => void;
    onPlayMusic?: (url: string | null) => void;
    onJoinWorld?: (worldId: number) => void;
}

const WorldPage: React.FC<WorldPageProps> = ({ world, onExit, onSendGroupMessage, userCreations, onStartConversation, currentUser, onSaveMeme, onPlayMusic, onJoinWorld }) => {
    const initialLocationId = world.locations?.[0]?.channels?.[0]?.id ?? null;
    const [activeLocationId, setActiveLocationId] = useState<number | null>(initialLocationId);
    const [showMap, setShowMap] = useState(false);
    const [showTimeline, setShowTimeline] = useState(false);

    const isMember = world.members.some(m => m.id === currentUser.id);

    // This ensures that if the world prop changes (e.g., messages updated), we get the fresh location object.
    const activeLocation = activeLocationId != null
        ? world.locations.flatMap(cat => cat.channels).find(chan => chan.id === activeLocationId)
        : null;

    // For mobile view, determines if chat/map is open or sidebar.
    const [isContentVisible, setIsContentVisible] = useState(!!initialLocationId);

    const handleSelectLocation = (location: WorldLocation) => {
        setActiveLocationId(location.id);
        setShowMap(false);
        setShowTimeline(false);
        setIsContentVisible(true); // Switch to chat view on mobile
        
        // Play theme song if available
        if (onPlayMusic && location.themeSongUrl) {
            onPlayMusic(location.themeSongUrl);
        }
    };
    
    const handleShowAtlas = () => {
        setShowMap(true);
        setShowTimeline(false);
        setIsContentVisible(true);
    };

    const handleShowTimeline = () => {
        setShowTimeline(true);
        setShowMap(false);
        setIsContentVisible(true);
    };
    
    // When the world data changes, if the active location no longer exists (e.g., was deleted), reset it.
    useEffect(() => {
        if (activeLocationId !== null) {
            const locationExists = world.locations.some(cat => cat.channels.some(chan => chan.id === activeLocationId));
            if (!locationExists) {
                setActiveLocationId(null);
                setIsContentVisible(false);
            }
        }
    }, [world, activeLocationId]);
    
    // Initial Music Trigger on Load
    useEffect(() => {
        if (activeLocation && activeLocation.themeSongUrl && onPlayMusic) {
            onPlayMusic(activeLocation.themeSongUrl);
        }
    }, []); // Run once on mount if initial location exists


    return (
        <div className="relative flex h-full w-full bg-black bg-gradient-to-tr from-black via-[#010619] to-blue-900/20 text-gray-100 font-sans overflow-hidden pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 transition-all">
            {/* Mobile View Logic: Show either chat/map or sidebar */}
            <div className={`absolute inset-0 md:hidden transition-opacity duration-300 ${isContentVisible ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'} z-10 bg-black pb-16`}>
                <WorldSidebar
                    world={world}
                    activeLocationId={activeLocationId ?? -1}
                    onSelectLocation={handleSelectLocation}
                    onExit={onExit}
                    onStartConversation={onStartConversation}
                    currentUser={currentUser}
                    onShowAtlas={handleShowAtlas}
                    onShowTimeline={handleShowTimeline}
                    onJoinWorld={onJoinWorld}
                />
            </div>
            <div className={`absolute inset-0 md:hidden transition-transform duration-300 ease-in-out z-20 bg-black ${isContentVisible ? 'translate-x-0' : 'translate-x-full'}`}>
                {showMap ? (
                    <div className="h-full relative flex flex-col">
                        <div className="absolute top-4 left-4 z-50">
                            <button onClick={() => setIsContentVisible(false)} className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 shadow-lg">Back</button>
                        </div>
                        <WorldMapView world={world} onSelectLocation={handleSelectLocation} />
                    </div>
                ) : showTimeline ? (
                    <div className="h-full relative flex flex-col">
                        <div className="absolute top-4 left-4 z-50">
                            <button onClick={() => setIsContentVisible(false)} className="p-2 bg-black/60 backdrop-blur-md rounded-full text-white border border-white/10 shadow-lg">Back</button>
                        </div>
                        <WorldTimelineView world={world} />
                    </div>
                ) : activeLocation ? (
                        <GroupChatView 
                        key={activeLocation.id} 
                        location={activeLocation} 
                        world={world}
                        onBack={() => setIsContentVisible(false)}
                        onSendMessage={onSendGroupMessage}
                        userCreations={userCreations}
                        onSaveMeme={onSaveMeme}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <button onClick={() => setIsContentVisible(false)} className="text-cyan-400">Back to Menu</button>
                    </div>
                )}
            </div>

            {/* Desktop View Logic: Show both side-by-side */}
            <div className="hidden md:flex flex-1 min-w-0 h-full">
                <WorldSidebar
                    world={world}
                    activeLocationId={activeLocationId ?? -1}
                    onSelectLocation={handleSelectLocation}
                    onExit={onExit}
                    onStartConversation={onStartConversation}
                    currentUser={currentUser}
                    onShowAtlas={handleShowAtlas}
                    onShowTimeline={handleShowTimeline}
                    onJoinWorld={onJoinWorld}
                />
                <div className="flex-1 flex flex-col min-w-0 h-full relative bg-black/20">
                     {showMap ? (
                        <WorldMapView world={world} onSelectLocation={handleSelectLocation} />
                     ) : showTimeline ? (
                        <WorldTimelineView world={world} />
                     ) : activeLocation ? (
                        <GroupChatView 
                            key={activeLocation.id} 
                            location={activeLocation} 
                            world={world}
                            onSendMessage={onSendGroupMessage}
                            userCreations={userCreations}
                            onSaveMeme={onSaveMeme}
                        />
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-500 h-full">
                            <div className="text-center p-6 bg-black/40 rounded-xl border border-white/5">
                                <h3 className="text-xl font-bold text-gray-300 mb-2">Welcome to {world.name}</h3>
                                <p>Select a channel from the sidebar to start role-playing.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Join Button Overlay for Non-Members */}
            {!isMember && onJoinWorld && (
                <div className="absolute bottom-20 left-0 right-0 z-50 flex justify-center pointer-events-none md:bottom-8">
                    <button 
                        onClick={() => onJoinWorld(world.id)}
                        className="pointer-events-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transform hover:scale-105 transition-all flex items-center gap-2 animate-pulse"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" /></svg>
                        <span>Join {world.name}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default WorldPage;
