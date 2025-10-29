// Salvar em: app/view/estabelecimentoFormView.jsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import EstabelecimentoService from '../services/estabelecimentoService';

export default function EstabelecimentoFormView() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      EstabelecimentoService.buscarPorId(id)
        .then((item) => {
          if (item) {
            setNome(item.nome);
            setEndereco(item.endereco);
            setTelefone(item.telefone);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleSalvar = async () => {
    setLoading(true);
    try {
      const dto = { nome, endereco, telefone };
      
      if (isEditing) {
        dto.id = id;
        await EstabelecimentoService.atualizar(dto);
      } else {
        await EstabelecimentoService.criar(dto);
      }

      Toast.show({ type: 'success', text1: 'Salvo com sucesso!' });
      router.back(); // Volta para a lista

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao salvar',
        text2: error.message || 'Verifique os dados.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isEditing ? 'Editar Estabelecimento' : 'Novo Estabelecimento' }} />
      
      <Title>{isEditing ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}</Title>

      <TextInput
        label="Nome do Estabelecimento"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Telefone / WhatsApp"
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />

      <Button
        mode="contained"
        onPress={handleSalvar}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {isEditing ? 'Atualizar' : 'Salvar'}
      </Button>

      <Button
        mode="text"
        onPress={() => router.back()}
        disabled={loading}
      >
        Cancelar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
    marginBottom: 8,
  },
});