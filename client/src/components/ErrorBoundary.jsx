import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset() {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isDev = process.env.NODE_ENV === "development";

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="glass-card rounded-3xl p-10 max-w-lg w-full text-center shadow-[0_32px_80px_rgba(0,0,0,0.08)]">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            An unexpected error occurred. Please try again or return home. If
            the problem persists, contact our support team.
          </p>

          {/* Dev error details */}
          {isDev && this.state.error && (
            <details className="mb-6 text-left">
              <summary className="text-xs font-semibold text-slate-400 cursor-pointer hover:text-slate-600 mb-2 uppercase tracking-wider">
                Error Details (dev only)
              </summary>
              <pre className="text-xs text-red-600 bg-red-50 rounded-xl p-4 overflow-auto max-h-32 leading-relaxed">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={this.handleReset}
              className="flex-1 btn-luxury py-3.5 rounded-xl text-white text-sm font-bold"
            >
              Try Again
            </button>
            <Link
              to="/"
              onClick={this.handleReset}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 hover:border-green-300 text-slate-700 hover:text-green-700 text-sm font-semibold transition-all duration-200 flex items-center justify-center"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
