/**
 * versions-data.js - Données des versions et mises à jour
 * Fichier externe pour version.html
 */

const VERSIONS_DATA = {
    // Version actuelle (sera détectée automatiquement depuis le dossier)
    currentVersion: "V2.6.1",
    
    // Historique complet des versions
    history: [
        {
            version: "V2.7.0",
            date: "2026-03-11",
            title: "Modal Developeur + Amélioration des resultats API chess.com",
            type: "new",
            changes: [
                "🔧 Modale de test developpeur console etc",
                "🔒 Protection avec mot de passe",
                "🔥 Amélioration du système d'API chess.com"
            ]
        },
        {
            version: "V2.6.1",
            date: "2026-03-08",
            title: "Système de versions automatiquex",
            type: "new",
            changes: [
                "🔧 Détection automatique de la version depuis le nom du dossier",
                "📁 Fichier versions-data.js externalisé",
                "🔄 Mise à jour dynamique du footer sur toutes les pages",
                "🐛 Correction des problèmes de version dans version.html",
                "✨ Page version.html maintenant plus légère"
            ]
        },
        {
            version: "V2.6.0",
            date: "2026-03-08",
            title: "Mode online Chess.com",
            type: "new",
            changes: [
                "🌐 Récupération des ELO depuis Chess.com",
                "⚡ Proxies CORS pour éviter les blocages",
                "📊 Graphiques toujours manuels",
                "🔌 Fallback automatique vers données locales"
            ]
        },
        {
            version: "V2.5.2",
            date: "2026-03-08",
            title: "Mode online + page mises à jour",
            type: "update",
            changes: [
                "✨ Ajout du mode online pour les ELO Chess.com",
                "📊 Page des mises à jour créée",
                "🔧 Version automatique basée sur le dossier",
                "🎨 Nouveaux badges dans l'interface",
                "🐛 Correction des proxies CORS"
            ]
        },
        {
            version: "V2.5.1",
            date: "2026-03-01",
            title: "Optimisations",
            type: "update",
            changes: [
                "⚡ Amélioration des performances",
                "🎯 Objectifs plus précis",
                "📈 Graphiques plus réactifs"
            ]
        },
        {
            version: "V2.5.0",
            date: "2026-02-20",
            title: "Ajout des dates limites",
            type: "new",
            changes: [
                "⏰ Affichage des deadlines par mode",
                "🚨 Alertes visuelles pour dates proches",
                "📱 Version mobile en cours..."
            ]
        },
        {
            version: "V2.4.0",
            date: "2026-02-10",
            title: "Leaderboard",
            type: "new",
            changes: [
                "🏆 Page classement avec podium",
                "📊 Comparaison entre joueurs",
                "🎨 Palettes de couleurs individuelles"
            ]
        },
        {
            version: "V2.3.0",
            date: "2026-01-25",
            title: "Gestion des comptes",
            type: "update",
            changes: [
                "🔒 Système de statuts (bloqué/actif/banned)",
                "📁 Organisation des fichiers data/"
            ]
        },
        {
            version: "V2.2.0",
            date: "2026-01-10",
            title: "Page À venir",
            type: "new",
            changes: [
                "📅 Timeline des futurs comptes",
                "🎯 Barres de progression",
                "🔮 Fonctionnalités à venir"
            ]
        },
        {
            version: "V2.1.0",
            date: "2025-12-15",
            title: "Refonte graphique",
            type: "update",
            changes: [
                "🎨 Nouveau design plus moderne",
                "🌈 Effets de glassmorphism",
                "📱 Version mobile bloqué"
            ]
        },
        {
            version: "V2.0.0",
            date: "2025-12-01",
            title: "Première version",
            type: "new",
            changes: [
                "🚀 Lancement du ChessDashboard",
                "📊 Suivi ELO Bullet/Blitz/Rapide",
                "🎯 Objectifs personnalisables",
                "📅 Dates limites"
            ]
        }
    ],
    
    // Statistiques
    stats: {
        totalUpdates: function() {
            return this.history.length;
        },
        lastUpdate: function() {
            return this.history[0]?.date || "2026-03-11";
        },
        getActiveAccounts: function() {
            // Cette fonction sera appelée avec les données de pdp.js
            if (typeof ACCOUNTS !== 'undefined') {
                return ACCOUNTS.filter(a => a.status === 'active').length;
            }
            return 4; // Valeur par défaut
        }
    },
    
    // Fonctions utilitaires
    getVersionByNumber: function(version) {
        return this.history.find(v => v.version === version);
    },
    
    getVersionsByType: function(type) {
        return this.history.filter(v => v.type === type);
    },
    
    getLatestVersion: function() {
        return this.history[0];
    },
    
    // Formater la date en français
    formatDate: function(dateString) {
        const months = ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
        const [year, month, day] = dateString.split('-');
        return `${parseInt(day)} ${months[parseInt(month)-1]} ${year}`;
    },
    
    // Obtenir le badge HTML selon le type
    getTypeBadge: function(type) {
        switch(type) {
            case 'new':
                return '<span class="badge badge-new"><i class="fas fa-star"></i> Nouveau</span>';
            case 'update':
                return '<span class="badge badge-update"><i class="fas fa-sync-alt"></i> Mise à jour</span>';
            case 'fix':
                return '<span class="badge badge-fix"><i class="fas fa-wrench"></i> Correction</span>';
            default:
                return '';
        }
    }
};

// Exposer les données globalement
window.VERSIONS_DATA = VERSIONS_DATA;