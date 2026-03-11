/**
 * loader.js - Chargeur dynamique de comptes
 */

// Inclure chess-api.js
if (!document.querySelector('script[src="chess-api.js"]')) {
    const script = document.createElement('script');
    script.src = 'chess-api.js';
    document.head.appendChild(script);
}

let currentAccountId = 'alpha604';
let currentChart = null;

// Fonctions de filtre
function getVisibleAccounts() {
    return ACCOUNTS.filter(account => account.status !== 'banned');
}

function getActiveAccounts() {
    return ACCOUNTS.filter(account => account.status === 'active');
}

function getDefaultAccount() {
    const activeAccounts = getActiveAccounts();
    return activeAccounts.length > 0 ? activeAccounts[0] : null;
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

// Appliquer la palette de couleurs
function applyColorPalette(paletteId) {
    const palette = COLOR_PALETTES[paletteId] || COLOR_PALETTES['alpha604'];
    
    let styleTag = document.getElementById('dynamic-palette');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-palette';
        document.head.appendChild(styleTag);
    }
    
    styleTag.textContent = `
        :root {
            --primary-color: ${palette.primary};
            --secondary-color: ${palette.secondary};
            --accent-color: ${palette.accent};
        }
        
        .select-button:hover {
            border-color: var(--primary-color) !important;
        }
        
        .account-avatar {
            border-color: var(--primary-color) !important;
            box-shadow: 0 0 10px ${palette.primary}80 !important;
        }
        
        .dropdown-arrow {
            color: var(--primary-color) !important;
        }
        
        .dropdown-item:hover {
            background: ${palette.primary}26 !important;
        }
        
        .dropdown-item.selected {
            background: ${palette.primary}40 !important;
            border-left-color: var(--primary-color) !important;
        }
        
        .stat-badge i {
            color: var(--primary-color) !important;
        }
        
        .mode-header i {
            color: var(--primary-color) !important;
        }
        
        .target-elo span {
            color: var(--primary-color) !important;
        }
        
        .goal-note i {
            color: var(--primary-color) !important;
        }
        
        .deadline-note i {
            color: var(--primary-color) !important;
        }
        
        .footer-link:hover {
            border-color: var(--primary-color) !important;
        }
        
        .last-update i {
            color: var(--primary-color) !important;
        }
    `;
}

// Charger un compte complet
function loadAccount(accountId) {
    const account = ACCOUNTS.find(a => a.id === accountId);
    if (!account) return;
    
    switch(account.status) {
        case 'banned':
            showNotification(`❌ Le compte ${account.name} a été banni`, '#f89898');
            return;
        case 'blocked':
            showNotification(`🔒 Le compte ${account.name} est actuellement bloqué`, '#faca86');
            return;
        case 'loading':
            showNotification(`⏳ Le compte ${account.name} est en cours de configuration`, '#f8be6d');
            return;
        case 'active':
            window.location.href = `?account=${accountId}`;
            break;
    }
}

// Afficher une notification
function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: #0b1219;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border-left: 4px solid white;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    if (!document.querySelector('#notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0%); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        notification.style.transition = 'all 0.3s ease';
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Mettre à jour l'UI
function updateAccountUI() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('account') || 'alpha604';
    
    let account = ACCOUNTS.find(a => a.id === accountId);
    
    if (!account || account.status !== 'active') {
        const defaultAccount = getDefaultAccount();
        if (defaultAccount) {
            account = defaultAccount;
            history.replaceState({}, '', `?account=${defaultAccount.id}`);
        } else {
            console.error('Aucun compte actif disponible');
            return;
        }
    }
    
    const avatar = AVATARS[account.avatarId] || AVATARS.default;
    const palette = COLOR_PALETTES[account.palette] || COLOR_PALETTES['alpha604'];
    
    applyColorPalette(account.palette);
    
    const selectedAvatar = document.getElementById('selectedAvatar');
    selectedAvatar.innerHTML = avatar.path 
        ? `<img src="${avatar.path}" alt="${account.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'avatar-fallback\\' style=\\'background:${avatar.bgColor};\\'>${avatar.fallback}</div>';">`
        : `<div class="avatar-fallback" style="background: ${avatar.bgColor};">${avatar.fallback}</div>`;
    
    document.getElementById('selectedName').textContent = account.name;
    document.getElementById('selectedHandle').textContent = account.handle;
    document.getElementById('accountDisplayName').textContent = account.name;
    document.getElementById('chessLink').href = account.chessUrl;
    document.getElementById('lichessLink').href = account.lichessUrl;
    
    updateDropdownSelection(account.id);
}

