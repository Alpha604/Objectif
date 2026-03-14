/**
 * pdp.js - Configuration des photos de profil et sources de données
 * source: 'online' = récupération ELO depuis Chess.com API (graphiques manuels)
 * source: 'manual' = toutes données statiques depuis les fichiers data/*.js
 * chartSource: 'manual' = graphiques toujours depuis les fichiers manuels
 */

const AVATARS = {
    'alpha604': {
        id: 'alpha604',
        path: 'pdp/alpharomo604.png',
        fallback: 'A',
        bgColor: 'linear-gradient(135deg, #82c4a8, #4a9080)'
    },
    'alphaRomeo': {
        id: 'alphaRomeo',
        path: 'pdp/image.png',
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
    'alphagas': {
        id: 'alphagas',
        path: 'pdp/alphagas.png',
        fallback: 'G',
        bgColor: 'linear-gradient(135deg, #82c4a8, #4a9080)'
    },
    'default': {
        id: 'default',
        path: null,
        fallback: '?',
        bgColor: 'linear-gradient(135deg, #6c757d, #495057)'
    },
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
    'alphagas': {
        primary: '#82c4a8',
        secondary: '#4a9080',
        bullet: '#4bc0c0',
        blitz: '#ffb347',
        rapide: '#ff8c8c',
        daily: '#baff8c',
        accent: '#82c4a8'
    },
    'alphaRomeo': {
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

// Configuration des comptes
// source: 'online' = ELO depuis Chess.com (graphiques manuels)
// source: 'manual' = toutes données depuis fichiers
const ACCOUNTS = [
    {
        id: 'alpha604',
        name: 'AlphaRomo604',
        handle: '@alpharomo604',
        chessUsername: 'alpharomo604',
        lichessUsername: 'AlphaRomeo604',
        chessUrl: 'https://www.chess.com/member/alpharomo604',
        lichessUrl: 'https://lichess.org/@/AlphaRomeo604',
        avatarId: 'alpha604',
        palette: 'alpha604',
        status: 'active',
        source: 'online',        // ELO depuis Chess.com
        chartSource: 'manual',    // Graphiques depuis le fichier manuel
        dataFile: 'data/data.js',
        appFile: 'app/app.js'
    },
    {
        id: 'alphagas',
        name: 'Alphagas',
        handle: '@alphagas',
        chessUsername: 'Alphagas',
        chessUrl: 'https://www.chess.com/member/alphagas',
        avatarId: 'alphagas',
        palette: 'alphagas',
        status: 'active',
        source: 'manual',        // Pour les demandes
        chartSource: 'manual',
        dataFile: 'data/data-alphagas.js',
        appFile: 'app/app-alphagas.js'
    },
    {
        id: 'alphaRomeo',
        name: 'AlphaRomeo604',
        handle: '@alpharomeo604',
        chessUsername: 'alpharomeo604',
        lichessUsername: 'AlphaRomeo604',
        chessUrl: 'https://www.chess.com/member/alpharomeo604',
        lichessUrl: 'https://lichess.org/@/AlphaRomeo604',
        avatarId: 'alphaRomeo',
        palette: 'alphaRomeo',
        status: 'blocked',
        source: 'online',        // Pour les demandes
        chartSource: 'manual',
        requestEmail: 'alpharomeo604@gmail.com',
        requestNote: 'Contactez cet admin pour les demandes de comptes'
    },
    {
        id: 'karen',
        name: 'Karen Karapetyan',
        handle: '@karen_chess',
        chessUsername: 'karenkarapetyan',
        lichessUsername: 'KarenKarapetyan',
        chessUrl: 'https://www.chess.com/member/karenkarapetyan',
        lichessUrl: 'https://lichess.org/@/KarenKarapetyan',
        avatarId: 'karen',
        palette: 'karen',
        status: 'banned',
        source: 'manual',         // Toutes données manuelles
        chartSource: 'manual',
        dataFile: 'data/data-karen.js',
        appFile: 'app/app-karen.js'
    },
    {
        id: 'martin',
        name: 'LgMartinIsCool',
        handle: '@lgmartiniscool',
        chessUsername: 'martin200iqgm',
        lichessUsername: 'martin200iqgm',
        chessUrl: 'https://www.chess.com/member/martin200iqgm',
        lichessUrl: 'https://lichess.org/@/martin200iqgm',
        avatarId: 'martin',
        palette: 'martin',
        status: 'banned',
        source: 'manual',         // Toutes données manuelles
        chartSource: 'manual',
        dataFile: 'data/data-martin.js',
        appFile: 'app/app-martin.js'
    }
];

// Fonctions utilitaires
function getVisibleAccounts() {
    return ACCOUNTS.filter(account => account.status !== 'banned');
}

function getActiveAccounts() {
    return ACCOUNTS.filter(account => account.status === 'active');
}

function getBlockedAccounts() {
    return ACCOUNTS.filter(account => account.status === 'blocked');
}

function isAccountAccessible(accountId) {
    const account = ACCOUNTS.find(a => a.id === accountId);
    return account ? account.status === 'active' : false;
}

function getDefaultAccount() {
    const activeAccounts = getActiveAccounts();
    return activeAccounts.length > 0 ? activeAccounts[0] : null;
}

function getRequestAdmins() {
    return ACCOUNTS.filter(account => 
        (account.status === 'active' || account.status === 'blocked') && 
        (account.id === 'alpha604' || account.id === 'alphaRomeo')
    );
}

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