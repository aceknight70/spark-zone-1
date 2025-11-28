
import React from 'react';
import { Party } from '../types';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 00.41-1.412A9.995 9.995 0 0010 12c-2.31 0-4.438.784-6.131-2.095z" /></svg>;


const PartyCard: React.FC<{ party: Party; onSelect: () => void; onEdit: () => void; }> = ({ party, onSelect, onEdit }) => (
    <div className="bg-gray-900/50 border border-violet-500/30 rounded-lg overflow-hidden group transition-all hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col text-left">
        <button onClick={onSelect} className="aspect-video overflow-hidden block w-full relative">
            <img src={party.imageUrl} alt={party.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            {party.rpFormat && (
                <span className="absolute top-2 right-2 bg-indigo-500/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {party.rpFormat}
                </span>
            )}
        </button>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-white truncate">{party.name}</h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2 flex-grow">{party.description}</p>
            
            {party.genreTags && party.genreTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {party.genreTags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-800 text-cyan-300 text-xs font-medium px-2 py-0.5 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-3 border-t border-violet-500/20 flex items-center justify-between gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <UsersIcon />
                    <span>{party.members.length} members</span>
                </div>
                <button onClick={onEdit} className="text-xs font-semibold text-cyan-400 hover:underline">Edit</button>
            </div>
        </div>
    </div>
);


interface PartyPageProps {
    parties: Party[];
    onSelectParty: (partyId: number) => void;
    onCreateParty: () => void;
    onEditParty: (partyId: number) => void;
}

const PartyPage: React.FC<PartyPageProps> = ({ parties, onSelectParty, onCreateParty, onEditParty }) => {
    return (
        <div className="container mx-auto px-4 py-8 animate-fadeIn h-full overflow-y-auto pb-20 md:pb-4">
             <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-cyan-400">Party Hub</h1>
                 <button onClick={onCreateParty} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-white font-semibold rounded-full shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out">
                    <PlusIcon />
                    <span>Create Party</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parties.map(party => (
                    <PartyCard 
                        key={party.id} 
                        party={party} 
                        onSelect={() => onSelectParty(party.id)}
                        onEdit={() => onEditParty(party.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PartyPage;
