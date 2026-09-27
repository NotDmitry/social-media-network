import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Navigate } from 'react-router';
import { ROUTES, type ErrorRouteState } from '@/app/routes';

interface ErrorBoundaryProps {
  children: ReactNode;
  retryPath: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Caught by Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const errorRouteState: ErrorRouteState = {
        retryPath: this.props.retryPath,
      };

      return (
        <Navigate to={ROUTES.error} replace state={errorRouteState} />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
