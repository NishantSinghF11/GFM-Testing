"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AiSuggestions from './components/AiSuggestions';
import WriterIntelligence from './components/WriterIntelligence';

function BlogCommunityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState<'edit' | 'preview' | 'manage'>('edit');
  const [myPosts, setMyPosts] = useState<any[]>([]);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Intelligence');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [externalImageUrl, setExternalImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  // Poll Creator State
  const [pollEnabled, setPollEnabled] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState([{ id: 'opt-1', text: '' }, { id: 'opt-2', text: '' }]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?next=/blog/community');
      } else {
        setUser(user);
        fetchMyPosts(user.id);
        if (editId) fetchPostToEdit(editId);
      }
      setLoading(false);
    };
    checkUser();
  }, [router, supabase, editId]);

  const fetchPostToEdit = async (id: string) => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (data) {
      setEditingId(data.id);
      setTitle(data.title);
      setCategory(data.category);
      setExcerpt(data.excerpt);
      setContent(data.content);
      setCoverImage(data.cover_image);
      setTags(data.tags || []);
      
      const { data: pollData } = await supabase
        .from('blog_polls')
        .select('*')
        .eq('blog_id', data.id)
        .single();
      
      if (pollData) {
        setPollEnabled(true);
        setPollQuestion(pollData.question);
        setPollOptions(pollData.options);
      } else {
        setPollEnabled(false);
        setPollQuestion('');
        setPollOptions([{ id: 'opt-1', text: '' }, { id: 'opt-2', text: '' }]);
      }
      setView('edit');
    }
  };

  const fetchMyPosts = async (userId: string) => {
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .eq('author_id', userId)
      .order('created_at', { ascending: false });
    if (data) setMyPosts(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage.from('blog-images').upload(filePath, file);
    if (uploadError) {
      alert(`Upload Error: ${uploadError.message}`);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(filePath);
      setCoverImage(publicUrl);
      setExternalImageUrl('');
    }
    setUploading(false);
  };

  const applyFormatting = (prefix: string, suffix: string = '') => {
    if (!contentRef.current) return;
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);
    setContent(before + prefix + selectedText + suffix + after);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const finalCoverImage = coverImage || externalImageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1600';
    const blogData = {
      author_id: user.id,
      title,
      category,
      excerpt,
      content,
      cover_image: finalCoverImage,
      tags,
      published: true
    };

    let error;
    let blogId = editingId;
    if (editingId) {
      const { error: updateError } = await supabase.from('blogs').update(blogData).eq('id', editingId);
      error = updateError;
    } else {
      const { data: insertData, error: insertError } = await supabase.from('blogs').insert(blogData).select().single();
      error = insertError;
      if (insertData) blogId = insertData.id;
    }

    if (error) {
      alert(`Error: ${error.message}`);
      setSubmitting(false);
      return;
    }

    if (pollEnabled && pollQuestion && blogId) {
      const { data: existingPoll } = await supabase.from('blog_polls').select('id').eq('blog_id', blogId).single();
      const pollData = { blog_id: blogId, question: pollQuestion, options: pollOptions };
      if (existingPoll) {
        await supabase.from('blog_polls').update(pollData).eq('id', existingPoll.id);
      } else {
        await supabase.from('blog_polls').insert(pollData);
      }
    } else if (!pollEnabled && blogId) {
      await supabase.from('blog_polls').delete().eq('blog_id', blogId);
    }

    alert(editingId ? 'Insight updated!' : 'Insight published!');
    resetForm();
    fetchMyPosts(user.id);
    setView('manage');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Intelligence');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setExternalImageUrl('');
    setTags([]);
    setPollEnabled(false);
    setPollQuestion('');
    setPollOptions([{ id: 'opt-1', text: '' }, { id: 'opt-2', text: '' }]);
  };

  const startEdit = async (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setCategory(post.category);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCoverImage(post.cover_image);
    setExternalImageUrl('');
    setTags(post.tags || []);
    const { data: pollData } = await supabase.from('blog_polls').select('*').eq('blog_id', post.id).single();
    if (pollData) {
      setPollEnabled(true);
      setPollQuestion(pollData.question);
      setPollOptions(pollData.options);
    } else {
      setPollEnabled(false);
      setPollQuestion('');
      setPollOptions([{ id: 'opt-1', text: '' }, { id: 'opt-2', text: '' }]);
    }
    setView('edit');
  };

  const deletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this insight? This cannot be undone.')) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) {
      alert(`Delete Error: ${error.message}`);
    } else {
      setMyPosts(myPosts.filter(p => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#05070B', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: '#6366f1' }}></i>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Insights', item: '/blog' },
    { name: 'Community Post', item: '/blog/community' }
  ];

  return (
    <div style={{ background: '#05070B', minHeight: '100vh', color: 'white', padding: '140px 20px 80px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Breadcrumbs items={breadcrumbItems} />
        
        <header style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', marginBottom: '10px' }}>
              {view === 'manage' ? 'Manage' : editingId ? 'Edit' : 'Share'} your <span className="text-gradient">Insight</span>
            </h1>
            <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>Contribute to the collective intelligence of the creative economy.</p>
          </div>
          <div className="glass-card" style={{ padding: '5px', borderRadius: '12px', display: 'flex', gap: '5px', background: 'rgba(255,255,255,0.02)' }}>
            <button onClick={() => setView('edit')} className={`btn ${view === 'edit' ? 'btn-primary' : ''}`} style={{ padding: '8px 20px', fontSize: '0.8rem', background: view === 'edit' ? '' : 'transparent', color: view === 'edit' ? 'white' : '#6B7280', border: 'none' }}>
              {editingId ? 'Edit Mode' : 'Write'}
            </button>
            <button onClick={() => setView('preview')} className={`btn ${view === 'preview' ? 'btn-primary' : ''}`} style={{ padding: '8px 20px', fontSize: '0.8rem', background: view === 'preview' ? '' : 'transparent', color: view === 'preview' ? 'white' : '#6B7280', border: 'none' }}>
              Preview
            </button>
            <button onClick={() => setView('manage')} className={`btn ${view === 'manage' ? 'btn-primary' : ''}`} style={{ padding: '8px 20px', fontSize: '0.8rem', background: view === 'manage' ? '' : 'transparent', color: view === 'manage' ? 'white' : '#6B7280', border: 'none' }}>
              My Insights ({myPosts.length})
            </button>
          </div>
        </header>

        {view === 'edit' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
            <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '40px', borderRadius: '30px', border: '1px solid #4B5563', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
              <div className="form-group" style={{ position: 'relative' }}>
                <label style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Article Title</label>
                <input type="text" className="form-control" placeholder="e.g. 5 Strategies for Scaling 3D Production" value={title} onChange={(e) => setTitle(e.target.value)} required />
                {content && <span style={{ position: 'absolute', right: '15px', bottom: '-25px', fontSize: '0.75rem', color: '#6B7280' }}>Est. Reading Time: {calculateReadingTime(content)} min</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Category</label>
                  <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option>Intelligence</option>
                    <option>Protocol</option>
                    <option>Technology</option>
                    <option>Creative Ops</option>
                    <option>Future of Work</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Cover Image</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" className="form-control" placeholder={coverImage ? "Image Uploaded Successfully" : "Paste external image URL..."} value={externalImageUrl} onChange={(e) => { setExternalImageUrl(e.target.value); setCoverImage(''); }} disabled={!!coverImage} style={{ color: coverImage ? '#34d399' : 'inherit' }} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-secondary" style={{ whiteSpace: 'nowrap', padding: '0 20px', border: '1px solid #4B5563' }}>
                      {uploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-upload"></i>}
                    </button>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Short Excerpt</label>
                <textarea className="form-control" rows={2} placeholder="A brief summary for the feed..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
              </div>

              <div className="form-group">
                <label style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tags (Press Enter to add)</label>
                <input type="text" className="form-control" placeholder="AI, Workflow, Scale..." value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} onKeyDown={addTag} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {tags.map(tag => (
                    <span key={tag} style={{ background: 'rgba(99,102,241,0.1)', color: '#A5B4FC', padding: '6px 14px', border: '1px solid #6366f1', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                      {tag} <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeTag(tag)}></i>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Content (Markdown Supported)</label>
                <div style={{ background: 'rgba(10, 13, 20, 0.5)', border: '1px solid #4B5563', borderRadius: '16px', padding: '12px', display: 'flex', gap: '15px', marginBottom: '15px' }}>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }} onClick={() => applyFormatting('**', '**')} title="Bold"><i className="fa-solid fa-bold"></i></button>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }} onClick={() => applyFormatting('*', '*')} title="Italic"><i className="fa-solid fa-italic"></i></button>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }} onClick={() => applyFormatting('\n## ')} title="Heading"><i className="fa-solid fa-heading"></i></button>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8 }} onClick={() => applyFormatting('\n- ')} title="List"><i className="fa-solid fa-list"></i></button>
                </div>
                <textarea ref={contentRef} className="form-control" rows={15} placeholder="Write your insightful article here..." value={content} onChange={(e) => setContent(e.target.value)} required style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', background: '#0A0A0F', color: '#F3F4F6', border: '1px solid #4B5563', padding: '25px', borderRadius: '20px' }} />
              </div>

              {/* Strategic Poll Section - Optional Toggle */}
              <div style={{ marginTop: '60px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button type="button" onClick={() => setPollEnabled(!pollEnabled)} style={{ width: '50px', height: '26px', borderRadius: '20px', background: pollEnabled ? '#6366f1' : '#1F2937', position: 'relative', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                  <div style={{ position: 'absolute', top: '3px', left: pollEnabled ? '26px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: 'all 0.3s ease' }} />
                </button>
                <span style={{ fontWeight: 800, color: pollEnabled ? '#A5B4FC' : '#6B7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Enable Strategic Poll {pollEnabled ? '(Active)' : '(Optional)'}</span>
              </div>

              {pollEnabled && (
                <div className="glass-card" style={{ padding: '40px', borderRadius: '30px', border: '1px solid #4B5563', background: '#0A0A0F' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Create <span className="text-gradient">Strategic Poll</span></h2>
                  </div>
                  <div className="form-group">
                    <label style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '15px', display: 'block' }}>Poll Question</label>
                    <input type="text" className="form-control" placeholder="e.g. Which workflow engine do you prefer?" value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #374151', padding: '18px' }} />
                  </div>
                  <div style={{ marginTop: '35px' }}>
                    <label style={{ fontWeight: 800, color: '#818cf8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '15px', display: 'block' }}>Options</label>
                    <div style={{ display: 'grid', gap: '15px', marginTop: '10px' }}>
                      {pollOptions.map((opt, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px' }}>
                          <input type="text" className="form-control" placeholder={`Option ${idx + 1}`} value={opt.text} onChange={(e) => { const newOpts = [...pollOptions]; newOpts[idx].text = e.target.value; setPollOptions(newOpts); }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #374151', padding: '15px' }} />
                          {pollOptions.length > 2 && <button type="button" onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '12px', padding: '0 15px', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>}
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => setPollOptions([...pollOptions, { id: `opt-${Date.now()}`, text: '' }])} className="btn" style={{ marginTop: '20px', fontSize: '0.75rem', padding: '10px 25px', borderRadius: '12px', border: '1.5px solid #6366f1', background: 'transparent', color: 'white', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}><i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Add Option</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px', gap: '20px' }}>
                {editingId && <button type="button" onClick={resetForm} className="btn" style={{ flex: 1, padding: '18px', borderRadius: '15px', border: '1.5px solid #6366f1', background: 'transparent', color: 'white', fontWeight: 800, textTransform: 'uppercase' }}>Cancel</button>}
                <button 
                  type="submit" 
                  className="btn animate-shimmer" 
                  style={{ 
                    flex: 2, 
                    padding: '18px', 
                    fontSize: '1rem', 
                    borderRadius: '15px', 
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
                    color: 'white', 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px',
                    boxShadow: '0 10px 40px rgba(99,102,241,0.4)',
                    border: 'none'
                  }} 
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : editingId ? 'UPDATE' : 'PUBLISH'}
                </button>
              </div>
            </form>

            <AiSuggestions content={content} title={title} onApplyExcerpt={setExcerpt} onApplyTags={setTags} onApplyTitle={setTitle} />
          </div>
        ) : view === 'preview' ? (
          <div className="glass-card" style={{ padding: '60px', borderRadius: '40px', background: '#05070B' }}>
            {(coverImage || externalImageUrl) && <img src={coverImage || externalImageUrl} alt="Cover" style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '30px', marginBottom: '40px' }} />}
            <span style={{ color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '15px', display: 'block' }}>{category}</span>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '30px' }}>{title || 'Untitled Article'}</h1>
            <div className="blog-content" style={{ color: '#D1D5DB', fontSize: '1.2rem', lineHeight: 1.8 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || 'No content yet...'}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div>
            <WriterIntelligence posts={myPosts} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              {myPosts.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                  <h3>You haven't shared any insights yet.</h3>
                  <button onClick={() => setView('edit')} className="btn btn-primary" style={{ marginTop: '20px' }}>Write Your First Post</button>
                </div>
              ) : (
                myPosts.map(post => (
                  <div key={post.id} className="glass-card" style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #4B5563' }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <img src={post.cover_image} style={{ width: '120px', height: '70px', borderRadius: '15px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>{post.title}</h4>
                        <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '5px', display: 'flex', gap: '15px' }}>
                          <span><i className="fa-solid fa-folder"></i> {post.category}</span>
                          <span><i className="fa-solid fa-calendar"></i> {new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={() => startEdit(post)} className="btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '12px', border: '1px solid #4B5563' }} title="Edit"><i className="fa-solid fa-pen-to-square"></i></button>
                      <button onClick={() => deletePost(post.id)} className="btn" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '10px 15px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }} title="Delete"><i className="fa-solid fa-trash"></i></button>
                      <Link href={`/blog/${post.slug}`} className="btn" style={{ background: '#6366f1', color: 'white', padding: '10px 15px', borderRadius: '12px', boxShadow: '0 0 15px rgba(99,102,241,0.3)' }} title="View Live"><i className="fa-solid fa-arrow-up-right-from-square"></i></Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlogCommunityPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#05070B', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <i className="fa-solid fa-circle-notch fa-spin fa-3x" style={{ color: '#6366f1' }}></i>
      </div>
    }>
      <BlogCommunityContent />
    </Suspense>
  );
}
