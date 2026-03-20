import { Panel, PanelHeader, Placeholder, Button, Group, SimpleCell, Avatar, IconButton } from '@vkontakte/vkui';
import { Icon56FavoriteOutline, Icon24Favorite } from '@vkontakte/icons';
import { useUnit } from 'effector-react';
import { useNavigate } from 'react-router-dom';
import { $favorites, removeFavorite } from '../store/favoritesStore';
import type { Film, TogglersProps } from '../types';

export const Favorites = ({ id, goCatalog }: TogglersProps) => {
    const favorites = useUnit($favorites);
    const navigate = useNavigate();
    
    const hasFavorites = favorites.length > 0;

    return (
        <Panel id={id}>
            <PanelHeader>Избранное</PanelHeader>
            {hasFavorites ? (
                <Group>
                    {favorites.map((film: Film) => (
                        <SimpleCell
                            key={`fav-${film.id}`}
                            onClick={() => navigate(`/movie/${film.id}`)}
                            before={<Avatar size={48} src={film.poster?.previewUrl || film.poster?.url} />}
                            subtitle={`${film?.year || 'Год не указан'}, ${film.genres?.map((g) => g.name).join(', ')}`}
                            extraSubtitle={
                                <span>{`KP: ${film.rating?.kp ? `${film.rating.kp}` : 'N/A'}`}</span>
                            }
                            after={
                                <IconButton 
                                    aria-label='Убрать из избранного'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFavorite(film.id);
                                    }}
                                >
                                    <Icon24Favorite fill="var(--vkui--color_icon_negative)" />
                                </IconButton>
                            }
                        >
                            {film.name || film.alternativeName || 'Без названия'}
                        </SimpleCell>
                    ))}
                </Group>
            ) : (
                <Placeholder
                    icon={<Icon56FavoriteOutline />}
                    title="Тут пока пусто"
                    action={<Button size="m" onClick={goCatalog}>Перейти в каталог</Button>}
                    stretched
                >
                    Вы не добавили в избранное ни одного фильма.
                </Placeholder>
            )}
        </Panel>
    );
};