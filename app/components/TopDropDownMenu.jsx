// Salvar em: app/components/TopDropDownMenu.jsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';

/**
 * Componente global da Appbar com menu dropdown.
 * Assume que está dentro de um <Stack.Screen options={{ header: ... }} />
 * * @param {object} props
 * @param {object} props.navigation - Objeto de navegação do React Navigation (passado pelo header)
 * @param {object} props.back - Objeto 'back' se houver uma rota anterior (passado pelo header)
 * @param {object} props.options - Opções da tela (ex: title) (passado pelo header)
 */
export default function TopDropDownMenu({ navigation, back, options }) {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const router = useRouter();

  // Pega o título definido no <Stack.Screen options={{ title: '...' }} />
  // Ou usa um padrão
  const title = options?.title ?? 'Menu';

  /**
   * Navega para uma rota do expo-router e fecha o menu.
   * @param {string} path - Caminho absoluto (ex: '/view/usuarioListView')
   */
  const navigateTo = (path) => {
    router.push(path);
    closeMenu();
  };

  return (
    <Appbar.Header>
      {/* Mostra o botão de voltar se houver histórico de navegação */}
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      
      {/* Título da Página */}
      <Appbar.Content title={title} />
      
      {/* Botão de Menu (Sanduíche) */}
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action icon="menu" color="white" onPress={openMenu} />
        }
      >
        {/* === Itens de Menu === */}

        {/* Item Adicionado */}
        <Menu.Item
          onPress={() => navigateTo('/view/estabelecimentoListView')}
          title="Estabelecimentos"
          leadingIcon="store"
        />

        {/* Itens Originais da Arquitetura */}
        <Menu.Item
          onPress={() => navigateTo('/view/contatoListView')}
          title="Contatos"
          leadingIcon="contacts"
        />
        <Menu.Item
          onPress={() => navigateTo('/view/usuarioListView')}
          title="Usuários"
          leadingIcon="account-group"
        />
        <Menu.Item
          onPress={() => navigateTo('/view/compromissoListView')}
          title="Compromissos"
          leadingIcon="calendar-check"
        />
        <Menu.Item
          onPress={() => navigateTo('/view/TarefaListView')}
          title="Tarefas"
          leadingIcon="check-all"
        />
        <Menu.Item
          onPress={() => navigateTo('/view/dataImportanteListView')}
          title="Datas Importantes"
          leadingIcon="calendar-star"
        />
      </Menu>
    </Appbar.Header>
  );
}