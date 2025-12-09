import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Leer preferencia guardada o default a 'light'
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved === 'light' || saved === 'dark') return saved;
            // opcional: detectar preferencia del sistema
            const mql = window.matchMedia('(prefers-color-scheme: dark)');
            return mql.matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        // Aplicar o quitar la clase 'dark' en <html>
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Hook para consumirlo más cómodo
export function useTheme() {
    return useContext(ThemeContext);
}
