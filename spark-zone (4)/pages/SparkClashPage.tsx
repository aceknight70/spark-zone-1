
import React, { useState, useMemo, useEffect } from 'react';
import { User, SparkCardTemplate, SparkCard, Character, UserCreation, SparkDeck, SparkCardType } from '../types';
import { cardTemplates, allUsers } from '../mockData';
import UserAvatar from '../components/UserAvatar';

// --- Icons ---
const ArrowLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" /></svg>;
const SparkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400"><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.84 2.84l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.84 2.84l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.84-2.84l-2.846-.813a.75.75 0 010-1.442l2.846-.813a3.75 3.75 0 002.84-2.84l.813-2.846A.75.75 0 019 4.5zM18 9.75a.75.75 0 01.721.544l.63 2.199a2.25 2.25 0 001.705 1.705l2.199.63a.75.75 0 010 1.442l-2.199.63a2.25 2.25 0 00-1.705 1.705l-.63 2.199a.75.75 0 01-1.442 0l-.63-2.199a2.25 2.25 0 00-1.705-1.705l-2.199-.63a.75.75 0 010-1.442l2.199-.63a2.25 2.25 0 001.705-1.705l.63-2.199A.75.75 0 0118 9.75z" clipRule="evenodd" /></svg>;
const StackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 6.5a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" /><path fillRule="evenodd" d="M2 4.75A.75.75 0 014.75 2h10.5A2.75 2.75 0 0118 4.75v10.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25V4.75zM4.75 3.5c-.69 0-1.25.56-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V4.75c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" /></svg>;
const CollectionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M2 4.25A2.25 2.25 0 014.25 2h2.5A2.25 2.25 0 019 4.25v2.5A2.25 2.25 0 016.75 9h-2.5A2.25 2.25 0 012 6.75v-2.5zM2 13.25A2.25 2.25 0 014.25 11h2.5A2.25 2.25 0 019 13.25v2.5A2.25 2.25 0 016.75 18h-2.5A2.25 2.25 0 012 15.75v-2.5zM11 4.25A2.25 2.25 0 0113.25 2h2.5A2.25 2.25 0 0118 4.25v2.5A2.25 2.25 0 0115.75 9h-2.5A2.25 2.25 0 0111 6.75v-2.5zM15.25 11.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" /></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 1c3.866 0 7 1.79 7 4s-3.134 4-7 4-7-1.79-7-4 3.134-4 7-4zm5.694 8.13c.464-.264.91-.583 1.306-.952V10c0 2.21-3.134 4-7 4s-7-1.79-7-4V8.178c.396.37.842.688 1.306.953C5.838 10.006 7.854 10.5 10 10.5s4.162-.494 5.694-1.37z" clipRule="evenodd" /><path d="M5.5 4C6.328 4 7 4.672 7 5.5S6.328 7 5.5 7 4 6.328 4 5.5 4.672 4 5.5 4zM10 4c.828 0 1.5.672 1.5 1.5S10.828 7 10 7s-1.5-.672-1.5-1.5S9.172 4 10 4zM14.5 4c.828 0 1.5.672 1.5 1.5S15.328 7 14.5 7 13 6.328 13 5.5 13.672 4 14.5 4z" /></svg>;
const ClipboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 2c-2.21 0-4 1.79-4 4v2.25A2.25 2.25 0 008.25 10.5h3.5A2.25 2.25 0 0014 8.25V6c0-2.21-1.79-4-4-4zm-2.5 4a2.5 2.5 0 015 0v2.25a.75.75 0 01-.75.75h-3.5a.75.75 0 01-.75-.75V6z" clipRule="evenodd" /><path fillRule="evenodd" d="M10 13a5.5 5.5 0 00-5.5 5.5v.5h11v-.5A5.5 5.5 0 0010 13z" clipRule="evenodd" /></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M14 6a2.5 2.5 0 00-4-4.9V9h4a2.5 2.5 0 000-5zm-1.5 0a1 1 0 011 1 1 1 0 110-2 1 1 0 01-1 1zm-2.5 1.9V1.1a2.5 2.5 0 00-4 4.9 2.5 2.5 0 000 5h4zm-1.5-2a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /><path d="M2 11.5a1.5 1.5 0 011.5-1.5h13a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-5z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>;

interface SparkClashPageProps {
    onExit: () => void;
    currentUser: User;
    userCreations: UserCreation[];
    onUpdateUser: (updates: Partial<User>) => void;
}

type View = 'Hub' | 'Shop' | 'Forge' | 'Collection' | 'Decks' | 'Battle' | 'Leaderboard';

// --- Helper Functions ---
const getRankTitle = (power: number) => {
    if (power < 1000) return "Novice";
    if (power < 1500) return "Apprentice";
    if (power < 2000) return "Duelist";
    if (power < 2500) return "Gladiator";
    if (power < 3000) return "Warlord";
    return "Grandmaster";
};

// --- Sub-Components ---

const ManaDisplay: React.FC<{ current: number; max?: number }> = ({ current, max = 10 }) => (
    <div className="flex gap-0.5 md:gap-1">
        {[...Array(max)].map((_, i) => (
            <div 
                key={i} 
                className={`w-1.5 h-3 md:w-3 md:h-6 skew-x-[-12deg] rounded-sm transition-all duration-300 ${i < current ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-y-100' : 'bg-gray-800 border border-gray-700 scale-y-75'}`}
            ></div>
        ))}
    </div>
);

