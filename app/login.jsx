// Salvar em: app/login.jsx

import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import UsuarioService from './services/usuarioService'; // Importa o serviço

export default function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@admin.com'); // Padrão para teste
  const [senha, setSenha] = useState('123'); // Padrão para teste
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // 🚫 Na arquitetura definida, não há AuthService.
      // Usamos o usuarioService para simular a busca.
      const usuario = await UsuarioService.buscarPorEmailESenha(email, senha);

      if (!usuario) {
        throw new Error("Email ou senha inválidos");
      }
      
      Toast.show({
        type: 'success',
        text1: `Bem-vindo, ${usuario.nome}!`,
      });
      
      // 3. Navega para a "listagem" principal
      // Vamos usar a nova lista de estabelecimentos como "home"
      router.replace('/view/estabelecimentoListView');

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro no login',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginGoogle = () => {
    // 🚫 Simulação, conforme 🚫 10. O que não fazer.
    Toast.show({
      type: 'info',
      text1: 'Simulando Login Google...',
    });
    setTimeout(() => {
        Toast.show({ type: 'success', text1: 'Logado com Google (Simulado)!' });
        router.replace('/view/estabelecimentoListView');
    }, 1000);
  };

  const handleIrCadastro = () => {
    router.push('/cadastro');
  };

  return (
    <View style={styles.container}>
      {/* Remove o header (TopDropDownMenu) desta tela específica */}
      <Stack.Screen options={{ headerShown: false }} />

      <Title style={styles.title}>Meu App</Title>
      
      <Image
        style={styles.logo}
        source={{ uri: 'https://via.placeholder.com/150?text=LOGO' }}
        resizeMode="contain"
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        mode="outlined"
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Entrar
      </Button>
      
      <Button
        icon="google"
        mode="outlined"
        onPress={handleLoginGoogle}
        style={styles.button}
      >
        Login com Google (Simulado)
      </Button>

      <Button
        mode="text"
        onPress={handleIrCadastro}
        style={styles.buttonText}
      >
        Não tem conta? Cadastre-se
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 28,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 32,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
  buttonText: {
    marginTop: 16,
  }
});