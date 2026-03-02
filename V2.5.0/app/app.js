/**
 * app/app.js - Application pour AlphaRomo604
 */

(function() {
    function init() {
        if (!window.CHESS_DATA) {
            setTimeout(init, 100);
            return;
        }
        
        const data = window.CHESS_DATA;
        let chart = null;

        // Palette spécifique à Alpha (sera aussi appliquée par le CSS)
        const colors = COLOR_PALETTES['alpha604'];

        // ------------------------------------------------------------------------
        // DATE DE DERNIÈRE MISE À JOUR
        // ------------------------------------------------------------------------
        const updateDisplay = document.getElementById('lastUpdateDisplay');
        if (updateDisplay) {
            const [year, month, day] = data.lastUpdate.split('-');
            const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
            const formattedDate = `${parseInt(day)} ${months[parseInt(month)-1]} ${year}`;
            updateDisplay.innerHTML = `<i class="fas fa-calendar-alt"></i> ${formattedDate}`;
        }

        // ------------------------------------------------------------------------
        // CARTES ELO
        // ------------------------------------------------------------------------
        const container = document.getElementById('eloCardsContainer');
        if (container) {
            const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
            const modes = [
                { key: 'bullet', label: 'Bullet', icon: 'fa-clock', color: colors.bullet },
                { key: 'blitz', label: 'Blitz', icon: 'fa-bolt', color: colors.blitz },
                { key: 'rapide', label: 'Rapide', icon: 'fa-hourglass-half', color: colors.rapide },
                { key: 'daily', label: 'Journalier', icon: 'fa-solid fa-clock', color: colors.daily }
            ];

            container.innerHTML = modes.map(mode => {
                const elo = data.elo[mode.key];
                if (!elo) return '';
                
                const percent = Math.min(100, (elo.current / elo.target) * 100).toFixed(1);
                const rest = elo.target - elo.current;
                
                let deadlineHtml = '';
                if (data.deadlines && data.deadlines[mode.key]) {
                    const deadlineDate = new Date(data.deadlines[mode.key]);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    deadlineDate.setHours(0, 0, 0, 0);
                    
                    const diffTime = deadlineDate - today;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    const [year, month, day] = data.deadlines[mode.key].split('-');
                    const formattedDeadline = `${parseInt(day)} ${months[parseInt(month)-1]} ${year}`;
                    
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
                            <span class="target-elo">/<span style="color:${colors.primary};"> ${elo.target}</span></span>
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
                        <div class="goal-note"><i class="fas fa-flag" style="color:${colors.primary};"></i> reste ${rest} Elo</div>
                        ${deadlineHtml}
                    </div>
                `;
            }).join('');
        }

        // ------------------------------------------------------------------------
        // TIMELINE
        // ------------------------------------------------------------------------
        const timelineEl = document.getElementById('timelineList');
        if (timelineEl && data.timeline) {
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
                
                const [year, month, day] = item.date.split('-');
                const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
                const formattedDate = `${parseInt(day)} ${months[parseInt(month)-1]} ${year}`;
                
                return `
                    <div class="timeline-item">
                        <div class="timeline-icon"><i class="fas ${iconClass}" style="color:${colors.primary};"></i></div>
                        <div class="timeline-content">
                            <p>${item.desc} ${item.eloValue ? '<span style="color:' + colors.primary + ';">· ' + item.eloValue + '</span>' : ''}</p>
                            <small>${formattedDate}</small>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // ------------------------------------------------------------------------
        // GRAPHIQUE
        // ------------------------------------------------------------------------
        const ctx = document.getElementById('eloChart')?.getContext('2d');
        if (ctx && data.chart) {
            if (window.currentChart) {
                window.currentChart.destroy();
            }
            
            if (typeof ChartAnnotation !== 'undefined') {
                Chart.register(ChartAnnotation);
            }
            
            window.currentChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.chart.labels,
                    datasets: [
                        { 
                            label: 'bullet', 
                            data: data.chart.bullet, 
                            borderColor: colors.bullet, 
                            backgroundColor: 'transparent', 
                            tension: 0.2, 
                            borderWidth: 2.5,
                            pointBackgroundColor: colors.bullet,
                            pointBorderColor: '#fff',
                            pointRadius: 4
                        },
                        { 
                            label: 'blitz', 
                            data: data.chart.blitz, 
                            borderColor: colors.blitz, 
                            backgroundColor: 'transparent', 
                            tension: 0.2, 
                            borderWidth: 2.5,
                            pointBackgroundColor: colors.blitz,
                            pointBorderColor: '#fff',
                            pointRadius: 4
                        },
                        { 
                            label: 'rapide', 
                            data: data.chart.rapide, 
                            borderColor: colors.rapide, 
                            backgroundColor: 'transparent', 
                            tension: 0.2, 
                            borderWidth: 2.5,
                            pointBackgroundColor: colors.rapide,
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
                                    borderColor: colors.bullet,
                                    borderWidth: 2,
                                    borderDash: [6, 6],
                                    label: {
                                        display: true,
                                        content: 'Bullet',
                                        position: 'end',
                                        backgroundColor: colors.bullet,
                                        color: '#fff',
                                        font: { size: 10, weight: 'bold' },
                                        padding: 4
                                    }
                                },
                                blitzTarget: {
                                    type: 'line',
                                    yMin: data.elo.blitz.target,
                                    yMax: data.elo.blitz.target,
                                    borderColor: colors.blitz,
                                    borderWidth: 2,
                                    borderDash: [6, 6],
                                    label: {
                                        display: true,
                                        content: 'Blitz',
                                        position: 'end',
                                        backgroundColor: colors.blitz,
                                        color: '#fff',
                                        font: { size: 10, weight: 'bold' },
                                        padding: 4
                                    }
                                },
                                rapideTarget: {
                                    type: 'line',
                                    yMin: data.elo.rapide.target,
                                    yMax: data.elo.rapide.target,
                                    borderColor: colors.rapide,
                                    borderWidth: 2,
                                    borderDash: [6, 6],
                                    label: {
                                        display: true,
                                        content: 'Rapide',
                                        position: 'end',
                                        backgroundColor: colors.rapide,
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
        // BANNIÈRE
        // ------------------------------------------------------------------------
        const bannerDiv = document.getElementById('goalAchievedBanner');
        if (bannerDiv) {
            if (data.achievement && data.achievement.active) {
                bannerDiv.innerHTML = `
                    <div class="achievement-banner">
                        <i class="fas fa-trophy" style="color: ${colors.primary};"></i>
                        <span>${data.achievement.text}</span>
                        <i class="fas fa-trophy" style="color: ${colors.primary};"></i>
                    </div>
                `;
            } else if (data.badges) {
                bannerDiv.innerHTML = `
                    <div class="achievement-banner" style="opacity:0.8;">
                        <i class="fas fa-chart-line"></i>
                        <span>${data.badges.trophies || 0} trophées · pic ${data.badges.peakBullet || 0}</span>
                    </div>
                `;
            }
        }

        // ------------------------------------------------------------------------
        // BADGES HEADER
        // ------------------------------------------------------------------------
        const headerBadges = document.getElementById('headerBadges');
        if (headerBadges && data.badges) {
            headerBadges.innerHTML = `
                <div class="stat-badge"><i class="fas fa-trophy" style="color: ${colors.primary};"></i> ${data.badges.trophies || 0} trophées</div>
                <div class="stat-badge"><i class="fas fa-bolt" style="color: ${colors.primary};"></i> pic ${data.badges.peakBullet || 0}</div>
                <div class="stat-badge"><i class="fas fa-hourglass-half" style="color: ${colors.primary};"></i> pic ${data.badges.peakRapide || 0}</div>
            `;
        }
    }

    init();
})();