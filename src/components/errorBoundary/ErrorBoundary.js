import { Component } from "react";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    // static getDerivedStateError(error) {
    //     return {error: true};
    // }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <h2>Something went wrong</h2>   // рендерим запасной ui, если компонент полностью отвалился
        }

        return this.props.children;
    }
}

export default ErrorBoundary;