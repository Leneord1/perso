import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Game2048Page from '../pages/game2048/game2048.jsx'

const BEST_KEY = 'pw-2048-best'

/** Identity spawn so tests control the board. */
function noSpawn(board) {
  return board
}

describe('Game2048Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders heading, board, and scores', () => {
    render(<Game2048Page rng={() => 0} spawnFn={noSpawn} />)
    expect(screen.getByRole('heading', { level: 1, name: /play 2048/i })).toBeInTheDocument()
    expect(screen.getByRole('grid', { name: /2048 board/i })).toBeInTheDocument()
    expect(screen.getAllByRole('gridcell')).toHaveLength(16)
    expect(screen.getByText(/^score$/i)).toBeInTheDocument()
    expect(screen.getByText(/^best$/i)).toBeInTheDocument()
    expect(screen.getByText(/join tiles to reach 2048/i)).toBeInTheDocument()
  })

  it('merges tiles on ArrowLeft and updates score', async () => {
    const user = userEvent.setup()
    render(<Game2048Page rng={() => 0} spawnFn={noSpawn} />)
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByLabelText('4')).toBeInTheDocument()
    expect(screen.getAllByLabelText('empty')).toHaveLength(15)
    expect(screen.getByText(/^score$/i).parentElement).toHaveTextContent('4')
  })

  it('undoes the last move', async () => {
    const user = userEvent.setup()
    render(<Game2048Page rng={() => 0} spawnFn={noSpawn} />)
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByLabelText('4')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /undo/i }))
    expect(screen.getAllByLabelText('2')).toHaveLength(2)
    expect(screen.getByRole('button', { name: /undo/i })).toBeDisabled()
  })

  it('resets the board with New game', async () => {
    const user = userEvent.setup()
    render(<Game2048Page rng={() => 0} spawnFn={noSpawn} />)
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByLabelText('4')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /new game/i }))
    expect(screen.getAllByLabelText('2')).toHaveLength(2)
    expect(screen.getByText(/join tiles to reach 2048/i)).toBeInTheDocument()
  })

  it('reads best score from localStorage', () => {
    localStorage.setItem(BEST_KEY, '88')
    render(<Game2048Page rng={() => 0} spawnFn={noSpawn} />)
    expect(screen.getByText('88')).toBeInTheDocument()
  })

  it('merges overlay tiles after the slide, not immediately', async () => {
    const user = userEvent.setup()
    render(<Game2048Page rng={() => 0} spawnFn={noSpawn} />)
    const overlay = document.querySelector('.game2048-tiles')
    expect(overlay.querySelectorAll('.game2048-tile')).toHaveLength(2)
    await user.keyboard('{ArrowLeft}')
    expect(overlay.querySelectorAll('.game2048-tile')).toHaveLength(2)
    expect(overlay.textContent.replace(/\s/g, '')).toBe('22')
    await waitFor(() => {
      expect(overlay.querySelectorAll('.game2048-tile')).toHaveLength(1)
    })
    expect(overlay.textContent.replace(/\s/g, '')).toBe('4')
  })

  it('spawns the new overlay tile after the slide', async () => {
    const user = userEvent.setup()
    render(<Game2048Page rng={() => 0} />)
    const overlay = document.querySelector('.game2048-tiles')
    await user.keyboard('{ArrowLeft}')
    expect(overlay.querySelectorAll('.game2048-tile')).toHaveLength(2)
    expect(overlay.textContent.replace(/\s/g, '')).toBe('22')
    await waitFor(() => {
      expect(overlay.querySelector('.game2048-tile__inner--spawn')).toBeTruthy()
    })
    const values = [...overlay.querySelectorAll('.game2048-tile__inner')].map((el) => el.textContent)
    expect(values.sort()).toEqual(['2', '4'])
    expect(overlay.querySelector('.game2048-tile__inner--merge')).toBeTruthy()
  })
})
