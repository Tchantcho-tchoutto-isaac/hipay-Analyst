# HiPay – QA Analyst | Automatisation API Order

> **Test technique** – Analyse et Automatisation de l'API de Paiement HiPay  
> Stack : CodeceptJS • Gherkin • JavaScript • Chai • GitHub Actions

---

## Contexte

En tant que QA Analyst dans une squad back chez HiPay, cette squad met en place une nouvelle **API Order** permettant d'exécuter des paiements en point de vente via le gateway Nepting.

- **Endpoint** : `POST /v1/connector/order`
- **Healthcheck** : `GET /v1/connector/healthcheck`
- **Environnement Stage** : `https://cloudrun-api-yugcnet4yq-ew.a.run.app`
- **Authentification** : HTTP Basic Auth (Base64)

---

## Stratégie de Test

### Ce que je teste et pourquoi

L'API Order est le point d'entrée critique du parcours de paiement en magasin. Une défaillance impacte directement les transactions clients. La stratégie couvre trois axes :

| Axe | Objectif |
|---|---|
| **Nominal** | Valider que le paiement s'exécute correctement avec les données valides |
| **Gestion d'erreurs** | Valider les rejets sur données invalides ou manquantes |
| **Sécurité** | Valider que l'accès sans credentials est bloqué |
| **Disponibilité** | Valider que le service est opérationnel via le healthcheck |

---

###  Scénarios identifiés

| # | Scénario | Endpoint | Résultat attendu | Priorité |
|---|---|---|---|---|
| 1 | Paiement valide avec payload minimal | POST /v1/connector/order | 200 OK | 🔴 Haute |
| 2 | Paiement valide avec payload complet | POST /v1/connector/order | 200 OK | 🔴 Haute |
| 3 | Payload vide | POST /v1/connector/order | 400 Bad Request | 🔴 Haute |
| 4 | Champ `amount` manquant | POST /v1/connector/order | 400 Bad Request | 🔴 Haute |
| 5 | Champ `serial_number` manquant | POST /v1/connector/order | 400 Bad Request | 🟡 Moyenne |
| 6 | Authentification invalide | POST /v1/connector/order | 401 Unauthorized | 🔴 Haute |
| 7 | Terminal POS non disponible | POST /v1/connector/order | 504 Gateway Timeout | 🟡 Moyenne |
| 8 | Montant négatif | POST /v1/connector/order | 400 Bad Request | 🟡 Moyenne |
| 9 | Healthcheck service UP | GET /v1/connector/healthcheck | 200 OK | 🔴 Haute |

---

### 🤖 Scénarios automatisés

Les 3 scénarios prioritaires automatisés dans ce projet :

1. ✅ **Paiement nominal** – payload minimal valide → 200 OK
2. ❌ **Authentification invalide** – sans credentials → 401
3. ⚠️ **Champ obligatoire manquant** – sans `amount` → 400

---

##  Structure du projet

```
hipay-Analyst/
├── .github/
│   └── workflows/
│       └── ci.yml                  → Pipeline GitHub Actions
├── features/
│   └── payment.feature             → Scénarios Gherkin (BDD)
├── step_definitions/
│   └── payment_steps.js            → Implémentation des steps
├── pages/
│   └── OrderPage.js                → Page Object Model (API)
├── data/
│   └── payloads.js                 → Données de test
├── output/                         → Rapports d'exécution
├── .env                            → Variables d'environnement (non commité)
├── .env.example                    → Template des variables
├── .gitignore
├── .gitattributes
├── codecept.conf.js                → Configuration CodeceptJS
└── package.json
```

---

##  Stack Technique

| Outil | Rôle |
|---|---|
| **CodeceptJS** | Framework de tests BDD |
| **Gherkin** | Rédaction des scénarios en langage naturel |
| **JavaScript** | Langage d'implémentation |
| **Chai** | Bibliothèque d'assertions |
| **dotenv** | Gestion des variables d'environnement |
| **GitHub Actions** | Pipeline CI/CD |

---

##  Installation

### Prérequis
- Node.js >= 24.x
- npm >= 11.x

### Cloner le projet

```bash
git clone https://github.com/Tchantcho-tchoutto-isaac/hipay-Analyst.git
cd hipay-Analyst
```

### Installer les dépendances

```bash
npm ci
```

### Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplissez le fichier `.env` :

```env
API_URL=https://cloudrun-api-yugcnet4yq-ew.a.run.app
API_LOGIN=votre_login
API_PASSWORD=votre_password
```

---

## 🚀 Lancer les tests

### Tous les tests

```bash
npm test
```

### Par tag

```bash
# Tests nominaux uniquement
npx codeceptjs run --grep @nominal

# Tests d'erreurs uniquement
npx codeceptjs run --grep @error

# Tests de sécurité uniquement
npx codeceptjs run --grep @security
```

### Avec rapport détaillé

```bash
npx codeceptjs run --steps
```

---

## 📊 Rapport d'exécution

Le rapport est généré automatiquement dans le dossier `output/` après chaque exécution.

```bash
# Ouvrir le rapport
open output/report.html
```

En CI/CD, le rapport est disponible dans les **Artifacts** de GitHub Actions.

---

## 🔄 CI/CD

Le pipeline GitHub Actions se déclenche automatiquement à chaque :
- **Push** sur `main`
- **Pull Request** vers `main`

### Étapes du pipeline

```
Checkout → Install → Lint → Tests → Upload rapport
```

### Variables secrètes GitHub

Configurées dans **Settings → Secrets and variables → Actions** :

| Secret | Description |
|---|---|
| `API_URL` | URL de l'environnement Stage |
| `API_KEY` | Clé d'authentification HiPay |

---

##  Stratégie de branches

```
main                          → code stable, pipeline déclenché au merge
└── feature/order-automation  → automatisation des tests API Order
```

---

## 👤 Auteur

**Tchantcho-tchoutto Isaac**  
QA Analyst – Test Technique HiPay
