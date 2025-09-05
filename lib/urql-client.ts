import { createClient, cacheExchange, fetchExchange } from 'urql';

// Sostituisci con l'URL del tuo backend .NET
const GRAPHQL_ENDPOINT = 'https://your-backend-url.com/graphql'; // Cambia questo URL

export const urqlClient = createClient({
  url: GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
  requestPolicy: 'cache-and-network',
  fetchOptions: () => {
    // Qui puoi aggiungere headers di autenticazione se necessario
    // const token = getToken(); // dalla tua gestione auth
    return {
      headers: {
        // authorization: token ? `Bearer ${token}` : "",
      },
    };
  },
});