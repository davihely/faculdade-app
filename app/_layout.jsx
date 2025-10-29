// Salvar em: app/_layout.jsx

import { Stack } from 'expo-router';
import {
    MD3LightTheme,
    PaperProvider
} from 'react-native-paper';
import Toast from 'react-native-toast-message';

// 1. Defina seu tema customizado com as cores pretas
const theme = {
  ...MD3LightTheme, // Comece com o tema padrão
  colors: {
    ...MD3LightTheme.colors, // Copie as cores padrão
    
    // 👇 DEFINA AS CORES DO TEXTO AQUI
    text: 'black',               // Cor do texto padrão (para <Text> e <Title>)
    onSurface: 'black',          // Cor do texto em cartões e <TextInput mode="outlined">
    onPrimary: 'black',          // Cor do texto em botões "contained" (Entrar)
    onSecondary: 'black',
    placeholder: '#4A4A4A',      // Cor do placeholder (cinza escuro, não preto)
    
    // Cor da borda do TextInput 
    primary: '#6200ee', // Cor da borda quando focado
    outline: '#888',     // Cor da borda quando não focado
  },
};

export default function RootLayout() {
  return (
    // 2. Envolva seu App no PaperProvider com o tema
    <PaperProvider theme={theme}>
      <Stack>
        {/* Defina suas telas aqui */}
        <Stack.Screen name="login" options={{ headerShown: false }}/>
        <Stack.Screen name="cadastro" options={{ title: 'Cadastro' }} />
        <Stack.Screen 
          name="view/estabelecimentoListView" 
          options={{ title: 'Estabelecimentos' }} 
        />
        {/* Adicione outras telas conforme necessário */}
      </Stack>
      
      {/* O Toast precisa ficar fora do Stack, mas dentro do Provider */}
      <Toast />
    </PaperProvider>
  );
}