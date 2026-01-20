# Frontend Mentor - Typing Speed Test solution

This is a solution to the [Typing Speed Test challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/typing-speed-test). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users can:

- **Choose from multiple test modes**: Timed mode (15s, 30s, 60s, 120s) or Passage mode
- **Select content categories**: General, Quotes, Code snippets, or Lyrics
- **Adjust difficulty levels**: Easy/Medium/Hard (or Short/Medium/Long for quotes, Basic/Intermediate/Advanced for code)
- **Get real-time typing feedback**: 
  - Live WPM (Words Per Minute) calculation
  - Instant accuracy tracking
  - Visual feedback for correct/incorrect characters
  - Character-by-character highlighting with color-coded states
- **See insightful heatmap on most used and missed keys**:
  - Keystroke heatmap showing which keys you pressed most
  - Keystroke heatmap showing which keys you missed most
  - Key statistics breakdown
- **See comprehensive results display**:
  - Final WPM and accuracy scores
  - Character statistics (correct vs incorrect)
  - Personal best tracking with local storage
  - High score celebrations with animations
- **Leaderboard system**: 
  - Submit scores to global Firebase leaderboard
  - View top performers
  - Track your personal best
- **Share results**: Generate and share result images via dynamic OG image generation
- **Sound effects**: Optional audio feedback for typing interactions

### Screenshot

<img width="2560" height="1288" alt="screencapture-typing-speed-test1212-vercel-app-2026-01-20-13_52_41" src="https://github.com/user-attachments/assets/0331af2e-f7be-40e5-b69e-ec05d9ef214c" />

___

<img width="2560" height="1264" alt="screencapture-typing-speed-test1212-vercel-app-2026-01-20-13_56_34" src="https://github.com/user-attachments/assets/060c4b67-ac7f-4c54-80d3-737b52b4f4e5" />

___

<img width="2560" height="2376" alt="screencapture-typing-speed-test1212-vercel-app-2026-01-20-13_57_50" src="https://github.com/user-attachments/assets/b3f05c9a-4385-4907-aeb2-adc81a6ee7e1" />

___

<img width="2560" height="1636" alt="screencapture-typing-speed-test1212-vercel-app-leaderboard-2026-01-20-13_59_05" src="https://github.com/user-attachments/assets/5b3de811-6921-4d71-9cb8-3aca60c35d7b" />

___

<img width="2560" height="1446" alt="screencapture-typing-speed-test1212-vercel-app-2026-01-20-13_59_59" src="https://github.com/user-attachments/assets/8f3874c8-81ac-4a1c-b8e6-3cb2c7efe378" />

### Links

- Solution URL: [https://www.frontendmentor.io/solutions/typing-speed-test-using-nextjs-firebase-framer-motion-and-tailwindcss-4xv4PiVNsJ](https://www.frontendmentor.io/solutions/typing-speed-test-using-nextjs-firebase-framer-motion-and-tailwindcss-4xv4PiVNsJ)
- Live Site URL: [https://typing-speed-test1212.vercel.app/](https://typing-speed-test1212.vercel.app/)

## My process

### Built with

- **Next.js 16** - React framework with App Router
- **React 19** - UI library with client components and custom hooks
- **TypeScript** - Static typing and type safety
- **Tailwind CSS v4** - Utility-first CSS framework via PostCSS
- **Firebase & Firebase Admin SDK** - Backend for leaderboard persistence
- **Vercel OG (`@vercel/og`)** - Dynamic result image generation
- **Motion** - Animation library for smooth transitions and effects
- **react-simple-keyboard** - Heatmap keyboard component
- **React Context API** - Global state management
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### What I learned

- The core strength of this project is the centralized typing state management. By using a custom `useTypingTest` hook and exposing it through `TypingTestContext`, all timing, accuracy, and WPM logic stays in one place, making the UI responsive and consistent across components.

- Real-time metrics calculation – Managing live WPM and accuracy calculations without performance degradation, ensuring the display updates smoothly as the user types character-by-character.

- Keyboard event handling and text input – Implementing precise character-by-character tracking with proper event handling, including managing the difference between what the user types and what they should type.

- Local storage strategy for persistent data – Using localStorage to track user profiles, personal bests, and keystroke statistics across sessions, with proper data serialization and retrieval.

- Working with data-driven content – Structuring passage data by category and difficulty levels, then dynamically selecting and serving content based on user preferences.

- Sound effects and audio API – Integrating audio feedback into a typing interface without creating performance issues or overwhelming the user experience.

- Data visualization (heatmap generation) – Representing keystroke frequency data visually to give users insights into their typing patterns.

- Leaderboard ranking logic – Implementing score comparison and ranking algorithms to identify personal bests and high score achievements.

- Dynamic image generation with Vercel OG – Creating shareable result cards programmatically based on test outcomes.

### Continued development

Future improvements could include:

- More rigorous accessibility testing with mobile devices, keyboard-only navigation and screen readers
- More configurable options for test modes and difficulty customization
- Performance profiling to ensure smooth interactions on lower-end devices
- Speed optimization when playing in hard modes.

### Useful resources

- [Firebase Documentation](https://firebase.google.com/docs) - For leaderboard implementation
- [Next.js Documentation](https://nextjs.org/docs) - For App Router and API routes
- [React Context API](https://react.dev/reference/react/useContext) - For state management patterns
- [Motion Documentation](https://motion.dev/) - For animation implementation

## Author

- Website - [Russell Oje](https://ruxy.tech)
- Frontend Mentor - [@ruxy1212](https://www.frontendmentor.io/profile/ruxy1212)
- Twitter - [@russell_oje](https://www.twitter.com/russell_oje)

## Acknowledgments

This project was built as a Frontend Mentor challenge, helping to improve coding skills through building realistic projects.
