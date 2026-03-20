import { Panel, PanelHeader, Placeholder, Button, Group, Box, IconButton } from '@vkontakte/vkui';
import { Icon28DeleteOutline } from '@vkontakte/icons';
import { Scale } from 'lucide-react';
import { useUnit } from 'effector-react';
import { $comparison, removeComparison } from '../store/comparisonStore';
import './Comparison.css';
import type { Film, TogglersProps } from '../types';

export const Comparison = ({ id, goCatalog }: TogglersProps) => {
    const comparison = useUnit($comparison);
    
    const hasComparisonItems = comparison.length > 0;

    return (
        <Panel id={id}>
            <PanelHeader>Сравнение</PanelHeader>
            {hasComparisonItems ? (
                <Group>
                    <Box>
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Характеристика</th>
                                    {comparison.map((film: Film) => (
                                        <th key={`header-${film.id}`}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                                <span>{film.name || film.alternativeName || 'Без названия'}</span>
                                                <IconButton 
                                                    aria-label="Удалить из сравнения" 
                                                    onClick={() => removeComparison(film.id)}
                                                >
                                                    <Icon28DeleteOutline width={20} height={20} />
                                                </IconButton>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="row-title">Год выпуска</td>
                                    {comparison.map((film: Film) => (
                                        <td key={`year-${film.id}`}>{film.year || '-'}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-title">Рейтинг (КП)</td>
                                    {comparison.map((film: Film) => (
                                        <td key={`kp-${film.id}`}>{film.rating?.kp || '-'}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-title">Жанры</td>
                                    {comparison.map((film: Film) => (
                                        <td key={`genre-${film.id}`}>{film.genres?.map((g) => g.name).join(', ') || '-'}</td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="row-title">Длительность</td>
                                    {comparison.map((film: Film) => (
                                        <td key={`length-${film.id}`}>
                                            {film.movieLength ? `${film.movieLength} мин.` : '-'}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </Box>
                    
                    {comparison.length < 2 && (
                        <Placeholder>
                            Добавьте еще один фильм для сравнения
                        </Placeholder>
                    )}
                </Group>
            ) : (
                <Placeholder
                    icon={<Scale size={56} style={{ color: 'var(--vkui--color_icon_tertiary)' }} />}
                    title="Нечего сравнивать"
                    action={<Button size="m" onClick={goCatalog}>Перейти в каталог</Button>}
                    stretched
                >
                    Добавьте фильмы для сравнения, чтобы увидеть их различия.
                </Placeholder>
            )}
        </Panel>
    );
};