// Functie 1: Valuta
export const formatCurrency = (value) => {
    if (value === null || value === undefined) return '€ 0,00';

    return new Intl.NumberFormat('nl-BE', {
        style: 'currency',
        currency: 'EUR'
    }).format(value);
};

// Functie 2: Percentages (Deze ontbrak of ging mis)
export const formatPercent = (value) => {
    if (!value) return '0%';

    // Deelt door 100 omdat Intl 0.21 verwacht voor 21%
    return new Intl.NumberFormat('nl-BE', {
        style: 'percent',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(value / 100);
};