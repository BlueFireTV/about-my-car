import  { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { RouterProvider } from 'react-router-dom';
import router from './Router';
import Spinner from './components/Spinner/Spinner';
import "./tables.css";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface ErrorFallbackProps {
  readonly error: Error
  readonly resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div>
      <h2>Ups! Etwas ist schief gelaufen.</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Erneut versuchen</button>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Spinner />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
