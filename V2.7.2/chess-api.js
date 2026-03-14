/**
 * chess-api.js - Récupération des ELO depuis Chess.com via proxy CORS
 */

const CHESS_API = {
    // Utiliser un proxy CORS pour éviter les blocages
    PROXY_URL: 'https://api.allorigins.win/raw?url=',
    
    // Récupérer les stats d'un joueur
    async getPlayerStats(username) {
        try {
            // Tentative 1: Avec proxy
            const proxyUrl = `${this.PROXY_URL}${encodeURIComponent(`https://api.chess.com/pub/player/${username}/stats`)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Vérifier que les données sont valides
            if (!data || Object.keys(data).length === 0) {
                throw new Error('Données vides reçues');
            }
            
            return {
                success: true,
                data: data,
                lastUpdate: new Date().toISOString().split('T')[0]
            };
            
        } catch (error) {
            console.warn('Erreur avec proxy 1, tentative avec proxy 2...', error);
            
            try {
                // Tentative 2: Proxy de secours
                const backupProxy = 'https://corsproxy.io/?';
                const proxyUrl = `${backupProxy}${encodeURIComponent(`https://api.chess.com/pub/player/${username}/stats`)}`;
                const response = await fetch(proxyUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                return {
                    success: true,
                    data: data,
                    lastUpdate: new Date().toISOString().split('T')[0]
                };
                
            } catch (backupError) {
                console.error('Tous les proxies ont échoué:', backupError);
                
                // Dernière tentative: sans proxy (si en local ou extension CORS)
                try {
                    const directResponse = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
                    if (directResponse.ok) {
                        const data = await directResponse.json();
                        return {
                            success: true,
                            data: data,
                            lastUpdate: new Date().toISOString().split('T')[0]
                        };
                    }
                } catch (directError) {
                    // Ignorer, on retournera false
                }
                
                return {
                    success: false,
                    error: 'Impossible de contacter l\'API Chess.com'
                };
            }
        }
    },
    
    // Mettre à jour uniquement les ELO
    updateEloInChessData(chessData, apiData) {
        if (!chessData) {
            console.warn('chessData est null');
            return chessData;
        }
        
        try {
            // Mettre à jour les ELO
            if (apiData.chess_blitz && apiData.chess_blitz.last) {
                chessData.elo.blitz.current = apiData.chess_blitz.last.rating;
                console.log('Blitz mis à jour:', apiData.chess_blitz.last.rating);
            }
            
            if (apiData.chess_bullet && apiData.chess_bullet.last) {
                chessData.elo.bullet.current = apiData.chess_bullet.last.rating;
                console.log('Bullet mis à jour:', apiData.chess_bullet.last.rating);
            }
            
            if (apiData.chess_rapid && apiData.chess_rapid.last) {
                chessData.elo.rapide.current = apiData.chess_rapid.last.rating;
                console.log('Rapide mis à jour:', apiData.chess_rapid.last.rating);
            }
            
            if (apiData.chess_daily && apiData.chess_daily.last) {
                chessData.elo.daily.current = apiData.chess_daily.last.rating;
            }
            
            // Mettre à jour les meilleurs scores
            if (apiData.chess_blitz?.best?.rating) {
                chessData.badges.peakBlitz = apiData.chess_blitz.best.rating;
            }
            if (apiData.chess_bullet?.best?.rating) {
                chessData.badges.peakBullet = apiData.chess_bullet.best.rating;
            }
            if (apiData.chess_rapid?.best?.rating) {
                chessData.badges.peakRapide = apiData.chess_rapid.best.rating;
            }
            
            // Mettre à jour la date
            chessData.lastUpdate = new Date().toISOString().split('T')[0];
            
            // Mettre à jour le texte d'objectif
            const mainMode = this.getMainMode(chessData);
            if (mainMode && chessData.elo[mainMode]) {
                const current = chessData.elo[mainMode].current;
                const target = chessData.elo[mainMode].target;
                const rest = target - current;
                if (rest > 0) {
                    chessData.achievement.text = `🏆 Objectif ${mainMode} ${target} · plus que ${rest} Elo`;
                } else {
                    chessData.achievement.text = `🎉 Objectif ${mainMode} atteint ! (${current}/${target})`;
                }
            }
            
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données:', error);
        }
        
        return chessData;
    },
    
    // Déterminer le mode principal
    getMainMode(chessData) {
        if (!chessData || !chessData.elo) return null;
        if (chessData.elo.blitz && chessData.elo.blitz.current) return 'blitz';
        if (chessData.elo.bullet && chessData.elo.bullet.current) return 'bullet';
        if (chessData.elo.rapide && chessData.elo.rapide.current) return 'rapide';
        return null;
    }
};

// Fonction pour charger un script avec timeout
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            existingScript.remove();
        }
        
        const script = document.createElement('script');
        script.src = src + '?t=' + Date.now();
        
        // Timeout de 5 secondes
        const timeout = setTimeout(() => {
            reject(new Error('Timeout chargement script'));
        }, 5000);
        
        script.onload = () => {
            clearTimeout(timeout);
            resolve();
        };
        
        script.onerror = (error) => {
            clearTimeout(timeout);
            reject(error);
        };
        
        document.head.appendChild(script);
    });
}