// Memoized TemplateCard
const TemplateCard: React.FC<{ template: SparkCardTemplate; onBuy: () => void; canAfford: boolean; ownedCount: number; showFeedback: boolean }> = React.memo(({ template, onBuy, canAfford, ownedCount, showFeedback }) => (
    <div className={`relative bg-gray-900/80 backdrop-blur-sm border-2 rounded-lg p-3 md:p-4 flex flex-col gap-2 transition-all transform active:scale-95 ${template.rarity === 'Ultimate' ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-gray-700 hover:border-cyan-500'}`}>
        <div className="flex justify-between items-start">
            <h3 className={`font-bold truncate text-sm md:text-base ${template.rarity === 'Ultimate' ? 'text-yellow-400' : 'text-white'}`}>{template.name}</h3>
            <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full border ${template.rarity === 'Ultimate' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400' : 'bg-gray-800 border-gray-600 text-gray-400'}`}>
                {template.rarity}
            </span>
        </div>
        <div className="text-xs text-gray-400 flex-grow min-h-[2.5em] line-clamp-2">{template.description}</div>
        <div className="mt-1 flex justify-between items-center text-xs md:text-sm bg-black/30 p-1.5 md:p-2 rounded-md">
            <span className="text-cyan-300 font-mono">⚡ {template.energyCost}</span>
            <div className="flex gap-2">
                {template.baseStats?.damage && <span className="text-red-400 font-bold">⚔️ {template.baseStats.damage}</span>}
                {template.baseStats?.shield && <span className="text-blue-400 font-bold">🛡️ {template.baseStats.shield}</span>}
                {template.baseStats?.manaRecovery && <span className="text-cyan-400 font-bold">💧 {template.baseStats.manaRecovery}</span>}
            </div>
        </div>
        {ownedCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold w-5 h-5 md:w-6 md:h-6 flex items-center justify-center rounded-full border-2 border-gray-900 shadow-lg z-10">
                {ownedCount}
            </div>
        )}
        <button 
            onClick={onBuy}
            disabled={!canAfford && !showFeedback}
            className={`mt-2 w-full py-2 rounded-md font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all 
                ${showFeedback ? 'bg-green-500 text-white scale-105' : canAfford ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
        >
            {showFeedback ? (
                <>
                    <CheckCircleIcon /> Acquired!
                </>
            ) : (
                <>
                    <SparkIcon /> {template.price}
                </>
            )}
        </button>
    </div>
));

const ForgeCardView: React.FC<{ template: SparkCardTemplate; oc?: Character; customName?: string }> = ({ template, oc, customName }) => (
    <div className={`w-full max-w-[16rem] aspect-[2/3] bg-gray-900 border-[3px] rounded-xl relative overflow-hidden shadow-2xl flex flex-col transition-all duration-500 group mx-auto
        ${template.rarity === 'Ultimate' ? 'border-yellow-500 shadow-yellow-500/20' : 'border-gray-600 hover:border-cyan-400'}`}>
        
        {/* Header */}
        <div className="bg-black/80 p-2 flex justify-between items-center z-10 backdrop-blur-sm absolute top-0 w-full border-b border-white/10">
            <span className={`font-bold text-xs md:text-sm truncate max-w-[80%] ${template.rarity === 'Ultimate' ? 'text-yellow-400' : 'text-gray-100'}`}>{customName || template.name}</span>
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-cyan-900 border border-cyan-500 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                <span className="text-cyan-300 font-black text-xs md:text-sm">{template.energyCost}</span>
            </div>
        </div>
        
        {/* Image Area (Full Art) */}
        <div className="absolute inset-0 bg-gray-800">
            {oc ? (
                <img src={oc.imageUrl} alt={oc.name} className="w-full h-full object-cover transition-transform duration-700" loading="lazy" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 to-gray-900">
                    <span className="font-mono text-xs uppercase tracking-widest">No Soul Bound</span>
                </div>
            )}
            {/* Rarity Effects */}
            {template.rarity === 'Ultimate' && (
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent pointer-events-none mix-blend-overlay animate-pulse"></div>
            )}
        </div>

        {/* Footer Stats Overlay */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-10 pb-3 px-3 z-10">
            <div className="flex flex-col gap-1">
                <p className="text-[9px] md:text-[10px] text-gray-400 font-medium text-center truncate uppercase tracking-widest">
                    {oc ? `${oc.name}` : 'UNKNOWN'} // {template.type}
                </p>
                <div className="flex justify-center gap-2 md:gap-3 text-xs md:text-sm font-bold mt-1 bg-white/5 py-1 rounded border border-white/5 backdrop-blur-sm">
                    {template.baseStats?.damage && <span className="text-red-400 drop-shadow-md">⚔️{template.baseStats.damage}</span>}
                    {template.baseStats?.shield && <span className="text-blue-400 drop-shadow-md">🛡️{template.baseStats.shield}</span>}
                    {template.baseStats?.manaRecovery && <span className="text-cyan-300 drop-shadow-md">💧+{template.baseStats.manaRecovery}</span>}
                </div>
            </div>
        </div>
    </div>
);

// Memoized MiniCard
const MiniCard: React.FC<{ card: SparkCard; template: SparkCardTemplate; oc?: Character; onClick?: () => void; inDeck?: boolean; disabled?: boolean }> = React.memo(({ card, template, oc, onClick, inDeck, disabled }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center gap-2 md:gap-3 p-2 rounded-lg border transition-all group relative overflow-hidden touch-manipulation
            ${disabled ? 'opacity-40 cursor-not-allowed bg-gray-900 border-gray-800' : 'cursor-pointer'}
            ${inDeck ? 'bg-cyan-900/20 border-cyan-500/50' : 'bg-gray-900 border-gray-700'} 
            ${template.rarity === 'Ultimate' ? 'border-yellow-500/50 shadow-[inset_0_0_10px_rgba(234,179,8,0.1)]' : ''}`}
    >
        <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-md bg-gray-800 flex-shrink-0 overflow-hidden border border-gray-600">
            {oc && <img src={oc.imageUrl} className="w-full h-full object-cover" loading="lazy" />}
            <div className="absolute bottom-0 right-0 bg-black/90 text-cyan-400 text-[9px] md:text-[10px] font-black px-1 border-tl rounded-tl-md border-gray-600">{template.energyCost}</div>
        </div>
        <div className="text-left min-w-0 flex-grow z-10">
            <p className={`text-xs md:text-sm font-bold truncate ${template.rarity === 'Ultimate' ? 'text-yellow-400' : 'text-gray-200'}`}>{card.customName || template.name}</p>
            <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-gray-500">
                <span className="truncate max-w-[80px]">{oc?.name}</span>
                {template.baseStats?.damage && <span className="text-red-900/80 bg-red-900/20 px-1 rounded">⚔️{template.baseStats.damage}</span>}
            </div>
        </div>
        {onClick && !disabled && (
            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${inDeck ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {inDeck ? '-' : '+'}
            </div>
        )}
    </button>
));

// Memoized BattleCard
const BattleCard: React.FC<{ card: SparkCard; template: SparkCardTemplate; oc?: Character; onClick: () => void; canPlay: boolean }> = React.memo(({ card, template, oc, onClick, canPlay }) => (
    <button
        onClick={onClick}
        disabled={!canPlay}
        className={`relative w-24 md:w-32 aspect-[2/3] rounded-lg transition-all duration-300 flex flex-col overflow-hidden shadow-2xl flex-shrink-0
            ${canPlay ? 'cursor-pointer hover:scale-105 hover:-translate-y-4 md:hover:-translate-y-8 z-10' : 'opacity-50 cursor-not-allowed grayscale-[0.8] brightness-75'}
            ${template.rarity === 'Ultimate' ? 'border-2 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'border border-gray-600'}`}
    >
        <div className="absolute inset-0 bg-gray-800">
             {oc && <img src={oc.imageUrl} className="w-full h-full object-cover" loading="lazy" />}
        </div>
        
        <div className={`absolute top-1 left-1 w-6 h-6 md:w-7 md:h-7 rounded-full border-2 flex items-center justify-center z-10 shadow-lg font-black text-xs md:text-sm ${canPlay ? 'bg-cyan-900 border-cyan-400 text-cyan-300' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
            {template.energyCost}
        </div>

        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-1 px-1 flex flex-col items-center z-10">
            <div className={`text-[9px] md:text-[10px] font-bold truncate max-w-full uppercase tracking-tight ${template.rarity === 'Ultimate' ? 'text-yellow-300 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]' : 'text-white drop-shadow-md'}`}>
                {card.customName || template.name}
            </div>
            <div className="flex justify-center gap-1 md:gap-2 text-[9px] md:text-[10px] font-bold mt-0.5">
                {template.baseStats?.damage && <span className="text-red-400">⚔️{template.baseStats.damage}</span>}
                {template.baseStats?.shield && <span className="text-blue-400">🛡️{template.baseStats.shield}</span>}
                {template.baseStats?.manaRecovery && <span className="text-cyan-300">💧{template.baseStats.manaRecovery}</span>}
            </div>
        </div>
    </button>
));

const ManaCurve: React.FC<{ cards: SparkCard[] }> = ({ cards }) => {
    const distribution = [0, 0, 0, 0, 0, 0]; // Costs 0, 1, 2, 3, 4, 5+
    cards.forEach(c => {
        const t = cardTemplates.find(temp => temp.id === c.templateId);
        if (t) {
            const cost = Math.min(t.energyCost, 5);
            distribution[cost]++;
        }
    });
    const max = Math.max(...distribution, 1);

    return (
        <div className="w-full bg-gray-900/50 rounded-xl p-2 md:p-4 border border-gray-700 shadow-inner">
            <div className="text-[9px] md:text-[10px] uppercase text-gray-500 font-bold mb-2 tracking-widest text-center">Energy Curve</div>
            <div className="flex items-end gap-1 md:gap-2 h-12 md:h-20 px-1 md:px-2">
                {distribution.map((count, cost) => (
                    <div key={cost} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                        <div 
                            className={`w-full rounded-t transition-all duration-500 ${count > 0 ? 'bg-gradient-to-t from-cyan-800 to-cyan-500' : 'bg-gray-800'}`} 
                            style={{ height: `${(count / max) * 100}%`, minHeight: count > 0 ? '3px' : '1px' }}
                        ></div>
                        <span className="text-[8px] md:text-[10px] text-gray-500 font-mono">{cost}{cost===5?'+':''}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CapacityBar: React.FC<{ count: number; max: number }> = ({ count, max }) => {
    const percentage = Math.min((count / max) * 100, 100);
    const color = count === max ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : count > max ? 'bg-red-500' : 'bg-yellow-500';
    
    return (
        <div className="w-full space-y-1 mb-2">
            <div className="flex justify-between text-[9px] md:text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                <span>Squad Size</span>
                <span className={count === max ? "text-green-400" : count > max ? "text-red-400" : "text-white"}>{count} / {max}</span>
            </div>
            <div className="h-1 md:h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-500 ease-out ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const BattleResultOverlay: React.FC<{ result: 'victory' | 'defeat', rewards: { sparks: number, bp: number }, onReturn: () => void }> = ({ result, rewards, onReturn }) => (
    <div className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center animate-fadeIn p-4">
        <div className="flex flex-col items-center text-center space-y-6 p-6 rounded-2xl border-2 border-white/10 bg-gradient-to-b from-gray-900 to-black shadow-2xl max-w-md w-full">
            <h1 className={`text-5xl md:text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_25px_rgba(0,0,0,0.8)] ${result === 'victory' ? 'text-yellow-400' : 'text-red-500'}`}>
                {result.toUpperCase()}
            </h1>
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
            
            <div className="flex gap-8 justify-center w-full">
                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Sparks</span>
                    <span className="text-2xl font-bold text-white">+{rewards.sparks}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Battle Power</span>
                    <span className={`text-2xl font-bold ${result === 'victory' ? 'text-green-400' : 'text-red-400'}`}>
                        {result === 'victory' ? '+' : ''}{rewards.bp}
                    </span>
                </div>
            </div>

            <button 
                onClick={onReturn}
                className="mt-4 px-8 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
                Return to Hub
            </button>
        </div>
    </div>
);

// --- Battle Component (Condensed for Mobile) ---

const SparkBattleView: React.FC<{ deck: SparkDeck; inventory: SparkCard[]; userCreations: UserCreation[]; onEndBattle: (win: boolean) => void }> = ({ deck, inventory, userCreations, onEndBattle }) => {
    // Stats
    const [playerHP, setPlayerHP] = useState(100);
    const [playerShield, setPlayerShield] = useState(0);
    const [playerEnergy, setPlayerEnergy] = useState(3);
    const [sparkGauge, setSparkGauge] = useState(0);
    
    const [enemyHP, setEnemyHP] = useState(100);
    const [enemyShield, setEnemyShield] = useState(0);
    const [enemyIntention, setEnemyIntention] = useState<{type: 'Attack' | 'Defend', amount: number}>({ type: 'Attack', amount: 10 });

    // Card State
    const [drawPile, setDrawPile] = useState<SparkCard[]>([]);
    const [hand, setHand] = useState<SparkCard[]>([]);
    const [discardPile, setDiscardPile] = useState<SparkCard[]>([]);
    
    const [turn, setTurn] = useState<'Player' | 'Enemy'>('Player');
    const [log, setLog] = useState<string[]>(["Battle Start!"]);
    const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);

    const getTemplate = (id: string) => cardTemplates.find(t => t.id === id);
    const addToLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 3)); // Reduced log history for mobile

    // Init
    useEffect(() => {
        const deckCards = deck.cardIds.map(id => inventory.find(c => c.id === id)).filter(Boolean) as SparkCard[];
        const shuffled = [...deckCards].sort(() => Math.random() - 0.5);
        setHand(shuffled.slice(0, 4));
        setDrawPile(shuffled.slice(4));
    }, []);

    // Turn Logic
    const handlePlayCard = (card: SparkCard, index: number) => {
        if(turn !== 'Player') return;
        const template = getTemplate(card.templateId);
        if(!template) return;
        if(playerEnergy < template.energyCost) return;

        setPlayerEnergy(prev => prev - template.energyCost);

        // Effects
        if(template.baseStats?.damage) {
            const dmg = template.baseStats.damage;
            let dmgToHP = dmg;
            if(enemyShield > 0) {
                const dmgToShield = Math.min(enemyShield, dmg);
                setEnemyShield(prev => prev - dmgToShield);
                dmgToHP -= dmgToShield;
            }
            setEnemyHP(prev => Math.max(0, prev - dmgToHP));
            addToLog(`Hit for ${dmg} dmg!`);
        }
        if(template.baseStats?.shield) {
            setPlayerShield(prev => prev + template.baseStats!.shield!);
            addToLog(`Shield +${template.baseStats!.shield}`);
        }
        if(template.baseStats?.manaRecovery) {
            setPlayerEnergy(prev => Math.min(10, prev + template.baseStats!.manaRecovery!));
            addToLog(`Energy +${template.baseStats!.manaRecovery}`);
        }

        // Spark Gauge
        setSparkGauge(prev => {
            const nextVal = Math.min(100, prev + 15);
            if (nextVal >= 100) {
                const ultTemplate = cardTemplates.find(t => t.rarity === 'Ultimate')!;
                const tempUltCard: SparkCard = {
                    id: `temp-ult-${Date.now()}`,
                    templateId: ultTemplate.id,
                    ownerId: 0,
                    characterId: card.characterId,
                    customName: "AWAKENING"
                };
                setHand(h => [...h, tempUltCard]);
                addToLog("ULTIMATE READY!");
                return 0;
            }
            return nextVal;
        });

        const newHand = [...hand];
        newHand.splice(index, 1);
        setHand(newHand);
        
        if (!card.id.startsWith('temp-ult')) {
            setDiscardPile(prev => [...prev, card]);
        }

        if(enemyHP <= (template.baseStats?.damage || 0)) {
            setTimeout(() => setBattleResult('victory'), 1000);
        }
    };

    const handleEndTurn = () => {
        setTurn('Enemy');
        setDiscardPile(prev => [...prev, ...hand.filter(c => !c.id.startsWith('temp-ult'))]);
        setHand([]);
    };

    useEffect(() => {
        if(turn === 'Enemy' && !battleResult) {
            setTimeout(() => {
                if(enemyIntention.type === 'Attack') {
                    const dmg = enemyIntention.amount;
                    let dmgToHP = dmg;
                    if(playerShield > 0) {
                        const dmgToShield = Math.min(playerShield, dmg);
                        setPlayerShield(prev => prev - dmgToShield);
                        dmgToHP -= dmgToShield;
                    }
                    setPlayerHP(prev => Math.max(0, prev - dmgToHP));
                    addToLog(`Took ${dmg} dmg`);
                } else {
                    setEnemyShield(prev => prev + enemyIntention.amount);
                    addToLog(`Enemy blocks (${enemyIntention.amount})`);
                }

                if(playerHP <= 0) {
                    setBattleResult('defeat');
                    return;
                }

                let newDeck = [...drawPile];
                let newDiscard = [...discardPile];
                let newHand = [];
                
                for(let i=0; i<5; i++) {
                    if(newDeck.length === 0) {
                        if(newDiscard.length === 0) break;
                        newDeck = [...newDiscard].sort(() => Math.random() - 0.5);
                        newDiscard = [];
                    }
                    newHand.push(newDeck.pop()!);
                }

                setDrawPile(newDeck);
                setDiscardPile(newDiscard);
                setHand(newHand);
                setPlayerShield(0); 
                setPlayerEnergy(3); 
                setTurn('Player');
                
                const isLowHP = enemyHP < 30;
                const isAttack = isLowHP ? Math.random() > 0.7 : Math.random() > 0.3;
                setEnemyIntention({ type: isAttack ? 'Attack' : 'Defend', amount: isAttack ? Math.floor(Math.random() * 10) + 8 : 15 });

            }, 1500);
        }
    }, [turn, playerHP, enemyHP, battleResult]);


    return (
        <div className="absolute inset-0 bg-gray-900 z-50 flex flex-col overflow-hidden text-xs md:text-base">
            {battleResult && (
                <BattleResultOverlay 
                    result={battleResult} 
                    rewards={{ sparks: battleResult === 'victory' ? 50 : 5, bp: battleResult === 'victory' ? 50 : -20 }}
                    onReturn={() => onEndBattle(battleResult === 'victory')}
                />
            )}

            {/* Enemy HUD */}
            <div className="flex justify-between items-center p-2 md:p-4 bg-black/80 backdrop-blur-md border-b border-red-900/30 z-20 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-red-900 to-gray-900 border border-red-500 flex items-center justify-center text-2xl">🤖</div>
                    <div className="flex flex-col">
                        <div className="w-32 md:w-64 h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                            <div className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 transition-all duration-500" style={{ width: `${enemyHP}%` }}></div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-red-300 font-bold">{enemyHP} HP</span>
                            {enemyShield > 0 && <span className="text-blue-400 font-bold">🛡️ {enemyShield}</span>}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-900/90 px-3 py-1 rounded border border-red-900/50 flex flex-col items-center min-w-[60px]">
                    <span className="text-lg">{enemyIntention.type === 'Attack' ? '⚔️' : '🛡️'}</span>
                    <span className="font-bold text-white">{enemyIntention.amount}</span>
                </div>
            </div>

            {/* Arena */}
            <div className="flex-grow relative flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200')] bg-cover bg-center">
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-[2px]"></div>
                
                {/* Combat Log */}
                <div className="absolute top-2 left-2 space-y-1 pointer-events-none z-10 opacity-80">
                    {log.map((l, i) => (
                        <div key={i} className="text-xs text-cyan-50 bg-black/70 border-l-2 border-cyan-500 px-2 py-1 rounded-r">
                            {l}
                        </div>
                    ))}
                </div>

                {/* Spark Gauge */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-gray-800 bg-gray-900 flex items-center justify-center relative overflow-hidden shadow-lg ring-1 ring-cyan-900">
                        <div className="absolute bottom-0 left-0 right-0 bg-cyan-500 transition-all duration-500 opacity-80" style={{ height: `${sparkGauge}%` }}></div>
                        <span className="relative font-black text-lg md:text-3xl text-white z-10">{sparkGauge}%</span>
                    </div>
                </div>
            </div>

            {/* Player HUD */}
            <div className="bg-gray-900/95 border-t border-cyan-900/30 flex flex-col z-20 pb-safe">
                <div className="flex justify-between items-center px-4 py-2 bg-black/40">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-cyan-500 font-bold uppercase">Energy</span>
                            <ManaDisplay current={playerEnergy} max={10} />
                        </div>
                        <div className="flex flex-col w-24 md:w-48">
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600 mb-1">
                                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${playerHP}%` }}></div>
                            </div>
                            <div className="flex gap-2 text-xs">
                                <span className="text-white font-bold">{playerHP} HP</span>
                                {playerShield > 0 && <span className="text-blue-300 font-bold">🛡️ {playerShield}</span>}
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={handleEndTurn}
                        disabled={turn !== 'Player'}
                        className={`px-4 py-2 rounded-md font-bold text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95
                            ${turn === 'Player' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                    >
                        {turn === 'Player' ? 'End Turn' : 'Wait...'}
                    </button>
                </div>

                {/* Hand Container */}
                <div className="flex items-end gap-2 px-4 pb-4 pt-2 overflow-x-auto scrollbar-hide min-h-[160px] md:justify-center">
                    {hand.map((card, i) => {
                        const t = getTemplate(card.templateId);
                        const oc = userCreations.find(c => c.id === card.characterId) as Character;
                        return (
                            <div key={card.id} className="flex-shrink-0">
                                <BattleCard 
                                    card={card}
                                    template={t!}
                                    oc={oc} 
                                    onClick={() => handlePlayCard(card, i)}
                                    canPlay={turn === 'Player' && playerEnergy >= (t?.energyCost || 0)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Main Page ---

const SparkClashPage: React.FC<SparkClashPageProps> = ({ onExit, currentUser, userCreations, onUpdateUser }) => {
    const [view, setView] = useState<View>('Hub');
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [selectedOcId, setSelectedOcId] = useState<number | null>(null);
    const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false);
    const [shopCategory, setShopCategory] = useState<SparkCardType | 'All'>('All');
    const [purchaseFeedbackId, setPurchaseFeedbackId] = useState<string | null>(null);
    
    // Deck Builder State
    const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
    const [deckNameEdit, setDeckNameEdit] = useState('');
    const [mobileDeckTab, setMobileDeckTab] = useState<'pool' | 'deck'>('deck'); // For Mobile Deck View

    const profile = currentUser.sparkClashProfile || {
        battlePower: 1000, sparks: 100, wins: 0, losses: 0,
        inventory: [], templates: [], decks: []
    };

    const userCharacters = userCreations.filter(c => c.type === 'Character' || c.type === 'AI Character') as Character[];
    
    const ownedTemplateCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        profile.templates.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
        return counts;
    }, [profile.templates]);

    const uniqueOwnedTemplates = cardTemplates.filter(t => (ownedTemplateCounts[t.id] || 0) > 0);

    // --- Actions ---
    const handleBuyTemplate = (template: SparkCardTemplate) => {
        if (profile.sparks >= template.price) {
            onUpdateUser({
                sparkClashProfile: { ...profile, sparks: profile.sparks - template.price, templates: [...profile.templates, template.id] }
            });
            setPurchaseFeedbackId(template.id);
            setTimeout(() => setPurchaseFeedbackId(null), 1500);
        }
    };

    const handleSoulbind = () => {
        if (!selectedTemplateId || !selectedOcId) return;
        const templateIndex = profile.templates.indexOf(selectedTemplateId);
        if (templateIndex === -1) return;

        const template = cardTemplates.find(t => t.id === selectedTemplateId);
        const newCard: SparkCard = {
            id: Date.now().toString(),
            templateId: selectedTemplateId,
            ownerId: currentUser.id,
            characterId: selectedOcId,
            customName: template?.name
        };

        const newTemplates = [...profile.templates];
        newTemplates.splice(templateIndex, 1);

        onUpdateUser({ sparkClashProfile: { ...profile, templates: newTemplates, inventory: [...profile.inventory, newCard] } });
        setSelectedTemplateId(null);
        setSelectedOcId(null);
        alert("Card Forged!");
    };
    
    const handleCreateDeck = () => {
        const newDeck: SparkDeck = { id: Date.now().toString(), name: `Deck ${profile.decks.length + 1}`, cardIds: [] };
        onUpdateUser({ sparkClashProfile: { ...profile, decks: [...profile.decks, newDeck] } });
        setActiveDeckId(newDeck.id);
        setDeckNameEdit(newDeck.name);
    };

    const handleDeleteDeck = (deckId: string) => {
        if(confirm("Delete deck?")) {
            onUpdateUser({ sparkClashProfile: { ...profile, decks: profile.decks.filter(d => d.id !== deckId) } });
            if(activeDeckId === deckId) setActiveDeckId(null);
        }
    };

    const handleAddCardToDeck = (card: SparkCard) => {
        if(!activeDeckId) return;
        const deck = profile.decks.find(d => d.id === activeDeckId);
        if(!deck || deck.cardIds.length >= 24) return;

        const template = cardTemplates.find(t => t.id === card.templateId);
        if(template?.rarity === 'Ultimate') {
            const hasUlt = deck.cardIds.some(id => {
                const existing = profile.inventory.find(c => c.id === id);
                const temp = cardTemplates.find(t => t.id === existing?.templateId);
                return temp?.rarity === 'Ultimate' && existing?.characterId === card.characterId;
            });
            if(hasUlt) { alert("One Ultimate per Character limit."); return; }
        }
        onUpdateUser({ sparkClashProfile: { ...profile, decks: profile.decks.map(d => d.id === activeDeckId ? {...d, cardIds: [...d.cardIds, card.id]} : d) } });
    };

    const handleRemoveCardFromDeck = (cardId: string) => {
        if(!activeDeckId) return;
        onUpdateUser({ sparkClashProfile: { ...profile, decks: profile.decks.map(d => d.id === activeDeckId ? {...d, cardIds: d.cardIds.filter(id => id !== cardId)} : d) } });
    };

    const handleStartBattle = () => {
        const validDeck = activeDeckId ? profile.decks.find(d => d.id === activeDeckId) : profile.decks.find(d => d.cardIds.length === 24);
        if (validDeck && validDeck.cardIds.length === 24) {
            setActiveDeckId(validDeck.id);
            setView('Battle');
        } else {
            alert("Select a valid 24-card deck.");
            setView('Decks');
        }
    };

    const handleEndBattle = (win: boolean) => {
        onUpdateUser({ 
            sparkClashProfile: { 
                ...profile, 
                battlePower: win ? profile.battlePower + 50 : Math.max(0, profile.battlePower - 20),
                sparks: win ? profile.sparks + 50 : profile.sparks + 5,
                wins: win ? profile.wins + 1 : profile.wins,
                losses: win ? profile.losses : profile.losses + 1
            } 
        });
        setView('Hub');
    };

    const navItems = ['Hub', 'Shop', 'Forge', 'Collection', 'Decks'];

    const renderView = () => {
        switch(view) {
            case 'Hub':
                return (
                    <div className="flex flex-col items-center justify-center h-full gap-8 animate-fadeIn relative p-4">
                        <div className="text-center relative z-10 mt-8">
                            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-md animate-float">
                                {profile.battlePower}
                            </h2>
                            <div className="text-xs font-bold bg-yellow-500 text-black px-2 py-0.5 rounded inline-block -mt-4 mb-2">BP</div>
                            <p className="text-xl text-white font-bold uppercase tracking-widest">{getRankTitle(profile.battlePower)}</p>
                        </div>
                        
                        <div className="flex flex-col w-full max-w-xs gap-4 z-10">
                             <button onClick={handleStartBattle} className="w-full py-4 bg-red-600 text-white font-black text-xl rounded-xl shadow-lg hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center gap-2">
                                <PlayIcon /> RANKED MATCH
                            </button>
                            {!dailyRewardClaimed && (
                                <button onClick={() => { onUpdateUser({ sparkClashProfile: { ...profile, sparks: profile.sparks + 100 }}); setDailyRewardClaimed(true); }} className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl font-bold text-black shadow-lg flex items-center justify-center gap-2">
                                    <GiftIcon /> Daily Supply (+100)
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full max-w-md px-2 z-10">
                            {[
                                { id: 'Shop', label: 'Shop', icon: <SparkIcon />, color: 'bg-indigo-600' },
                                { id: 'Forge', label: 'Forge', icon: '⚒️', color: 'bg-slate-700' },
                                { id: 'Decks', label: 'Decks', icon: <StackIcon />, color: 'bg-emerald-600' },
                                { id: 'Collection', label: 'Inventory', icon: <CollectionIcon />, color: 'bg-violet-600' },
                            ].map(item => (
                                <button 
                                    key={item.id} 
                                    onClick={() => setView(item.id as View)} 
                                    className={`relative overflow-hidden ${item.color} rounded-xl p-4 shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center min-h-[100px]`}
                                >
                                    <div className="text-2xl mb-1">{item.icon}</div>
                                    <span className="text-sm font-bold uppercase tracking-wide text-white/90">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'Shop':
                const filteredTemplates = cardTemplates.filter(t => shopCategory === 'All' || t.type === shopCategory);
                return (
                    <div className="p-4 pb-20 max-w-6xl mx-auto animate-fadeIn overflow-y-auto h-full">
                        <div className="sticky top-0 bg-[#050505]/95 z-10 pb-2 border-b border-gray-800 mb-4">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                <SparkIcon /> Card Shop
                            </h2>
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                {['All', 'Attack', 'Defense', 'Utility', 'Ultimate'].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setShopCategory(cat as any)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${shopCategory === cat ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {filteredTemplates.map(t => (
                                <TemplateCard 
                                    key={t.id} 
                                    template={t} 
                                    onBuy={() => handleBuyTemplate(t)} 
                                    canAfford={profile.sparks >= t.price} 
                                    ownedCount={ownedTemplateCounts[t.id] || 0} 
                                    showFeedback={purchaseFeedbackId === t.id}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'Collection':
                return (
                    <div className="p-4 pb-20 max-w-6xl mx-auto animate-fadeIn overflow-y-auto h-full">
                        <h2 className="text-2xl font-bold text-white mb-4 sticky top-0 bg-[#050505] z-10 py-2 border-b border-gray-800">My Cards</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {profile.inventory.map(card => {
                                const t = cardTemplates.find(temp => temp.id === card.templateId);
                                const oc = userCreations.find(c => c.id === card.characterId) as Character;
                                if(!t) return null;
                                return <div key={card.id} className="scale-90 origin-top-left"><ForgeCardView template={t} oc={oc} customName={card.customName} /></div>
                            })}
                        </div>
                        {profile.inventory.length === 0 && <p className="text-gray-500 text-center mt-10">No cards forged yet.</p>}
                    </div>
                );
            case 'Forge':
                return (
                    <div className="p-4 pb-20 max-w-4xl mx-auto h-full flex flex-col gap-4 animate-fadeIn overflow-y-auto">
                        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                            <h3 className="text-sm font-bold text-cyan-400 mb-2 uppercase">1. Template</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {uniqueOwnedTemplates.length > 0 ? uniqueOwnedTemplates.map(t => (
                                    <button key={t.id} onClick={() => setSelectedTemplateId(t.id)} className={`flex-shrink-0 p-3 rounded-lg border w-32 ${selectedTemplateId === t.id ? 'bg-cyan-900/40 border-cyan-400' : 'bg-gray-800 border-gray-700'}`}>
                                        <div className="font-bold text-white text-xs truncate">{t.name}</div>
                                        <div className="text-[10px] text-gray-400">x{ownedTemplateCounts[t.id]}</div>
                                    </button>
                                )) : <p className="text-sm text-gray-500 italic">Buy templates from the Shop.</p>}
                            </div>
                        </div>
                        
                        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
                            <h3 className="text-sm font-bold text-cyan-400 mb-2 uppercase">2. Character</h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {userCharacters.map(c => (
                                    <button key={c.id} onClick={() => setSelectedOcId(c.id)} className={`flex-shrink-0 p-2 rounded-lg border w-20 flex flex-col items-center gap-1 ${selectedOcId === c.id ? 'bg-cyan-900/40 border-cyan-400' : 'bg-gray-800 border-gray-700'}`}>
                                        <UserAvatar src={c.imageUrl} size="8" />
                                        <span className="text-[10px] text-white truncate w-full text-center">{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleSoulbind} 
                            disabled={!selectedTemplateId || !selectedOcId} 
                            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold text-white uppercase tracking-widest shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Forge Card
                        </button>

                        <div className="flex-grow flex items-center justify-center bg-black/20 rounded-xl border-2 border-dashed border-gray-800 p-4 min-h-[300px]">
                            {selectedTemplateId ? (
                                <ForgeCardView template={cardTemplates.find(t => t.id === selectedTemplateId)!} oc={userCharacters.find(c => c.id === selectedOcId)} />
                            ) : (
                                <span className="text-gray-600 font-mono text-xs uppercase">Preview</span>
                            )}
                        </div>
                    </div>
                );
            case 'Decks':
                const activeDeck = profile.decks.find(d => d.id === activeDeckId);
                const activeDeckSize = activeDeck?.cardIds.length || 0;
                const deckCards = activeDeck?.cardIds.map(id => profile.inventory.find(c => c.id === id)).filter(Boolean) as SparkCard[] || [];
                const availableCards = profile.inventory.filter(c => !activeDeck?.cardIds.includes(c.id));

                if (!activeDeck) {
                    return (
                        <div className="p-6 flex flex-col items-center justify-center h-full text-center gap-4">
                            <StackIcon />
                            <p className="text-gray-400">Select a deck from the list or create a new one.</p>
                            <div className="w-full max-w-md space-y-2">
                                {profile.decks.map(d => (
                                    <button key={d.id} onClick={() => setActiveDeckId(d.id)} className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 flex justify-between items-center">
                                        <span className="font-bold">{d.name}</span>
                                        <span className="text-xs text-gray-500">{d.cardIds.length}/24</span>
                                    </button>
                                ))}
                                <button onClick={handleCreateDeck} className="w-full p-3 border-2 border-dashed border-gray-700 text-gray-400 rounded-lg">+ Create New Deck</button>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Deck Header */}
                        <div className="p-3 bg-gray-900 border-b border-gray-800 flex flex-col gap-2 shrink-0">
                            <div className="flex justify-between items-center">
                                <button onClick={() => setActiveDeckId(null)} className="text-gray-400 text-xs"><ArrowLeftIcon/></button>
                                <input value={deckNameEdit} onChange={(e) => setDeckNameEdit(e.target.value)} className="bg-transparent text-center font-bold text-white focus:outline-none border-b border-transparent focus:border-cyan-500" />
                                <button onClick={() => handleDeleteDeck(activeDeck.id)} className="text-red-400"><TrashIcon/></button>
                            </div>
                            <div className="px-4"><CapacityBar count={activeDeckSize} max={24} /></div>
                            {/* Mobile Toggle Tabs */}
                            <div className="flex md:hidden bg-gray-800 rounded-lg p-1">
                                <button onClick={() => setMobileDeckTab('pool')} className={`flex-1 py-1 text-xs font-bold rounded-md ${mobileDeckTab === 'pool' ? 'bg-gray-700 text-white' : 'text-gray-400'}`}>Collection</button>
                                <button onClick={() => setMobileDeckTab('deck')} className={`flex-1 py-1 text-xs font-bold rounded-md ${mobileDeckTab === 'deck' ? 'bg-cyan-900 text-cyan-300' : 'text-gray-400'}`}>Active Deck</button>
                            </div>
                        </div>

                        <div className="flex-grow flex overflow-hidden">
                            {/* Left: Collection (Desktop: 50%, Mobile: 100% if tab active) */}
                            <div className={`md:w-1/2 flex-col border-r border-gray-800 bg-gray-900/30 ${mobileDeckTab === 'pool' ? 'flex w-full' : 'hidden md:flex'}`}>
                                <div className="p-2 text-xs font-bold text-gray-500 uppercase text-center bg-[#08080a]">Card Pool</div>
                                <div className="flex-grow overflow-y-auto p-2 space-y-2 pb-20">
                                    {availableCards.map(card => {
                                        const t = cardTemplates.find(temp => temp.id === card.templateId);
                                        const oc = userCreations.find(c => c.id === card.characterId) as Character;
                                        return <MiniCard key={card.id} card={card} template={t!} oc={oc} onClick={() => handleAddCardToDeck(card)} inDeck={false} disabled={activeDeckSize >= 24} />
                                    })}
                                </div>
                            </div>

                            {/* Right: Deck (Desktop: 50%, Mobile: 100% if tab active) */}
                            <div className={`md:w-1/2 flex-col bg-gradient-to-b from-cyan-900/5 to-transparent ${mobileDeckTab === 'deck' ? 'flex w-full' : 'hidden md:flex'}`}>
                                <div className="p-2 text-xs font-bold text-cyan-500 uppercase text-center bg-[#060d13]">Current Squad</div>
                                <div className="flex-grow overflow-y-auto p-2 space-y-2 pb-20">
                                    {deckCards.map(card => {
                                        const t = cardTemplates.find(temp => temp.id === card.templateId);
                                        const oc = userCreations.find(c => c.id === card.characterId) as Character;
                                        return <MiniCard key={card.id} card={card} template={t!} oc={oc} onClick={() => handleRemoveCardFromDeck(card.id)} inDeck={true} />
                                    })}
                                    {deckCards.length === 0 && <p className="text-center text-gray-600 text-sm mt-10">Deck is empty.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    if (view === 'Battle') {
        // Battle view handles its own layout
        const currentDeck = profile.decks.find(d => d.id === activeDeckId);
        if(currentDeck) return <SparkBattleView deck={currentDeck} inventory={profile.inventory} userCreations={userCreations} onEndBattle={handleEndBattle} />;
        return <div>Error</div>;
    }

    return (
        <div className="h-full w-full flex flex-col bg-[#050505] text-gray-100 font-sans overflow-hidden">
            {/* Compact Sticky Header */}
            <header className="h-14 flex-shrink-0 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={onExit} className="text-gray-400"><ArrowLeftIcon /></button>
                    <div className="font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 text-lg" onClick={() => setView('Hub')}>
                        SPARK CLASH
                    </div>
                </div>
                
                {/* Scrollable Nav Pills */}
                <div className="flex-grow mx-4 overflow-x-auto scrollbar-hide flex gap-2 items-center mask-linear-fade">
                    {navItems.map(v => (
                        <button 
                            key={v} 
                            onClick={() => setView(v as View)} 
                            className={`whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${view === v ? 'bg-cyan-600 text-white' : 'text-gray-500 bg-gray-800'}`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1 bg-gray-800 px-2 py-1 rounded-md border border-gray-700">
                    <SparkIcon />
                    <span className="text-xs font-bold text-yellow-400">{profile.sparks}</span>
                </div>
            </header>

            <main className="flex-grow relative overflow-hidden">
                {renderView()}
            </main>
        </div>
    );
};

export default SparkClashPage;
