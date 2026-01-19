import admin from 'firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

interface SubmitScoreBody {
  profileId: string;
  username: string;
  personalBestWpm: number;
  totalKeystrokes: number;
  totalErrors: number;
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();

// Rank score function
function computeRankScore(personalBestWpm: number, totalKeystrokes: number, totalErrors: number): number {
  if (totalKeystrokes === 0) return 0;
  const accuracy = (totalKeystrokes - totalErrors) / totalKeystrokes;
  const volumeFactor = Math.sqrt(totalKeystrokes);
  return personalBestWpm * accuracy * volumeFactor;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: SubmitScoreBody = await req.json();
    const { profileId, username, personalBestWpm, totalKeystrokes, totalErrors } = body;
    
    if (!profileId || !username || personalBestWpm < 0 || totalKeystrokes < 0 || totalErrors < 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const rankScore = computeRankScore(personalBestWpm, totalKeystrokes, totalErrors);

    await db.collection('leaderboard').doc(profileId).set({
      username,
      personalBestWpm,
      totalKeystrokes,
      totalErrors,
      rankScore,
    }, { merge: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}