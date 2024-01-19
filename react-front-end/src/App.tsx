import { useState } from "react";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TablePage from "./employee-table/TablePage";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <main>
          <TablePage />
        </main>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
