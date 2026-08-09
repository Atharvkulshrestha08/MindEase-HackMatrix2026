import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'

export const useDarkMode = () => {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false, v => typeof v === 'boolean')

  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  return [isDark, setIsDark]
}

export default useDarkMode
