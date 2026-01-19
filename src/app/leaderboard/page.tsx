'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, QuerySnapshot, DocumentData, doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { Loader2, Trophy, Pencil, Check, X } from 'lucide-react';
import { getProfileId, getUsername, saveUsername } from '@/lib/storage';
import Link from 'next/link';
import Header from '@/components/header';
import { TypingTestProvider } from '@/context/TypingTestContext';

interface LeaderboardEntry {
  profileId: string;
  username: string;
  personalBestWpm: number;
  totalKeystrokes: number;
  totalErrors: number;
  rankScore: number;
  rank?: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  
  const currentProfileId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return getProfileId();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('rankScore', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot: QuerySnapshot<DocumentData>) => {
        const data: LeaderboardEntry[] = snapshot.docs.map((doc, index) => ({
          profileId: doc.id,
          rank: index + 1,
          ...doc.data(),
        }) as LeaderboardEntry);
        setLeaderboard(data);

        // Check if current user is in top 50
        const currentUserInTop50 = data.some(entry => entry.profileId === currentProfileId);
        
        if (!currentUserInTop50 && currentProfileId) {
          // Fetch current user's record separately
          try {
            const userDocRef = doc(db, 'leaderboard', currentProfileId);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data() as Omit<LeaderboardEntry, 'profileId' | 'rank'>;
              
              setCurrentUserEntry({
                profileId: currentProfileId,
                ...userData,
                rank: undefined, // Will be displayed as "50+"
              });
            } else {
              setCurrentUserEntry(null);
            }
          } catch (error) {
            console.error('Error fetching current user data:', error);
            setCurrentUserEntry(null);
          }
        } else {
          setCurrentUserEntry(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error('Error fetching leaderboard:', error);
        toast.error('Failed to load leaderboard. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentProfileId]);

  const handleEditStart = (username: string) => {
    setEditedUsername(username);
    setIsEditing(true);
  };

  const handleEditSave = () => {
    const trimmed = editedUsername.trim();
    if (trimmed && trimmed.length <= 20) {
      saveUsername(trimmed);
      toast.success('Username saved! It will update on the leaderboard after your next game.');
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedUsername('');
  };

  return (
    <TypingTestProvider>
      <div className="p-4 flex flex-col gap-8 md:p-8 md:gap-10 xl:gap-14 min-h-screen">
        <Header />
        {/* Main Content */}
        <main className="w-full max-w-344 mx-auto flex-1">
          <div className="bg-ts-neutral-800 rounded-lg p-4 md:p-6">
            <h1 className="text-ts-neutral-0 text-xl md:text-2xl font-bold mb-6 flex items-center gap-3">
              <Trophy className="h-6 w-6 text-ts-yellow-400" />
              Leaderboard
            </h1>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-ts-blue-600 animate-spin" />
                <p className="text-ts-neutral-400 text-lg">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Trophy className="h-12 w-12 text-ts-neutral-500" />
                <p className="text-ts-neutral-400 text-lg">No entries yet. Be the first!</p>
              </div>
            ) : (
              <div className="overflow-auto max-h-[80vh] tiny-scrollbar">
                <table className="cursor-default w-full border-collapse min-w-150">
                  <thead className="sticky top-0 bg-ts-neutral-800 z-10">
                    <tr className="border-b border-ts-neutral-700">
                      <th className="text-ts-neutral-400 text-sm font-semibold text-left py-3 px-3 whitespace-nowrap">
                        Rank
                      </th>
                      <th className="text-ts-neutral-400 text-sm font-semibold text-left py-3 px-3 whitespace-nowrap max-w-37.5">
                        Username
                      </th>
                      <th className="text-ts-neutral-400 text-sm font-semibold text-right py-3 px-3 whitespace-nowrap">
                        PB WPM
                      </th>
                      <th className="text-ts-neutral-400 text-sm font-semibold text-right py-3 px-3 whitespace-nowrap">
                        Keystrokes
                      </th>
                      <th className="text-ts-neutral-400 text-sm font-semibold text-right py-3 px-3 whitespace-nowrap">
                        Errors
                      </th>
                      <th className="text-ts-neutral-400 text-sm font-semibold text-right py-3 px-3 whitespace-nowrap">
                        Accuracy
                      </th>
                      <th className="text-ts-neutral-400 text-sm font-semibold text-right py-3 px-3 whitespace-nowrap">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((player, index) => {
                      const isCurrentUser = player.profileId === currentProfileId;
                      const accuracy = player.totalKeystrokes > 0
                        ? ((player.totalKeystrokes - player.totalErrors) / player.totalKeystrokes) * 100
                        : 0;

                      return (
                        <tr
                          key={player.profileId}
                          className={`border-b border-ts-neutral-700 last:border-b-0 transition-colors hover:bg-ts-neutral-700/50 ${
                            isCurrentUser ? 'bg-ts-blue-600/25' : ''
                          }`}
                        >
                          <td className="text-ts-neutral-0 text-sm py-3 px-3 whitespace-nowrap">
                            <span className={`font-semibold ${
                              index === 0 ? 'text-ts-yellow-400' :
                              index === 1 ? 'text-ts-neutral-400' :
                              index === 2 ? 'text-orange-400' :
                              'text-ts-neutral-0'
                            }`}>
                              #{index + 1}
                            </span>
                          </td>
                          <td className="text-ts-neutral-0 text-sm py-3 px-3 whitespace-nowrap max-w-37.5 truncate" title={player.username}>
                            {isCurrentUser && isEditing ? (
                              <div className="flex items-center gap-1">
                                <input
                                  type="text"
                                  value={editedUsername}
                                  onChange={(e) => setEditedUsername(e.target.value)}
                                  maxLength={20}
                                  className="bg-ts-neutral-700 text-ts-neutral-0 text-sm px-2 py-0.5 rounded w-24 outline-none focus:ring-1 focus:ring-ts-blue-400"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleEditSave();
                                    if (e.key === 'Escape') handleEditCancel();
                                  }}
                                />
                                <button onClick={handleEditSave} className="cursor-pointer p-0.5 hover:text-ts-green-500 text-ts-neutral-400">
                                  <Check className="h-4 w-4" />
                                </button>
                                <button onClick={handleEditCancel} className="cursor-pointer p-0.5 hover:text-ts-red-500 text-ts-neutral-400">
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <span
                                className={isCurrentUser ? 'cursor-pointer group' : ''}
                                onClick={() => isCurrentUser && handleEditStart(isCurrentUser ? getUsername() : player.username)}
                              >
                                {isCurrentUser ? getUsername() : player.username}
                                {isCurrentUser && (
                                  <>
                                    <Pencil className="inline-block ml-1 h-3 w-3 text-ts-neutral-500 group-hover:text-ts-blue-400" />
                                    <span className="ml-1 text-xs text-ts-blue-400">(You)</span>
                                  </>
                                )}
                              </span>
                            )}
                          </td>
                          <td className="text-ts-neutral-0 text-sm py-3 px-3 text-right whitespace-nowrap font-semibold">
                            {player.personalBestWpm}
                          </td>
                          <td className="text-ts-neutral-400 text-sm py-3 px-3 text-right whitespace-nowrap">
                            {player.totalKeystrokes.toLocaleString()}
                          </td>
                          <td className="text-ts-red-500 text-sm py-3 px-3 text-right whitespace-nowrap">
                            {player.totalErrors.toLocaleString()}
                          </td>
                          <td className={`text-sm py-3 px-3 text-right whitespace-nowrap ${
                            accuracy >= 95 ? 'text-ts-green-500' :
                            accuracy >= 90 ? 'text-ts-yellow-400' :
                            'text-ts-neutral-400'
                          }`}>
                            {accuracy.toFixed(1)}%
                          </td>
                          <td className="text-ts-blue-400 text-sm py-3 px-3 text-right whitespace-nowrap font-semibold">
                            {player.rankScore.toFixed(0)}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Current user's entry if not in top 50 */}
                    {currentUserEntry && (() => {
                      const accuracy = currentUserEntry.totalKeystrokes > 0
                        ? ((currentUserEntry.totalKeystrokes - currentUserEntry.totalErrors) / currentUserEntry.totalKeystrokes) * 100
                        : 0;

                      return (
                        <>
                          {/* Separator row */}
                          <tr className="border-b border-ts-neutral-600">
                            <td colSpan={7} className="py-2 px-3">
                              <div className="flex items-center gap-2 text-ts-neutral-500 text-xs">
                                <span className="flex-1 border-t border-dashed border-ts-neutral-600"></span>
                                <span>...</span>
                                <span className="flex-1 border-t border-dashed border-ts-neutral-600"></span>
                              </div>
                            </td>
                          </tr>
                          <tr
                            className="border-b border-ts-neutral-700 last:border-b-0 transition-colors hover:bg-ts-neutral-700/50 bg-ts-blue-600/25"
                          >
                            <td className="text-ts-neutral-0 text-sm py-3 px-3 whitespace-nowrap">
                              <span className="font-semibold text-ts-neutral-0">
                                #50+
                              </span>
                            </td>
                            <td className="text-ts-neutral-0 text-sm py-3 px-3 whitespace-nowrap max-w-37.5 truncate" title={currentUserEntry.username}>
                              {isEditing ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={editedUsername}
                                    onChange={(e) => setEditedUsername(e.target.value)}
                                    maxLength={20}
                                    className="bg-ts-neutral-700 text-ts-neutral-0 text-sm px-2 py-0.5 rounded w-24 outline-none focus:ring-1 focus:ring-ts-blue-400"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleEditSave();
                                      if (e.key === 'Escape') handleEditCancel();
                                    }}
                                  />
                                  <button onClick={handleEditSave} className="cursor-pointer p-0.5 hover:text-ts-green-500 text-ts-neutral-400">
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button onClick={handleEditCancel} className="cursor-pointer p-0.5 hover:text-ts-red-500 text-ts-neutral-400">
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <span
                                  className="cursor-pointer group"
                                  onClick={() => handleEditStart(getUsername())}
                                >
                                  {getUsername()}
                                  <Pencil className="inline-block ml-1 h-3 w-3 text-ts-neutral-500 group-hover:text-ts-blue-400" />
                                  <span className="ml-1 text-xs text-ts-blue-400">(You)</span>
                                </span>
                              )}
                            </td>
                            <td className="text-ts-neutral-0 text-sm py-3 px-3 text-right whitespace-nowrap font-semibold">
                              {currentUserEntry.personalBestWpm}
                            </td>
                            <td className="text-ts-neutral-400 text-sm py-3 px-3 text-right whitespace-nowrap">
                              {currentUserEntry.totalKeystrokes.toLocaleString()}
                            </td>
                            <td className="text-ts-red-500 text-sm py-3 px-3 text-right whitespace-nowrap">
                              {currentUserEntry.totalErrors.toLocaleString()}
                            </td>
                            <td className={`text-sm py-3 px-3 text-right whitespace-nowrap ${
                              accuracy >= 95 ? 'text-ts-green-500' :
                              accuracy >= 90 ? 'text-ts-yellow-400' :
                              'text-ts-neutral-400'
                            }`}>
                              {accuracy.toFixed(1)}%
                            </td>
                            <td className="text-ts-blue-400 text-sm py-3 px-3 text-right whitespace-nowrap font-semibold">
                              {currentUserEntry.rankScore.toFixed(0)}
                            </td>
                          </tr>
                        </>
                      );
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-ts-blue-400 hover:text-ts-blue-600 transition-colors text-sm font-medium"
            >
              ← Back to Typing Test
            </Link>
          </div>
        </main>
      </div>
    </TypingTestProvider>
  );
}