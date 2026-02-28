/**
 * loader.js - Chargeur dynamique de comptes avec rafraîchissement
 */

let currentAccountId = 'alpha604';
let currentApp = null;
let currentChart = null;

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

// Fonction pour charger un script
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            setTimeout(resolve, 50);
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Appliquer la palette de couleurs au thème
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
    
    // Vérifier le statut
    switch(account.status) {
        case 'banned':
            console.warn(`Compte ${account.name} est banni`);
            showNotification(`❌ Le compte ${account.name} a été banni`, '#f89898');
            return;
            
        case 'blocked':
            console.warn(`Compte ${account.name} est bloqué`);
            showNotification(`🔒 Le compte ${account.name} est actuellement bloqué`, '#faca86');
            return;
            
        case 'loading':
            console.warn(`Compte ${account.name} est en cours de chargement`);
            showNotification(`⏳ Le compte ${account.name} est en cours de configuration`, '#f8be6d');
            return;
            
        case 'active':
            // Rafraîchir la page avec le nouveau compte
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
        color: white;
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
    
    // Animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        notification.style.transition = 'all 0.3s ease';
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Mettre à jour l'UI avec les infos du compte
function updateAccountUI() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('account') || 'alpha604';
    
    let account = ACCOUNTS.find(a => a.id === accountId);
    
    // Si le compte n'existe pas ou n'est pas actif, prendre le premier compte actif
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

// Générer le dropdown avec TOUS les comptes sauf les bannis
function generateDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    const urlParams = new URLSearchParams(window.location.search);
    const currentAccountId = urlParams.get('account') || 'alpha604';
    
    // Utiliser les comptes visibles (exclut les bannis)
    const visibleAccounts = getVisibleAccounts();
    
    dropdown.innerHTML = visibleAccounts.map(account => {
        const avatar = AVATARS[account.avatarId] || AVATARS.default;
        const isSelected = account.id === currentAccountId;
        const palette = COLOR_PALETTES[account.palette] || COLOR_PALETTES['alpha604'];
        const isClickable = account.status === 'active';
        const statusIcon = getStatusIcon(account.status);
        
        // Style différent pour les comptes non cliquables
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
                    </span>
                    <span class="account-handle">${account.handle}</span>
                </div>
                ${!isClickable ? '<span class="status-badge" style="font-size: 10px; color: #a0b8c7; margin-left: auto;">' + 
                    (account.status === 'blocked' ? 'Bloqué' : 'En cours') + '</span>' : ''}
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const accountId = item.dataset.account;
            const status = item.dataset.status;
            
            if (status !== 'active') {
                // Afficher une notification selon le statut
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

// Mettre à jour la sélection dans le dropdown
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

// Gestion du dropdown
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    const button = document.getElementById('selectButton');
    dropdown.classList.toggle('show');
    button.classList.toggle('open');
}

// Fermer le dropdown si on clique ailleurs
document.addEventListener('click', (e) => {
    const selector = document.querySelector('.account-selector');
    const dropdown = document.getElementById('dropdownMenu');
    const button = document.getElementById('selectButton');
    
    if (!selector.contains(e.target) && dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('open');
    }
});

// Charger les scripts nécessaires pour le compte courant
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
        await loadScript(account.dataFile);
        await loadScript(account.appFile);
        document.body.style.cursor = 'default';
    } catch (error) {
        console.error('Erreur chargement scripts:', error);
        document.body.style.cursor = 'default';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Vérifier l'URL au chargement
    const urlParams = new URLSearchParams(window.location.search);
    let accountParam = urlParams.get('account');
    
    // Si le compte dans l'URL n'est pas actif, rediriger vers le défaut
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