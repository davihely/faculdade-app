// Salvar em: app/view/dataImportanteFormView.jsx
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import DataImportanteService from '../services/dataImportanteService';

export default function DataImportanteFormView() {
  const router = useRouter();
  // useLocalSearchParams pega os parâmetros da URL (ex: ?id=d_1)
  const { id } = useLocalSearchParams(); 
  
  const [nome, setNome] = useState('');
  const [data, setData] = useState(''); // Formato YYYY-MM-DD
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!id; // Modo de edição se o ID estiver presente

  useEffect(() => {
    // Se estiver em modo de edição, busca os dados
    if (isEditing) {
      setLoading(true);
      DataImportanteService.buscarPorId(id)
        .then((item) => {
          if (item) {
            setNome(item.nome);
            setData(item.data);
          } else {
            Toast.show({ type: 'error', text1: 'Item não encontrado' });
            router.back();
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing, router]);

  const handleSalvar = async () => {
    setLoading(true);
    try {
      const dto = { nome, data };
      
      if (isEditing) {
        dto.id = id;
        await DataImportanteService.atualizar(dto);
      } else {
        await DataImportanteService.criar(dto);
      }

      Toast.show({ type: 'success', text1: 'Salvo com sucesso!' });
      router.back(); // Volta para a lista

    } catch (error) {
      console.error("Erro ao salvar:", error);
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
      {/* Define o título da página dinamicamente */}
      <Stack.Screen options={{ title: isEditing ? 'Editar Data' : 'Nova Data' }} />
      
      <Title>{isEditing ? 'Editar Data' : 'Nova Data Importante'}</Title>

      <TextInput
        label="Nome (Ex: Natal)"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
        mode="outlined"
      />
      
      <TextInput
        label="Data (YYYY-MM-DD)"
        value={data}
        onChangeText={setData}
        style={styles.input}
        mode="outlined"
        placeholder="Ex: 2025-12-25"
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