// Salvar em: app/_layout.jsx
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';

// Importa os componentes de layout globais
import ButtomMenu from './components/ButtomMenu';
import TopDropDownMenu from './components/TopDropDownMenu';

export default function RootLayout() {
  return (
    // 1. Provedor do React Native Paper
    <PaperProvider>
      
      {/* 2. Layout principal com Stack (expo-router) */}
      <Stack
        screenOptions={{
          // 3. Adiciona o Appbar customizado (TopDropDownMenu)
          header: (props) => <TopDropDownMenu {...props} />,
        }}
      />

      {/* 4. Menu inferior fixo (ButtomMenu) */}
      <ButtomMenu />

      {/* 5. Configuração global do Toast */}
      <Toast />
      
    </PaperProvider>
  );
}