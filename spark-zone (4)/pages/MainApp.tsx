
import React, { useState, useEffect } from 'react';
import { Page, World, Character, Story, Party, Conversation, Post, UserCreation, User, Notification, Message, Comment, Community, ShopItem } from '../types';
import NavBar from '../components/NavBar';
import HomePage from './HomePage';
import ExplorePage from './ExplorePage';
import WorkshopPage from './WorkshopPage';
import PartyPage from './PartyPage';
import MessengerPage from './MessengerPage';
import ProfilePage from './ProfilePage';
import SparkClashPage from './SparkClashPage';

// Viewers
import WorldPage from './WorldPage';
import CharacterPage from './CharacterPage';
import StoryReaderPage from './StoryReaderPage';
import PartyViewPage from './PartyViewPage';
import CommunityPage from './CommunityPage';

// Editors / Creators
import WorldCreationPage from './WorldCreationPage';
import CharacterCreationPage from './CharacterCreationPage';
import StoryCreationPage from './StoryCreationPage';
import MemeCreationPage from './MemeCreationPage';
import WorldWorkshop from './WorldWorkshop';
import StoryWorkshopPage from './StoryWorkshopPage';
import PartyWorkshopPage from './PartyWorkshopPage';
import ProfileEditorPage from './ProfileEditorPage';
import CommunityCreationPage from './CommunityCreationPage';
import CommunityWorkshopPage from './CommunityWorkshopPage';

import SonicJukebox from '../components/SonicJukebox';
import CommentModal from '../components/CommentModal';
import ShopView from '../components/ShopView';

import { 
    currentUser as initialUser, 
    initialUserCreations, 
    posts as initialPosts, 
    conversations as initialConversations,
    allUsers as initialAllUsers,
    worlds as initialWorlds,
    stories as initialStories,
    parties as initialParties,
    characters as initialCharacters,
    comments as initialComments,
    communities as initialCommunities,
    mockNotifications
} from '../mockData';

type OverlayState = 
    | { type: 'world'; id: number }
    | { type: 'story-read'; id: number }
    | { type: 'story-edit'; id: number }
    | { type: 'party-view'; id: number }
    | { type: 'party-edit'; id: number }
    | { type: 'character-view'; id: number }
    | { type: 'character-edit'; id: number }
    | { type: 'world-edit'; id: number }
    | { type: 'world-create' }
    | { type: 'character-create' }
    | { type: 'story-create' }
    | { type: 'party-create' }
    | { type: 'meme-create' }
    | { type: 'profile-edit' }
    | { type: 'spark-clash' }
    | { type: 'comments'; postId: number }
    | { type: 'community'; id: number }
    | { type: 'community-create' }
    | { type: 'community-edit'; id: number }
    | { type: 'shop' };

