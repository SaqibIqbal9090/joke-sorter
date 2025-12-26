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

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };

            card.style.transition = 'none';
            card.style.zIndex = '1000';
            card.classList.add('dragging');
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.cancelable) e.preventDefault();

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartRef.current.x;
            const deltaY = touch.clientY - touchStartRef.current.y;

            currentTranslateRef.current = { x: deltaX, y: deltaY }; 

            card.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(2deg) scale(0.95)`;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            card.classList.remove('dragging');
            card.style.zIndex = '';
            card.style.transform = '';
            card.style.transition = '';

            const touch = e.changedTouches[0];

            // Hide card momentarily to find what's underneath
            card.style.visibility = 'hidden';
            const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            card.style.visibility = 'visible';

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

        // Attach non-passive listeners
        card.addEventListener('touchstart', handleTouchStart, { passive: false });
        card.addEventListener('touchmove', handleTouchMove, { passive: false });
        card.addEventListener('touchend', handleTouchEnd);

        return () => {
            card.removeEventListener('touchstart', handleTouchStart);
            card.removeEventListener('touchmove', handleTouchMove);
            card.removeEventListener('touchend', handleTouchEnd);
        };
    }, [joke.id, onMobileDrop, mountTimeRef]); // Re-attach if props change

    return (
        <div
            ref={cardRef}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            // Touch listeners are now handled in useEffect
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
