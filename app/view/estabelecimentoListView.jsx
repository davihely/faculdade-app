// Salvar em: app/view/estabelecimentoListView.jsx
import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { List, Text, FAB, IconButton, Title } from 'react-native-paper';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import Toast from 'react-native-toast-message';

import EstabelecimentoService from '../services/estabelecimentoService';

export default function EstabelecimentoListView() {
  const router = useRouter();
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const dados = await EstabelecimentoService.listar();
      setEstabelecimentos(dados);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Erro ao carregar dados' });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const handleEdit = (id) => {
    router.push(`/view/estabelecimentoFormView?id=${id}`);
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmar Exclusão', 'Deseja realmente excluir este item?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await EstabelecimentoService.remover(id);
          Toast.show({ type: 'success', text1: 'Item excluído!' });
          carregarDados();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <List.Item
      title={item.nome}
      description={`${item.endereco}\n${item.telefone || ''}`}
      descriptionNumberOfLines={2}
      left={(props) => <List.Icon {...props} icon="store" />}
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
      {/* Esta tela USA o layout global, mas definimos o título */}
      <Stack.Screen options={{ title: 'Estabelecimentos' }} />

      {loading && <Text style={styles.loadingText}>Carregando...</Text>}
      
      {!loading && estabelecimentos.length === 0 && (
        <Text style={styles.emptyText}>Nenhum estabelecimento cadastrado.</Text>
      )}

      <FlatList
        data={estabelecimentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        style={styles.list}
      />

      {/* Este é o botão para "cadastrar os serviços /estabelecimentos" */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/view/estabelecimentoFormView')}
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
  loadingText: {
    padding: 16,
    textAlign: 'center',
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