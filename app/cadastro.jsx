// Salvar em: app/cadastro.jsx

import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import UsuarioService from './services/usuarioService';

export default function CadastroView() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    setLoading(true);
    try {
      const dto = { nome, email, senha };
      await UsuarioService.criar(dto);

      Toast.show({
        type: 'success',
        text1: 'Cadastro realizado com sucesso!',
        text2: 'Você já pode fazer o login.',
      });
      
      router.back(); // Volta para a tela de login

    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: error.message || 'Verifique os dados e tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Remove o header (TopDropDownMenu) desta tela específica */}
      <Stack.Screen options={{ headerShown: false }} />

      <Title style={styles.title}>Criar sua conta</Title>

      <TextInput
        label="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        mode="outlined"
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
        onPress={handleSalvar}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Cadastrar
      </Button>
      <Button
        mode="text"
        onPress={() => router.back()}
        disabled={loading}
      >
        Já tenho conta (Voltar)
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
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
    marginBottom: 8,
  },
});