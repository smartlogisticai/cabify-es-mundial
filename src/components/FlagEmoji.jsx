/**
 * FlagEmoji
 * Renders a flag emoji as an <img> from flagcdn.com to ensure cross-platform
 * display (Windows does not render regional-indicator emoji as flag images).
 *
 * Accepts the emoji string stored in flag_local / flag_visitante from Supabase.
 * Handles standard 2-letter regional indicator emoji AND tag-sequence flags
 * (England 🏴󠁧󠁢󠁥󠁮󠁧󠁿, Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿).
 */

// Tag-sequence flags that need a special flagcdn code
const TAG_FLAGS = {
  '🏴󠁧󠁢󠁥󠁮󠁧󠁿': 'gb-eng',
  '🏴󠁧󠁢󠁳󠁣󠁴󠁿': 'gb-sct',
  '🏴󠁧󠁢󠁷󠁬󠁳󠁿': 'gb-wls',
}

function emojiToCode(emoji) {
  if (!emoji) return null
  if (TAG_FLAGS[emoji]) return TAG_FLAGS[emoji]

  // Regional indicator symbols: U+1F1E6 (A) … U+1F1FF (Z)
  const points = [...emoji]
    .map(c => c.codePointAt(0))
    .filter(cp => cp >= 0x1F1E6 && cp <= 0x1F1FF)
    .map(cp => String.fromCharCode(cp - 0x1F1E6 + 65))

  if (points.length === 2) return points.join('').toLowerCase()
  return null
}

const SIZE_MAP = {
  sm: 'w20',   // 20px wide
  md: 'w32',   // 32px wide
  lg: 'w48',   // 48px wide
  xl: 'w64',   // 64px wide
}

export default function FlagEmoji({ emoji, size = 'md', className = '' }) {
  const code = emojiToCode(emoji)

  if (!code) {
    // Fallback: render the raw emoji text
    return <span className={className}>{emoji}</span>
  }

  const sizeKey = SIZE_MAP[size] || 'w32'
  const url = `https://flagcdn.com/${sizeKey}/${code}.png`

  // height ≈ 75% of width (3:2 flag ratio)
  const widthPx = parseInt(sizeKey.replace('w', ''), 10)
  const heightPx = Math.round(widthPx * 0.75)

  return (
    <img
      src={url}
      alt={emoji}
      width={widthPx}
      height={heightPx}
      className={`inline-block object-contain rounded-sm ${className}`}
      loading="lazy"
    />
  )
}
