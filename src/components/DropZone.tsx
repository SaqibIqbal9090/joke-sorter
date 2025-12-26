import React, { useState } from 'react';
import type { Reaction } from '../types';

interface DropZoneProps {
    type: Reaction;
    onJokeDrop: (jokeId: string, timeSpent: number) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ type, onJokeDrop }) => {
    const [isActive, setIsActive] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsActive(true);
    };

    const handleDragLeave = () => {
        setIsActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsActive(false);

        const jokeId = e.dataTransfer.getData('jokeId');
        const timeSpent = parseInt(e.dataTransfer.getData('timeSpent'), 10);

        if (jokeId) {
            onJokeDrop(jokeId, isNaN(timeSpent) ? 0 : timeSpent);
        }
    };

    const isLoved = type === 'loved';
    const label = isLoved ? 'Loved It! 😍' : 'Not Funny 😒';
    const className = `drop-zone ${type} ${isActive ? 'active' : ''}`;

    return (
        <div
            className={className}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-zone-type={type}
        >
            <span style={{ fontSize: '1.5rem', fontWeight: 600, color: isLoved ? 'var(--color-loved)' : 'var(--color-not-funny)' }}>
                {label}
            </span>
        </div>
    );
};
