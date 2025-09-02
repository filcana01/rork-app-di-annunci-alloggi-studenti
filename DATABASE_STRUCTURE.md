# STRUTTURA DATABASE - PIATTAFORMA ALLOGGI STUDENTI

## PANORAMICA GENERALE

Il progetto attualmente utilizza un sistema di mock data con AsyncStorage per la persistenza locale. Non è presente un database backend reale, ma la struttura dati è ben definita attraverso TypeScript interfaces.

## ENTITÀ PRINCIPALI

### 1. TABELLA USERS (Utenti)

```typescript
interface User {
  id: string;                    // Chiave primaria (UUID/string)
  email: string;                 // Email univoca
  firstName: string;             // Nome
  lastName: string;              // Cognome
  phone: string;                 // Numero di telefono
  role: UserRole;               // Ruolo utente
  companyName?: string;         // Nome azienda (opzionale)
  address?: string;             // Indirizzo (opzionale)
  verified: boolean;            // Stato verifica
  createdAt: Date;              // Data creazione
}
```

**Tipi di Ruolo (UserRole):**
- `guest`: Visitatore non registrato
- `student`: Studente verificato
- `landlord`: Proprietario/Inserzionista
- `admin`: Amministratore

**Indici suggeriti:**
- PRIMARY KEY: `id`
- UNIQUE INDEX: `email`
- INDEX: `role`
- INDEX: `verified`

---

### 2. TABELLA LISTINGS (Annunci)

```typescript
interface Listing {
  id: string;                           // Chiave primaria
  userId: string;                       // FK -> Users.id
  category: ListingCategory;            // Categoria annuncio
  title: string;                        // Titolo annuncio
  description: string;                  // Descrizione dettagliata
  images: string[];                     // Array URL immagini
  address: Address;                     // Oggetto indirizzo completo
  surface: number;                      // Superficie in m²
  rooms?: number;                       // Numero locali (opzionale)
  floor?: string;                       // Piano (opzionale)
  bathrooms: number;                    // Numero bagni
  furnishing: FurnishingStatus;         // Stato arredamento
  monthlyRent: number;                  // Affitto mensile
  expensesIncluded: boolean;            // Spese incluse si/no
  monthlyExpenses?: number;             // Importo spese mensili
  yearlyAdjustment: boolean;            // Conguaglio annuale
  features: Features;                   // Caratteristiche aggiuntive
  availabilityType: AvailabilityType;   // Tipo disponibilità
  availableFrom: Date;                  // Data disponibilità
  minimumContractMonths: number;        // Durata minima contratto
  rules?: string;                       // Regole (opzionale)
  accessibility: AccessibilityFeature[]; // Array accessibilità
  securityDeposit: number;              // Deposito cauzionale
  acceptsSwissCaution: boolean;         // Accetta SwissCaution
  acceptsOtherGuarantees: boolean;      // Accetta altre garanzie
  guaranteeServices?: string;           // Servizi garanzia
  status: ListingStatus;                // Stato annuncio
  createdAt: Date;                      // Data creazione
  updatedAt: Date;                      // Data ultima modifica
}
```

**Sottostrutture:**

#### Address (Indirizzo)
```typescript
interface Address {
  street: string;      // Via/Strada
  zipCode: string;     // CAP
  city: string;        // Città
  country: string;     // Nazione
  latitude: number;    // Coordinata GPS
  longitude: number;   // Coordinata GPS
}
```

#### Features (Caratteristiche)
```typescript
interface Features {
  terrace: boolean;              // Terrazza
  garden: boolean;               // Giardino
  petsAllowed: boolean;          // Animali ammessi
  accessibleForDisabled: boolean; // Accessibile disabili
}
```

**Enumerazioni:**

- **ListingCategory**: `room`, `apartment`, `parking`
- **ListingStatus**: `draft`, `pending`, `active`, `expired`, `archived`
- **FurnishingStatus**: `furnished`, `partially_furnished`, `unfurnished`
- **AvailabilityType**: `immediately`, `from_date`
- **AccessibilityFeature**: `elevator`, `disabled_access`, `ground_floor`, `ramp`

