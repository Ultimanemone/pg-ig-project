import { useState, useEffect, useCallback } from 'react'
import UserLayout from '../../components/UserLayout.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const API_BASE = '/api'

function dedupeBooks(books) {
  const map = new Map()
  books.forEach(b => {
    const key = b.res_id ?? `${b.title}-${b.author}`
    if (!map.has(key)) map.set(key, b)
  })
  return Array.from(map.values())
}

export default function SearchBooks() {
  const { user, getAuthHeader } = useAuth()
  const [allBooks, setAllBooks] = useState([])
  const [borrowRows, setBorrowRows] = useState([])
  const [categories, setCategories] = useState([])
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [activeBorrowedIds, setActiveBorrowedIds] = useState(new Set())
  const [recommendationHint, setRecommendationHint] = useState('')
  const [recommendationScores, setRecommendationScores] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [bookRes, borrowRes] = await Promise.all([
          fetch(`${API_BASE}/`, { headers: getAuthHeader() }),
          fetch(`${API_BASE}/log/borrow?user_id=${user.userId}`, { headers: getAuthHeader() })
        ])
        const bookData = await bookRes.json()
        const borrowData = await borrowRes.json()

        const books = dedupeBooks(bookData.data || [])
        const borrows = borrowData.data || []

        setAllBooks(books)
        setBorrowRows(borrows)
        setActiveBorrowedIds(new Set(
          borrows.filter(r => r.status === 'Borrowed').map(r => Number(r.res_id))
        ))

        const cats = [...new Set(books.map(b => b.category).filter(Boolean))]
        setCategories(cats)

        // Build recommendation scores
        const byId = new Map(books.map(b => [b.res_id, b]))
        const categoryCounts = {}
        borrows.forEach(r => {
          const cat = byId.get(r.res_id)?.category
          if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
        })
        const catKeys = Object.keys(categoryCounts)
        if (!catKeys.length) {
          setRecommendationHint('No borrowing history yet. Borrow a few books to get personalized recommendations.')
        } else {
          const maxCount = Math.max(...Object.values(categoryCounts))
          const topCats = catKeys.filter(c => categoryCounts[c] === maxCount)
          const total = Object.values(categoryCounts).reduce((s, c) => s + c, 0)
          const scores = {}
          books.forEach(b => {
            const count = categoryCounts[b.category] || 0
            scores[b.res_id] = { score: count, weight: total ? count / total : 0 }
          })
          setRecommendationScores(scores)
          setRecommendationHint(`Top categor${topCats.length > 1 ? 'ies' : 'y'}: ${topCats.join(', ')}. Recommended books are pushed to the top.`)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredBooks = useCallback(() => {
    let books = allBooks
    if (searchText) {
      const q = searchText.toLowerCase()
      books = books.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.author?.toLowerCase().includes(q)
      )
    }
    if (selectedCategory) {
      books = books.filter(b => b.category === selectedCategory)
    }
    // Sort by recommendation score descending
    return [...books].sort((a, b) => {
      const sa = recommendationScores[a.res_id]?.score || 0
      const sb = recommendationScores[b.res_id]?.score || 0
      return sb - sa
    }).map(b => ({ ...b, _score: recommendationScores[b.res_id]?.score || 0, _weight: recommendationScores[b.res_id]?.weight || 0 }))
  }, [allBooks, searchText, selectedCategory, recommendationScores])

  const handleBorrow = async (resId) => {
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/borrow`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ user_id: user.userId, res_id: resId })
      })
      const data = await res.json()
      if (!res.ok) { setMessage(data.message || 'Failed to borrow'); return }

      setMessage('Book borrowed successfully!')
      setAllBooks(prev => prev.map(b => b.res_id === resId ? { ...b, availability: 'Unavailable' } : b))
      setActiveBorrowedIds(prev => new Set([...prev, resId]))

      // Update preference
      const book = allBooks.find(b => b.res_id === resId)
      if (book?.category) {
        await fetch(`${API_BASE}/preferences`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ user_id: user.userId, category: book.category, countChange: 1, lastread: new Date().toISOString() })
        })
      }
    } catch {
      setMessage('Network error')
    }
  }

  const books = filteredBooks()

  return (
    <UserLayout title="Search Books" subtitle={user?.nickname || 'User'}>
      <div className="search-panel">
        <input
          type="text"
          placeholder="Search by title, author, or keyword"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {recommendationHint && <p style={{ marginBottom: 16, color: '#64748b', fontSize: '0.9rem' }}>{recommendationHint}</p>}
      {message && <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>{message}</div>}

      {loading ? <p>Loading books...</p> : (
        <div className="book-list">
          {books.length === 0 ? <p>No books found.</p> : books.map(book => (
            <div className="book-card" key={book.res_id}>
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Category:</strong> {book.category || 'Uncategorized'}</p>
              <p><strong>Status:</strong> {book.availability}</p>
              {book._score > 0 && <p><strong>Recommended:</strong> {Math.round(book._weight * 100)}% match</p>}
              <div className="book-actions">
                {activeBorrowedIds.has(Number(book.res_id)) && (
                  <button className="btn btn-secondary" disabled>Open</button>
                )}
                {!activeBorrowedIds.has(Number(book.res_id)) && book.availability === 'Available' && (
                  <button className="btn btn-primary" onClick={() => handleBorrow(book.res_id)}>Borrow</button>
                )}
                {!activeBorrowedIds.has(Number(book.res_id)) && book.availability !== 'Available' && (
                  <button className="btn btn-secondary" disabled>Unavailable</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </UserLayout>
  )
}
