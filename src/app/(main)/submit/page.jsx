// src/app/(main)/submit/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X } from 'lucide-react';
import CreatePostForm from '@/components/post/CreatePostForm';
import { useAuth } from '@/hooks/useAuth';
import { postService } from '@/services/postService';
import { orbitService } from '@/services/orbitService';

export default function CreatePostPage() {
const router = useRouter();
const { user } = useAuth();

const [orbits, setOrbits] = useState([]);

useEffect(() => {
    orbitService.getAllOrbits().then(setOrbits).catch((error) => console.error('Failed to load orbits:', error));
}, []);

const handleClose = () => {
    // Navigates back to the previous page like Twitter's modal/page escape
    router.back();
};

const handleSuccess = async (postData) => {
    // Redirect to home feed after successfully posting
    await postService.createPost({
    ...postData,
    orbitName: postData.orbitId,
    author: user,
    });
    router.push('/');
};

return (
    <div className="flex-1 max-w-2xl mx-auto w-full min-h-[calc(100vh-4rem)] p-4 md:p-6 flex flex-col gap-4">
    {/* Page Header */}
    <div className="flex items-center justify-between pb-3 border-b border-[--border-subtle]">
        <div className="flex items-center gap-3">
        <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-full text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface] transition-colors"
            title="Go back"
        >
            <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-[--text-primary]">Create Post</h1>
        </div>

        <button
        type="button"
        onClick={handleClose}
        className="p-1.5 rounded-lg text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--bg-surface] transition-colors"
        >
        <X className="w-5 h-5" />
        </button>
    </div>

    {/* Main Form Area */}
    <div className="bg-[--bg-surface] border border-[--border-subtle] rounded-2xl p-4 sm:p-6 shadow-sm">
        <CreatePostForm onSubmit={handleSuccess} orbits={orbits} />
    </div>
    </div>
);
}