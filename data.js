/**
 * data.js - FICHIER DE DONNÉES CENTRAL
 * 
 * CE FICHIER CONTIENT TOUTES VOS DONNÉES DE PROGRESSION.
 * C'est ici que vous devez modifier les chiffres, dates et objectifs.
 * La structure est commentée pour une compréhension immédiate.
 */

window.CHESS_DATA = {
    // ------------------------------------------------------------------------
    // 0. DATE DE DERNIÈRE MISE À JOUR
    //    Indiquez ici la date à laquelle vous avez modifié les données.
    //    Format: "YYYY-MM-DD" (ex: "2025-02-23")
    // ------------------------------------------------------------------------
    lastUpdate: "2026-02-25",

    // ------------------------------------------------------------------------
    // 1. OBJECTIFS ELO PAR CATÉGORIE
    //    Modifiez les valeurs 'current' (votre Elo actuel) et 'target' (objectif)
    // ------------------------------------------------------------------------
    elo: {
        bullet: { 
            current: 1087,   // Votre Elo actuel en Bullet
            target: 1450      // Objectif à atteindre
        },
        blitz: {  
            current: 961,    // Elo Blitz actuel
            target: 1000      // Objectif Blitz
        },
        rapide: { 
            current: 896,    // Elo Rapide actuel
            target: 1000      // Objectif Rapide
        }
    },

    // ------------------------------------------------------------------------
    // 2. TIMELINE / JALONS IMPORTANTS
    //    Ajoutez ou modifiez des entrées pour vos records et moments clés.
    //    - date : au format YYYY-MM-DD (année-mois-jour)
    //    - desc : description de l'événement
    //    - icon : icône Font Awesome (sans le préfixe 'fa-') : "bolt", "crown", "star", "target", "trophy"...
    //    - eloValue : (optionnel) Elo associé à cet événement
    // ------------------------------------------------------------------------
    
    timeline: [
        { date: "2025-12-01", desc: "Passage Bullet 1000", icon: "bolt", eloValue: 1000 },
        // Ajoutez d'autres lignes en respectant le format (virgule entre les lignes)
    ],

    // ------------------------------------------------------------------------
    // 3. DONNÉES POUR LE GRAPHIQUE D'ÉVOLUTION (6 derniers mois)
    //    - labels : les noms des mois (ou périodes) à afficher sur l'axe X
    //    - bullet / blitz / rapide : les valeurs Elo pour chaque mois (dans l'ordre)
    //    Attention : les trois tableaux doivent avoir le même nombre d'éléments.
    // ------------------------------------------------------------------------
    chart: {
        labels: ["Sept", "Oct", "Nov", "Déc", "Janv", "Fevr", "Maintenant"],
        bullet: [355, 524, 789, 1001, 973, 1047, 1087],   // Évolution bullet
        blitz:  [605, 542, 421, 494, 510, 907, 961],   // Évolution blitz
        rapide: [416, 426, 525, 586, 615, 816, 896],    // Évolution rapide
    },

    // ------------------------------------------------------------------------
    // 4. BADGES RÉCAPITULATIFS (affichés à côté du titre)
    //    Ces petites statistiques donnent un aperçu rapide de vos meilleurs scores.
    // ------------------------------------------------------------------------
    badges: {
        trophies: 3,          // Nombre de trophées (ou distinctions)
        peakBullet: 1087,      // Votre meilleur Elo Bullet historique
        peakRapide: 897       // Votre meilleur Elo Rapide historique
    },

    // ------------------------------------------------------------------------
    // 5. BANNIÈRE DE SUCCÈS (objectif récent à mettre en avant)
    //    active : true pour afficher la bannière, false pour la masquer
    //    text : message à afficher (supporte les émojis et caractères spéciaux)
    // ------------------------------------------------------------------------
    achievement: {
        active: true,
        text: "🏆 Objectif bullet 1450 atteint le 01 janvier 2027"
    }
};

// Permet l'export pour environnement Node (optionnel, sans impact sur le navigateur)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.CHESS_DATA;
}