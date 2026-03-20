import { createStore, createEffect } from 'effector';
import type { Film } from '../types';

export const fetchMovieFx = createEffect<string, Film, Error>(async (movieId) => {
    const API_KEY = import.meta.env.VITE_API_KEY;
    if (!API_KEY) throw new Error('API_KEY is not defined');

    const response = await fetch(`https://api.poiskkino.dev/v1.4/movie/${movieId}`, {
        headers: {
            'X-API-KEY': API_KEY
        }
    });

    if (!response.ok) throw new Error('Failed to fetch movie');

    return await response.json();
});

export const $currentMovie = createStore<Film | null>(null)
    .on(fetchMovieFx.doneData, (_, film) => film)
    .reset(fetchMovieFx); 

export const formatGenres = (genres: { name: string }[] | undefined) => {
    if (!genres || genres.length === 0) return 'Жанр не указан';
    return genres.map(g => g.name).join(', ');    
}

export const formatPremiereDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Дата не указана';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
}