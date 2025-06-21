
import React from 'react';
import { NotesProvider } from '@/contexts/NotesContext';
import NotesApp from '@/components/NotesApp';

const Index = () => {
  return (
    <NotesProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <NotesApp />
      </div>
    </NotesProvider>
  );
};

export default Index;
