/**
 * pdp.js - Configuration des photos de profil
 * Contient tous les chemins d'accès aux avatars
 */

const AVATARS = {
    'alpha604': {
        id: 'alpha604',
        path: 'pdp/alpharomo604.png',
        fallback: 'A',
        bgColor: 'linear-gradient(135deg, #82c4a8, #4a9080)'
    },
    'karen': {
        id: 'karen',
        path: 'pdp/karen.png',
        fallback: 'K',
        bgColor: 'linear-gradient(135deg, #c482a8, #904a80)'
    },
    'martin': {
        id: 'martin',
        path: 'pdp/martinlg.png',
        fallback: 'M',
        bgColor: 'linear-gradient(135deg, #ffb347, #ff8c8c)'
    },
    'default': {
        id: 'default',
        path: null,
        fallback: '?',
        bgColor: 'linear-gradient(135deg, #6c757d, #495057)'
    }
};

// Palettes de couleurs pour chaque compte
const COLOR_PALETTES = {
    'alpha604': {
        primary: '#82c4a8',
        secondary: '#4a9080',
        bullet: '#4bc0c0',
        blitz: '#ffb347',
        rapide: '#ff8c8c',
        daily: '#baff8c',
        accent: '#82c4a8'
    },
    'karen': {
        primary: '#c482a8',
        secondary: '#904a80',
        bullet: '#c482a8',
        blitz: '#d4a373',
        rapide: '#e9c46a',
        daily: '#b5838d',
        accent: '#c482a8'
    },
    'martin': {
        primary: '#ffb347',
        secondary: '#ff8c8c',
        bullet: '#ffb347',
        blitz: '#ff8c8c',
        rapide: '#ff6b6b',
        daily: '#ffb347',
        accent: '#ffb347'
    }
};

// Configuration des comptes avec différents statuts
// status: 'active' | 'blocked' | 'loading' | 'banned'
const ACCOUNTS = [
    {
        id: 'alpha604',
        dataFile: 'data/data.js',
        appFile: 'app/app.js',
        name: 'AlphaRomo604',
        handle: '@alpharomo604',
        chessUrl: 'https://www.chess.com/member/alpharomo604',
        lichessUrl: 'https://lichess.org/@/AlphaRomeo604',
        avatarId: 'alpha604',
        palette: 'alpha604',
        status: 'active' // Compte actif
    },
    {
        id: 'karen',
        dataFile: 'data/data-karen.js',
        appFile: 'app/app-karen.js',
        name: 'Karen Karapetyan',
        handle: '@karen_chess',
        chessUrl: 'https://www.chess.com/member/karenkarapetyan',
        lichessUrl: 'https://lichess.org/@/KarenKarapetyan',
        avatarId: 'karen',
        palette: 'karen',
        status: 'loading' // Compte BLOQUÉ (visible avec cadenas)
    },
    {
        id: 'martin',
        dataFile: 'data/data-martin.js',
        appFile: 'app/app-martin.js',
        name: 'LgMartinIsCool',
        handle: '@lgmartiniscool',
        chessUrl: 'https://www.chess.com/member/martin200iqgm',
        lichessUrl: 'https://lichess.org/@/martin200iqgm',
        avatarId: 'martin',
        palette: 'martin',
        status: 'loading' // Compte en cours de chargement (avec spinner)
    },
    {
        id: 'hacker',
        dataFile: 'data/data-hacker.js',
        appFile: 'app/app-hacker.js',
        name: 'Hacker123',
        handle: '@hacker_cheat',
        chessUrl: 'https://www.chess.com/member/hacker123',
        lichessUrl: 'https://lichess.org/@/hacker123',
        avatarId: 'default',
        palette: 'alpha604',
        status: 'banned' // Compte BANNI (invisible)
    }
];

// Fonction pour filtrer les comptes visibles (exclut les bannis)
function getVisibleAccounts() {
    return ACCOUNTS.filter(account => account.status !== 'banned');
}

// Fonction pour obtenir les comptes actifs
function getActiveAccounts() {
    return ACCOUNTS.filter(account => account.status === 'active');
}

// Fonction pour vérifier si un compte est accessible (cliquable)
function isAccountAccessible(accountId) {
    const account = ACCOUNTS.find(a => a.id === accountId);
    return account ? account.status === 'active' : false;
}

// Fonction pour obtenir le compte par défaut (premier compte actif)
function getDefaultAccount() {
    const activeAccounts = getActiveAccounts();
    return activeAccounts.length > 0 ? activeAccounts[0] : null;
}

// Fonction pour obtenir l'icône de statut
function getStatusIcon(status) {
    switch(status) {
        case 'blocked':
            return '<i class="fas fa-lock" style="color: #ff6b6b; font-size: 12px; margin-left: 6px;"></i>';
        case 'loading':
            return '<i class="fas fa-spinner fa-spin" style="color: #ffb347; font-size: 12px; margin-left: 6px;"></i>';
        default:
            return '';
    }
}