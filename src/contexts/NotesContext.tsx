
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface NotesContextType {
  notes: Note[];
  categories: Category[];
  selectedNote: Note | null;
  selectedCategory: string;
  searchQuery: string;
  createNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  selectNote: (note: Note | null) => void;
  setSelectedCategory: (categoryId: string) => void;
  setSearchQuery: (query: string) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  filteredNotes: Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: 'all', name: 'All Notes', color: 'bg-blue-500' },
  { id: 'work', name: 'Work', color: 'bg-purple-500' },
  { id: 'personal', name: 'Personal', color: 'bg-green-500' },
  { id: 'ideas', name: 'Ideas', color: 'bg-orange-500' },
];

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load data from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      setNotes(parsedNotes);
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Save to localStorage whenever notes or categories change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      tags: [],
      category: selectedCategory === 'all' ? 'personal' : selectedCategory,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
    
    if (selectedNote?.id === id) {
      setSelectedNote(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const selectNote = (note: Note | null) => {
    setSelectedNote(note);
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    if (id === 'all') return; // Can't delete "All Notes"
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Move notes from deleted category to "personal"
    setNotes(prev =>
      prev.map(note =>
        note.category === id ? { ...note, category: 'personal' } : note
      )
    );
  };

  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <NotesContext.Provider
      value={{
        notes,
        categories,
        selectedNote,
        selectedCategory,
        searchQuery,
        createNote,
        updateNote,
        deleteNote,
        selectNote,
        setSelectedCategory,
        setSearchQuery,
        addCategory,
        deleteCategory,
        filteredNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
