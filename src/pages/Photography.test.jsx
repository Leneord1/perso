import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Photography from './Photography'
import { photographyPhotos } from '../data/photographyPhotos.js'

describe('Photography', () => {
  it('renders the gallery eyebrow', () => {
    const { container } = render(<Photography />)
    expect(container.querySelector('.photography-page__eyebrow')?.textContent).toMatch(
      /^gallery$/i,
    )
  })

  it('renders one image per photography photo', () => {
    const { container } = render(<Photography />)
    const images = container.querySelectorAll('img')
    expect(images).toHaveLength(photographyPhotos.length)
  })

  it('orders photos newest first', () => {
    const { container } = render(<Photography />)
    const images = container.querySelectorAll('img')
    const newest = [...photographyPhotos].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
    expect(images[0]).toHaveAttribute('src', newest.src)
  })
})
