# Implementazione GraphQL per USI Housing

## Panoramica

L'app è stata configurata per utilizzare GraphQL per recuperare i dati dei listings dal backend. L'implementazione include un sistema di fallback che utilizza dati mock quando l'endpoint GraphQL non è disponibile.

## Struttura dei File

### File di Configurazione
- `constants/graphql-config.js` - Configurazione centrale per l'endpoint GraphQL
- `constants/graphql.js` - Client GraphQL e definizioni delle query
- `hooks/use-graphql.js` - Hook personalizzati per le query GraphQL

### Hook Disponibili
- `useListings()` - Recupera tutti i listings
- `useListing(id)` - Recupera un singolo listing per ID
- `useCategories()` - Recupera tutte le categorie
- `useInvalidateListings()` - Invalida la cache dei listings
- `useUpdateGraphQLEndpoint()` - Aggiorna l'endpoint GraphQL

## Query GraphQL Implementate

### 1. Listings Query
```graphql
query GetListings {
  listings {
    id
    userId
    categoryId
    title
    description
    address
    city
    # ... tutti i campi del listing
    category {
      id
      nameIt
      nameEn
    }
    user {
      id
      firstName
      lastName
      # ... campi utente
    }
    images {
      id
      imageUrl
      isPrimary
      orderIndex
    }
  }
}
```

### 2. Single Listing Query
```graphql
query GetListingById($id: Int!) {
  listing(id: $id) {
    # ... stessi campi della query listings
  }
}
```

### 3. Categories Query
```graphql
query GetCategories {
  categories {
    id
    nameIt
    nameEn
    createdAt
  }
}
```

## Come Configurare l'Endpoint

### Opzione 1: Modifica il file di configurazione
Modifica `constants/graphql-config.js`:
```javascript
export const GRAPHQL_CONFIG = {
  endpoint: 'https://tuo-endpoint.com/graphql', // Sostituisci qui
  // ... resto della configurazione
};
```

### Opzione 2: Aggiornamento dinamico
Usa l'hook `useUpdateGraphQLEndpoint()`:
```javascript
const updateEndpoint = useUpdateGraphQLEndpoint();

// Quando l'endpoint è pronto
updateEndpoint('https://tuo-endpoint.com/graphql');
```

## Funzionalità Implementate

### 1. Fallback ai Mock Data
- Se l'endpoint non è configurato o non risponde, l'app utilizza automaticamente i dati mock
- Gli utenti vedono sempre i dati, anche durante lo sviluppo

### 2. Stati di Loading e Errore
- Indicatori di caricamento durante le richieste
- Messaggi di errore user-friendly
- Gestione graceful degli errori di rete

### 3. Caching Intelligente
- Cache automatica con React Query
- Invalidazione selettiva della cache
- Configurazione ottimizzata per diversi tipi di dati

### 4. Ottimizzazioni Performance
- Lazy loading dei dati
- Retry automatico configurabile
- Timeout delle richieste

## Integrazione nel Context

Il context dell'app (`hooks/use-app-context.jsx`) è stato aggiornato per:
- Utilizzare i hook GraphQL invece dei dati mock statici
- Fornire stati di loading e errore ai componenti
- Mantenere la compatibilità con l'interfaccia esistente

## Testing

### Con Endpoint Mock
L'app funziona immediatamente con dati di esempio, permettendo di:
- Testare l'interfaccia utente
- Sviluppare nuove funzionalità
- Verificare il comportamento dell'app

### Con Endpoint Reale
Quando l'endpoint GraphQL sarà online:
1. Aggiorna la configurazione con l'URL reale
2. L'app inizierà automaticamente a utilizzare i dati reali
3. I dati mock saranno utilizzati solo come fallback

## Prossimi Passi

1. **Configura l'endpoint**: Sostituisci l'URL placeholder con quello reale
2. **Testa le query**: Verifica che le query corrispondano al tuo schema GraphQL
3. **Aggiungi autenticazione**: Se necessaria, aggiungi headers di autenticazione
4. **Implementa mutazioni**: Aggiungi operazioni di create/update/delete

## Struttura delle Query Attese

Le query sono state create basandosi sui modelli C# forniti. Assicurati che il tuo endpoint GraphQL esponga:

- `listings` - Array di tutti i listings attivi
- `listing(id: Int!)` - Singolo listing per ID
- `categories` - Array di tutte le categorie

Ogni listing dovrebbe includere le relazioni con `category`, `user`, e `images` come definito nelle query.