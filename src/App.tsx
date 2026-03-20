import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import { Catalog } from './panels/Catalog';
import { Favorites } from './panels/Favorites';
import { Comparison } from './panels/Comparison';
import { MovieDetail } from './panels/MovieDetail';
import { useUnit } from 'effector-react';
import { $catalogSearch } from './store/catalogStore';

const MovieDetailWrapper = () => {
  const navigate = useNavigate();
  const { movieId } = useParams<{ movieId: string }>(); 
  
  return <MovieDetail id="main-panel" goBack={() => navigate(-1)} movieId={movieId || null} />; 
};

export default function App() {
  const navigate = useNavigate();
  const catalogSearch = useUnit($catalogSearch);
  const goCatalog = () => navigate('/catalog' + catalogSearch);

  return (
    <Routes>
      <Route path="/" element={<Layout goCatalog={goCatalog} />}>
          <Route index element={<Navigate to="/catalog" replace />} />

          <Route path="catalog" element={<Catalog id="main-panel" />} />
          <Route path="movie/:movieId" element={<MovieDetailWrapper />} />
          <Route path="favorites" element={<Favorites id="main-panel" goCatalog={goCatalog}/>} />
          <Route path="comparison" element={<Comparison id="main-panel" goCatalog={goCatalog}/>} />
      </Route>
    </Routes>
  );
}