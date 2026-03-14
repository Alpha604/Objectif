/**
 * data/data-karen.js - Données pour Karen Karapetyan
 */

window.CHESS_DATA = {
    lastUpdate: "2026-02-28",
    elo: {
        bullet: { current: 100, target: 200 },  // Modifie ici
        blitz: { current: 100, target: 200 },    // Modifie ici
        rapide: { current: 100, target: 200 },   // Modifie ici
    },
    deadlines: {
        bullet: "2026-05-01",
        blitz: "2026-05-15",
        rapide: "2026-06-01",
        daily: "2026-07-01"
    },
    timeline: [

    ],
    chart: {
        labels: ["Sept", "Oct", "Nov", "Déc", "Janv", "Mars", "Maintenant"],
        bullet: [100, 100, 100, 100, 100, 100, 100],
        blitz: [100, 100, 100, 100, 100, 100, 100],
        rapide: [100, 100, 100, 100, 100, 100, 100]
    },
    badges: {
        trophies: 8,
        peakBullet: 100,
        peakRapide: 111
    },
    achievement: {
        active: true,
        text: "🏆 Objectif Maître FIDE en cours · plus que 150 Elo"
    }
};