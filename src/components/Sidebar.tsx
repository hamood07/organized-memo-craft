
import React, { useState } from 'react';
import { useNotes } from '@/contexts/NotesContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Tag, Trash2, Edit } from 'lucide-react';

const Sidebar = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    notes,
    addCategory,
    deleteCategory,
  } = useNotes();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');

  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-red-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), selectedColor);
      setNewCategoryName('');
      setShowAddCategory(false);
      setSelectedColor('bg-blue-500');
    }
  };

  const getCategoryNoteCount = (categoryId: string) => {
    if (categoryId === 'all') return notes.length;
    return notes.filter(note => note.category === categoryId).length;
  };

  return (
    <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-purple-100 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-purple-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Notes
        </h1>
        <p className="text-sm text-gray-500 mt-1">Organize your thoughts</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-purple-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Categories</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <Tag className="w-4 h-4" />
            </Button>
          </div>

          {/* Add Category Form */}
          {showAddCategory && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Input
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="mb-3"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <div className="flex gap-2 mb-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full ${color} ${
                      selectedColor === color ? 'ring-2 ring-purple-400 ring-offset-2' : ''
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddCategory} className="bg-purple-600 hover:bg-purple-700">
                  Add
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddCategory(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Category List */}
          <div className="space-y-1">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryNoteCount(category.id)}
                  </Badge>
                  {category.id !== 'all' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCategory(category.id);
                      }}
                      className="p-1 h-auto text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
