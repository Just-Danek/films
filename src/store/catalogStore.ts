import { createStore, createEvent, createEffect } from 'effector';
import type { Film } from '../types';

export const setPage = createEvent<number>();
export const setCatalogSearch = createEvent<string>();
export const resetCatalog = createEvent();

export const fetchFilmsFx = createEffect<
    { page: number; searchString: string },
    { docs: Film[]; page: number; pages: number },
    Error
>(async ({ page, searchString }) => {
    const url = new URL('https://api.poiskkino.dev/v1.4/movie');
    url.searchParams.append('limit', '50');
    url.searchParams.append('page', page.toString());
    url.searchParams.append('sortField', 'votes.kp');
    url.searchParams.append('sortType', '-1');

    const params = new URLSearchParams(searchString);
    const year = params.get('year');
    const rating = params.get('rating');
    const genres = params.getAll('genre');

    if (year) url.searchParams.append('year', year);
    else url.searchParams.append('year', '1990-2026');
    if (rating) url.searchParams.append('rating.kp', rating);
    else url.searchParams.append('rating.kp', '1-10');
    
    genres.forEach(genre => {
        if (genre) url.searchParams.append('genres.name', genre);
    });

    const API_KEY = import.meta.env.VITE_API_KEY;
    if (!API_KEY) throw new Error('API_KEY is not defined');
    
    const response = await fetch(url.toString(), {
        headers: { 'X-API-KEY': API_KEY }
    });

    if (!response.ok) throw new Error('Ошибка при загрузке фильмов');
    return await response.json();
});

export const $catalogSearch = createStore<string>('')
    .on(setCatalogSearch, (_, search) => search);

export const $films = createStore<Film[]>([])
    .on(fetchFilmsFx.done, (state, { params, result }) => {
        if (params.page === 1) return result.docs;
        return [...state, ...result.docs];
    })
    .reset(resetCatalog);

export const $page = createStore<number>(1)
    .on(setPage, (_, page) => page)
    .reset(resetCatalog);

export const $hasMore = createStore<boolean>(true)
    .on(fetchFilmsFx.doneData, (_, result) => result.page < result.pages)
    .reset(resetCatalog);

export const $lastLoadedPage = createStore<number>(0)
    .on(fetchFilmsFx.done, (_, { params }) => params.page)
    .reset(resetCatalog);
