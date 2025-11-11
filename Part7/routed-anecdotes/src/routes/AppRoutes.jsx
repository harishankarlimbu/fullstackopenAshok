import { Routes, Route } from 'react-router-dom';
import AnecdoteList from '../AnecdoteList';
import CreateNew from '../CreateNew';
import About from '../About';
import Anecdote from '../Anecdotes';

const AppRoutes = ({ anecdotes, addNew }) => {
  return (
    <Routes>
      <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
      <Route path="/create" element={<CreateNew addNew={addNew} />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/anecdotes/:id"
        element={<Anecdote anecdotes={anecdotes} />}
      />
    </Routes>
  );
};

export default AppRoutes;
