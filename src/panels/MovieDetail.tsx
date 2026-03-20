import { useEffect } from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Group, Box, Title, Text, Spinner } from '@vkontakte/vkui';
import type { MovieDetailProps } from '../types';
import { useUnit } from 'effector-react';
import { $currentMovie, fetchMovieFx, formatGenres, formatPremiereDate } from '../store/movieStore';

export const MovieDetail = ({ id, goBack, movieId }: MovieDetailProps) => {
    const film = useUnit($currentMovie);
    const isLoading = useUnit(fetchMovieFx.pending);

    useEffect(() => {
        if (movieId) fetchMovieFx(movieId);
    }, [movieId]);

    return (
        <Panel id={id}>
            <PanelHeader before={<PanelHeaderBack onClick={goBack} />}>
                Описание
            </PanelHeader>

            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                    <Spinner size="l" />
                </div>
            ) : film ? (
                <Group>
                    <Box style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 12 }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                            {film.poster?.url && (
                                <img 
                                    src={film.poster.url} 
                                    alt={film.name} 
                                    style={{ width: 140, borderRadius: 12, objectFit: 'cover' }} 
                                />
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <Title level="2">{film.name || film.alternativeName}</Title>
                                <Text weight="3">Год: <strong>{film.year}</strong></Text>
                                {(film.premiere?.russia || film.premiere?.world) && (
                                    <Text weight="3">Дата выхода: <strong>{formatPremiereDate(film.premiere?.russia || film.premiere?.world)}</strong></Text>
                                )}
                                <Text weight="3">
                                    Жанр: {formatGenres(film.genres)}
                                </Text>
                                <Text weight="3">
                                    Рейтинг: KP <strong>{film.rating?.kp || 'N/A'}</strong> / IMDB <strong>{film.rating?.imdb || 'N/A'}</strong>
                                </Text>
                                {film.movieLength && (
                                    <Text weight="3">Продолжительность: <strong>{film.movieLength}</strong> мин.</Text>
                                )}
                            </div>
                        </div>
                        {film.description && (
                            <Box style={{ padding: 10, backgroundColor: 'var(--vkui--color_background_secondary)', borderRadius: 8 }}>
                                <Title level="3" style={{ marginBottom: 8 }}>О фильме</Title>
                                <Text weight="3">{film.description}</Text>
                            </Box>
                        )}
                    </Box>
                </Group>
            ) : null}
        </Panel>
    );
};