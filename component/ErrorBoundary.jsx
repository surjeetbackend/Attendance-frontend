import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, backgroundColor: '#ffe6e6', color: '#cc0000' }}>
          <h2>Oops! Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <p>Please try refreshing or contact support.</p>
        </div>
      );
    }

    // When no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
