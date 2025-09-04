# Guida per implementare GraphQL con .NET e MS SQL

## 1. Pacchetti NuGet da installare

Esegui questi comandi nella directory del tuo progetto backend:

```bash
dotnet add package HotChocolate.AspNetCore
dotnet add package HotChocolate.Data.EntityFramework
dotnet add package HotChocolate.Types.Filters
dotnet add package HotChocolate.Types.Sorting
dotnet add package HotChocolate.Types.Projections
```

## 2. Configurazione della Connection String

Nel file `appsettings.json`, aggiungi la connection string per il tuo database SQL Server:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=StudentHousingDB;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-here-make-it-long-and-complex",
    "Issuer": "StudentHousingAPI",
    "Audience": "StudentHousingApp"
  }
}
```

## 3. Creazione del Database

1. Apri SQL Server Management Studio
2. Connettiti al tuo server SQL
3. Esegui lo script SQL che hai già nel file `database/create_database.sql`

## 4. Configurazione Entity Framework

Il tuo `ApplicationDbContext` dovrebbe includere tutti i DbSet necessari. Verifica che sia configurato correttamente.

## 5. Avvio dell'applicazione

1. Compila il progetto: `dotnet build`
2. Avvia l'applicazione: `dotnet run`
3. L'endpoint GraphQL sarà disponibile su: `https://localhost:5001/graphql`
4. L'interfaccia GraphQL Playground sarà disponibile su: `https://localhost:5001/graphql`

## 6. Esempi di Query GraphQL

### Query per ottenere tutti gli annunci attivi:
```graphql
query {
  listings {
    id
    title
    description
    monthlyRent
    city
    user {
      firstName
      lastName
      email
    }
    category {
      name
    }
  }
}
```

### Query con filtri:
```graphql
query {
  searchListings(
    city: "Lugano"
    minPrice: 500
    maxPrice: 1500
    categoryId: 1
  ) {
    id
    title
    monthlyRent
    address
    hasTerrace
    hasGarden
  }
}
```

### Mutation per creare un nuovo annuncio:
```graphql
mutation {
  createListing(
    userId: 1
    categoryId: 1
    title: "Bella camera in centro"
    description: "Camera luminosa e spaziosa"
    address: "Via Roma 123"
    postalCode: "6900"
    city: "Lugano"
    country: "Svizzera"
    monthlyRent: 800
    availabilityDate: "2024-01-01"
    hasTerrace: true
    petsAllowed: false
  ) {
    id
    title
    status
    createdAt
  }
}
```

### Mutation per aggiungere ai preferiti:
```graphql
mutation {
  addToFavorites(userId: 1, listingId: 5) {
    id
    createdAt
    user {
      firstName
    }
    listing {
      title
    }
  }
}
```

## 7. Integrazione con React Native

Nel tuo app React Native, potrai usare Apollo Client o urql per fare le query GraphQL:

```typescript
const GET_LISTINGS = gql`
  query GetListings($city: String, $minPrice: Decimal, $maxPrice: Decimal) {
    searchListings(city: $city, minPrice: $minPrice, maxPrice: $maxPrice) {
      id
      title
      monthlyRent
      city
      address
      user {
        firstName
        lastName
      }
    }
  }
`;
```

## 8. Autenticazione

Il sistema JWT è già configurato. Dovrai implementare:
- Login endpoint che restituisce il JWT token
- Middleware per validare il token nelle query/mutations protette
- Gestione dei ruoli utente (Student, Individual, Agency, Admin)

## 9. Testing

Puoi testare le tue query e mutations usando:
- GraphQL Playground (incluso automaticamente)
- Postman (supporta GraphQL)
- Insomnia
- GraphiQL

## 10. Deployment

Per il deployment in produzione:
- Configura la connection string per il database di produzione
- Imposta le variabili d'ambiente per le chiavi JWT
- Configura HTTPS
- Imposta i CORS appropriati per il dominio di produzione