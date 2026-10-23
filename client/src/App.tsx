/** CodeCraft Mission Control: application shell fixed to the deep-ink developer workspace theme. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Library from "@/pages/Library";
import Developer from "@/pages/Developer";
import Projects from "@/pages/Projects";
import Tutor from "@/pages/Tutor";
import Workshops from "@/pages/Workshops";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/library" component={Library} />
      <Route path="/developer" component={Developer} />
      <Route path="/projects" component={Projects} />
      <Route path="/tutor" component={Tutor} />
      <Route path="/workshops" component={Workshops} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster theme="dark" position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
