const COLORS = ['#22d3ee', '#a78bfa', '#22c55e', '#ef4444', '#f59e0b', '#ec4899']

export const GAMES = [
  { id: 1, title: 'Neon Runner', category: 'action', featured: true },
  { id: 2, title: 'Crystal Puzzle', category: 'puzzle', featured: true },
  { id: 3, title: 'Sky Archer', category: 'adventure', featured: true },
  { id: 4, title: 'Velocity Drift', category: 'racing', featured: true },
  { id: 5, title: 'Word Quest', category: 'puzzle', featured: false },
  { id: 6, title: 'Bubble Pop', category: 'classic', featured: false },
  { id: 7, title: 'Goal Strike', category: 'sports', featured: false },
  { id: 8, title: 'Shadow Blade', category: 'action', featured: false }
]

export function placeholderThumb (id, title) {
  const color = COLORS[id % COLORS.length]
  const escaped = title.replace(/'/g, '%27')
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120'%3E%3Crect width='200' height='120' fill='%230f172a'/%3E%3Crect width='180' height='100' x='10' y='10' fill='${color}' opacity='0.15'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2364748b' font-size='14' font-family='sans-serif'%3E${escaped}%3C/text%3E%3C/svg%3E`
}

export function filterGames (games, term) {
  const q = String(term).toLowerCase().trim()
  if (!q) return games
  return games.filter((g) => g.title.toLowerCase().includes(q))
}

export function renderGamesHtml (games) {
  return games.map((game) => {
    const src = placeholderThumb(game.id, game.title)
    return `
      <article class="game-card" data-id="${game.id}">
        <div class="game-thumb">
          <img src="${src}" alt="${game.title}" loading="lazy">
          <div class="game-play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
        </div>
        <div class="game-info">
          <div class="game-title">${game.title}</div>
        </div>
      </article>
    `
  }).join('')
}

// Browser-only DOM wiring
if (typeof document !== 'undefined') {
  function renderGames (containerId, games) {
    const container = document.getElementById(containerId)
    if (!container) return
    container.innerHTML = renderGamesHtml(games)
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderGames('games-grid', GAMES.filter((g) => g.featured))
    renderGames('new-games-grid', GAMES.filter((g) => !g.featured))

    const form = document.querySelector('.search form')
    const input = form.querySelector('input')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const results = filterGames(GAMES, input.value)
      renderGames('games-grid', results)
      const header = document.querySelector('.featured .section-header h2')
      if (header) header.textContent = results.length ? `Results for "${input.value}"` : 'No games found'
    })
  })
}
