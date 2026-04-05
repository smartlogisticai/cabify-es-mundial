/**
 * FlagEmoji
 * Renders a flag emoji directly from the database field.
 * On macOS/iOS/Android it shows the actual flag image.
 * On Windows it shows the 2-letter country code (browser limitation).
 * If emoji is null/empty, falls back to the first 2 letters of the team name.
 */

const SIZE = {
  sm: '20px',
  md: '28px',
  lg: '40px',
  xl: '52px',
}

export default function FlagEmoji({ emoji, size = 'md', team = '', className = '' }) {
  const fontSize = SIZE[size] || SIZE.md

  if (!emoji) {
    const initials = team.trim().slice(0, 2).toUpperCase()
    return (
      <span
        className={`inline-flex items-center justify-center rounded font-bold text-white flex-shrink-0 ${className}`}
        style={{
          width: fontSize,
          height: fontSize,
          fontSize: `calc(${fontSize} * 0.42)`,
          backgroundColor: '#3d3560',
          letterSpacing: '-0.5px',
        }}
      >
        {initials || '?'}
      </span>
    )
  }

  return (
    <span
      className={`inline-block leading-none flex-shrink-0 ${className}`}
      style={{ fontSize }}
      role="img"
      aria-label={team}
    >
      {emoji}
    </span>
  )
}
