'use client';

import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';  // Adjust path
import { collection, query, orderBy, limit, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

// Interface for leaderboard entry
interface LeaderboardEntry {
  profileId: string;
  username: string;
  personalBestWpm: number;
  totalKeystrokes: number;
  totalErrors: number;
  rankScore: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('rankScore', 'desc'),
      limit(50)  // Top 50, adjust as needed
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const data: LeaderboardEntry[] = snapshot.docs.map((doc) => ({
        profileId: doc.id,
        ...doc.data(),
      }) as LeaderboardEntry);
      setLeaderboard(data);
      setLoading(false);
    }, (error) => {
      console.error('Error:', error);
    });

    return () => unsubscribe();  // Cleanup
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Typing Speed Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>PB WPM</th>
            <th>Total Keystrokes</th>
            <th>Total Errors</th>
            <th>Accuracy</th>
            <th>Rank Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr key={player.profileId}>
              <td>{index + 1}</td>
              <td>{player.username}</td>
              <td>{player.personalBestWpm}</td>
              <td>{player.totalKeystrokes.toLocaleString()}</td>
              <td>{player.totalErrors.toLocaleString()}</td>
              <td>{(((player.totalKeystrokes - player.totalErrors) / player.totalKeystrokes) * 100).toFixed(1)}%</td>
              <td>{player.rankScore.toFixed(0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}