'use client';

import { ArrowBigUp, ArrowBigDown } from 'lucide-react';

export default function VoteBox({ votes, userVote, onVote, direction = 'col' }) {
const isRow = direction === 'row';

return (
    <div
    className={`flex items-center justify-center bg-[--bg-main] rounded-full border border-[--border-subtle] p-1 ${
        isRow ? 'flex-row' : 'flex-col'
    }`}
    >
    <button
        type="button"
        onClick={() => onVote('up')}
        className={`p-1.5 rounded-full transition-colors ${
        userVote === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-[--text-secondary] hover:text-[--text-primary]'
        }`}
        aria-label="Upvote"
    >
        <ArrowBigUp className="w-5 h-5" />
    </button>

    <span
        className={`text-xs font-bold px-2 ${
        userVote === 'up' ? 'text-emerald-500' : userVote === 'down' ? 'text-red-500' : 'text-[--text-primary]'
        }`}
    >
        {votes}
    </span>

    <button
        type="button"
        onClick={() => onVote('down')}
        className={`p-1.5 rounded-full transition-colors ${
        userVote === 'down' ? 'text-red-500 bg-red-500/10' : 'text-[--text-secondary] hover:text-[--text-primary]'
        }`}
        aria-label="Downvote"
    >
        <ArrowBigDown className="w-5 h-5" />
    </button>
    </div>
);
}