// Générer le dropdown
function generateDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    const urlParams = new URLSearchParams(window.location.search);
    const currentAccountId = urlParams.get('account') || 'alpha604';
    
    const visibleAccounts = getVisibleAccounts();
    
    dropdown.innerHTML = visibleAccounts.map(account => {
        const avatar = AVATARS[account.avatarId] || AVATARS.default;
        const isSelected = account.id === currentAccountId;
        const palette = COLOR_PALETTES[account.palette] || COLOR_PALETTES['alpha604'];
        const isClickable = account.status === 'active';
        const statusIcon = getStatusIcon(account.status);
        
        // Icône source
        const sourceIcon = account.source === 'online' 
            ? '<i class="fas fa-cloud" style="color: #4bc0c0; font-size: 10px; margin-left: 4px;" title="ELO live"></i>'
            : '<i class="fas fa-database" style="color: #a0b8c7; font-size: 10px; margin-left: 4px;" title="Données manuelles"></i>';
        
        const opacity = isClickable ? '1' : '0.7';
        const cursor = isClickable ? 'pointer' : 'not-allowed';
        
        return `
            <div class="dropdown-item ${isSelected ? 'selected' : ''} ${!isClickable ? 'disabled' : ''}" 
                 data-account="${account.id}" 
                 data-status="${account.status}"
                 style="${isSelected ? `border-left-color: ${palette.primary};` : ''} opacity: ${opacity}; cursor: ${cursor};">
                <div class="account-avatar">
                    ${avatar.path 
                        ? `<img src="${avatar.path}" alt="${account.name}" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'avatar-fallback\\' style=\\'background:${avatar.bgColor};\\'>${avatar.fallback}</div>';">`
                        : `<div class="avatar-fallback" style="background: ${avatar.bgColor};">${avatar.fallback}</div>`
                    }
                </div>
                <div class="account-info">
                    <span class="account-name">
                        ${account.name}
                        ${statusIcon}
                        ${sourceIcon}
                    </span>
                    <span class="account-handle">${account.handle}</span>
                </div>
                ${!isClickable ? '<span class="status-badge">' + 
                    (account.status === 'blocked' ? 'Bloqué' : 'En cours') + '</span>' : ''}
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const accountId = item.dataset.account;
            const status = item.dataset.status;
            
            if (status !== 'active') {
                const account = ACCOUNTS.find(a => a.id === accountId);
                if (account) {
                    switch(status) {
                        case 'blocked':
                            showNotification(`🔒 ${account.name} est bloqué`, '#ff6b6b');
                            break;
                        case 'loading':
                            showNotification(`⏳ ${account.name} est en cours de configuration`, '#ffb347');
                            break;
                    }
                }
                toggleDropdown();
                return;
            }
            
            if (accountId === currentAccountId) {
                toggleDropdown();
                return;
            }
            
            toggleDropdown();
            loadAccount(accountId);
        });
    });
}

function updateDropdownSelection(selectedId) {
    document.querySelectorAll('.dropdown-item').forEach(item => {
        const accountId = item.dataset.account;
        if (accountId === selectedId) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    const button = document.getElementById('selectButton');
    dropdown.classList.toggle('show');
    button.classList.toggle('open');
}

// Fermer le dropdown
document.addEventListener('click', (e) => {
    const selector = document.querySelector('.account-selector');
    const dropdown = document.getElementById('dropdownMenu');
    const button = document.getElementById('selectButton');
    
    if (!selector.contains(e.target) && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('open');
    }
});

// Charger les scripts
async function loadCurrentAccountScripts() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('account') || 'alpha604';
    
    let account = ACCOUNTS.find(a => a.id === accountId);
    
    if (!account || account.status !== 'active') {
        const defaultAccount = getDefaultAccount();
        if (defaultAccount) {
            account = defaultAccount;
        } else {
            console.error('Aucun compte actif disponible');
            return;
        }
    }
    
    try {
        document.body.style.cursor = 'wait';
        
        // Nettoyer les anciens scripts
        const oldApp = document.querySelector('script[src*="app/"]');
        if (oldApp) oldApp.remove();
        
        const oldData = document.querySelector('script[src*="data/"]');
        if (oldData) oldData.remove();
        
        delete window.CHESS_DATA;
        
        if (account.source === 'online' && typeof loadAccountDataWithSource === 'function') {
            // Mode online : charge les données manuelles puis met à jour l'ELO
            await loadAccountDataWithSource(account);
        } else {
            // Mode manuel
            await loadScript(account.dataFile);
        }
        
        // Charger l'app
        await loadScript(account.appFile);
        
        document.body.style.cursor = 'default';
    } catch (error) {
        console.error('Erreur chargement scripts:', error);
        document.body.style.cursor = 'default';
        showNotification('❌ Erreur chargement des données', '#ff6b6b');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let accountParam = urlParams.get('account');
    
    if (accountParam) {
        const account = ACCOUNTS.find(a => a.id === accountParam);
        if (!account || account.status !== 'active') {
            const defaultAccount = getDefaultAccount();
            if (defaultAccount) {
                history.replaceState({}, '', `?account=${defaultAccount.id}`);
            }
        }
    }
    
    generateDropdown();
    updateAccountUI();
    await loadCurrentAccountScripts();
    
    document.getElementById('selectButton').addEventListener('click', toggleDropdown);
});