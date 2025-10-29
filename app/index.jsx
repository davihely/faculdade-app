// Salvar em: app/index.jsx
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Bem-vindo ao App!</Title>
      <Text style={styles.text}>
        Use o menu superior para navegar pelas seções.
      </Text>
      
      <Button 
        mode="contained" 
        onPress={() => router.push('/login')} 
        style={styles.button}
      >
        Ir para Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  text: {
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
  }
});