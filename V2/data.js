/**
 * data.js - FICHIER DE DONNÉES CENTRAL
 * Modifiez ici vos chiffres, dates et objectifs
 */

window.CHESS_DATA = {
    // Date de dernière mise à jour (YYYY-MM-DD)
    lastUpdate: "2026-02-26",

    // Objectifs Elo par catégorie
    elo: {
        bullet: { 
            current: 1087,   // Elo actuel
            target: 1200      // Objectif
        },
        blitz: {  
            current: 961,    
            target: 1100      
        },
        rapide: { 
            current: 912,    
            target: 1000      
        }
    },

    // Timeline / jalons importants
    timeline: [
        { date: "2025-12-01", desc: "Passage bullet", icon: "bolt", eloValue: 1000 },
        { date: "2025-12-01", desc: "Nouvelle version du site", icon: "serveur", eloValue: 'V2.1.0' },
        { date: "2025-12-01", desc: "D", icon: "balai", eloValue: 'PRO' },
    ],

    // Données pour le graphique (6 derniers mois)
    chart: {
        labels: ["Sept", "Oct", "Nov", "Déc", "Janv", "Fév"],
        bullet: [355, 524, 789, 1001, 1047, 1087],
        blitz: [605, 542, 421, 510, 907, 961],
        rapide: [416, 426, 525, 615, 816, 912]
    },

    // Badges récapitulatifs
    badges: {
        trophies: 3,
        peakBullet: 1087,
        peakRapide: 897
    },

    // Bannière de succès
    achievement: {
        active: true,
        text: "🏆 Objectif Bullet 1150 en cours · plus que 63 Elo"
    }
};