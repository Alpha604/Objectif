/**
 * data/data-karen.js - Données pour Karen Karapetyan
 */

window.CHESS_DATA = {
    lastUpdate: "2026-02-28",
    elo: {
        bullet: { current: 1450, target: 1600 },
        blitz: { current: 1380, target: 1500 },
        rapide: { current: 1420, target: 1550 },
        daily: { current: 1300, target: 1400 }
    },
    deadlines: {
        bullet: "2026-05-01",
        blitz: "2026-05-15",
        rapide: "2026-06-01",
        daily: "2026-07-01"
    },
    timeline: [
        { date: "2025-11-15", desc: "Victoire tournoi blitz", icon: "trophy", eloValue: "1450" },
        { date: "2025-12-20", desc: "Record personnel Bullet", icon: "bolt", eloValue: "1500" },
        { date: "2026-01-05", desc: "Qualification championnat", icon: "star", eloValue: "✔️" },
        { date: "2026-02-10", desc: "Série de 10 victoires", icon: "target", eloValue: "Blitz" },
        { date: "2026-02-25", desc: "Nouveau pic Rapide", icon: "clock", eloValue: "1420" }
    ],
    chart: {
        labels: ["Sept", "Oct", "Nov", "Déc", "Janv", "Maintenant"],
        bullet: [1200, 1280, 1350, 1400, 1420, 1450],
        blitz: [1150, 1180, 1250, 1300, 1350, 1380],
        rapide: [1180, 1220, 1300, 1350, 1400, 1420]
    },
    badges: {
        trophies: 8,
        peakBullet: 1450,
        peakRapide: 1420
    },
    achievement: {
        active: true,
        text: "🏆 Objectif Maître FIDE en cours · plus que 150 Elo"
    }
};