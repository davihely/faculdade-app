// app/_layout.jsx
import { Slot, usePathname } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { GlowMapTheme } from './_theme';
import ButtomMenu from './components/ButtomMenu';
import TopDropDownMenu from './components/TopDropDownMenu';

export default function RootLayout() {
  const pathname = usePathname();

  // Esconde menus nas telas de autenticação
  const hideChrome = ['/view/loginView', '/view/loginSenhaView', '/view/usuarioFormView'].some(
    (p) => pathname?.toLowerCase().includes(p.toLowerCase())
  );

  return (
    <PaperProvider theme={GlowMapTheme}>
      <View style={styles.container}>
        {!hideChrome && <TopDropDownMenu />}
        <View style={styles.content}>
          <Slot />
        </View>
        {!hideChrome && <ButtomMenu />}
        <Toast />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E36AC3' }, // fundo rosa
  content: { flex: 1 },
});
