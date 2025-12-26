# Draggable Joke Sorter

## What does it do?

Simple: It fetches fresh jokes from the web, and you play critic.
- **Read & React**: You get a list of jokes.
- **Sort 'em out**: Drag the good ones to "Loved It" and the bad ones to "Not Funny".
- **Track the time**:Track how long you hesitated before judging each joke.
- **undo button**:There's an "Undo" button to save that poor joke you accidentally rejected.


## Tech Stack

I kept things lightweight and modern:
- **React (Vite)**: For that instant dev server speed.
- **TypeScript**: Because types save lives (and sanity).
- **Vanilla CSS**: No Tailwind or Bootstrap here—just custom, semantic CSS variables for that premium feel.
- **Native Drag & Drop**: I used the native DOM API for desktop and wrote custom logic for mobile touch support.

## Getting Started

Want to run this locally? It's super easy.

1.  **Clone & Install**
    ```bash
    npm install
    ```

2.  **Run the Dev Server**
    ```bash
    npm run dev
    ```
    Open up the link it gives you (usually `http://localhost:5173`) and start sorting!

3.  **Build for Production**
    ```bash
    npm run build
    ```

## Assessment Checklist

Just for reference, here's how I tackled the requirements:
- [x] Fetch 5 random jokes (Batched fetch for efficiency).
- [x] Draggable Interface (Works on Desktop & Mobile).
- [x] Timer Tracking (Seconds on screen).
- [x] Undo Functionality (Stack-based history).
- [x] Filtering (View only "Loved" jokes).
- [x]  Dark Mode & Responsive Mobile Layout.

---
*Created with love (and a lot of bad puns)*
