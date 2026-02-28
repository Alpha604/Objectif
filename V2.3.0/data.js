/**
 * data.js - FICHIER DE DONNÉES CENTRAL
 * Modifiez ici vos chiffres, dates et objectifs
 */

window.CHESS_DATA = {
    // Date de dernière mise à jour (YYYY-MM-DD)
    lastUpdate: "2026-02-28",

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
            current: 920,    
            target: 1000      
        }
    },

    // ⏰ DATES LIMITES POUR LES OBJECTIFS
    deadlines: {
        bullet: "2026-04-01",
        blitz: "2026-04-01",
        rapide: "2026-04-01"
    },

    // Timeline / jalons importants
    timeline: [
        { date: "2025-12-01", desc: "Passage bullet 1000", icon: "bolt", eloValue: "1000" },
        { date: "2025-12-15", desc: "Nouvelle version du site", icon: "serveur", eloValue: "V2.1.0" },
        { date: "2026-01-10", desc: "Modification du style", icon: "balai", eloValue: "PRO" },
        { date: "2026-02-01", desc: "Record personnel Blitz", icon: "trophy", eloValue: "961" },
        { date: "2026-02-20", desc: "Ajout des dates limites", icon: "clock", eloValue: "deadlines" }
    ],

    // Données pour le graphique (6 derniers mois)
    chart: {
        labels: ["Sept", "Oct", "Nov", "Déc", "Janv", "Maintenant"],
        bullet: [355, 524, 789, 1001, 1047, 1087],
        blitz: [605, 542, 421, 510, 907, 961],
        rapide: [416, 426, 525, 615, 816, 920]
    },

    // Badges récapitulatifs
    badges: {
        trophies: 3,
        peakBullet: 1087,
        peakRapide: 920
    },

    // Bannière de succès
    achievement: {
        active: true,
        text: "🏆 Objectif Bullet 1150 en cours · plus que 63 Elo"
    }
};