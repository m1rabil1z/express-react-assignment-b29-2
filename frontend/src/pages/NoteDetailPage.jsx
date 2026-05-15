import { ArrowLeftIcon, LoaderIcon, Trash2Icon, MessageSquareIcon } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../lib/axios';
import { getorcreateUser } from '../utils/auth';

const NoteDetailPage = () => {
  const [note,setNote] = useState(null);
  const [loading,setLoading] = useState(true);
  const [saving,setSaving] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const localUserAuid = getorcreateUser();

  const navigate = useNavigate()

  const {id} = useParams();


 const fetchComments = useCallback(async () => {
    try {
      const res = await api.get(`/notes/${id}/comments`);
      setComments(res.data.comments || []);
    } catch (error) {
      console.log("Error in fetching remarks", error);
    }
  }, [id]);

  useEffect(() => {
    const fetchNote = async() => {
      try{
        const res = await api.get(`/notes/${id}`)
        setNote(res.data)
      } catch(error){
        console.log("Error in fetching snippet")
        toast.error("Failed to fetch the snippet")

      } finally {
        setLoading(false)
      }
    }
    
    fetchComments();
    fetchNote();
  },[id, fetchComments]);

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this snippet?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Snippet Deleted");
      navigate("/")
    } catch(error){
      console.log("Error deleting the snippet", error)
      toast.error("Failed to delete snippet")
    }
  };

  const handleSave = async () => {
  if (!note.title.trim() || !note.content.trim()){
    toast.error("Please add a title or content");
    return;
  }

  setSaving(true)
  try {
    await api.put(`/notes/${id}`, {
      title: note.title,
      content: note.content
    })
    toast.success("Snippet updated successfully")
    navigate("/")
  } catch(error){
    console.log("Error updating the snippet", error)
    toast.error("Failed to update snippet")
  } finally {
    setSaving(false)
  }
};

const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      await api.post(`/notes/${id}/comments`, { 
        text: newComment.trim(), 
        authorID: localUserAuid 
      });
      toast.success("Remark posted anonymously!");
      setNewComment("");
      await fetchComments();
    } catch (error) {
      console.log("Error posting remark:", error);
      toast.error("Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };

const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete your anonymous remark?")) return;
    try {
      await api.delete(`/notes/comments/${commentId}`, { 
        data: { authorID: localUserAuid } 
      });
      toast.success("Remark removed");
      await fetchComments(); 
    } catch (error) {
      console.log("Error deleting remark:", error);
      toast.error("Failed to delete comment");
    }
  };

  if(loading){
    return (
      <div className='min-h-screen bg-base-200 flex items-center justify-center'>
        <LoaderIcon className='animate-spin size-10' />
      </div>
    )
  }



  return (
    <div className='min-h-screen bg-base-200'>
      <div className='container mx-auto px-4 py-8'>
        <div className="max-w-2xl mx-auto">
          <div className='flex items-center justify-between mb-6'>
            <Link to="/" className='btn btn-ghost'>
              <ArrowLeftIcon className='h-5 w-5' />
              Back to Snippets
            </Link>
            <button onClick={handleDelete} className='btn btn-error btn-outline'>
              <Trash2Icon className='h-5 w-5' />
              Delete Snippet
            </button>
          </div>

          <div className='card bg-base-100'>
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your snippet here..."
                  className="textarea textarea-bordered h-32"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              <div className="card-actions justify-end">
                <button className='btn btn-primary' disabled={saving} onClick={handleSave}>
                  {saving ? "Saving...":"Save Changes"}
                </button>
              </div>
            </div>
          </div>
          <div className='card bg-base-100 shadow-xl mt-6'>
            <div className='card-body'>
              <h3 className='card-title text-xl mb-4 flex items-center gap-2'>
                <MessageSquareIcon className='size-5 text-primary' />
                Remarks Wall ({comments.length})
              </h3>

              <form onSubmit={handleAddComment} className='flex gap-2 mb-6'>
                <input 
                  type='text' 
                  placeholder='Leave an anonymous roast or remark...' 
                  className='input input-bordered flex-1'
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  maxLength={300}
                />
                <button type='submit' className='btn btn-primary' disabled={commentLoading || !newComment.trim()}>
                  {commentLoading ? "Posting..." : "Post"}
                </button>
              </form>

              <div className='space-y-3 max-h-96 overflow-y-auto pr-1'>
                {comments.length === 0 ? (
                  <p className='text-center text-base-content/50 py-4 italic text-sm'>No remarks yet.</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className='p-3 bg-base-200 rounded-lg flex items-start justify-between gap-4 border border-base-300'>
                      <div className='flex flex-col gap-1'>
                        <p className='text-sm text-base-content whitespace-pre-wrap break-words'>{comment.text}</p>
                        <span className='text-[10px] text-base-content/40 font-mono'>
                          Anonymous Code: {comment.authorID?.slice(0, 8)}...
                        </span>
                      </div>
                      {comment.authorID === localUserAuid && (
                        <button type="button" onClick={() => handleDeleteComment(comment._id)} className='btn btn-ghost btn-xs text-error btn-square'>
                          <Trash2Icon className='size-3.5' />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
}

export default NoteDetailPage