// Fonction principale
async function loadAccountDataWithSource(account) {
    if (account.source === 'online' && account.chessUsername) {
        try {
            document.body.style.cursor = 'wait';
            
            showNotification(`🌐 Connexion à Chess.com pour ${account.name}...`, '#82c4a8');
            
            // 1. Charger les données manuelles d'abord
            console.log('Chargement des données manuelles...');
            await loadScript(account.dataFile);
            
            if (!window.CHESS_DATA) {
                throw new Error('Impossible de charger les données manuelles');
            }
            
            console.log('Données manuelles chargées:', window.CHESS_DATA);
            showNotification(`📊 Données de base chargées`, '#82c4a8');
            
            // 2. Récupérer les ELO depuis l'API
            console.log('Récupération des ELO depuis Chess.com...');
            const result = await CHESS_API.getPlayerStats(account.chessUsername);
            
            if (result.success) {
                console.log('Données API reçues:', result.data);
                
                // 3. Mettre à jour uniquement les ELO
                window.CHESS_DATA = CHESS_API.updateEloInChessData(window.CHESS_DATA, result.data);
                
                showNotification(`✅ ELO mis à jour : Bullet ${window.CHESS_DATA.elo.bullet.current} · Blitz ${window.CHESS_DATA.elo.blitz.current}`, '#82c4a8');
            } else {
                console.warn('Échec API, conservation des données manuelles');
                showNotification(`⚠️ Utilisation des données manuelles (mode hors-ligne)`, '#ffb347');
            }
            
            document.body.style.cursor = 'default';
            return true;
            
        } catch (error) {
            console.error('Erreur détaillée:', error);
            showNotification(`❌ Erreur: ${error.message}`, '#ff6b6b');
            
            // Fallback : charger juste les données manuelles si pas déjà fait
            if (!window.CHESS_DATA) {
                try {
                    await loadScript(account.dataFile);
                } catch (e) {
                    console.error('Fallback échoué aussi');
                }
            }
            
            document.body.style.cursor = 'default';
            return false;
        }
    } else {
        // Mode manuel
        try {
            await loadScript(account.dataFile);
            return true;
        } catch (error) {
            console.error('Erreur chargement manuel:', error);
            return false;
        }
    }
}

// Fonction pour afficher une notification
function showNotification(message, color) {
    // Supprimer les anciennes notifications
    const oldNotifications = document.querySelectorAll('.chess-notification');
    oldNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'chess-notification';
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
        max-width: 300px;
        word-wrap: break-word;
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
    }, 5000);
}