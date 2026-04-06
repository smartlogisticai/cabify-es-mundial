import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('darkMode')
    return stored === null ? true : stored !== 'false'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
  }, [isDark])

  function toggleTheme() {
    setIsDark(prev => {
      const next = !prev
      localStorage.setItem('darkMode', String(next))
      document.documentElement.dataset.theme = next ? 'dark' : 'light'
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
