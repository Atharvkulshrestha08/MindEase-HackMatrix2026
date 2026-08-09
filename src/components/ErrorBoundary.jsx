import { Component } from 'react'
import Button from './ui/Button'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--surface)' }}>
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-5">🧠</div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--on-surface)' }}>
            Something went wrong
          </h1>
          <p className="mb-6 leading-relaxed" style={{ color: 'var(--on-surface-variant)' }}>
            A small hiccup interrupted your calm. Your data is safe — try reloading, or continue where you left off.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={this.handleReload}>Reload app</Button>
            <Button variant="outline" onClick={this.handleReset}>Try again</Button>
          </div>
          {this.props.showDetails && this.state.error && (
            <pre className="mt-6 p-4 text-left text-xs overflow-auto rounded-xl" style={{ backgroundColor: 'var(--surface-container)', color: 'var(--on-surface-variant)' }}>
              {String(this.state.error)}
            </pre>
          )}
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
