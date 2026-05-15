import React, { useEffect, useState } from 'react';
import { ArrowLeftIcon, FileCodeIcon, MessageSquareIcon, LoaderIcon } from 'lucide-react';
import { Link } from 'react-router';
import api from '../lib/axios';
import { getorcreateUser } from '../utils/auth';

const ProfilePage = () => {
  const [history, setHistory] = useState({ notes: [], comments: [] });
  const [loading, setLoading] = useState(true);
  const localUserAuid = getorcreateUser();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/notes/profile/${localUserAuid}`);
        setHistory(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [localUserAuid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="btn btn-ghost">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Snippets
          </Link>
          <div className="text-right font-mono">
            <h1 className="text-xl font-bold">Anonymous Profile Log</h1>
            <p className="text-xs text-base-content/50">ID: {localUserAuid.slice(0, 16)}...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="card bg-base-100 shadow-xl border border-primary/10">
            <div className="card-body">
              <h2 className="card-title text-lg font-mono uppercase tracking-wider mb-2 flex items-center gap-2 text-primary">
                <FileCodeIcon className="size-5" /> My Posted Snippets ({history.notes.length})
              </h2>
              <div className="divider my-0"></div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 mt-3">
                {history.notes.length === 0 ? (
                  <p className="text-sm italic text-base-content/50 text-center py-8">No code items posted yet.</p>
                ) : (
                  history.notes.map((note) => (
                    <Link key={note._id} to={`/note/${note._id}`} className="block p-4 bg-base-200 rounded-xl border border-transparent hover:border-primary/40 transition-all group">
                      <h3 className="text-sm font-bold font-mono group-hover:text-primary transition-colors truncate">{note.title}</h3>
                      <span className="text-[10px] text-base-content/40 font-mono block mt-2">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-secondary/10">
            <div className="card-body">
              <h2 className="card-title text-lg font-mono uppercase tracking-wider mb-2 flex items-center gap-2 text-secondary">
                <MessageSquareIcon className="size-5" /> My Left Remarks ({history.comments.length})
              </h2>
              <div className="divider my-0"></div>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 mt-3">
                {history.comments.length === 0 ? (
                  <p className="text-sm italic text-base-content/50 text-center py-8">No remarks left yet.</p>
                ) : (
                  history.comments.map((comment) => (
                    <Link key={comment._id} to={`/note/${comment.noteId}`} className="flex flex-col justify-between p-4 bg-base-200 rounded-xl border border-transparent hover:border-secondary/40 transition-all">
                      <p className="text-xs text-base-content font-mono line-clamp-3 italic">"{comment.text}"</p>
                      <span className="text-[9px] text-base-content/40 font-mono block mt-3 text-right">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
