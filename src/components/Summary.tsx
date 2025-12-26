import React from 'react';
import type { SortedJoke } from '../types';

interface SummaryProps {
    jokes: SortedJoke[];
}

export const Summary: React.FC<SummaryProps> = ({ jokes }) => {
    if (jokes.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-sub)' }}>
                No jokes sorted yet. Start dragging!
            </div>
        )
    }

    return (
        <div className="card mt-4" style={{ marginTop: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Sorting Summary</h2>
            <div className="flex flex-col gap-2">
                {jokes.map((j) => (
                    <div key={j.id} className="flex justify-between items-center" style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                            <p style={{ fontWeight: 500 }}>{j.joke.substring(0, 50)}{j.joke.length > 50 ? '...' : ''}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--color-text-sub)' }}>
                            <span style={{
                                color: j.reaction === 'loved' ? 'var(--color-loved)' : 'var(--color-not-funny)',
                                fontWeight: 600
                            }}>
                                {j.reaction === 'loved' ? 'Loved' : 'Not Funny'}
                            </span>
                            <span>
                                {j.timeSpent}s
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
