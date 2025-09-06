import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, info) { console.error('ErrorBoundary caught', error, info); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="card-surface" style={{ maxWidth: 720, margin: '60px auto', padding: 40 }}>
                    <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
                    <p className="muted" style={{ fontSize: '.8rem' }}>{this.state.error?.message || 'Unexpected error'}</p>
                    <button className="btn btn-accent" onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}>Reload</button>
                </div>
            );
        }
        return this.props.children;
    }
}
