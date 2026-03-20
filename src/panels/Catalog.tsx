import { useState, useEffect, useRef } from 'react';
import { Panel, PanelHeader, Group, SimpleCell, Avatar, Spinner, IconButton, Box, Button } from '@vkontakte/vkui';
import { Icon24FavoriteOutline, Icon24Favorite } from '@vkontakte/icons';
import { Scale } from 'lucide-react';
import { useUnit } from 'effector-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { $favorites, openModal, removeFavorite } from '../store/favoritesStore';
import { $comparison, toggleComparison } from '../store/comparisonStore';
import { 
    $films, $page, $hasMore, $lastLoadedPage, $catalogSearch,
    setPage, resetCatalog, fetchFilmsFx, setCatalogSearch 
} from '../store/catalogStore';
import { MovieFilters } from './MovieFilters';
import type { CatalogProps, Film } from '../types';
import { formatGenres } from '../store/movieStore';

export const Catalog = ({ id }: CatalogProps) => {
    const favorites = useUnit($favorites);
    const comparison = useUnit($comparison);
    
    const { films, page, hasMore, lastLoadedPage, isLoading, catalogSearchStore } = useUnit({
        films: $films,
        page: $page,
        hasMore: $hasMore,
        lastLoadedPage: $lastLoadedPage,
        isLoading: fetchFilmsFx.pending,
        catalogSearchStore: $catalogSearch
    });

    const [filtersVisible, setFiltersVisible] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const searchString = searchParams.toString();
    useEffect(() => {
        if (searchString !== catalogSearchStore) {
            setCatalogSearch(searchString);
            resetCatalog();
        }
    }, [searchString, catalogSearchStore]);

    useEffect(() => {
        if (page > lastLoadedPage && !isLoading) {
            fetchFilmsFx({ page, searchString: catalogSearchStore });
        }
    }, [page, lastLoadedPage, catalogSearchStore, isLoading]);

    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0,
        rootMargin: '200px'
    });

    const isLoadingRef = useRef(false);
    useEffect(() => {
        isLoadingRef.current = isLoading;
    }, [isLoading]);

    useEffect(() => {
        if (inView && hasMore && !isLoadingRef.current && page === lastLoadedPage && films.length > 0) {
            setPage(page + 1);
        }
    }, [inView, hasMore, page, lastLoadedPage, films.length]);

    return (
        <Panel id={id}>
            <PanelHeader>Каталог фильмов</PanelHeader>

            <Group>
                <Box>
                    <Button 
                        size="m" 
                        mode="secondary" 
                        onClick={() => setFiltersVisible(!filtersVisible)}
                        stretched
                    >
                        {filtersVisible ? 'Скрыть фильтры' : 'Показать фильтры'}
                    </Button>
                </Box>
                {filtersVisible && <MovieFilters />}
            </Group>

            <Group>
                {films.map((film, index) => {
                    const isFav = favorites.some((f: Film) => f.id === film.id);
                    
                    return (
                        <div key={`${film.id}-${index}`}>
                            <SimpleCell
                                onClick={() => navigate(`/movie/${film.id}`)}
                                before={<Avatar size={48} src={film.poster?.previewUrl || film.poster?.url} />}
                                subtitle={`${film?.year || 'Год не указан'}, ${formatGenres(film.genres)}`}
                                extraSubtitle={
                                <span>
                                    {`KP: ${film.rating?.kp || 'N/A'}, IMDB: ${film.rating?.imdb || 'N/A'}`}
                                </span>}
                                after={
                                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                        <IconButton 
                                            aria-label='Сравнить'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleComparison(film);
                                            }}
                                            style={{
                                                color: comparison.some((c: Film) => c.id === film.id) ? 'var(--vkui--color_icon_accent)' : 'black' 
                                            }}
                                        >
                                            <Scale size={24} />
                                        </IconButton>
                                        <IconButton 
                                            aria-label='Добавить в избранное'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isFav) removeFavorite(film.id);
                                                else openModal({ modalId: 'confirm-add', film });
                                            }}
                                        >
                                            {isFav ? <Icon24Favorite fill="var(--vkui--color_icon_negative)" /> : <Icon24FavoriteOutline />}
                                        </IconButton>
                                    </div>
                                }
                            >
                                {film.name || film.alternativeName || 'Без названия'}
                            </SimpleCell>
                        </div>
                    );
                })}
                
                {(hasMore || isLoading) && <div ref={loadMoreRef} style={{ height: 1 }} />}
            </Group>
            
            {isLoading && (
                <div style={{ color: 'var(--vkui--color_background_accent)' }}>
                    <Spinner size="l" noColor />
                </div>
            )}
        </Panel>
    );
}