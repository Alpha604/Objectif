/**
 * data/data-martin.js - Données pour LgMartinIsCool
 */

window.CHESS_DATA = {
    lastUpdate: "2026-02-28",
    elo: {
        bullet: { current: 1400, target: 1550 },  // Modifie ici
        blitz: { current: 1350, target: 1450 },    // Modifie ici
        rapide: { current: 1360, target: 1450 },   // Modifie ici
        daily: { current: 1250, target: 1350 }
    },
    deadlines: {
        bullet: "2026-05-01",
        blitz: "2026-05-15",
        rapide: "2026-06-01",
        daily: "2026-07-01"
    },
    timeline: [
        { date: "2025-11-20", desc: "Début du projet", icon: "rocket", eloValue: "1200" },
        { date: "2025-12-10", desc: "Premier record Blitz", icon: "bolt", eloValue: "1300" },
        { date: "2026-01-15", desc: "Intégration au dashboard", icon: "star", eloValue: "✔️" },
        { date: "2026-02-01", desc: "Série de victoires", icon: "trophy", eloValue: "8" },
        { date: "2026-02-20", desc: "Nouveau pic personnel", icon: "clock", eloValue: "1360" }
    ],
    chart: {
        labels: ["Sept", "Oct", "Nov", "Déc", "Janv", "Maintenant"],
        bullet: [1100, 1180, 1250, 1320, 1380, 1400],
        blitz: [1050, 1120, 1180, 1250, 1300, 1350],
        rapide: [1080, 1150, 1200, 1280, 1320, 1360]
    },
    badges: {
        trophies: 5,
        peakBullet: 1400,
        peakRapide: 1360
    },
    achievement: {
        active: true,
        text: "🏆 Objectif 1500 en cours · plus que 100 Elo"
    }
};