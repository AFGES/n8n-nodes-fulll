# @afges/n8n-nodes-fulll

> Nœud communautaire n8n pour l'API Fulll — comptabilité, tiers, écritures, documents et Datahub.
> n8n community node for the Fulll API — accounting, counterparts, entries, documents and Datahub.

[Français](#français) · [English](#english)

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

---

## Français

Nœud communautaire [n8n](https://n8n.io) pour interagir avec l'API [Fulll](https://www.fulll.fr)
(et Inexweb). Fulll est une plateforme de comptabilité en ligne pour les cabinets d'expertise
comptable et leurs clients. Ce nœud permet de lire et d'alimenter les comptes, tiers, écritures,
journaux, balances, documents et le Datahub directement dans vos workflows n8n.

Bases de l'API : `https://api.fulll.io` (Fulll) ou `https://api.inexweb.fr` (Inexweb).

### Installation

Suivez le [guide d'installation des nœuds communautaires](https://docs.n8n.io/integrations/community-nodes/installation/)
de n8n.

Dans n8n : **Settings → Community Nodes → Install**, puis saisissez le nom du paquet :

```
@afges/n8n-nodes-fulll
```

Installation manuelle (instance auto-hébergée) :

```bash
npm install @afges/n8n-nodes-fulll
```

### Identifiants (Credentials)

Le nœud utilise des identifiants **Fulll API** (intégration personnalisée, jeton _Bearer_).

1. Créez une application dans le store de la plateforme Fulll et récupérez le **Client ID**
   et le **Client Secret**.
2. Générez un **Access Token** (valide 2 heures) et un **Refresh Token** dans la plateforme Fulll.
3. Dans n8n, créez des identifiants **Fulll API** et renseignez :
   - **Environment** : _Production Fulll_ ou _Production Inexweb_ ;
   - **Client ID** et **Client Secret** ;
   - **Company ID** : identifiant du dossier, envoyé dans l'en-tête `X-Company` ;
   - **Access Token** et **Refresh Token**.

Les identifiants sont validés via un appel à `GET /cred/v1/access/companies.json`.
Utilisez l'opération **Token → Refresh Token** pour obtenir de nouveaux jetons.

### Opérations

| Ressource                           | Opérations                                                                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Compte** (Account)                | Get Many · Create · Get Counterparts                                                                                                            |
| **Analytique** (Analytics)          | Get Many                                                                                                                                        |
| **Balance**                         | Get Many                                                                                                                                        |
| **Journal** (Book)                  | Get Many                                                                                                                                        |
| **Dossier** (Company)               | Get Many · Check Access · Check Module Access                                                                                                   |
| **Devise** (Currency)               | Get Many                                                                                                                                        |
| **Client** (Customer)               | Get Many · Create · Get Counterparts                                                                                                            |
| **Datahub**                         | Account Sums · Accounts · Analysis · Analytic · Atom Definition · Company · Currency · Datatypes · Entries · Fiscal Years · Values By Datatypes |
| **Document**                        | Create · List By Type · List Types · Upload                                                                                                     |
| **Salarié** (Employee)              | Get Many · Create · Get Counterparts                                                                                                            |
| **Écriture** (Entry)                | Create · Create Expense Report · Create Purchase Invoice · Create Sales Invoice · Get Many · List Commands                                      |
| **Exercice** (Fiscal Year)          | Get Many                                                                                                                                        |
| **Mode de paiement** (Payment Type) | Get Many                                                                                                                                        |
| **Préférences** (Preferences)       | Get                                                                                                                                             |
| **Fournisseur** (Provider)          | Get Many · Create · Get Counterparts                                                                                                            |
| **Jeton** (Token)                   | Refresh Token                                                                                                                                   |
| **Utilisateur** (User)              | Get Many · Check Access                                                                                                                         |

### Fonctionnalités

- **Deux environnements** : Fulll et Inexweb, choisis dans les identifiants.
- **Filtres** : la plupart des listes exposent les paramètres de requête documentés
  (périodes, plages de dates, classes de comptes, états, pagination…).
- **Datahub** : champs typés par opération pour construire les `variables` GraphQL,
  plus un champ de requête GraphQL et un champ JSON _Additional Variables_.
- **Documents** : envoi de fichiers binaires en `multipart/form-data`.
- Le nœud est utilisable comme **outil** (`usableAsTool`) dans les workflows IA d'n8n.

### Compatibilité

- API des nœuds n8n version 1, mode `strict`.
- Nécessite une instance n8n prenant en charge les nœuds communautaires.

### Exemple d'utilisation

1. Ajoutez le nœud **Fulll** et sélectionnez vos identifiants.
2. Ressource **Entry** (Écriture) → opération **Get Many**.
3. Renseignez une période de début et de fin pour ne récupérer que les écritures de cette période.

### Ressources

- [Documentation des nœuds communautaires n8n](https://docs.n8n.io/integrations/community-nodes/)
- [Référence de l'API Fulll](API.md)
- [Dépôt GitHub](https://github.com/AFGES/n8n-nodes-fulll)

### Historique des versions

Voir [CHANGELOG.md](CHANGELOG.md).

### Licence

[MIT](https://opensource.org/licenses/MIT).

---

## English

[n8n](https://n8n.io) community node for the [Fulll](https://www.fulll.fr) API (and Inexweb).
Fulll is an online accounting platform for accounting firms and their clients. This node lets
you read and feed accounts, counterparts, entries, books, balances, documents and the Datahub
directly inside your n8n workflows.

API bases: `https://api.fulll.io` (Fulll) or `https://api.inexweb.fr` (Inexweb).

### Installation

Follow n8n's [community node installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

In n8n: **Settings → Community Nodes → Install**, then enter the package name:

```
@afges/n8n-nodes-fulll
```

Manual install (self-hosted instance):

```bash
npm install @afges/n8n-nodes-fulll
```

### Credentials

The node uses **Fulll API** credentials (custom integration, _Bearer_ token).

1. Create an application in the Fulll platform store and get its **Client ID** and
   **Client Secret**.
2. Generate an **Access Token** (valid for 2 hours) and a **Refresh Token** in the Fulll platform.
3. In n8n, create **Fulll API** credentials and fill in:
   - **Environment**: _Production Fulll_ or _Production Inexweb_;
   - **Client ID** and **Client Secret**;
   - **Company ID**: company identifier, sent in the `X-Company` header;
   - **Access Token** and **Refresh Token**.

Credentials are validated with a call to `GET /cred/v1/access/companies.json`.
Use the **Token → Refresh Token** operation to obtain new tokens.

### Operations

| Resource         | Operations                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Account**      | Get Many · Create · Get Counterparts                                                                                                            |
| **Analytics**    | Get Many                                                                                                                                        |
| **Balance**      | Get Many                                                                                                                                        |
| **Book**         | Get Many                                                                                                                                        |
| **Company**      | Get Many · Check Access · Check Module Access                                                                                                   |
| **Currency**     | Get Many                                                                                                                                        |
| **Customer**     | Get Many · Create · Get Counterparts                                                                                                            |
| **Datahub**      | Account Sums · Accounts · Analysis · Analytic · Atom Definition · Company · Currency · Datatypes · Entries · Fiscal Years · Values By Datatypes |
| **Document**     | Create · List By Type · List Types · Upload                                                                                                     |
| **Employee**     | Get Many · Create · Get Counterparts                                                                                                            |
| **Entry**        | Create · Create Expense Report · Create Purchase Invoice · Create Sales Invoice · Get Many · List Commands                                      |
| **Fiscal Year**  | Get Many                                                                                                                                        |
| **Payment Type** | Get Many                                                                                                                                        |
| **Preferences**  | Get                                                                                                                                             |
| **Provider**     | Get Many · Create · Get Counterparts                                                                                                            |
| **Token**        | Refresh Token                                                                                                                                   |
| **User**         | Get Many · Check Access                                                                                                                         |

### Features

- **Two environments**: Fulll and Inexweb, selected in the credentials.
- **Filters**: most lists expose the documented query parameters (periods, date ranges,
  account classes, states, pagination…).
- **Datahub**: typed per-operation fields that build the GraphQL `variables`, plus a
  GraphQL query field and an _Additional Variables_ JSON field.
- **Documents**: binary file upload as `multipart/form-data`.
- The node is **usable as a tool** (`usableAsTool`) in n8n AI workflows.

### Compatibility

- n8n nodes API version 1, `strict` mode.
- Requires an n8n instance that supports community nodes.

### Usage example

1. Add the **Fulll** node and select your credentials.
2. Resource **Entry** → operation **Get Many**.
3. Set a period start and end to fetch only the entries of that period.

### Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Fulll API reference](API.md)
- [GitHub repository](https://github.com/AFGES/n8n-nodes-fulll)

### Version history

See [CHANGELOG.md](CHANGELOG.md).

### License

[MIT](https://opensource.org/licenses/MIT).
