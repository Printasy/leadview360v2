import { ref, onMounted } from 'vue';

// We maken de state globaal buiten de functie, zodat de status overal in de app hetzelfde is.
const isDark = ref(false);

export function useTheme() {

    // Functie om de class op de HTML-tag te zetten
    const applyTheme = () => {
        if (isDark.value) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Functie om te wisselen
    const toggleTheme = () => {
        isDark.value = !isDark.value;
        applyTheme();
    };

    // Bij het opstarten checken we de voorkeur
    onMounted(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            isDark.value = true;
        } else {
            isDark.value = false;
        }
        applyTheme();
    });

    return {
        isDark,
        toggleTheme
    };
}