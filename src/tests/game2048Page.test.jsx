import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
