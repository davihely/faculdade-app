// Salvar em: app/view/dataImportanteListView.jsx
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { FAB, IconButton, List, Text } from 'react-native-paper';
import Toast from 'react-native-toast-message';

import DataImportanteService from '../services/dataImportanteService';

export default function DataImportanteListView() {
  const router = useRouter();
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const dados = await DataImportanteService.listar();
      setDatas(dados);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar dados' });
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect recarrega os dados toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const handleEdit = (id) => {
    // Navega para o formulário passando o ID para edição
    router.push(`/view/dataImportanteFormView?id=${id}`);
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmar Exclusão', 'Deseja realmente excluir este item?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await DataImportanteService.remover(id);
            Toast.show({ type: 'success', text1: 'Item excluído!' });
            carregarDados(); // Recarrega a lista
          } catch (e) {
            Toast.show({ type: 'error', text1: 'Erro ao excluir' });
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.nome}
      description={`Data: ${item.data}`} // Exibe a data
      left={(props) => <List.Icon {...props} icon="calendar" />}
      right={() => (
        <View style={{ flexDirection: 'row' }}>
          <IconButton icon="pencil" onPress={() => handleEdit(item.id)} />
          <IconButton icon="delete" onPress={() => handleDelete(item.id)} />
        </View>
      )}
      onPress={() => handleEdit(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      {loading && <Text>Carregando...</Text>}
      
      {!loading && datas.length === 0 && (
        <Text style={styles.emptyText}>Nenhuma data cadastrada.</Text>
      )}

      <FlatList
        data={datas}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        style={styles.list}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/view/dataImportanteFormView')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80, // Deixa espaço para o ButtomMenu
  },
});