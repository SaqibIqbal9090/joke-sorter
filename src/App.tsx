import { useState, useEffect } from 'react';
import type { Joke, SortedJoke, Reaction } from './types';
import { JokeCard } from './components/JokeCard';
import { DropZone } from './components/DropZone';
import { Summary } from './components/Summary';

const STORAGE_KEY = 'joke_sorter_state_v1';

interface AppState {
  jokes: Joke[];
  sortedJokes: SortedJoke[];
}

function App() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [sortedJokes, setSortedJokes] = useState<SortedJoke[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterLoved, setFilterLoved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: AppState = JSON.parse(saved);
        setJokes(parsed.jokes || []);
        setSortedJokes(parsed.sortedJokes || []);
      } catch (e) {
        console.error("Failed to load state", e);
      }
    } else {
      fetchJokes();
    }


    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ jokes, sortedJokes }));
  }, [jokes, sortedJokes]);

  const fetchJokes = async () => {
    setLoading(true);
    try {
      const randomPage = Math.floor(Math.random() * 20) + 1;
      const res = await fetch(`https://icanhazdadjoke.com/search?limit=5&page=${randomPage}`, {
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();

      if (data.results && Array.isArray(data.results)) {
        const newJokes: Joke[] = data.results.map((j: any) => ({
          id: j.id,
          joke: j.joke
        }));

        // Filter out duplicates if any exist in current state
        setJokes(prev => {
          const seenIds = new Set(prev.map(j => j.id));
          const uniqueNewJokes = newJokes.filter(j => !seenIds.has(j.id));
          return [...prev, ...uniqueNewJokes];
        });
      }
    } catch (err) {
      console.error("Failed to fetch jokes", err);
      alert("Failed to fetch new jokes. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = () => {
  };

  const handleJokeDrop = (jokeId: string, timeSpent: number, reaction: Reaction) => {
    const jokeIndex = jokes.findIndex(j => j.id === jokeId);
    if (jokeIndex === -1) return;

    const joke = jokes[jokeIndex];

    const sorted: SortedJoke = { ...joke, reaction, timeSpent };
    setSortedJokes(prev => [sorted, ...prev]);

    const newJokes = [...jokes];
    newJokes.splice(jokeIndex, 1);
    setJokes(newJokes);
  };

  const handleUndo = () => {
    if (sortedJokes.length === 0) return;
    const lastSorted = sortedJokes[0];

    const newSorted = sortedJokes.slice(1);
    setSortedJokes(newSorted);

    const { reaction, timeSpent, ...originalJoke } = lastSorted;
    setJokes(prev => [originalJoke, ...prev]);
  };

  const clearData = () => {
    setJokes([]);
    setSortedJokes([]);
    localStorage.removeItem(STORAGE_KEY);
    fetchJokes();
  };

  const displayedSortedJokes = filterLoved
    ? sortedJokes.filter(j => j.reaction === 'loved')
    : sortedJokes;

  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen">
      <main className="container min-h-[100vh]">
        <header className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <h1>Joke Sorter</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn btn-ghost"
              title="Toggle Theme"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={clearData}
              className="btn btn-ghost"
              title="Reset App"
            >
              Reset
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="main-layout">

          {/* Column 1: Joke List */}
          <div className="flex flex-col gap-4" style={{ minHeight: '200px' }}>
            <h2 className="text-xl font-bold mb-2">New Jokes</h2>
            {jokes.length > 0 ? (
              jokes.map((joke) => (
                <JokeCard
                  key={joke.id}
                  joke={joke}
                  onDragStart={handleDragStart}
                  onMobileDrop={handleJokeDrop}
                />
              ))
            ) : (
              <div className="card flex flex-col items-center justify-center" style={{ padding: '3rem', textAlign: 'center' }}>
                {loading ? (
                  <p>Loading jokes...</p>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <p>All caught up! 🎉</p>
                    <button className="btn btn-primary" onClick={fetchJokes}>
                      Fetch More Jokes
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-2">Sorter Zones</h2>
            <div className="zone-container" style={{ marginTop: 0 }}>
              <DropZone type="not-funny" onJokeDrop={(id, time) => handleJokeDrop(id, time, 'not-funny')} />
              <DropZone type="loved" onJokeDrop={(id, time) => handleJokeDrop(id, time, 'loved')} />
            </div>

            <div className="flex justify-between items-center mt-4 card p-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterLoved}
                    onChange={e => setFilterLoved(e.target.checked)}
                    style={{ accentColor: 'var(--color-primary)', width: '1.2rem', height: '1.2rem' }}
                  />
                  <span style={{ fontWeight: 500 }}>Show Loved Only</span>
                </label>
              </div>

              <button
                onClick={handleUndo}
                disabled={sortedJokes.length === 0}
                className="btn btn-ghost"
                style={{ opacity: sortedJokes.length === 0 ? 0.5 : 1 }}
              >
                ↩️ Undo Last
              </button>
            </div>

            {/* Summary */}
            <Summary jokes={displayedSortedJokes} />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
