/**
 * app.js - MOTEUR D'AFFICHAGE (NE RIEN MODIFIER ICI SAUF SI VOUS SAVEZ)
 * 
 * Ce fichier lit les données de data.js et construit l'interface.
 * Il n'y a normalement rien à changer ici pour mettre à jour vos chiffres.
 * Tout se passe dans data.js !
 */

(function() {
    // Récupération des données (avec un fallback pour éviter les erreurs)
    const data = window.CHESS_DATA || {
        lastUpdate: "2025-01-01",
        elo: { bullet: { current: 1400, target: 1600 }, 
               blitz: { current: 1500, target: 1700 }, 
               rapide: { current: 1600, target: 1800 } },
        timeline: [],
        chart: { labels: [], bullet: [], blitz: [], rapide: [] },
        badges: { trophies: 0, peakBullet: 0, peakRapide: 0 },
        achievement: { active: false, text: '' }
    };

    // ------------------------------------------------------------------------
    // 1. AFFICHAGE DE LA DATE DE DERNIÈRE MISE À JOUR
    // ------------------------------------------------------------------------
    const updateDisplay = document.getElementById('lastUpdateDisplay');
    if (updateDisplay) {
        // Formater la date de manière élégante (ex: "23 février 2025")
        let formattedDate = data.lastUpdate || "Date non renseignée";
        if (data.lastUpdate && data.lastUpdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = data.lastUpdate.split('-');
            const months = [
                'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
            ];
            const monthName = months[parseInt(month) - 1];
            formattedDate = `${parseInt(day)} ${monthName} ${year}`;
        }
        updateDisplay.innerHTML = `
            <i class="fas fa-calendar-alt"></i>
            <span>mise à jour : ${formattedDate}</span>
        `;
    }

    // ------------------------------------------------------------------------
    // 2. AFFICHAGE DES CARTES ELO (Bullet, Blitz, Rapide)
    // ------------------------------------------------------------------------
    const container = document.getElementById('eloCardsContainer');
    if (container) {
        const modes = [
            { key: 'bullet', label: 'Bullet', icon: 'fa-clock' },
            { key: 'blitz', label: 'Blitz', icon: 'fa-bolt' },
            { key: 'rapide', label: 'Rapide', icon: 'fa-hourglass-half' }
        ];

        container.innerHTML = modes.map(mode => {
            const elo = data.elo[mode.key];
            if (!elo) return '';
            const percent = Math.min(100, (elo.current / elo.target) * 100).toFixed(1);
            const rest = elo.target - elo.current;
            return `
                <div class="elo-card">
                    <div class="mode-header">
                        <i class="fas ${mode.icon}"></i>
                        <h2>${mode.label}</h2>
                    </div>
                    <div class="elo-values">
                        <span class="current-elo">${elo.current}</span>
                        <span class="target-elo">/<span> ${elo.target}</span></span>
                    </div>
                    <div class="progress-wrapper">
                        <div class="progress-label">
                            <span>progression</span>
                            <span>${percent}%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-fill" style="width: ${percent}%;"></div>
                        </div>
                    </div>
                    <div class="goal-note"><i class="fas fa-chess-pawn"></i> reste ${rest} Elo</div>
                </div>
            `;
        }).join('');
    }

    // ------------------------------------------------------------------------
    // 3. AFFICHAGE DE LA TIMELINE (jalons)
    // ------------------------------------------------------------------------
    const timelineEl = document.getElementById('timelineList');
    if (timelineEl && data.timeline) {
        // Tri du plus récent au plus ancien
        const sorted = [...data.timeline].sort((a,b) => new Date(b.date) - new Date(a.date));
        timelineEl.innerHTML = sorted.slice(0,5).map(item => {
            // Correspondance icône → classe Font Awesome
            const iconMap = {
                'bolt': 'fa-bolt',
                'crown': 'fa-crown',
                'star': 'fa-star',
                'target': 'fa-bullseye',
                'trophy': 'fa-trophy'
            };
            const iconClass = iconMap[item.icon] || 'fa-chess-pawn';
            return `
                <div class="timeline-item">
                    <div class="timeline-icon"><i class="fas ${iconClass}"></i></div>
                    <div class="timeline-content">
                        <p>${item.desc} ${item.eloValue ? '<span style="color:#dcc48c;">🏅'+item.eloValue+'</span>' : ''}</p>
                        <small>${item.date}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ------------------------------------------------------------------------
    // 4. AFFICHAGE DU GRAPHIQUE D'ÉVOLUTION (Chart.js)
    // ------------------------------------------------------------------------
    const ctx = document.getElementById('eloChart')?.getContext('2d');
    if (ctx && data.chart && data.chart.labels.length) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.chart.labels,
                datasets: [
                    { 
                        label: 'bullet', 
                        data: data.chart.bullet, 
                        borderColor: '#2e8b57', 
                        backgroundColor: 'transparent', 
                        tension: 0.2, 
                        borderWidth: 3, 
                        pointBackgroundColor: '#b5974b' 
                    },
                    { 
                        label: 'blitz', 
                        data: data.chart.blitz, 
                        borderColor: '#b5974b', 
                        backgroundColor: 'transparent', 
                        tension: 0.2, 
                        borderWidth: 3 
                    },
                    { 
                        label: 'rapide', 
                        data: data.chart.rapide, 
                        borderColor: '#e5c78c', 
                        backgroundColor: 'transparent', 
                        tension: 0.2, 
                        borderWidth: 3 
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false }, 
                    tooltip: { backgroundColor: '#1f332c', titleColor: '#efdfa2' } 
                },
                scales: { 
                    y: { 
                        grid: { color: '#30584a' }, 
                        ticks: { color: '#b7cfc2' }, 
                        min: 300 
                    },
                    x: { 
                        ticks: { color: '#b7cfc2' } 
                    }
                }
            }
        });
    } else if (ctx) {
        // Fallback silencieux si les données sont manquantes
        ctx.font = "12px Inter";
        ctx.fillStyle = "#b5974b";
        ctx.fillText("données graphique indisponibles", 20, 120);
    }

    // ------------------------------------------------------------------------
    // 5. AFFICHAGE DE LA BANNIÈRE DE SUCCÈS
    // ------------------------------------------------------------------------
    const bannerDiv = document.getElementById('goalAchievedBanner');
    if (bannerDiv) {
        if (data.achievement && data.achievement.active) {
            bannerDiv.innerHTML = `
                <div class="achievement-banner">
                    <i class="fas fa-trophy"></i>
                    <span>${data.achievement.text}</span>
                    <i class="fas fa-trophy"></i>
                </div>
            `;
        } else {
            // Bannière par défaut (discrète) si aucun achievement actif
            bannerDiv.innerHTML = `
                <div class="achievement-banner" style="opacity:0.7; background:#1a3128;">
                    <i class="fas fa-chess-queen"></i>
                    <span>${data.badges.trophies} trophées · pic bullet ${data.badges.peakBullet}</span>
                    <i class="fas fa-chess-queen"></i>
                </div>
            `;
        }
    }

    // ------------------------------------------------------------------------
    // 6. AFFICHAGE DES BADGES DANS LE HEADER
    // ------------------------------------------------------------------------
    const headerBadges = document.getElementById('headerBadges');
    if (headerBadges && data.badges) {
        headerBadges.innerHTML = `
            <div class="stat-badge"><i class="fas fa-trophy"></i> ${data.badges.trophies} trophées</div>
            <div class="stat-badge"><i class="fas fa-bolt"></i> pic bullet ${data.badges.peakBullet}</div>
            <div class="stat-badge"><i class="fas fa-crown"></i> ${data.badges.peakRapide} (rapide)</div>
        `;
    }
})();