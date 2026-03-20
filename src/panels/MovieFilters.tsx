import { useState } from 'react';
import { FormLayoutGroup, FormItem, Slider, Button, ChipsSelect, Group } from '@vkontakte/vkui';
import { useSearchParams } from 'react-router-dom';

const genresList = [
    { value: 'комедия', label: 'Комедия' },
    { value: 'драма', label: 'Драма' },
    { value: 'криминал', label: 'Криминал' },
    { value: 'мелодрама', label: 'Мелодрама' },
    { value: 'фантастика', label: 'Фантастика' },
    { value: 'триллер', label: 'Триллер' },
    { value: 'боевик', label: 'Боевик' },
    { value: 'мультфильм', label: 'Мультфильм' },
    { value: 'детектив', label: 'Детектив' },
    { value: 'приключения', label: 'Приключения' }
];

export const MovieFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentYear = searchParams.get('year') 
        ? searchParams.get('year')!.split('-').map(Number).filter(n => !isNaN(n)) 
        : [1990, new Date().getFullYear()];
        
    const currentRating = searchParams.get('rating') 
        ? searchParams.get('rating')!.split('-').map(Number).filter(n => !isNaN(n)) 
        : [0, 10];
    const currentGenres = searchParams.getAll('genre');

    const [yearRange, setYearRange] = useState<[number, number]>([currentYear![0], currentYear![1]]);
    const [ratingRange, setRatingRange] = useState<[number, number]>([currentRating![0], currentRating![1]]);
    
    const [selectedGenres, setSelectedGenres] = useState<{ value: string; label: string }[]>(
        currentGenres.map(g => genresList.find(i => i.value === g) || { value: g, label: g })
    );

    const applyFilters = () => {
        const params = new URLSearchParams();
        
        if (Array.isArray(yearRange) && yearRange.length === 2 && !isNaN(yearRange[0])) {
            params.set('year', `${yearRange[0]}-${yearRange[1]}`);
        }
        
        if (Array.isArray(ratingRange) && ratingRange.length === 2 && !isNaN(ratingRange[0])) {
            params.set('rating', `${ratingRange[0]}-${ratingRange[1]}`);
        }
        
        selectedGenres.forEach((g) => {
            const val = typeof g === 'object' && g !== null ? g.value : g;
            if (val) params.append('genre', val);
        });

        setSearchParams(params);
    };

    const resetFilters = () => {
        setYearRange([1990, new Date().getFullYear()]);
        setRatingRange([0, 10]);
        setSelectedGenres([]);
        setSearchParams(new URLSearchParams());
    };

    return (
        <Group>
            <FormLayoutGroup>
                <FormItem top={`Год выпуска: от ${Array.isArray(yearRange) ? yearRange[0] : yearRange} до ${Array.isArray(yearRange) ? yearRange[1] : yearRange}`}>
                    <Slider 
                        multiple
                        min={1990} 
                        max={new Date().getFullYear()} 
                        step={1} 
                        value={yearRange} 
                        onChange={(val: [number, number]) => setYearRange(val)} 
                    />
                </FormItem>
                
                <FormItem top={`Рейтинг (Кинопоиск): от ${Array.isArray(ratingRange) ? ratingRange[0] : ratingRange} до ${Array.isArray(ratingRange) ? ratingRange[1] : ratingRange}`}>
                    <Slider 
                        multiple
                        min={0} 
                        max={10} 
                        step={1} 
                        value={ratingRange} 
                        onChange={(val: [number, number]) => setRatingRange(val)} 
                    />
                </FormItem>

                <FormItem top="Жанры">
                    <ChipsSelect
                        value={selectedGenres}
                        onChange={setSelectedGenres}
                        options={genresList}
                        placeholder="Выберите жанры"
                        emptyText="Ничего не найдено"
                    />
                </FormItem>

                <FormItem>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button size="l" stretched onClick={applyFilters}>
                            Применить фильтры
                        </Button>
                        <Button size="l" stretched mode="secondary" onClick={resetFilters}>
                            Сбросить
                        </Button>
                    </div>
                </FormItem>
            </FormLayoutGroup>
        </Group>
    );
};