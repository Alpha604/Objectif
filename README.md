# AlphaRomo604 · Tableau de bord d'objectifs Échecs ♟️

Dashboard interactif pour suivre ma progression Elo sur Chess.com avec objectifs et dates limites.

---

## 📋 Historique des modifications

### **28 février 2026** - Version 2.3.0
- **Nouveauté** : Ajout d'une page `tel.html` pour les visiteurs mobiles
- **Amélioration** : Redirection automatique des téléphones vers une page d'information
- **Interface** : Bouton "Forcer l'accès" pour les utilisateurs mobiles qui veulent quand même voir le site
- **Astuce** : Petit message d'aide si le forçage ne fonctionne pas
- **Design** : Page mobile épurée mais élégante avec icônes

### **28 février 2026** - Version 2.1.0
- **Nouveauté** : Ajout des dates limites pour chaque objectif (bullet, blitz, rapide)
- **Fonctionnalité** : Calcul automatique des jours restants avant chaque deadline
- **Visuel** : Code couleur selon l'urgence (vert >15j, orange <15j, rouge <7j, rouge foncé dépassé)
- **Données** : Nouvelle propriété `deadlines` dans `data.js`

### **15 janvier 2026** - Version 2.0.0
- **Refonte** : Nouveau design moderne avec cartes Elo
- **Graphique** : Intégration de Chart.js avec lignes d'objectifs
- **Timeline** : Ajout d'une frise chronologique des événements marquants
- **Responsive** : Adaptation pour tablettes

### **1 décembre 2025** - Version 1.0.0
- **Création** : Lancement du tableau de bord
- **Fonctionnalités** : Affichage des Elo actuels, progression en pourcentage
- **Données** : Structure JSON pour faciliter les mises à jour

---

## 🚀 Prochaines étapes (idées)
- [ ] Ajout des comptes personnel via serveur
- [ ] Graphique d'évolution sur 12 mois
- [ ] Comparaison avec d'autres joueurs
- [ ] Mode sombre/clair (déjà sombre par défaut 😄)