const MainApp: React.FC = () => {
    const [activePage, setActivePage] = useState<Page>(Page.Home);
    const [overlay, setOverlay] = useState<OverlayState | null>(null);
    
    // Data State
    const [currentUser, setCurrentUser] = useState<User>(initialUser);
    const [users, setUsers] = useState<User[]>(initialAllUsers);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [allComments, setAllComments] = useState<Comment[]>(initialComments);
    const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
    const [userCreations, setUserCreations] = useState<UserCreation[]>(initialUserCreations);
    const [worlds, setWorlds] = useState<World[]>(initialWorlds);
    const [stories, setStories] = useState<Story[]>(initialStories);
    const [parties, setParties] = useState<Party[]>(initialParties);
    const [characters, setCharacters] = useState<Character[]>(initialCharacters);
    const [communities, setCommunities] = useState<Community[]>(initialCommunities);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

    // Global Music State
    const [bgMusic, setBgMusic] = useState<string | null>(null);

    // --- Actions ---

    const handleCreatePost = (content: string, character?: UserCreation, media?: { type: 'image' | 'video', url: string }) => {
        const newPost: Post = {
            id: Date.now(),
            author: currentUser,
            character,
            timestamp: 'Just now',
            content,
            media,
            sparks: 0,
            sparkedBy: [],
            comments: 0
        };
        setPosts([newPost, ...posts]);
    };

    const handleSparkPost = (postId: number) => {
        setPosts(posts.map(p => {
            if (p.id === postId) {
                const isSparked = p.sparkedBy.includes(currentUser.id);
                return {
                    ...p,
                    sparks: isSparked ? p.sparks - 1 : p.sparks + 1,
                    sparkedBy: isSparked ? p.sparkedBy.filter(id => id !== currentUser.id) : [...p.sparkedBy, currentUser.id]
                };
            }
            return p;
        }));
    };

    const handleCommentPost = (postId: number) => {
        setOverlay({ type: 'comments', postId });
    };

    const handleAddComment = (postId: number, content: string, character?: UserCreation) => {
        const newComment: Comment = {
            id: Date.now(),
            postId,
            author: currentUser,
            character,
            content,
            timestamp: 'Just now',
            sparks: 0,
            sparkedBy: []
        };
        setAllComments([...allComments, newComment]);
        setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    };

    const handleSparkComment = (commentId: number) => {
        setAllComments(allComments.map(c => {
            if (c.id === commentId) {
                const isSparked = c.sparkedBy.includes(currentUser.id);
                return {
                    ...c,
                    sparks: isSparked ? c.sparks - 1 : c.sparks + 1,
                    sparkedBy: isSparked ? c.sparkedBy.filter(id => id !== currentUser.id) : [...c.sparkedBy, currentUser.id]
                };
            }
            return c;
        }));
    };

    const handleStartConversation = (userId: number) => {
        const existing = conversations.find(c => c.participant.id === userId);
        if (existing) {
            setOverlay(null); 
            setActivePage(Page.Messenger);
            // In a real app, we'd pass the conversation ID to select it. 
            // For now, MessengerPage will default or we can add a prop to MessengerPage later.
            // Using a hacky way to force selection via props if needed, but for now simple navigation.
        } else {
            const user = users.find(u => u.id === userId);
            if (user) {
                const newConvo: Conversation = {
                    id: Date.now(),
                    participant: user,
                    messages: [],
                    unreadCount: 0
                };
                setConversations([newConvo, ...conversations]);
                setActivePage(Page.Messenger);
            }
        }
    };

    const handleSendMessage = (conversationId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string) => {
        setConversations(conversations.map(c => {
            if (c.id === conversationId) {
                const newMessage: Message = {
                    id: Date.now(),
                    text,
                    senderId: currentUser.id,
                    timestamp: 'Just now',
                    character,
                    imageUrl,
                    audioUrl
                };
                return { ...c, messages: [...c.messages, newMessage] };
            }
            return c;
        }));
    };

    const handleSendGroupMessage = (worldId: number, locationId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string) => {
        setWorlds(prev => prev.map(w => {
            if (w.id === worldId) {
                // Find location and update its channel messages
                const newLocations = w.locations.map(cat => ({
                    ...cat,
                    channels: cat.channels.map(chan => {
                        if (chan.id === locationId) {
                            return {
                                ...chan,
                                messages: [...chan.messages, {
                                    id: Date.now(),
                                    text,
                                    timestamp: 'Just now',
                                    sender: { ...currentUser, role: 'Member' },
                                    character,
                                    imageUrl,
                                    audioUrl
                                }]
                            };
                        }
                        return chan;
                    })
                }));
                return { ...w, locations: newLocations };
            }
            return w;
        }));
    };

    const handleSendPartyMessage = (partyId: number, text: string, character?: UserCreation, imageUrl?: string, audioUrl?: string) => {
        setParties(prev => prev.map(p => {
            if (p.id === partyId) {
                // Check for dice roll command
                let roll = undefined;
                const rollMatch = text.match(/^\/roll (\d+)d(\d+)(\+(\d+))?/);
                if (rollMatch) {
                    const count = parseInt(rollMatch[1]);
                    const sides = parseInt(rollMatch[2]);
                    const mod = rollMatch[4] ? parseInt(rollMatch[4]) : 0;
                    const rolls = Array.from({length: count}, () => Math.floor(Math.random() * sides) + 1);
                    const total = rolls.reduce((a, b) => a + b, 0) + mod;
                    roll = { command: rollMatch[0], rolls, modifier: mod, total };
                }

                return {
                    ...p,
                    chat: [...p.chat, {
                        id: Date.now(),
                        text,
                        timestamp: 'Just now',
                        sender: { ...currentUser, isHost: p.hostId === currentUser.id },
                        character,
                        roll,
                        imageUrl,
                        audioUrl
                    }]
                };
            }
            return p;
        }));
    };

    const handleMarkNotificationRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleUpdateProfile = (updates: Partial<User>) => {
        setCurrentUser(prev => ({ ...prev, ...updates }));
    };

    const handleOverlay = (newState: OverlayState | null) => {
        setOverlay(newState);
    };

    // --- Creation Handlers ---

    const handleSaveWorld = (worldData: World) => {
        if (overlay?.type === 'world-create') {
            const newWorld = { ...worldData, id: Date.now(), authorId: currentUser.id };
            setWorlds([...worlds, newWorld]);
            setUserCreations([...userCreations, newWorld]);
            handleOverlay({ type: 'world', id: newWorld.id });
        } else if (overlay?.type === 'world-edit') {
            setWorlds(worlds.map(w => w.id === worldData.id ? worldData : w));
            setUserCreations(userCreations.map(c => c.id === worldData.id ? worldData : c));
            handleOverlay({ type: 'world', id: worldData.id });
        }
    };

    const handleSaveCharacter = (charData: Character) => {
        if (overlay?.type === 'character-create') {
            const newChar = { ...charData, id: Date.now(), authorId: currentUser.id };
            setCharacters([...characters, newChar]);
            setUserCreations([...userCreations, newChar]);
            handleOverlay({ type: 'character-view', id: newChar.id });
        } else if (overlay?.type === 'character-edit') {
            setCharacters(characters.map(c => c.id === charData.id ? charData : c));
            setUserCreations(userCreations.map(c => c.id === charData.id ? charData : c));
            handleOverlay({ type: 'character-view', id: charData.id });
        }
    };

    const handleSaveStory = (storyData: Story) => {
        if (overlay?.type === 'story-create') {
            const newStory = { ...storyData, id: Date.now(), authorId: currentUser.id, chapters: [] };
            setStories([...stories, newStory]);
            setUserCreations([...userCreations, newStory]);
            handleOverlay({ type: 'story-edit', id: newStory.id });
        } else if (overlay?.type === 'story-edit') {
            setStories(stories.map(s => s.id === storyData.id ? storyData : s));
            setUserCreations(userCreations.map(c => c.id === storyData.id ? storyData : c));
            // Stay in edit mode or go to reader? Let's stay in edit or close.
            // For now, let's just update state.
        }
    };

    const handleSaveParty = (partyData: Party) => {
        if (overlay?.type === 'party-create') {
            const newParty = { ...partyData, id: Date.now(), authorId: currentUser.id, hostId: currentUser.id };
            setParties([...parties, newParty]);
            setUserCreations([...userCreations, newParty]);
            handleOverlay({ type: 'party-view', id: newParty.id });
        } else if (overlay?.type === 'party-edit') {
            setParties(parties.map(p => p.id === partyData.id ? partyData : p));
            setUserCreations(userCreations.map(c => c.id === partyData.id ? partyData : c));
            handleOverlay({ type: 'party-view', id: partyData.id });
        }
    };

    const handleSaveMeme = (memeData: { name: string, imageUrl: string }) => {
        const newMeme: UserCreation = {
            id: Date.now(),
            type: 'Meme',
            name: memeData.name,
            imageUrl: memeData.imageUrl,
            status: 'Published',
            authorId: currentUser.id
        };
        setUserCreations([...userCreations, newMeme]);
        handleOverlay(null); // Close meme creator
    };

    const handleSaveCommunity = (communityData: Community) => {
        if (overlay?.type === 'community-create') {
            const newCommunity = { 
                ...communityData, 
                id: Date.now(), 
                authorId: currentUser.id, 
                leaderId: currentUser.id,
                members: [{ userId: currentUser.id, role: 'Leader', joinedAt: new Date().toISOString().split('T')[0] }],
                level: 1, 
                xp: 0, 
                showcase: [], 
                feed: [] 
            } as Community;
            
            setCommunities([...communities, newCommunity]);
            setUserCreations([...userCreations, newCommunity]);
            
            // Add to user's community list
            setCurrentUser(prev => ({
                ...prev,
                communityIds: [...(prev.communityIds || []), newCommunity.id]
            }));
            
            handleOverlay({ type: 'community', id: newCommunity.id });
        } else if (overlay?.type === 'community-edit') {
            setCommunities(communities.map(c => c.id === communityData.id ? communityData : c));
            setUserCreations(userCreations.map(c => c.id === communityData.id ? communityData : c));
            handleOverlay({ type: 'community', id: communityData.id });
        }
    };

    const handleJoinCommunity = (communityId: number) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                return {
                    ...c,
                    members: [...c.members, { userId: currentUser.id, role: 'Member', joinedAt: new Date().toISOString().split('T')[0] }]
                };
            }
            return c;
        }));
        setCurrentUser(prev => ({
            ...prev,
            communityIds: [...(prev.communityIds || []), communityId]
        }));
    };

    const handleLeaveCommunity = (communityId: number) => {
        setCommunities(prev => prev.map(c => {
            if (c.id === communityId) {
                return {
                    ...c,
                    members: c.members.filter(m => m.userId !== currentUser.id)
                };
            }
            return c;
        }));
        setCurrentUser(prev => ({
            ...prev,
            communityIds: (prev.communityIds || []).filter(id => id !== communityId)
        }));
    };

    const handleJoinWorld = (worldId: number) => {
        setWorlds(prev => prev.map(w => {
            if (w.id === worldId) {
                // Check if already member
                if (w.members.some(m => m.id === currentUser.id)) return w;
                return {
                    ...w,
                    members: [...w.members, { ...currentUser, role: 'Member' }]
                };
            }
            return w;
        }));
    };

    const handlePurchase = (item: ShopItem) => {
        // Mock purchase logic
        if (item.type === 'bundle') {
            const amount = item.currencyAmount || 0;
            setCurrentUser(prev => ({
                ...prev,
                sparkClashProfile: {
                    ...prev.sparkClashProfile!,
                    sparks: (prev.sparkClashProfile?.sparks || 0) + amount
                }
            }));
            alert(`Purchase successful! +${amount} Sparks`);
        } else if (item.type === 'subscription') {
            setCurrentUser(prev => ({ ...prev, isPremium: true }));
            alert("Upgrade successful! You are now Premium.");
        } else if (item.type === 'cosmetic' || item.type === 'tool') {
            if ((currentUser.sparkClashProfile?.sparks || 0) >= item.price) {
                setCurrentUser(prev => ({
                    ...prev,
                    sparkClashProfile: {
                        ...prev.sparkClashProfile!,
                        sparks: (prev.sparkClashProfile?.sparks || 0) - item.price
                    }
                }));
                alert(`Purchased ${item.name}!`);
            } else {
                alert("Not enough Sparks!");
            }
        }
        handleOverlay(null);
    };

    // --- Audio Control ---
    const handlePlayMusic = (url: string | null) => {
        setBgMusic(url);
    };

    // --- Render Logic ---

    const renderOverlay = () => {
        if (!overlay) return null;

        switch (overlay.type) {
            case 'world':
                const world = worlds.find(w => w.id === overlay.id);
                if (!world) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <WorldPage
                            world={world}
                            onExit={() => setOverlay(null)}
                            onSendGroupMessage={handleSendGroupMessage}
                            userCreations={userCreations.filter(c => c.authorId === currentUser.id)}
                            onStartConversation={handleStartConversation}
                            currentUser={currentUser}
                            onSaveMeme={handleSaveMeme}
                            onPlayMusic={handlePlayMusic}
                            onJoinWorld={handleJoinWorld}
                        />
                    </div>
                );
            case 'world-create':
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <WorldCreationPage onExit={() => setOverlay(null)} onCreate={handleSaveWorld} />
                    </div>
                );
            case 'world-edit':
                const worldToEdit = worlds.find(w => w.id === overlay.id);
                if (!worldToEdit) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <WorldWorkshop world={worldToEdit} onExit={() => setOverlay(null)} onSave={handleSaveWorld} />
                    </div>
                );
            case 'character-view':
                const char = characters.find(c => c.id === overlay.id);
                if (!char) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <CharacterPage 
                            character={char} 
                            onExit={() => setOverlay(null)} 
                            onViewCharacter={(id) => setOverlay({ type: 'character-view', id })}
                            onEdit={() => handleOverlay({ type: 'character-edit', id: char.id })}
                            onStartConversation={handleStartConversation}
                            currentUser={currentUser}
                        />
                    </div>
                );
            case 'character-create':
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <CharacterCreationPage onExit={() => setOverlay(null)} onSave={handleSaveCharacter} />
                    </div>
                );
            case 'character-edit':
                const charToEdit = characters.find(c => c.id === overlay.id);
                if (!charToEdit) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <CharacterCreationPage characterToEdit={charToEdit} onExit={() => setOverlay(null)} onSave={handleSaveCharacter} />
                    </div>
                );
            case 'story-read':
                const story = stories.find(s => s.id === overlay.id);
                if (!story) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <StoryReaderPage 
                            story={story} 
                            onExit={() => setOverlay(null)}
                            onViewCharacter={(id) => handleOverlay({ type: 'character-view', id })}
                            onStartConversation={handleStartConversation}
                            currentUser={currentUser}
                        />
                    </div>
                );
            case 'story-create':
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <StoryCreationPage onExit={() => setOverlay(null)} onCreate={handleSaveStory} />
                    </div>
                );
            case 'story-edit':
                const storyToEdit = stories.find(s => s.id === overlay.id);
                if (!storyToEdit) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <StoryWorkshopPage story={storyToEdit} onExit={() => setOverlay(null)} onSave={handleSaveStory} />
                    </div>
                );
            case 'party-view':
                const party = parties.find(p => p.id === overlay.id);
                if (!party) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <PartyViewPage 
                            party={party} 
                            onExit={() => setOverlay(null)} 
                            onSendMessage={handleSendPartyMessage}
                            userCreations={userCreations.filter(c => c.authorId === currentUser.id)}
                            onStartConversation={handleStartConversation}
                            currentUser={currentUser}
                            onSaveMeme={handleSaveMeme}
                        />
                    </div>
                );
            case 'party-create':
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <PartyWorkshopPage onExit={() => setOverlay(null)} onSave={handleSaveParty} />
                    </div>
                );
            case 'party-edit':
                const partyToEdit = parties.find(p => p.id === overlay.id);
                if (!partyToEdit) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <PartyWorkshopPage party={partyToEdit} onExit={() => setOverlay(null)} onSave={handleSaveParty} />
                    </div>
                );
            case 'meme-create':
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <MemeCreationPage onExit={() => setOverlay(null)} onSave={handleSaveMeme} />
                    </div>
                );
            case 'profile-edit':
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <ProfileEditorPage currentUser={currentUser} onSave={(data) => { handleUpdateProfile(data); setOverlay(null); }} onExit={() => setOverlay(null)} />
                    </div>
                );
            case 'spark-clash':
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <SparkClashPage 
                            onExit={() => setOverlay(null)} 
                            currentUser={currentUser} 
                            userCreations={userCreations.filter(c => c.authorId === currentUser.id)}
                            onUpdateUser={handleUpdateProfile}
                        />
                    </div>
                );
            case 'comments':
                const post = posts.find(p => p.id === overlay.postId);
                if (!post) return null;
                const postComments = allComments.filter(c => c.postId === overlay.postId);
                return (
                    <CommentModal 
                        post={post}
                        comments={postComments}
                        currentUser={currentUser}
                        userCreations={userCreations.filter(c => c.authorId === currentUser.id)}
                        allUsers={users}
                        onClose={() => setOverlay(null)}
                        onCreateComment={handleAddComment}
                        onSparkComment={handleSparkComment}
                    />
                );
            case 'community':
                const community = communities.find(c => c.id === overlay.id);
                if (!community) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <CommunityPage 
                            community={community} 
                            onExit={() => setOverlay(null)}
                            currentUser={currentUser}
                            onJoin={() => handleJoinCommunity(community.id)}
                            onLeave={() => handleLeaveCommunity(community.id)}
                            onSparkPost={handleSparkPost}
                            onCommentPost={handleCommentPost}
                            allUsers={users}
                        />
                    </div>
                );
            case 'community-create':
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <CommunityCreationPage onExit={() => setOverlay(null)} onCreate={handleSaveCommunity} />
                    </div>
                );
            case 'community-edit':
                const commToEdit = communities.find(c => c.id === overlay.id);
                if (!commToEdit) return null;
                return (
                    <div className="fixed inset-0 z-50 bg-black animate-fadeIn">
                        <CommunityWorkshopPage community={commToEdit} onExit={() => setOverlay(null)} onSave={handleSaveCommunity} allUsers={users} />
                    </div>
                );
            case 'shop':
                return (
                    <ShopView onClose={() => setOverlay(null)} onPurchase={handlePurchase} currentUser={currentUser} />
                );
            default:
                return null;
        }
    };

    const renderActivePage = () => {
        switch (activePage) {
            case Page.Home:
                return (
                    <HomePage 
                        posts={posts} 
                        onCreatePost={handleCreatePost} 
                        onSparkPost={handleSparkPost}
                        onCommentPost={handleCommentPost}
                        userCreations={userCreations.filter(c => c.authorId === currentUser.id)}
                        currentUser={currentUser}
                        onStartConversation={handleStartConversation}
                    />
                );
            case Page.Explore:
                return (
                    <ExplorePage 
                        onSelectWorld={(id) => handleOverlay({ type: 'world', id })}
                        onViewStory={(id) => handleOverlay({ type: 'story-read', id })}
                        onSelectParty={(id) => handleOverlay({ type: 'party-view', id })}
                        onSelectCommunity={(id) => handleOverlay({ type: 'community', id })}
                        onStartConversation={handleStartConversation}
                        currentUser={currentUser}
                        communities={communities}
                        worlds={worlds}
                        stories={stories}
                        parties={parties}
                        characters={characters}
                    />
                );
            case Page.Workshop:
                return (
                    <WorkshopPage 
                        userCreations={userCreations.filter(c => c.authorId === currentUser.id)}
                        onEditWorld={(id) => handleOverlay({ type: 'world-edit', id })}
                        onCreateCharacter={() => handleOverlay({ type: 'character-create' })}
                        onEditCharacter={(id) => handleOverlay({ type: 'character-edit', id })}
                        onViewCharacter={(id) => handleOverlay({ type: 'character-view', id })}
                        onCreateWorld={() => handleOverlay({ type: 'world-create' })}
                        onCreateStory={() => handleOverlay({ type: 'story-create' })}
                        onEditStory={(id) => handleOverlay({ type: 'story-edit', id })}
                        onViewStory={(id) => handleOverlay({ type: 'story-read', id })}
                        onCreateParty={() => handleOverlay({ type: 'party-create' })}
                        onEditParty={(id) => handleOverlay({ type: 'party-edit', id })}
                        onCreateMeme={() => handleOverlay({ type: 'meme-create' })}
                        onCreateCommunity={() => handleOverlay({ type: 'community-create' })}
                        onEditCommunity={(id) => handleOverlay({ type: 'community-edit', id })}
                    />
                );
            case Page.Messenger:
                return (
                    <MessengerPage 
                        conversations={conversations} 
                        onSendMessage={handleSendMessage}
                        onCreateConversation={(pid) => {
                            const id = Date.now();
                            const user = users.find(u => u.id === pid);
                            if(user) {
                                setConversations([{ id, participant: user, messages: [] }, ...conversations]);
                                return id;
                            }
                            return 0;
                        }}
                        userCreations={userCreations.filter(c => c.authorId === currentUser.id)}
                        allUsers={users}
                        initialConversationId={null}
                        onClearInitialConversation={() => {}}
                        onSaveMeme={handleSaveMeme}
                    />
                );
            case Page.Profile:
                return (
                    <ProfilePage 
                        currentUser={currentUser}
                        userCreations={userCreations.filter(c => c.authorId === currentUser.id)}
                        allCommunities={communities}
                        onSelectCommunity={(id) => handleOverlay({ type: 'community', id })}
                        onUpdateProfile={handleUpdateProfile}
                        onEditProfile={() => handleOverlay({ type: 'profile-edit' })}
                        onEnterSparkClash={() => handleOverlay({ type: 'spark-clash' })}
                        onOpenShop={() => handleOverlay({ type: 'shop' })}
                        allUsers={users}
                    />
                );
            case Page.Party:
                return (
                    <PartyPage 
                        parties={parties} 
                        onSelectParty={(id) => handleOverlay({ type: 'party-view', id })}
                        onCreateParty={() => handleOverlay({ type: 'party-create' })}
                        onEditParty={(id) => handleOverlay({ type: 'party-edit', id })}
                    />
                );
            default:
                return <div>Page Not Found</div>;
        }
    };

    return (
        <div className="flex flex-col h-full bg-black text-gray-100 font-sans relative">
            {/* Background elements */}
            <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-20"></div>
            
            <div className="flex-grow overflow-hidden z-10">
                {renderActivePage()}
            </div>

            <NavBar 
                activePage={activePage} 
                setActivePage={setActivePage} 
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationRead}
                allUsers={users}
            />

            {/* Global Overlays */}
            {renderOverlay()}

            {/* Persistent Audio Player */}
            <SonicJukebox musicUrl={bgMusic} onClear={() => setBgMusic(null)} />
        </div>
    );
};

export default MainApp;
