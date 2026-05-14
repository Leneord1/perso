import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../global.css'
import './chatbot.css'
import { getAgentReply, getWelcomeMessage } from './chatAgent.js'

function nextMessageId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `m-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function Chatbot() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => [getWelcomeMessage()])
  const chatBodyRef = useRef(null)

  useEffect(() => {
    const el = chatBodyRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, open])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text) return

    const userMessage = { id: nextMessageId(), role: 'user', content: text }
    const { content, actions } = getAgentReply(text)
    const assistantMessage = { id: nextMessageId(), role: 'assistant', content, actions }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput('')
  }, [input])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    if (!open) return
    const onEsc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open])

  return (
    <aside className="pw-chat" aria-label="Site assistant">
      <div
        id="pw-chat-panel"
        className="pw-chat__panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="pw-chat-title"
        hidden={!open}
      >
          <div className="pw-chat__header">
            <span id="pw-chat-title" className="pw-chat__title">
              Site assistant
            </span>
            <button
              type="button"
              className="pw-chat__close"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
            >
              ×
            </button>
          </div>
          <div className="pw-chat__body" ref={chatBodyRef} aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`pw-chat__msg pw-chat__msg--${msg.role}`}>
                <div>{msg.content}</div>
                {msg.actions?.length ? (
                  <div className="pw-chat__actions">
                    {msg.actions.map((a) => {
                      if (!a.external) {
                        return (
                          <button
                            key={`${msg.id}-${a.label}`}
                            type="button"
                            className="button-outline"
                            onClick={() => {
                              navigate(a.to)
                              setOpen(false)
                            }}
                          >
                            {a.label}
                          </button>
                        )
                      }
                      const isMailto = a.to.startsWith('mailto:')
                      return (
                        <a
                          key={`${msg.id}-${a.label}`}
                          href={a.to}
                          className="button-outline"
                          {...(isMailto
                            ? {}
                            : { target: '_blank', rel: 'noopener noreferrer' })}
                        >
                          {a.label}
                        </a>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="pw-chat__footer">
            <input
              className="pw-chat__input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about projects, skills, contact…"
              aria-label="Message to assistant"
            />
            <button type="button" className="button-primary pw-chat__send" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>

      <button
        type="button"
        className="pw-chat__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="pw-chat-panel"
        title={open ? 'Close assistant' : 'Open site assistant'}
      >
        {open ? (
          <span className="pw-chat__toggle-icon" aria-hidden>
            ×
          </span>
        ) : (
          <svg className="pw-chat__toggle-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 3C7.03 3 3 6.58 3 11c0 2.12 1.01 4.03 2.6 5.35L4 21l5.08-1.38C10.47 20.2 11.22 20.3 12 20.3c4.97 0 9-3.58 9-8s-4.03-8-9-8Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="11" r="1.1" fill="currentColor" />
            <circle cx="12" cy="11" r="1.1" fill="currentColor" />
            <circle cx="15" cy="11" r="1.1" fill="currentColor" />
          </svg>
        )}
      </button>
    </aside>
  )
}
