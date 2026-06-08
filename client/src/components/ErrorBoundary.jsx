import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an external service here.
    console.error("Uncaught error in component tree:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong.</h1>
          <p>We&apos;re sorry for the inconvenience. Please try refreshing the page.</p>
          {this.state.error && <pre>{this.state.error.toString()}</pre>}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
