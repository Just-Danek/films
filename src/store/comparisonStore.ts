import { createStore, createEvent } from 'effector';
import type { Film } from '../types';

const getInitialComparison = () => {
    try {
        const stored = localStorage.getItem('comparison');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const toggleComparison = createEvent<Film>();
export const removeComparison = createEvent<string>();

export const $comparison = createStore<Film[]>(getInitialComparison())
    .on(toggleComparison, (state, film) => {
        if (state.find(f => f.id === film.id)) return state.filter(f => f.id !== film.id);
        
        let newState = [...state, film];
        if (newState.length > 2) newState.shift();
        
        return newState;
    })
    .on(removeComparison, (state, filmId) => state.filter(f => f.id !== filmId));

$comparison.watch((state) => {
    localStorage.setItem('comparison', JSON.stringify(state));
});