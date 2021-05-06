import React, { Component } from "react";
import Lottie from "react-lottie";
import animation from "../assets/animations/error.json";

interface Props {}
interface State {}

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

// https://reactjs.org/docs/error-boundaries.html

export default class ErrorBoundary extends Component<Props, State> {
  state = {
    error: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { error: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // API req to log error somewhere
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary">
          <Lottie options={defaultOptions} height={500} width={500} />
        </div>
      );
    }

    return this.props.children;
  }
}
