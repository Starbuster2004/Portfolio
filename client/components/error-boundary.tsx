"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log to error reporting service in production
        if (process.env.NODE_ENV === "production") {
            // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
            console.error("Uncaught error:", error, errorInfo);
        } else {
            console.error("Uncaught error:", error, errorInfo);
        }
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex items-center justify-center p-8">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            We encountered an unexpected error. Please try again.
                        </p>
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <pre className="text-left text-xs bg-zinc-100 dark:bg-zinc-900 p-4 rounded-lg mb-6 overflow-auto max-h-32 text-red-600 dark:text-red-400">
                                {this.state.error.message}
                            </pre>
                        )}
                        <button
                            onClick={this.handleRetry}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Functional wrapper for easier use
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
) {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}
