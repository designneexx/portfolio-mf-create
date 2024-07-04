import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    errorMessage?: string;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false
    };

    public static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    public render() {
        if (this.state.hasError) {
            return <span>{this.props.errorMessage || 'Sorry.. there was an error'}</span>;
        }

        return this.props.children;
    }
}
