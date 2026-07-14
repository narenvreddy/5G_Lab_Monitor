import React from "react";
import { RobotMascot } from "./RobotMascot";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Application error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F2FF] flex flex-col items-center justify-center px-6 text-center">
          <RobotMascot size={100} mood="thinking" className="mb-6" />
          <h1 className="text-2xl font-black text-[#5B4FCF] mb-2">
            Oops! Something went wrong 😅
          </h1>
          <p className="text-[#6B6B8A] mb-8 max-w-xs">
            Don't worry — your progress is safe! Let's try reloading the app.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="bg-[#FF6B35] hover:bg-[#e55c28] text-white font-black text-lg px-8 py-4 rounded-2xl shadow-md transition-colors"
            data-ocid="error_boundary.reload.primary_button"
          >
            Try Again 🚀
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
