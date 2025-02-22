import { useState, useRef, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'

export function useMovies ({ search, sortTitle, sortYear }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [, setError] = useState(null)
  const previousSearch = useRef(search)

  const getMovies = useCallback(async ({ search }) => {
    if (search === previousSearch.current) return
    try {
      setLoading(true)
      setError(null)
      previousSearch.current = search
      const newMovies = await searchMovies({ search })
      setMovies(newMovies)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const sortedMovies = useMemo(() => {
    if (!movies) return
    if (sortTitle) {
      return [...movies].sort((a, b) => a.title.localeCompare(b.title))
    }

    if (sortYear) {
      return [...movies].sort((a, b) => Number(a.year.split('–')[0]) - Number(b.year.split('–')[0]))
    }
    return movies
  }, [sortTitle, sortYear, movies])

  return { movies: sortedMovies, getMovies, loading }
}
