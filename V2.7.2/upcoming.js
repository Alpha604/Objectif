/**
 * upcoming.js - Données des comptes à venir
 * Fichier séparé pour gérer les futurs comptes avec vraies images
 */

// Configuration des comptes à venir avec vraies images
const UPCOMING_ACCOUNTS = [
    {
        id: 'magnus',
        name: 'Karen Karapetyan',
        handle: '@magnuscarlsen',
        avatarPath: 'pdp/magnus.jpg', // À placer dans le dossier pdp/
        fallback: 'M',
        bgColor: 'linear-gradient(135deg, #2c3e50, #3498db)',
        date: '2026-03-15',
        progress: 75,
        status: 'Bientôt',
        eta: 'J-15',
        title: 'Champion du monde',
        country: 'Norvège',
        elo: 2830
    },
    {
        id: 'magnus',
        name: 'Magnus Carlsen',
        handle: '@magnuscarlsen',
        avatarPath: 'pdp/magnus.jpg', // À placer dans le dossier pdp/
        fallback: 'M',
        bgColor: 'linear-gradient(135deg, #2c3e50, #3498db)',
        date: '2026-03-15',
        progress: 75,
        status: 'Bientôt',
        eta: 'J-15',
        title: 'Champion du monde',
        country: 'Norvège',
        elo: 2830
    }
];

// Fonction pour obtenir les comptes à venir (filtrer si besoin)
function getUpcomingAccounts(filter = 'all') {
    if (filter === 'soon') {
        return UPCOMING_ACCOUNTS.filter(a => a.progress >= 25);
    } else if (filter === 'planned') {
        return UPCOMING_ACCOUNTS.filter(a => a.progress < 25);
    }
    return UPCOMING_ACCOUNTS;
}

// Fonction pour obtenir un compte par son ID
function getUpcomingAccountById(id) {
    return UPCOMING_ACCOUNTS.find(a => a.id === id);
}

// Fonction pour formater la date en français
function formatFrenchDate(dateString) {
    const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
    const [year, month, day] = dateString.split('-');
    return `${parseInt(day)} ${months[parseInt(month)-1]} ${year}`;
}

// Fonction pour obtenir l'avatar avec vraie image
function getUpcomingAvatarHtml(account) {
    // Si le chemin de l'avatar existe
    if (account.avatarPath) {
        return `<img src="${account.avatarPath}" alt="${account.name}" 
                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'avatar-fallback\\' style=\\'background:${account.bgColor};\\'>${account.fallback}</div>';">`;
    }
    // Fallback avec la lettre
    return `<div class="avatar-fallback" style="background: ${account.bgColor};">${account.fallback}</div>`;
}

// Fonction pour générer le HTML d'une carte de compte à venir
function generateUpcomingCardHtml(account) {
    const formattedDate = formatFrenchDate(account.date);
    const eta = account.eta === 'TBD' ? 'Date à définir' : account.eta;
    
    return `
        <div class="timeline-card" data-id="${account.id}" data-progress="${account.progress}">
            <span class="timeline-date">
                <i class="far fa-calendar-alt" style="margin-right: 4px;"></i>
                ${formattedDate}
            </span>
            <div class="timeline-content">
                <div class="timeline-avatar">
                    ${getUpcomingAvatarHtml(account)}
                </div>
                <div class="timeline-info">
                    <h3>${account.name}</h3>
                    <p>${account.handle}</p>
                    <span class="player-meta">
                        <i class="fas fa-trophy" style="color: #FFD700; font-size: 0.7rem;"></i> ${account.title}
                        <i class="fas fa-flag" style="color: #82c4a8; margin-left: 8px;"></i> ${account.country}
                        <i class="fas fa-chart-line" style="color: #4bc0c0; margin-left: 8px;"></i> ${account.elo}
                    </span>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-header">
                    <span>Intégration</span>
                    <span>${account.progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${account.progress}%;"></div>
                </div>
            </div>
            <div class="timeline-footer">
                <span class="status-badge">
                    <i class="fas ${account.progress >= 50 ? 'fa-rocket' : account.progress >= 25 ? 'fa-hourglass-half' : 'fa-clock'}"></i>
                    ${account.status}
                </span>
                <span class="eta-badge">
                    <i class="far fa-clock"></i>
                    ${eta}
                </span>
            </div>
        </div>
    `;
}

// Exporter les fonctions si nécessaire (pour les modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UPCOMING_ACCOUNTS,
        getUpcomingAccounts,
        getUpcomingAccountById,
        formatFrenchDate,
        getUpcomingAvatarHtml,
        generateUpcomingCardHtml
    };
}