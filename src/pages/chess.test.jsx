import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChessPage from './chess'

vi.mock('./chessBot.js', () => ({
  getChessBotMove: vi.fn(async () => null),
}))

describe('ChessPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders heading, board, and default vs Player mode', () => {
    render(<ChessPage />)
    expect(screen.getByRole('heading', { level: 1, name: /play chess/i })).toBeInTheDocument()
    expect(screen.getByRole('grid', { name: /chess board/i })).toBeInTheDocument()
    expect(screen.getByText(/white to move/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /vs player/i })).toHaveClass(
      'chess-mode__btn--active',
    )
  })

  it('shows empty captured pieces and moves list', () => {
    render(<ChessPage />)
    expect(screen.getByLabelText(/captured pieces/i)).toBeInTheDocument()
    expect(screen.getByText(/white took/i)).toBeInTheDocument()
    expect(screen.getByText(/black took/i)).toBeInTheDocument()
    expect(screen.getByText(/no moves yet/i)).toBeInTheDocument()
  })

  it('switches to vs Bot mode', async () => {
    const user = userEvent.setup()
    render(<ChessPage />)
    await user.click(screen.getByRole('button', { name: /vs bot/i }))
    expect(screen.getByRole('button', { name: /vs bot/i })).toHaveClass('chess-mode__btn--active')
    expect(screen.getByText(/you play white/i)).toBeInTheDocument()
  })

  it('plays a pawn move and records it in history', async () => {
    const user = userEvent.setup()
    render(<ChessPage />)
    await user.click(screen.getByRole('button', { name: /^e2$/i }))
    await user.click(screen.getByRole('button', { name: /^e4$/i }))
    expect(screen.getByText(/black to move/i)).toBeInTheDocument()
    const moves = screen.getByRole('list')
    expect(within(moves).getByText('e4')).toBeInTheDocument()
  })

  it('records a capture under White took', async () => {
    const user = userEvent.setup()
    render(<ChessPage />)
    // Scholar's mate setup to capture: e4 e5 Qh5 Nc6 Qxe5
    await user.click(screen.getByRole('button', { name: /^e2$/i }))
    await user.click(screen.getByRole('button', { name: /^e4$/i }))
    await user.click(screen.getByRole('button', { name: /^e7$/i }))
    await user.click(screen.getByRole('button', { name: /^e5$/i }))
    await user.click(screen.getByRole('button', { name: /^d1$/i }))
    await user.click(screen.getByRole('button', { name: /^h5$/i }))
    await user.click(screen.getByRole('button', { name: /^b8$/i }))
    await user.click(screen.getByRole('button', { name: /^c6$/i }))
    await user.click(screen.getByRole('button', { name: /^h5$/i }))
    await user.click(screen.getByRole('button', { name: /^e5$/i }))

    const captured = screen.getByLabelText(/captured pieces/i)
    expect(within(captured).getByLabelText(/captured p/i)).toBeInTheDocument()
  })

  it('resets the board with New game', async () => {
    const user = userEvent.setup()
    render(<ChessPage />)
    await user.click(screen.getByRole('button', { name: /^e2$/i }))
    await user.click(screen.getByRole('button', { name: /^e4$/i }))
    await user.click(screen.getByRole('button', { name: /new game/i }))
    expect(screen.getByText(/white to move/i)).toBeInTheDocument()
    expect(screen.getByText(/no moves yet/i)).toBeInTheDocument()
  })

  it('undoes the last move', async () => {
    const user = userEvent.setup()
    render(<ChessPage />)
    await user.click(screen.getByRole('button', { name: /^e2$/i }))
    await user.click(screen.getByRole('button', { name: /^e4$/i }))
    await user.click(screen.getByRole('button', { name: /^undo$/i }))
    expect(screen.getByText(/white to move/i)).toBeInTheDocument()
    expect(screen.getByText(/no moves yet/i)).toBeInTheDocument()
  })
})
