// Configurazione per l'endpoint GraphQL
export const GRAPHQL_CONFIG = {
  // Sostituisci con il tuo endpoint quando sarà online
  endpoint: 'https://your-api-endpoint.com/graphql',
  
  // Headers di default
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Configurazione per il fallback ai mock data
  useMockDataOnError: true,
  
  // Timeout per le richieste (in millisecondi)
  timeout: 10000,
  
  // Numero di retry in caso di errore
  retryCount: 3,
  
  // Intervalli di cache per React Query
  staleTime: 5 * 60 * 1000, // 5 minuti
  cacheTime: 10 * 60 * 1000, // 10 minuti
};

// Funzione per aggiornare l'endpoint quando sarà disponibile
export const updateGraphQLEndpoint = (newEndpoint) => {
  if (!newEndpoint || typeof newEndpoint !== 'string') {
    console.warn('Invalid GraphQL endpoint provided');
    return;
  }
  
  GRAPHQL_CONFIG.endpoint = newEndpoint;
  console.log('GraphQL endpoint updated to:', newEndpoint);
  
  // Qui potresti anche invalidare la cache di React Query
  // per forzare il refetch con il nuovo endpoint
};

// Funzione per verificare se l'endpoint è configurato correttamente
export const isGraphQLEndpointConfigured = () => {
  return GRAPHQL_CONFIG.endpoint && 
         !GRAPHQL_CONFIG.endpoint.includes('your-api-endpoint.com');
};

// Funzione per ottenere l'endpoint corrente
export const getCurrentGraphQLEndpoint = () => {
  return GRAPHQL_CONFIG.endpoint;
};