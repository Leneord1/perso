/**
 * Chess Player-2 bot via site chat agent (/api/chat → Groq).
 * Falls back to a simple legal-move pick if the model fails.
 */
import { readViteEnv } from '../env.js'

const CHESS_SYSTEM = `You are Player 2 (Black) in a chess game.
Reply with exactly one legal move from the provided list.
Use the SAN string only — no commentary, no punctuation beyond the move itself.`

function chatApiUrl() {
  return readViteEnv('VITE_CHAT_API_URL') || '/api/chat'
}

/**
 * Prefer captures / checks when the LLM is unavailable.
 * Deterministic pick — no PRNG (S2245).
 * @param {{ san: string, captured?: string, flags: string }[]} legalMoves
 */
function fallbackMove(legalMoves) {
  if (legalMoves.length === 0) return null
  const check = legalMoves.find((m) => m.san.includes('+') || m.san.includes('#'))
  if (check) return check
  const capture = legalMoves.find((m) => m.captured)
  if (capture) return capture
  return legalMoves[0]
}

/**
 * Pull a SAN that appears in legalMoves from free-form model text.
 * @param {string} text
 * @param {{ san: string }[]} legalMoves
 */
function parseSan(text, legalMoves) {
  const cleaned = text.trim().replaceAll('**', '')
  const byExact = legalMoves.find((m) => m.san === cleaned)
  if (byExact) return byExact

  // Longest SAN first so "Nxe5+" beats "e5"
  const sorted = [...legalMoves].sort((a, b) => b.san.length - a.san.length)
  for (const m of sorted) {
    if (cleaned.includes(m.san)) return m
  }
  return null
}

/**
 * Asks the site agent for Black's next move.
 * @param {string} fen
 * @param {{ san: string, from: string, to: string, promotion?: string, captured?: string, flags: string }[]} legalMoves
 * @returns {Promise<{ from: string, to: string, promotion?: string } | null>}
 */
export async function getChessBotMove(fen, legalMoves) {
  if (!legalMoves.length) return null

  const sans = legalMoves.map((m) => m.san)
  const userPrompt = [
    `FEN: ${fen}`,
    `Legal moves (SAN): ${sans.join(', ')}`,
    'Choose the strongest move for Black. Reply with one SAN from the list only.',
  ].join('\n')

  let chosen = null
  try {
    const res = await fetch(chatApiUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: CHESS_SYSTEM },
          { role: 'user', content: userPrompt },
        ],
        stream: false,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      const content = data?.message?.content?.trim() || ''
      chosen = parseSan(content, legalMoves)
    }
  } catch {
    // Use fallback below.
  }

  const move = chosen || fallbackMove(legalMoves)
  if (!move) return null

  const result = { from: move.from, to: move.to }
  if (move.promotion) result.promotion = move.promotion
  return result
}
