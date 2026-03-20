import { createStore, createEvent } from 'effector';
import type { Film } from '../types';

const getInitialFavorites = () => {
    try {
        const stored = localStorage.getItem('favorites');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const addFavorite = createEvent<Film>();
export const removeFavorite = createEvent<string>();

export const $favorites = createStore<Film[]>(getInitialFavorites())
    .on(addFavorite, (state, film) => {
        if (state.find(f => f.id === film.id)) return state;
        return [...state, film];
    })
    .on(removeFavorite, (state, filmId) => state.filter(f => f.id !== filmId));

$favorites.watch((state) => {
    localStorage.setItem('favorites', JSON.stringify(state));
});

export const openModal = createEvent<{ modalId: string, film: Film }>();
export const closeModal = createEvent();

export const $modalState = createStore<{ modalId: string | null, film: Film | null }>({ modalId: null, film: null })
    .on(openModal, (_, payload) => payload)
    .on(closeModal, () => ({ modalId: null, film: null }));