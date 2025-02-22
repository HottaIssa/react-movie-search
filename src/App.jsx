import { useCallback, useState } from 'react'
import './App.css'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import { useSearch } from './hooks/useSearch'
import debounce from 'just-debounce-it'

function App () {
  const [sortTitle, setSortTitle] = useState(false)
  const [sortYear, setSortYear] = useState(false)

  const { search, setSearch, error } = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sortTitle, sortYear })

  const debounceGetMovies = useCallback(
    debounce(search => {
      getMovies({ search })
    }, 500)
    , [getMovies])

  const handleSubmit = (e) => {
    e.preventDefault()
    getMovies({ search })
  }

  const handleChange = (e) => {
    const newSearch = e.target.value
    setSearch(newSearch)
    debounceGetMovies(newSearch)
  }

  const handleSort = (e) => {
    if (e.target.value === 'title') {
      console.log('gola')
      setSortTitle(!sortTitle)
      setSortYear(false)
    }

    if (e.target.value === 'year') {
      setSortYear(!sortYear)
      setSortTitle(false)
    }
  }

  return (
    <div className='page'>
      <header>
        <h1>Buscador de peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input onChange={handleChange} value={search} name='query' placeholder='Avengers, Star Wars, The Matrix ...' />
          <button type='submit'>Buscar</button>
          <button onClick={handleSort} value='title'>Sort by Title</button>
          <button onClick={handleSort} value='year'>Sort by Year</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {loading ? <p>Loading...</p> : <Movies movies={movies} />}
      </main>
    </div>
  )
}

export default App
