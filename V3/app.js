/**
 * app.js - MOTEUR D'AFFICHAGE
 */

(function() {
    // Vérifier que les données sont disponibles
    if (typeof window.CHESS_DATA === 'undefined') {
        console.error('Erreur: CHESS_DATA non trouvé. Vérifiez que data.js est chargé avant app.js');
        return;
    }
    
    const data = window.CHESS_DATA;

    // ------------------------------------------------------------------------
    // 1. DATE DE DERNIÈRE MISE À JOUR
    // ------------------------------------------------------------------------
    const updateDisplay = document.getElementById('lastUpdateDisplay');
    if (updateDisplay) {
        const [year, month, day] = data.lastUpdate.split('-');
        const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
        const formattedDate = `${parseInt(day)} ${months[parseInt(month)-1]} ${year}`;
        updateDisplay.innerHTML = `<i class="fas fa-calendar-alt"></i> ${formattedDate}`;
    }

    // ------------------------------------------------------------------------
    // 2. CARTES ELO (AVEC DATES LIMITES)
    // ------------------------------------------------------------------------
    const container = document.getElementById('eloCardsContainer');
    if (container) {
        const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
        const modes = [
            { key: 'bullet', label: 'Bullet', icon: 'fa-clock', color: '#4bc0c0' },
            { key: 'blitz', label: 'Blitz', icon: 'fa-bolt', color: '#ffb347' },
            { key: 'rapide', label: 'Rapide', icon: 'fa-hourglass-half', color: '#ff8c8c' }
        ];

        container.innerHTML = modes.map(mode => {
            const elo = data.elo[mode.key];
            const percent = Math.min(100, (elo.current / elo.target) * 100).toFixed(1);
            const rest = elo.target - elo.current;
            
            // Gestion de la date limite
            let deadlineHtml = '';
            if (data.deadlines && data.deadlines[mode.key]) {
                const deadlineDate = new Date(data.deadlines[mode.key]);
                const today = new Date();
                // Remettre l'heure à 0 pour comparer les jours correctement
                today.setHours(0, 0, 0, 0);
                deadlineDate.setHours(0, 0, 0, 0);
                
                const diffTime = deadlineDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                // Formater la date pour l'affichage
                const [year, month, day] = data.deadlines[mode.key].split('-');
                const formattedDeadline = `${parseInt(day)} ${months[parseInt(month)-1]} ${year}`;
                
                // Déterminer l'urgence
                let urgencyClass = '';
                let urgencyIcon = 'fa-calendar-check';
                
                if (diffDays < 0) {
                    urgencyClass = 'deadline-expired';
                    urgencyIcon = 'fa-exclamation-triangle';
                } else if (diffDays <= 7) {
                    urgencyClass = 'deadline-urgent';
                    urgencyIcon = 'fa-clock';
                } else if (diffDays <= 15) {
                    urgencyClass = 'deadline-warning';
                    urgencyIcon = 'fa-calendar-exclamation';
                }
                
                const daysText = diffDays >= 0 ? 
                    `· ${diffDays} jour${diffDays > 1 ? 's' : ''}` : 
                    '· DÉPASSÉE';
                
                deadlineHtml = `
                    <div class="deadline-note ${urgencyClass}">
                        <i class="fas ${urgencyIcon}"></i> 
                        limite : ${formattedDeadline} ${daysText}
                    </div>
                `;
            }
            
            return `
                <div class="elo-card">
                    <div class="mode-header">
                        <i class="fas ${mode.icon}" style="color:${mode.color};"></i>
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
                            <div class="progress-fill" style="width: ${percent}%; background:${mode.color};"></div>
                        </div>
                    </div>
                    <div class="goal-note"><i class="fas fa-flag"></i> reste ${rest} Elo</div>
                    ${deadlineHtml}
                </div>
            `;
        }).join('');
    }

    // ------------------------------------------------------------------------
    // 3. TIMELINE
    // ------------------------------------------------------------------------
    const timelineEl = document.getElementById('timelineList');
    if (timelineEl) {
        const sorted = [...data.timeline].sort((a,b) => new Date(b.date) - new Date(a.date));
        timelineEl.innerHTML = sorted.map(item => {
            const iconMap = { 
                'bolt': 'fa-bolt', 
                'serveur': 'fa-database',
                'balai': 'fa-broom',
                'trophy': 'fa-trophy', 
                'clock': 'fa-clock',
                'star': 'fa-star',
                'target': 'fa-bullseye'
            };
            const iconClass = iconMap[item.icon] || 'fa-chess-pawn';
            
            // Formater la date pour l'affichage
            const [year, month, day] = item.date.split('-');
            const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
            const formattedDate = `${parseInt(day)} ${months[parseInt(month)-1]} ${year}`;
            
            return `
                <div class="timeline-item">
                    <div class="timeline-icon"><i class="fas ${iconClass}"></i></div>
                    <div class="timeline-content">
                        <p>${item.desc} ${item.eloValue ? '<span style="color:#82c4a8;">· ' + item.eloValue + '</span>' : ''}</p>
                        <small>${formattedDate}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ------------------------------------------------------------------------
    // 4. GRAPHIQUE AVEC BARRES D'OBJECTIF
    // ------------------------------------------------------------------------
    const ctx = document.getElementById('eloChart')?.getContext('2d');
    if (ctx) {
        // S'assurer que le plugin annotation est enregistré
        if (typeof ChartAnnotation !== 'undefined') {
            Chart.register(ChartAnnotation);
        }
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.chart.labels,
                datasets: [
                    { 
                        label: 'bullet', 
                        data: data.chart.bullet, 
                        borderColor: '#4bc0c0', 
                        backgroundColor: 'transparent', 
                        tension: 0.2, 
                        borderWidth: 2.5,
                        pointBackgroundColor: '#4bc0c0',
                        pointBorderColor: '#fff',
                        pointRadius: 4
                    },
                    { 
                        label: 'blitz', 
                        data: data.chart.blitz, 
                        borderColor: '#ffb347', 
                        backgroundColor: 'transparent', 
                        tension: 0.2, 
                        borderWidth: 2.5,
                        pointBackgroundColor: '#ffb347',
                        pointBorderColor: '#fff',
                        pointRadius: 4
                    },
                    { 
                        label: 'rapide', 
                        data: data.chart.rapide, 
                        borderColor: '#ff8c8c', 
                        backgroundColor: 'transparent', 
                        tension: 0.2, 
                        borderWidth: 2.5,
                        pointBackgroundColor: '#ff8c8c',
                        pointBorderColor: '#fff',
                        pointRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                    legend: { display: false },
                    tooltip: { 
                        backgroundColor: '#1e2c34',
                        titleColor: '#fff',
                        bodyColor: '#a0b8c7',
                        borderColor: '#354f5c',
                        borderWidth: 1
                    },
                    annotation: {
                        annotations: {
                            bulletTarget: {
                                type: 'line',
                                yMin: data.elo.bullet.target,
                                yMax: data.elo.bullet.target,
                                borderColor: '#4bc0c0',
                                borderWidth: 2,
                                borderDash: [6, 6],
                                label: {
                                    display: true,
                                    content: 'Bullet',
                                    position: 'end',
                                    backgroundColor: '#4bc0c0',
                                    color: '#fff',
                                    font: { size: 10, weight: 'bold' },
                                    padding: 4
                                }
                            },
                            blitzTarget: {
                                type: 'line',
                                yMin: data.elo.blitz.target,
                                yMax: data.elo.blitz.target,
                                borderColor: '#ffb347',
                                borderWidth: 2,
                                borderDash: [6, 6],
                                label: {
                                    display: true,
                                    content: 'Blitz',
                                    position: 'end',
                                    backgroundColor: '#ffb347',
                                    color: '#fff',
                                    font: { size: 10, weight: 'bold' },
                                    padding: 4
                                }
                            },
                            rapideTarget: {
                                type: 'line',
                                yMin: data.elo.rapide.target,
                                yMax: data.elo.rapide.target,
                                borderColor: '#ff8c8c',
                                borderWidth: 2,
                                borderDash: [6, 6],
                                label: {
                                    display: true,
                                    content: 'Rapide',
                                    position: 'end',
                                    backgroundColor: '#ff8c8c',
                                    color: '#fff',
                                    font: { size: 10, weight: 'bold' },
                                    padding: 4
                                }
                            }
                        }
                    }
                },
                scales: { 
                    y: { 
                        grid: { color: '#253b47' }, 
                        ticks: { color: '#a0b8c7' },
                        min: 300,
                        max: 1300
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#a0b8c7' } 
                    }
                }
            }
        });
    }

    // ------------------------------------------------------------------------
    // 5. BANNIÈRE
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
            bannerDiv.innerHTML = `
                <div class="achievement-banner" style="opacity:0.8;">
                    <i class="fas fa-chart-line"></i>
                    <span>${data.badges.trophies} trophées · pic ${data.badges.peakBullet}</span>
                </div>
            `;
        }
    }

    // ------------------------------------------------------------------------
    // 6. BADGES HEADER
    // ------------------------------------------------------------------------
    const headerBadges = document.getElementById('headerBadges');
    if (headerBadges) {
        headerBadges.innerHTML = `
            <div class="stat-badge"><i class="fas fa-trophy"></i> ${data.badges.trophies} trophées</div>
            <div class="stat-badge"><i class="fas fa-bolt"></i> pic ${data.badges.peakBullet}</div>
            <div class="stat-badge"><i class="fas fa-hourglass-half"></i> pic ${data.badges.peakRapide}</div>
        `;
    }
})();