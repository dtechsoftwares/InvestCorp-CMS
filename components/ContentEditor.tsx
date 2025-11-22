import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Save, Eye, Wand2, Image as ImageIcon } from 'lucide-react';
import { BlogPost, PostStatus, ViewState } from '../types';
import { generateFinancialDraft, polishContent, generateSEOTags, generateCoverImage } from '../services/geminiService';

interface ContentEditorProps {
  post?: BlogPost | null;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ post, onSave, onCancel }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [category, setCategory] = useState(post?.category || 'Market Insights');
  const [status, setStatus] = useState<PostStatus>(post?.status || PostStatus.DRAFT);
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || '');
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = () => {
    onSave({
      id: post?.id || Date.now().toString(),
      title,
      content,
      excerpt: content.substring(0, 100) + '...',
      author: post?.author || 'Invest Corp Team',
      category,
      status,
      date: post?.date || new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || `https://picsum.photos/800/400?random=${Date.now()}`
    });
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    const generatedText = await generateFinancialDraft(aiPrompt);
    setContent(generatedText);
    if (!title) setTitle(aiPrompt); // Auto title if empty
    setIsGenerating(false);
    setIsAiModalOpen(false);
  };

  const handleAiPolish = async () => {
    if (!content) return;
    setIsGenerating(true);
    const polished = await polishContent(content);
    setContent(polished);
    setIsGenerating(false);
  };

  const handleAiSEO = async () => {
    if (!content) return;
    setIsGenerating(true);
    const seo = await generateSEOTags(content);
    alert(`Suggested SEO Title: ${seo.title}\n\nDescription: ${seo.description}`);
    setIsGenerating(false);
  };

  const handleGenerateImage = async () => {
      if (!title) {
          alert("Please enter a title first to generate a relevant image.");
          return;
      }
      setIsGenerating(true);
      const generatedImage = await generateCoverImage(title);
      if (generatedImage) {
          setImageUrl(generatedImage);
      } else {
          alert("Could not generate image. Please try again.");
      }
      setIsGenerating(false);
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm sticky top-4 z-20">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-invest-900">{post ? 'Edit Article' : 'New Article'}</h2>
        </div>
        <div className="flex gap-3">
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as PostStatus)}
            className="border border-slate-200 rounded-lg px-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-invest-gold"
          >
            <option value={PostStatus.DRAFT}>Draft</option>
            <option value={PostStatus.PUBLISHED}>Published</option>
          </select>
          <button 
            onClick={handleSave}
            className="bg-invest-900 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <input
            type="text"
            placeholder="Article Headline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold text-invest-900 placeholder-slate-300 border-none outline-none bg-transparent"
          />
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px] relative overflow-hidden">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your market analysis here..."
              className="w-full h-full p-6 resize-none focus:outline-none font-sans text-lg leading-relaxed text-slate-700"
              style={{ minHeight: '500px' }}
            />
            
            {/* AI Floating Action Button */}
            <div className="absolute bottom-6 right-6 flex gap-2">
               <button
                onClick={() => setIsAiModalOpen(true)}
                className="bg-invest-gold hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                title="Draft with AI"
              >
                <Sparkles size={20} />
                <span className="text-sm font-bold pr-2">AI Draft</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
           {/* AI Tools */}
           <div className="bg-gradient-to-br from-invest-900 to-slate-900 rounded-xl p-6 text-white shadow-lg">
             <div className="flex items-center gap-2 mb-4 text-invest-gold">
               <Wand2 size={20} />
               <h3 className="font-bold">Gemini Assistant</h3>
             </div>
             <p className="text-sm text-slate-300 mb-4">Enhance your content with enterprise-grade AI.</p>
             
             <div className="space-y-3">
                <button 
                  onClick={handleAiPolish}
                  disabled={isGenerating || !content}
                  className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Sparkles size={14} /> Polish Tone
                </button>
                <button 
                  onClick={handleAiSEO}
                  disabled={isGenerating || !content}
                  className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Eye size={14} /> Check SEO
                </button>
             </div>
             {isGenerating && <p className="text-xs text-center mt-3 text-invest-gold animate-pulse">Gemini is working...</p>}
           </div>

           {/* Cover Image */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-invest-900 mb-4">Cover Image</h3>
              <div className="mb-4 rounded-lg overflow-hidden bg-slate-100 aspect-video flex items-center justify-center border border-slate-200 relative group">
                  {imageUrl ? (
                      <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                      <div className="text-slate-400 flex flex-col items-center">
                          <ImageIcon size={24} />
                          <span className="text-xs mt-2">No image selected</span>
                      </div>
                  )}
              </div>
              <button 
                  onClick={handleGenerateImage}
                  disabled={isGenerating || !title}
                  className="w-full bg-slate-50 border border-slate-200 hover:bg-slate-100 text-invest-900 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                  <Sparkles size={14} className="text-invest-gold" />
                  Generate with AI
              </button>
           </div>

           {/* Metadata */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-invest-900 mb-4">Publishing Details</h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                 <select 
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full border border-slate-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-invest-gold outline-none"
                 >
                   <option>Market Insights</option>
                   <option>Company News</option>
                   <option>Quarterly Reports</option>
                   <option>Investment Education</option>
                 </select>
               </div>
               <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Author</label>
                  <input type="text" disabled value="Invest Corp Team" className="w-full bg-slate-50 border border-slate-200 rounded-md p-2 text-sm text-slate-500" />
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg m-4">
            <h3 className="text-lg font-bold text-invest-900 mb-2">Draft with AI</h3>
            <p className="text-sm text-slate-500 mb-4">Enter a topic, and Gemini will generate a structured financial blog post draft for you.</p>
            <textarea
              autoFocus
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="E.g., The impact of inflation on Ghana's bond market in Q3 2024..."
              className="w-full border border-slate-200 rounded-lg p-3 text-sm h-32 focus:ring-2 focus:ring-invest-gold outline-none resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:text-invest-900"
              >
                Cancel
              </button>
              <button 
                onClick={handleAiGenerate}
                disabled={!aiPrompt || isGenerating}
                className="px-4 py-2 bg-invest-gold text-white rounded-lg text-sm font-medium hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? 'Generating...' : 'Generate Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;