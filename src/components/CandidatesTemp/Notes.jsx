
import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "../../db/dexieDB";
import { Send, AtSign, User } from "lucide-react";

const USERS = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Henry"];

export default function Notes({ candidateId }) {
  const [note, setNote] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const textareaRef = useRef(null);
  const queryClient = useQueryClient();

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (noteContent) => {
      await db.timelines.add({
        candidateId: parseInt(candidateId),
        timestamp: new Date().toISOString(),
        note: noteContent,
        type: 'note',
        from: null,
        to: null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['timeline', candidateId]);
      setNote("");
    }
  });

  const handleInput = (e) => {
    const value = e.target.value;
    setNote(value);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastWord = textBeforeCursor.split(/\s/).pop();

    if (lastWord.startsWith("@")) {
      const query = lastWord.slice(1).toLowerCase();
      const filtered = USERS.filter((u) => u.toLowerCase().includes(query));
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      } else if (e.key === "Enter" && suggestions.length > 0) {
        e.preventDefault();
        selectSuggestion(suggestionIndex);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    }
  };

  const selectSuggestion = (index) => {
    const selectedUser = suggestions[index];
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = note.substring(0, cursorPosition);
    const textAfterCursor = note.substring(cursorPosition);

    const lastAt = textBeforeCursor.lastIndexOf("@");
    const newText = textBeforeCursor.substring(0, lastAt) + `@${selectedUser} ` + textAfterCursor;

    setNote(newText);
    setShowSuggestions(false);

    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textareaRef.current.focus();
      const newCursorPosition = lastAt + selectedUser.length + 2;
      textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.trim()) {
      addNoteMutation.mutate(note.trim());
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (textareaRef.current && !textareaRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <User className="w-5 h-5 mr-2 text-blue-600" />
        Notes & Mentions
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={note}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Add a note about this candidate... Use @ to mention team members"
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
            disabled={addNoteMutation.isLoading}
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
              {suggestions.map((user, index) => (
                <button
                  key={user}
                  type="button"
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${index === suggestionIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    } ${index === 0 ? 'rounded-t-lg' : ''} ${index === suggestions.length - 1 ? 'rounded-b-lg' : ''
                    }`}
                  onClick={() => selectSuggestion(index)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {user[0]}
                    </div>
                    <span>@{user}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <AtSign className="w-4 h-4" />
            <span>Mention team members with @</span>
          </div>

          <button
            type="submit"
            disabled={!note.trim() || addNoteMutation.isLoading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {addNoteMutation.isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Add Note</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Recent Mentions Hint */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Available mentions:</p>
        <div className="flex flex-wrap gap-2">
          {USERS.map(user => (
            <span key={user} className="inline-flex items-center space-x-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600">
              <AtSign className="w-3 h-3" />
              <span>{user}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}