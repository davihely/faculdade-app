// Salvar em: app/components/ButtomMenu.jsx
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function ButtomMenu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        icon="home"
        mode="contained"
        onPress={() => router.push('/')}
        style={styles.button}
      >
        Início
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // Posiciona o menu na parte inferior
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    textColor: "black",
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fundo para destacar
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    width: '50%',
  },
});