/**
 * data/data.js - Données pour AlphaRomo604
 */

window.CHESS_DATA = {
    lastUpdate: "2026-03-11",
    elo: {
        bullet: { current: 1107, target: 1200 },
        blitz: { current: 1105, target: 1100 },
        rapide: { current: 1037, target: 1000 },
    },
    deadlines: {
        bullet: "2026-04-01",
        blitz: "2026-04-01",
        rapide: "2026-04-01",
        daily: "2026-12-01"
    },
    timeline: [
        { date: "2025-12-01", desc: "Passage bullet 1000", icon: "bolt", eloValue: "1000" },
        { date: "2025-12-15", desc: "Nouvelle version du site", icon: "serveur", eloValue: "V2.1.0" },
        { date: "2026-01-10", desc: "Modification du style", icon: "balai", eloValue: "PRO" },
        { date: "2026-02-01", desc: "Record personnel Blitz", icon: "trophy", eloValue: "961" },
        { date: "2026-02-20", desc: "Ajout des dates limites", icon: "clock", eloValue: "deadlines" },
        { date: "2026-02-28", desc: "Passage 1100 Bullet", icon: "bolt", eloValue: "1100" }
    ],
    chart: {
        labels: ["Sept", "Oct", "Nov", "Déc", "Janv", "Fevr", "Maintenant"],
        bullet: [355, 524, 789, 1001, 1047, 1104, 1107],
        blitz: [605, 542, 421, 510, 907, 999, 1105],
        rapide: [416, 426, 525, 615, 816, 920, 1037]
    },
    badges: {
        trophies: 3,
        peakBullet: 1122,
        peakRapide: 1037
    },
    achievement: {
        active: true,
        text: "🏆 Objectif Bullet 1150 en cours · plus que 46 Elo"
    }
};