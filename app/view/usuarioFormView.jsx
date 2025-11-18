import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Appbar, Button, Menu, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import categoriaService from '../services/categoriaService';
import usuarioService from '../services/usuarioService';

const C = {
    primary: '#E36AC3',
    bg: '#FFF0FB',
    text: '#3C2A4D',
    outline: '#E6CFE0',
};

// Sugestões simples de endereços (sem API)
const SUGESTOES_ENDERECO = [
    'R. 10, 6 - Vila Ivonete, Rio Branco - AC',
    'Av. Brasil, 1000 - Centro, Rio Branco - AC',
    'Rua das Flores, 250 - Jardim Primavera, Rio Branco - AC',
    'Rua da Paz, 45 - Bosque, Rio Branco - AC',
    'Av. Ceará, 789 - Estação Experimental, Rio Branco - AC',
];

export default function usuarioFormView() {
    const router = useRouter();
    const { email: emailParam } = useLocalSearchParams();

    // Tipo de usuário
    const [tipoUsuario, setTipoUsuario] = useState('Usuário Comum');
    const [menuTipoVisible, setMenuTipoVisible] = useState(false);

    // Formulário usuário comum
    const [nome, setNome] = useState('');
    const [genero, setGenero] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [dataNascimento, setDataNascimento] = useState('');
    const [cpf, setCpf] = useState('');
    const [ddi, setDdi] = useState('55');
    const [celular, setCelular] = useState('');
    const [email] = useState(String(emailParam || ''));
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    // Categorias
    const [categorias, setCategorias] = useState([]);
    const [categoriaId, setCategoriaId] = useState(null);
    const [menuCategoriaVisible, setMenuCategoriaVisible] = useState(false);

    // Formulário estabelecimento
    const [imgs, setImgs] = useState([]);
    const [nomeEst, setNomeEst] = useState('');
    const [endereco, setEndereco] = useState('');
    const [sobre, setSobre] = useState('');
    const [redesSociais, setRedesSociais] = useState('');
    const [mostrarSugestoesEndereco, setMostrarSugestoesEndereco] = useState(false);

    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const [horarios, setHorarios] = useState(
        diasSemana.map(() => ({ abre: '', fecha: '', naoAbre: false }))
    );

    const [funcionarios, setFuncionarios] = useState([]);

    // carregar categorias quando mudar para estabelecimento
    useEffect(() => {
        async function loadCategorias() {
            if (tipoUsuario === "Estabelecimento") {
                const lista = await categoriaService.listar();
                setCategorias(lista);
            }
        }
        loadCategorias();
    }, [tipoUsuario]);


    async function escolherImagens() {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });
        if (!res.canceled) {
            setImgs([...imgs, ...res.assets.map((a) => a.uri)]);
        }
    }

    function adicionarFuncionario() {
        setFuncionarios([...funcionarios, { nome: '', area: '', imagem: null }]);
    }

    function atualizarFuncionario(index, campo, valor) {
        const clone = [...funcionarios];
        clone[index][campo] = valor;
        setFuncionarios(clone);
    }

    // 🔥 NOVO: escolher foto do funcionário
    async function escolherFotoFuncionario(index) {
        try {
            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!res.canceled) {
                const uri = res.assets[0].uri;
                const clone = [...funcionarios];
                if (!clone[index]) clone[index] = { nome: '', area: '' };
                clone[index] = { ...clone[index], imagem: uri };
                setFuncionarios(clone);
            }
        } catch (e) {
            console.log("Erro ao escolher foto do funcionário", e);
        }
    }

    function filtrarSugestoesEndereco(texto) {
        const t = String(texto || '').toLowerCase();
        return SUGESTOES_ENDERECO.filter((s) =>
            s.toLowerCase().includes(t)
        ).slice(0, 5);
    }

    async function handleSalvar() {
        try {

            const payload =
                tipoUsuario === 'Usuário Comum'
                    ? {
                        tipoUsuario,
                        nome,
                        genero,
                        dataNascimento,
                        cpf,
                        ddi,
                        celular,
                        email,
                        senha,
                    }
                    : {
                        tipoUsuario,
                        categoriaId,
                        nome: nomeEst || nome,
                        email,
                        senha,
                        imagens: imgs,
                        nomeEstabelecimento: nomeEst,
                        endereco,
                        sobre,
                        redesSociais,
                        horarios,
                        funcionarios,
                    };

            const { ok } = await usuarioService.criar(payload);
            if (ok) {
                Toast.show({ type: 'success', text1: 'Cadastro realizado com sucesso!' });
                router.replace('/view/loginView');
            }
        } catch (e) {
            Toast.show({ type: 'error', text1: e.message });
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: C.bg }}>
            <Appbar.Header style={{ backgroundColor: C.bg, elevation: 0 }}>
                <Appbar.BackAction onPress={() => router.back()} color={C.text} />
                <Appbar.Content title="Cadastrar" titleStyle={{ color: C.text, fontWeight: '600' }} />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Tipo de usuário */}
                    <Text style={styles.label}>Tipo de usuário</Text>
                    <Menu
                        visible={menuTipoVisible}
                        onDismiss={() => setMenuTipoVisible(false)}
                        anchor={
                            <TextInput
                                mode="outlined"
                                placeholder="Selecione"
                                value={tipoUsuario}
                                right={
                                    <TextInput.Icon
                                        icon="menu-down"
                                        onPress={() => setMenuTipoVisible(true)}
                                    />
                                }
                                style={styles.input}
                                outlineColor={C.outline}
                                activeOutlineColor={C.primary}
                                editable={false}
                            />
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                setTipoUsuario('Usuário Comum');
                                setMenuTipoVisible(false);
                            }}
                            title="Usuário Comum"
                        />
                        <Menu.Item
                            onPress={() => {
                                setTipoUsuario('Estabelecimento');
                                setMenuTipoVisible(false);
                            }}
                            title="Estabelecimento"
                        />
                    </Menu>

                    {/* FORMULÁRIO: USUÁRIO COMUM */}
                    {tipoUsuario === 'Usuário Comum' && (
                        <>
                            <Text style={styles.label}>Nome completo</Text>
                            <TextInput
                                mode="outlined"
                                placeholder="Seu nome"
                                value={nome}
                                onChangeText={setNome}
                                style={styles.input}
                                outlineColor={C.outline}
                                activeOutlineColor={C.primary}
                            />

                            <Text style={styles.label}>Gênero</Text>
                            <Menu
                                visible={menuVisible}
                                onDismiss={() => setMenuVisible(false)}
                                anchor={
                                    <TextInput
                                        mode="outlined"
                                        placeholder="Selecione"
                                        value={genero}
                                        right={
                                            <TextInput.Icon
                                                icon="menu-down"
                                                onPress={() => setMenuVisible(true)}
                                            />
                                        }
                                        style={styles.input}
                                        outlineColor={C.outline}
                                        activeOutlineColor={C.primary}
                                        editable={false}
                                    />
                                }
                            >
                                <Menu.Item onPress={() => { setGenero('Feminino'); setMenuVisible(false); }} title="Feminino" />
                                <Menu.Item onPress={() => { setGenero('Masculino'); setMenuVisible(false); }} title="Masculino" />
                                <Menu.Item onPress={() => { setGenero('Outro'); setMenuVisible(false); }} title="Outro" />
                            </Menu>

                            <Text style={styles.label}>Data de nascimento</Text>
                            <MaskedTextInput
                                mask="99/99/9999"
                                placeholder="dd/mm/aaaa"
                                keyboardType="numeric"
                                value={dataNascimento}
                                onChangeText={setDataNascimento}
                                style={styles.inputMask}
                            />

                            <Text style={styles.label}>CPF</Text>
                            <MaskedTextInput
                                mask="999.999.999-99"
                                keyboardType="numeric"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChangeText={setCpf}
                                style={styles.inputMask}
                            />

                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>DDI</Text>
                                    <TextInput
                                        mode="outlined"
                                        value={ddi}
                                        onChangeText={setDdi}
                                        style={styles.input}
                                        outlineColor={C.outline}
                                        activeOutlineColor={C.primary}
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={{ flex: 3, marginLeft: 10 }}>
                                    <Text style={styles.label}>Celular</Text>
                                    <MaskedTextInput
                                        mask="(99) 99999-9999"
                                        keyboardType="phone-pad"
                                        placeholder="(00) 00000-0000"
                                        value={celular}
                                        onChangeText={setCelular}
                                        style={styles.inputMask}
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    {/* FORMULÁRIO: ESTABELECIMENTO */}
                    {tipoUsuario === 'Estabelecimento' && (
                        <>

                            {/* Categoria */}
                            <Text style={styles.label}>Categoria</Text>
                            <Menu
                                visible={menuCategoriaVisible}
                                onDismiss={() => setMenuCategoriaVisible(false)}
                                anchor={
                                    <TextInput
                                        mode="outlined"
                                        placeholder="Selecione uma categoria"
                                        value={categorias.find((c) => c.id === categoriaId)?.nome || ''}
                                        right={
                                            <TextInput.Icon
                                                icon="menu-down"
                                                onPress={() => setMenuCategoriaVisible(true)}
                                            />
                                        }
                                        style={styles.input}
                                        outlineColor={C.outline}
                                        activeOutlineColor={C.primary}
                                        editable={false}
                                    />
                                }
                            >
                                {categorias.length === 0 ? (
                                    <Menu.Item title="Nenhuma categoria cadastrada" disabled />
                                ) : (
                                    categorias.map((cat) => (
                                        <Menu.Item
                                            key={cat.id}
                                            onPress={() => {
                                                setCategoriaId(cat.id);
                                                setMenuCategoriaVisible(false);
                                            }}
                                            title={cat.nome}
                                        />
                                    ))
                                )}
                            </Menu>

                            <Text style={styles.label}>Imagens</Text>
                            <Button
                                mode="outlined"
                                onPress={escolherImagens}
                                style={{ marginBottom: 10 }}
                                textColor={C.primary}
                                buttonColor="#FFF"
                            >
                                Adicionar imagens
                            </Button>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ marginBottom: 16 }}
                            >
                                {imgs.map((uri, i) => (
                                    <Image
                                        key={i}
                                        source={{ uri }}
                                        style={{
                                            width: 90,
                                            height: 90,
                                            borderRadius: 6,
                                            marginRight: 8,
                                            backgroundColor: '#EEE',
                                        }}
                                    />
                                ))}
                            </ScrollView>

                            <Text style={styles.label}>Nome do estabelecimento</Text>
                            <TextInput
                                mode="outlined"
                                placeholder="Nome fantasia"
                                value={nomeEst}
                                onChangeText={setNomeEst}
                                style={styles.input}
                                outlineColor={C.outline}
                                activeOutlineColor={C.primary}
                            />

                            <Text style={styles.label}>Endereço</Text>
                            <View style={{ marginBottom: 16 }}>
                                <TextInput
                                    mode="outlined"
                                    placeholder="Rua, número, bairro, cidade"
                                    value={endereco}
                                    onChangeText={(t) => {
                                        setEndereco(t);
                                        setMostrarSugestoesEndereco(true);
                                    }}
                                    style={styles.input}
                                    outlineColor={C.outline}
                                    activeOutlineColor={C.primary}
                                />

                                {mostrarSugestoesEndereco && endereco.length > 0 && (
                                    <View style={styles.dropdown}>
                                        {filtrarSugestoesEndereco(endereco).map((s, idx) => (
                                            <Pressable
                                                key={idx}
                                                onPress={() => {
                                                    setEndereco(s);
                                                    setMostrarSugestoesEndereco(false);
                                                }}
                                                style={styles.dropdownItem}
                                            >
                                                <Text style={styles.dropdownItemText}>{s}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <Text style={styles.label}>Sobre o estabelecimento</Text>
                            <TextInput
                                mode="outlined"
                                placeholder="Fale um pouco sobre o espaço, serviços, diferenciais..."
                                value={sobre}
                                onChangeText={setSobre}
                                multiline
                                style={styles.input}
                                outlineColor={C.outline}
                                activeOutlineColor={C.primary}
                            />

                            <Text style={styles.label}>Redes sociais</Text>
                            <TextInput
                                mode="outlined"
                                placeholder="@instagram, links etc."
                                value={redesSociais}
                                onChangeText={setRedesSociais}
                                style={styles.input}
                                outlineColor={C.outline}
                                activeOutlineColor={C.primary}
                            />

                            <Text style={[styles.label, { marginTop: 12 }]}>
                                Horários de funcionamento
                            </Text>

                            {diasSemana.map((dia, index) => (
                                <View key={index} style={{ marginBottom: 16 }}>
                                    <Text style={{ fontWeight: '600', color: C.text, marginBottom: 4 }}>
                                        {dia}
                                    </Text>

                                    <View style={styles.row}>
                                        <MaskedTextInput
                                            mask="99:99"
                                            placeholder="08:00"
                                            keyboardType="numeric"
                                            value={horarios[index].abre}
                                            onChangeText={(v) => {
                                                const clone = [...horarios];
                                                clone[index].abre = v;
                                                setHorarios(clone);
                                            }}
                                            style={[styles.inputMask, { flex: 1, marginBottom: 0 }]}
                                            editable={!horarios[index].naoAbre}
                                        />

                                        <MaskedTextInput
                                            mask="99:99"
                                            placeholder="18:00"
                                            keyboardType="numeric"
                                            value={horarios[index].fecha}
                                            onChangeText={(v) => {
                                                const clone = [...horarios];
                                                clone[index].fecha = v;
                                                setHorarios(clone);
                                            }}
                                            style={[
                                                styles.inputMask,
                                                { flex: 1, marginLeft: 10, marginBottom: 0 },
                                            ]}
                                            editable={!horarios[index].naoAbre}
                                        />
                                    </View>

                                    <Pressable
                                        onPress={() => {
                                            const clone = [...horarios];
                                            clone[index].naoAbre = !clone[index].naoAbre;
                                            setHorarios(clone);
                                        }}
                                    >
                                        <Text style={{ color: C.primary, marginTop: 4 }}>
                                            {horarios[index].naoAbre
                                                ? '✔ Não abre'
                                                : 'Marcar como não abre'}
                                        </Text>
                                    </Pressable>
                                </View>
                            ))}

                            <Text style={[styles.label, { marginTop: 20 }]}>
                                Funcionários
                            </Text>

                            {funcionarios.map((f, index) => (
                                <View
                                    key={index}
                                    style={{
                                        backgroundColor: '#FFF',
                                        padding: 12,
                                        borderRadius: 6,
                                        marginBottom: 16,
                                        borderWidth: 1,
                                        borderColor: C.outline,
                                    }}
                                >
                                    {/* FOTO DO FUNCIONÁRIO */}
                                    <View style={styles.funcionarioFotoRow}>
                                        {f.imagem ? (
                                            <Image
                                                source={{ uri: f.imagem }}
                                                style={styles.funcionarioFoto}
                                            />
                                        ) : (
                                            <View style={styles.funcionarioFotoPlaceholder}>
                                                <Text style={styles.funcionarioFotoPlaceholderText}>Foto</Text>
                                            </View>
                                        )}

                                        <Button
                                            mode="outlined"
                                            onPress={() => escolherFotoFuncionario(index)}
                                            textColor={C.primary}
                                            style={styles.funcionarioFotoButton}
                                        >
                                            Selecionar foto
                                        </Button>
                                    </View>

                                    <TextInput
                                        mode="outlined"
                                        placeholder="Nome"
                                        value={f.nome}
                                        onChangeText={(v) => atualizarFuncionario(index, 'nome', v)}
                                        style={styles.input}
                                        outlineColor={C.outline}
                                        activeOutlineColor={C.primary}
                                    />

                                    <TextInput
                                        mode="outlined"
                                        placeholder="Área de atuação (ex: Cabelo, Tattoo, Nail Art)"
                                        value={f.area}
                                        onChangeText={(v) => atualizarFuncionario(index, 'area', v)}
                                        style={styles.input}
                                        outlineColor={C.outline}
                                        activeOutlineColor={C.primary}
                                    />
                                </View>
                            ))}

                            <Button
                                mode="outlined"
                                onPress={adicionarFuncionario}
                                style={{ marginBottom: 16 }}
                                textColor={C.primary}
                                buttonColor="#FFF"
                            >
                                Adicionar funcionário
                            </Button>
                        </>
                    )}

                    {/* CAMPOS COMUNS */}
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        mode="outlined"
                        value={email}
                        disabled
                        right={<TextInput.Icon icon="close-circle" disabled />}
                        style={styles.input}
                        outlineColor={C.outline}
                    />

                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="••••••"
                        secureTextEntry={!mostrarSenha}
                        value={senha}
                        onChangeText={setSenha}
                        right={
                            <TextInput.Icon
                                icon={mostrarSenha ? 'eye-off' : 'eye'}
                                onPress={() => setMostrarSenha(!mostrarSenha)}
                            />
                        }
                        style={styles.input}
                        outlineColor={C.outline}
                        activeOutlineColor={C.primary}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSalvar}
                        style={styles.saveButton}
                        contentStyle={{ height: 48 }}
                        labelStyle={{ color: '#FFF', fontWeight: '600' }}
                    >
                        Salvar minhas informações
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 24, flexGrow: 1 },
    label: { fontWeight: '600', color: C.text, marginBottom: 4 },
    input: { backgroundColor: '#FFF', borderRadius: 0, marginBottom: 16 },
    inputMask: {
        borderWidth: 1,
        borderColor: C.outline,
        padding: 14,
        backgroundColor: '#FFF',
        fontSize: 16,
        marginBottom: 16,
        borderRadius: 0,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    dropdown: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: C.outline,
        borderRadius: 4,
        marginTop: -8,
        marginBottom: 8,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    dropdownItemText: {
        color: C.text,
        fontSize: 14,
    },
    saveButton: {
        width: '100%',
        backgroundColor: C.primary,
        borderRadius: 0,
        marginTop: 10,
    },
    // 🔥 estilos novos para foto do funcionário
    funcionarioFotoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    funcionarioFoto: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
        backgroundColor: '#EEE',
    },
    funcionarioFotoPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
        backgroundColor: '#EEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    funcionarioFotoPlaceholderText: {
        fontSize: 12,
        color: C.text,
    },
    funcionarioFotoButton: {
        flex: 1,
        borderColor: C.outline,
        backgroundColor: '#FFF',
    },
});
