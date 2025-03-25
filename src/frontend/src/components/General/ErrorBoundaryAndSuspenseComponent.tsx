import React, { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import Spinner from '../Spinner/Spinner';

interface ErrorBoundaryAndSuspenseProps {
  children: React.ReactNode;
  errorFallback?: React.ComponentType<FallbackProps>; // Custom error fallback component
  suspenseFallback?: React.ReactNode; // Fallback for Suspense
}

const ErrorBoundaryAndSuspenseComponent: React.FC<ErrorBoundaryAndSuspenseProps> = ({
  children,
  errorFallback = ({ error, resetErrorBoundary }) => (
    <div>
      <p>Ein Fehler ist aufgetreten: {error.message}</p>
      <button onClick={resetErrorBoundary}>Erneut versuchen</button>
    </div>
  ), // Default error fallback
  suspenseFallback = <Spinner />, // Default suspense fallback
}) => {
  return (
    <ErrorBoundary FallbackComponent={errorFallback}>
      <Suspense fallback={suspenseFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default ErrorBoundaryAndSuspenseComponent;
