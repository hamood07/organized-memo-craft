
import React from 'react';
import Sidebar from './Sidebar';
import NotesList from './NotesList';
import NoteEditor from './NoteEditor';
import { useNotes } from '@/contexts/NotesContext';

const NotesApp = () => {
  const { selectedNote } = useNotes();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        <NotesList />
        <div className="flex-1 flex items-center justify-center">
          {selectedNote ? (
            <NoteEditor />
          ) : (
            <div className="text-center text-gray-500 p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Select a note to edit</h3>
              <p className="text-sm text-gray-500">Choose a note from the list or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
