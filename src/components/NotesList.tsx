
import React from 'react';
import { useNotes } from '@/contexts/NotesContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FilePlus, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NotesList = () => {
  const { filteredNotes, selectedNote, selectNote, createNote, deleteNote, toggleNoteCompletion } = useNotes();

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="w-96 bg-white/60 backdrop-blur-sm border-r border-purple-100 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-purple-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Notes ({filteredNotes.length})
          </h2>
          <Button
            onClick={createNote}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            <FilePlus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <FilePlus className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No notes found</h3>
            <p className="text-sm text-gray-500 mb-4">Create your first note to get started</p>
            <Button
              onClick={createNote}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <FilePlus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          </div>
        ) : (
          <div className="p-2">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className={`p-4 mb-2 rounded-lg cursor-pointer transition-all border ${
                  selectedNote?.id === note.id
                    ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-sm'
                    : 'bg-white/50 border-gray-200 hover:bg-white/80 hover:border-purple-200'
                } ${note.completed ? 'opacity-75' : ''}`}
                onClick={() => selectNote(note)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={note.completed}
                      onCheckedChange={() => toggleNoteCompletion(note.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <h3 className={`font-medium text-gray-800 truncate flex-1 mr-2 ${
                      note.completed ? 'line-through text-gray-500' : ''
                    }`}>
                      {note.title || 'Untitled Note'}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="p-1 h-auto text-gray-400 hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {note.content && (
                  <p className={`text-sm text-gray-600 mb-3 line-clamp-3 ml-7 ${
                    note.completed ? 'line-through text-gray-400' : ''
                  }`}>
                    {truncateContent(note.content)}
                  </p>
                )}
                
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3 ml-7">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{note.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 ml-7">
                  {formatDate(note.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesList;
