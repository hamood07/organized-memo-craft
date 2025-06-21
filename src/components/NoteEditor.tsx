
import React, { useState, useEffect } from 'react';
import { useNotes } from '@/contexts/NotesContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag, Trash2 } from 'lucide-react';

const NoteEditor = () => {
  const { selectedNote, updateNote, categories } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setCategory(selectedNote.category);
      setTags(selectedNote.tags);
    }
  }, [selectedNote]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (selectedNote) {
      updateNote(selectedNote.id, { title: newTitle });
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (selectedNote) {
      updateNote(selectedNote.id, { content: newContent });
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    if (selectedNote) {
      updateNote(selectedNote.id, { category: newCategory });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      if (selectedNote) {
        updateNote(selectedNote.id, { tags: updatedTags });
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    if (selectedNote) {
      updateNote(selectedNote.id, { tags: updatedTags });
    }
  };

  if (!selectedNote) return null;

  return (
    <div className="flex-1 bg-white/60 backdrop-blur-sm h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-purple-100 bg-white/80">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-2xl font-bold border-none bg-transparent p-0 focus:ring-0 focus:border-none placeholder:text-gray-400"
          placeholder="Note title..."
        />
        
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Category:</span>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-40 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.filter(cat => cat.id !== 'all').map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                      {cat.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: {selectedNote.updatedAt.toLocaleDateString()} at {selectedNote.updatedAt.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="p-6 border-b border-purple-100 bg-white/60">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Tags</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            className="flex-1 h-8"
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
          />
          <Button onClick={addTag} size="sm" variant="outline">
            Add
          </Button>
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex-1 p-6">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start writing your note..."
          className="w-full h-full border-none bg-transparent resize-none focus:ring-0 focus:border-none text-base leading-relaxed"
        />
      </div>
    </div>
  );
};

export default NoteEditor;