**Indici suggeriti:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId` -> Users.id
- INDEX: `category`
- INDEX: `status`
- INDEX: `city` (da address.city)
- INDEX: `monthlyRent`
- INDEX: `availableFrom`
- SPATIAL INDEX: `latitude, longitude`

---

### 3. TABELLA MESSAGES (Messaggi)

```typescript
interface Message {
  id: string;          // Chiave primaria
  senderId: string;    // FK -> Users.id (mittente)
  receiverId: string;  // FK -> Users.id (destinatario)
  listingId: string;   // FK -> Listings.id
  content: string;     // Contenuto messaggio
  read: boolean;       // Stato lettura
  createdAt: Date;     // Data invio
}
```

**Indici suggeriti:**
- PRIMARY KEY: `id`
- FOREIGN KEY: `senderId` -> Users.id
- FOREIGN KEY: `receiverId` -> Users.id
- FOREIGN KEY: `listingId` -> Listings.id
- INDEX: `senderId, receiverId`
- INDEX: `listingId`
- INDEX: `createdAt`

---

### 4. TABELLA SEARCH_FILTERS (Filtri di Ricerca)

```typescript
interface SearchFilters {
  category?: ListingCategory;    // Categoria
  minPrice?: number;            // Prezzo minimo
  maxPrice?: number;            // Prezzo massimo
  city?: string;                // Città
  minSurface?: number;          // Superficie minima
  maxSurface?: number;          // Superficie massima
  rooms?: number;               // Numero locali
  furnishing?: FurnishingStatus; // Arredamento
  petsAllowed?: boolean;        // Animali ammessi
  accessibleForDisabled?: boolean; // Accessibile disabili
}
```

---

## RELAZIONI TRA TABELLE

### Relazioni Principali:

1. **Users → Listings** (1:N)
   - Un utente può avere più annunci
   - `Listings.userId` → `Users.id`

2. **Users → Messages** (1:N come mittente)
   - Un utente può inviare più messaggi
   - `Messages.senderId` → `Users.id`

3. **Users → Messages** (1:N come destinatario)
   - Un utente può ricevere più messaggi
   - `Messages.receiverId` → `Users.id`

4. **Listings → Messages** (1:N)
   - Un annuncio può avere più messaggi
   - `Messages.listingId` → `Listings.id`

### Diagramma Relazioni:

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    USERS    │ 1   N │  LISTINGS   │ 1   N │  MESSAGES   │
│             │◄──────│             │◄──────│             │
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │       │ userId (FK) │       │ senderId(FK)│
│ firstName   │       │ category    │       │ receiverId  │
│ lastName    │       │ title       │       │ listingId   │
│ role        │       │ status      │       │ content     │
│ verified    │       │ ...         │       │ read        │
└─────────────┘       └─────────────┘       └─────────────┘
```

---

## STORAGE ATTUALE (AsyncStorage)

### Chiavi utilizzate:
- `language`: Lingua dell'interfaccia
- `user`: Dati utente corrente (JSON)
- `favorites`: Array ID annunci preferiti (JSON)

### Dati Mock:
- **Listings**: Definiti in `mocks/listings.ts`
- **Users**: Generati dinamicamente nel login/register

---

## CONSIDERAZIONI PER IMPLEMENTAZIONE DATABASE REALE

### Database Consigliato:
- **PostgreSQL** per robustezza e supporto JSON
- **MongoDB** per flessibilità struttura dati
- **SQLite** per sviluppo locale

### Migrazioni Necessarie:
1. Creazione tabelle con vincoli di integrità
2. Indici per performance
3. Trigger per `updatedAt` automatico
4. Stored procedures per ricerche complesse

### Sicurezza:
- Hash password con bcrypt
- Validazione input
- Sanitizzazione query
- Rate limiting API

### Performance:
- Indici su campi di ricerca frequenti
- Cache per ricerche popolari
- Paginazione risultati
- Ottimizzazione query geospaziali

---

## ESTENSIONI FUTURE

### Tabelle Aggiuntive Suggerite:

1. **FAVORITES** (Preferiti)
   - `userId`, `listingId`, `createdAt`

2. **REVIEWS** (Recensioni)
   - `userId`, `listingId`, `rating`, `comment`

3. **NOTIFICATIONS** (Notifiche)
   - `userId`, `type`, `content`, `read`, `createdAt`

4. **SAVED_SEARCHES** (Ricerche Salvate)
   - `userId`, `filters`, `name`, `createdAt`

5. **LISTING_VIEWS** (Visualizzazioni)
   - `listingId`, `userId`, `viewedAt`

---

*Documento generato il: 2025-08-28*
*Versione: 1.0*