#  HiPay – QA Analyst | Automatisation API Order

> **Test technique** – Analyse et Automatisation de l'API de Paiement HiPay
> Stack : CodeceptJS • Gherkin • TypeScript • Chai • ESLint • GitHub Actions

---

##  Contexte

En tant que QA Analyst dans une squad back chez HiPay, cette squad met en place une nouvelle **API Order** permettant d'exécuter des paiements en point de vente via le gateway Nepting.

- **Endpoint** : `POST /v1/connector/order`
- **Healthcheck** : `GET /v1/connector/healthcheck`
- **Environnement Stage** : `https://cloudrun-api-yugcnet4yq-ew.a.run.app`
- **Authentification** : HTTP Basic Auth (Base64)

---

## Stratégie de Test

### Ce que je teste et pourquoi

L'API Order est le point d'entrée critique du parcours de paiement en magasin. Une défaillance impacte directement les transactions clients. La stratégie couvre quatre axes :

| Axe | Objectif |
|---|---|
| **Nominal** | Valider que le paiement s'exécute correctement avec les données valides |
| **Gestion d'erreurs** | Valider les rejets sur données invalides ou manquantes |
| **Sécurité** | Valider que l'accès sans credentials est bloqué |
| **Disponibilité** | Valider que le service est opérationnel via le healthcheck |

---



###  Risques identifiés

| Risque | Impact | Code | Mitigation |
|---|---|---|---|
| Credentials invalides | 🔴 Haute | 401 | Test @security |
| Payload invalide | 🔴 Haute | 400 | Test @validation |
| Terminal POS éteint | 🔴 Haute | 502 | Test @error |
| Timeout terminal (> 10s) | 🟡 Moyenne | 504 | Test @error |
| Passphrase non configurée | 🟡 Moyenne | 403 | Test @error |
| Erreur serveur interne | 🟡 Moyenne | 500 | Monitoring |

---

###  Scénarios identifiés

| # | Scénario | Endpoint | Résultat attendu | Priorité |
|---|---|---|---|---|
| 1 | Paiement valide avec payload minimal | POST /v1/connector/order | 200 + paymentStatus | 🔴 Haute |
| 2 | Paiement valide avec payload complet | POST /v1/connector/order | 200 + paymentStatus | 🔴 Haute |
| 3 | Payload vide | POST /v1/connector/order | 400 Bad Request | 🔴 Haute |
| 4 | Champ `amount` manquant | POST /v1/connector/order | 400 Bad Request | 🔴 Haute |
| 5 | Champ `serial_number` manquant | POST /v1/connector/order | 400 Bad Request | 🟡 Moyenne |
| 6 | Authentification invalide | POST /v1/connector/order | 401 Unauthorized | 🔴 Haute |
| 7 | Passphrase non configurée | POST /v1/connector/order | 403 Forbidden | 🟡 Moyenne |
| 8 | Terminal POS éteint | POST /v1/connector/order | 502 Bad Gateway | 🟡 Moyenne |
| 9 | Timeout terminal POS | POST /v1/connector/order | 504 Gateway Timeout | 🟡 Moyenne |
| 10 | Healthcheck service UP | GET /v1/connector/healthcheck | 200 OK | 🔴 Haute |

---

###  Scénarios automatisés

| # | Scénario | Tag | Statut attendu |
|---|---|---|---|
| 1 | Paiement valide payload minimal | `@nominal @smoke` | 200 + paymentStatus |
| 2 | Authentification invalide | `@security @error` | 401 |
| 3 | Champ `amount` manquant | `@error @validation` | 400 |
| 4 | Payload vide | `@error @validation` | 400 |
| 5 | Healthcheck service | `@healthcheck @smoke` | 200 |

>  
---

## 🏗️ Structure du projet

```
hipay-Analyst/
├── .github/
│   └── workflows/
│       └── ci.yml                    → Pipeline GitHub Actions (Lint + TNR + Smoke)
├── data/
│   └── payloads.ts                   → DataTypes + Datasets + JDD
├── features/
│   └── order/
│       └── create_order.feature      → Scénarios Gherkin (BDD)
├── mochawesome-report/
│   ├── mochawesome.html              → Rapport HTML d'exécution
│   └── mochawesome.json             → Rapport JSON
├── pages/
│   └── OrderPage.ts                  → Page Object Model (appels API)
├── step_definitions/
│   └── order_steps.ts               → Liaison Gherkin ↔ code
├── support/
│   └── hooks.ts                     → Before/After hooks
├── .env                             → Variables d'environnement (non commité)
├── .gitignore
├── codecept.conf.ts                 → Configuration CodeceptJS
├── eslint.config.js                 → Configuration ESLint
├── package.json
├── tsconfig.json
└── README.md
```

---

##  Stack Technique

| Outil | Rôle |
|---|---|
| **CodeceptJS** | Framework de tests BDD |
| **Gherkin** | Rédaction des scénarios en langage naturel |
| **TypeScript** | Langage d'implémentation |
| **Chai** | Bibliothèque d'assertions |
| **dotenv** | Gestion des variables d'environnement |
| **ESLint** | Linter TypeScript |
| **Mochawesome** | Rapport d'exécution HTML |
| **GitHub Actions** | Pipeline CI/CD |

---

## ⚙️ Installation

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

Créez un fichier `.env` à la racine :

```env
API_URL=https://cloudrun-api-yugcnet4yq-ew.a.run.app
API_LOGIN=votre_login
API_PASSWORD=votre_password
```

> 

---

## 🚀 Lancer les tests

### Tous les tests

```bash
npm test
```

### Par tag

```bash
npm run test:smoke      # Smoke tests uniquement (@smoke)
npm run test:nominal    # Tests nominaux (@nominal)
npm run test:error      # Tests d'erreurs (@error)
npm run test:security   # Tests sécurité (@security)
npm run test:healthcheck # Healthcheck (@healthcheck)
```

### Avec rapport Mochawesome

```bash
npm run test:report
start mochawesome-report/mochawesome.html
```

### Linter

```bash
npm run lint
npm run lint:fix
```

---

## Rapport d'exécution

Le rapport Mochawesome est généré automatiquement dans `mochawesome-report/` après chaque exécution.

En CI/CD, le rapport est disponible dans les **Artifacts** de GitHub Actions (rétention 30 jours).

---

## 🔄 CI/CD

### Déclencheurs

| Événement | Lint | Smoke + TNR |
|---|---|---|
| Push `main` ou `feature/**` | ✅ | ❌ |
| Pull Request vers `main` | ✅ | ❌ |
| Cron 7h (Lun-Ven) | ✅ | ✅ |
| Manuel `workflow_dispatch` | ✅ | ✅ |

### Flux du pipeline

```
Push/PR          → Lint uniquement
Cron 7h / Manuel → Lint → Smoke Tests → TNR complets → Email équipe
```

### Variables secrètes GitHub

| Secret | Description |
|---|---|
| `API_URL` | URL de l'environnement Stage |
| `API_LOGIN` | Login API HiPay |
| `API_PASSWORD` | Password API HiPay |
| `MAIL_USERNAME` | Email expéditeur Gmail |
| `MAIL_PASSWORD` | App password Gmail |
| `TEAM_EMAIL` | Email(s) de l'équipe |

-
## Stratégie de branches

```
main                          → code stable, pipeline déclenché au merge
└── feature/order-automation  → automatisation des tests API Order HiPay
```

---
