import React from 'react';
import { BlogPost, PostStatus } from '../types';
import { Edit2, Trash2, Plus, Search, Filter } from 'lucide-react';

interface PostListProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onEdit, onCreate, onDelete }) => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-invest-900">Market Insights</h2>
            <p className="text-slate-500 text-sm mt-1">Manage your research articles and updates.</p>
        </div>
        <button 
          onClick={onCreate}
          className="bg-invest-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-invest-800 flex items-center gap-2 shadow-lg shadow-invest-900/20"
        >
          <Plus size={18} />
          New Article
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-center">
         <div className="relative flex-1 w-full">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Search articles..." 
             className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-invest-gold/50"
           />
         </div>
         <div className="flex gap-2 w-full sm:w-auto">
           <button className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
             <Filter size={16} /> Filter
           </button>
         </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Article</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-invest-900">{post.title}</div>
                    <div className="text-slate-400 text-xs mt-1 truncate max-w-xs">{post.excerpt}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex w-fit items-center gap-1
                      ${post.status === PostStatus.PUBLISHED ? 'bg-green-50 text-green-700' : 
                        post.status === PostStatus.DRAFT ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        post.status === PostStatus.PUBLISHED ? 'bg-green-500' : 
                        post.status === PostStatus.DRAFT ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></span>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(post)} className="p-1.5 text-slate-400 hover:text-invest-900 hover:bg-slate-100 rounded transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onDelete(post.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {posts.length === 0 && (
           <div className="p-12 text-center text-slate-400">
             <p>No articles found. Create your first one!</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default PostList;