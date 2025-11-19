// app/_layout.jsx
import { Slot, usePathname } from 'expo-router';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { GlowMapTheme } from './_theme';
import ButtomMenu from './components/ButtomMenu';
import TopDropDownMenu from './components/TopDropDownMenu';

export default function RootLayout() {
  const pathname = usePathname();

  const hideChrome = ['/view/loginView', '/view/loginSenhaView', '/view/usuarioFormView'].some(
    (p) => pathname?.toLowerCase().includes(p.toLowerCase())
  );

  return (
    <PaperProvider theme={GlowMapTheme}>
      <SafeAreaView style={styles.container} edges={['top']}>
        {!hideChrome && <TopDropDownMenu />}

        <SafeAreaView style={styles.content} edges={[]}>
          <Slot />
        </SafeAreaView>

        {!hideChrome && <ButtomMenu />}

        <Toast />
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, backgroundColor: '#FFF' },
});
