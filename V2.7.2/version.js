/**
 * version.js - Gestion automatique de la version basée sur le nom du dossier
 * Utilise maintenant VERSIONS_DATA si disponible
 */

(function() {
    // Version par défaut depuis les données si disponibles
    const DEFAULT_VERSION = (typeof VERSIONS_DATA !== 'undefined') 
        ? VERSIONS_DATA.currentVersion 
        : "V2.6.1";
    
    // Récupérer la version depuis le chemin
    function getVersionFromPath() {
        try {
            const fullUrl = window.location.href;
            
            // Patterns de recherche
            const patterns = [
                /\/([Vv][\d.]+[^\/]*)\//,  // /V2.6.1/
                /\/(\d+\.\d+\.\d+[^\/]*)\//,  // /2.6.1/
                /\/Objectif\/([^\/]+)\//,  // /Objectif/V2.6.1/
                /\/([^\/]+)\/[^\/]+\.html$/  // Dossier parent du fichier HTML
            ];
            
            for (const pattern of patterns) {
                const match = fullUrl.match(pattern);
                if (match && match[1]) {
                    let version = match[1];
                    // S'assurer que ça ressemble à une version
                    if (version.match(/^[Vv]?[\d.]+$/)) {
                        return version;
                    }
                }
            }
            
            return DEFAULT_VERSION;
            
        } catch (e) {
            console.error("Erreur détection version:", e);
            return DEFAULT_VERSION;
        }
    }

    // Formatter la version
    function formatVersion(version) {
        // Garder le format original (V majuscule de préférence)
        if (version.startsWith('v')) {
            return 'V' + version.substring(1);
        }
        if (!version.startsWith('V')) {
            return `V${version}`;
        }
        return version;
    }

    // Mettre à jour tous les éléments
    function updateAllVersions() {
        const rawVersion = getVersionFromPath();
        const version = formatVersion(rawVersion);
        
        // Mettre à jour les éléments avec ID spécifique
        const footerVersion = document.getElementById('footerVersion');
        if (footerVersion) footerVersion.textContent = version;
        
        const versionDisplay = document.getElementById('versionDisplay');
        if (versionDisplay) {
            const span = versionDisplay.querySelector('span');
            if (span) span.textContent = version;
        }
        
        // Mettre à jour les footers
        document.querySelectorAll('.footer div, .footer-info div, footer div').forEach(el => {
            if (el.innerHTML && el.innerHTML.includes('AlphaRomo604')) {
                el.innerHTML = el.innerHTML.replace(
                    /AlphaRomo604 · [^·]+ ·/,
                    `AlphaRomo604 · ${version} ·`
                );
            }
        });
    }

    // Exécuter
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAllVersions);
    } else {
        updateAllVersions();
    }
})();