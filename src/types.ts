export interface Film {
    id: string;
    name: string;
    alternativeName?: string;
    year?: number;
    genres?: { name: string }[];
    rating?: {
        kp?: number;
        imdb?: number;
    };
    movieLength?: number;
    description?: string;
    poster?: {
        url: string;
        previewUrl?: string;
    };
    premiere?: {
        russia?: string;
        world?: string;
    };
}


export interface CatalogProps {
    id: string;
}

export interface TogglersProps {
    id: string;
    goCatalog: () => void;
}

export interface MovieDetailProps {
    id: string;
    goBack: () => void;
    movieId: string | null;
}