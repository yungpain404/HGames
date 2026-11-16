import test from 'node:test';
import assert from 'node:assert/strict';
import { GAMES, filterGames, renderGamesHtml, placeholderThumb } from '../js/main.js';

test('GAMES is a non-empty array of shaped entries', () => {
  assert.ok(Array.isArray(GAMES));
  assert.ok(GAMES.length > 0);
  for (const g of GAMES) {
    assert.ok(Number.isInteger(g.id));
    assert.ok(typeof g.title === 'string' && g.title.length > 0);
    assert.ok(typeof g.category === 'string');
  }
});

test('filterGames returns all games for empty term', () => {
  assert.deepStrictEqual(filterGames(GAMES, ''), GAMES);
  assert.deepStrictEqual(filterGames(GAMES, '   '), GAMES);
});

test('filterGames matches case-insensitively', () => {
  const results = filterGames(GAMES, 'runner');
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].title, 'Neon Runner');

  const upper = filterGames(GAMES, 'RUNNER');
  assert.strictEqual(upper.length, 1);
});

test('filterGames returns empty for no match', () => {
  assert.deepStrictEqual(filterGames(GAMES, 'zzznomatch'), []);
});

test('renderGamesHtml produces one article per game', () => {
  const html = renderGamesHtml(GAMES.slice(0, 2));
  assert.strictEqual(html.match(/game-card/g).length, 2);
  assert.ok(html.includes('Neon Runner'));
  assert.ok(html.includes('Crystal Puzzle'));
});

test('placeholderThumb returns a data url', () => {
  const src = placeholderThumb(1, 'Neon Runner');
  assert.ok(src.startsWith('data:image/svg+xml'));
});
