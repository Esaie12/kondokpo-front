export const getProgressPercentage = (collected: number, goal: number): number => {
    if (goal <= 0) return 0;
    const percentage = Math.min((collected / goal) * 100, 100);
    return Math.round(percentage); // Pour éviter les décimales
};

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const getStrokeOffset = (percentage: number): number => {
    return CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
};

export const PROGRESS_RADIUS = RADIUS;
export const PROGRESS_CIRCUMFERENCE = CIRCUMFERENCE;


export function formatDateToFrench(dateString: string): string {
    const date = new Date(dateString);

    // Options de format
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long', // ex: lundi
        day: 'numeric',
        month: 'long',   // ex: août
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    // Formatage en français
    return new Intl.DateTimeFormat('fr-FR', options).format(date).replace(',', ' à');
}

export function getDaysRemaining(targetDateStr: string): number {
    const now = new Date();
    const targetDate = new Date(targetDateStr);

    // Mettre les deux dates à minuit pour éviter les erreurs dues à l'heure
    now.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}
