import React, { useState, useEffect, useRef } from 'react';
import type { Joke, Reaction } from '../types';

interface JokeCardProps {
    joke: Joke;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string, timeSpent: number) => void;
    onMobileDrop?: (id: string, timeSpent: number, reaction: Reaction) => void;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke, onDragStart, onMobileDrop }) => {
    const [seconds, setSeconds] = useState(0);
    const mountTimeRef = useRef(Date.now());

    // Mobile Touch Refs
    const touchStartRef = useRef({ x: 0, y: 0 });
    const currentTranslateRef = useRef({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(Math.floor((Date.now() - mountTimeRef.current) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        const timeSpent = Math.floor((Date.now() - mountTimeRef.current) / 1000);
        e.dataTransfer.setData('jokeId', joke.id);
        e.dataTransfer.setData('timeSpent', timeSpent.toString());
        e.dataTransfer.effectAllowed = 'move';

        e.currentTarget.classList.add('dragging');

        onDragStart(e, joke.id, timeSpent);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('dragging');
    };

    // --- Touch Logic for Mobile ---
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };

        // Add visual feedback
        if (cardRef.current) {
            cardRef.current.style.transition = 'none'; // Disable transition for direct 1:1 movement
            cardRef.current.style.zIndex = '1000';
            cardRef.current.classList.add('dragging');
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartRef.current.x;
        const deltaY = touch.clientY - touchStartRef.current.y;

        currentTranslateRef.current = { x: deltaX, y: deltaY };

        if (cardRef.current) {
            cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(2deg) scale(0.95)`;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    
        if (cardRef.current) {
            cardRef.current.classList.remove('dragging');
            cardRef.current.style.zIndex = '';
            cardRef.current.style.transform = '';
            cardRef.current.style.transition = ''; // Restore CSS transition
        }

        const touch = e.changedTouches[0];

        if (cardRef.current) cardRef.current.style.visibility = 'hidden';

        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);

        if (cardRef.current) cardRef.current.style.visibility = 'visible';

        if (!elemBelow) return;

        const dropZone = elemBelow.closest('[data-zone-type]');
        if (dropZone && onMobileDrop) {
            const reaction = dropZone.getAttribute('data-zone-type') as Reaction;
            const timeSpent = Math.floor((Date.now() - mountTimeRef.current) / 1000);
            if (reaction) {
                onMobileDrop(joke.id, timeSpent, reaction);
            }
        }
    };

    return (
        <div
            ref={cardRef}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="card joke-card-draggable animate-fade-in"
            style={{ marginBottom: '1rem', cursor: 'grab' }}
        >
            <div className="flex flex-col gap-4">
                <p style={{ fontSize: '1.125rem', fontWeight: 500, lineHeight: 1.6 }}>
                    {joke.joke}
                </p>
                <div className="flex justify-between items-center" style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)' }}>
                    <span>⏱️ {seconds}s on screen</span>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--color-bg)', borderRadius: '1rem' }}>
                        Drag to sort
                    </span>
                </div>
            </div>
        </div>
    );
};
