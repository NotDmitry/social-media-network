import AppRouter from "@app/AppRouter";
import ThemeContextProvider from '@features/theme/ThemeContextProvider';

function App() {
  return (
    <ThemeContextProvider>
      <AppRouter />
    </ThemeContextProvider>
  )
}

export default App;
