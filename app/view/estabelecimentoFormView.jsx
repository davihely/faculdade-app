// app/view/estabelecimentoFormView.jsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { Appbar, Button, Menu, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import categoriaService from "../services/categoriaService";
import usuarioService from "../services/usuarioService";

const C = {
    primary: "#E36AC3",
    bg: "#FFF0FB",
    text: "#3C2A4D",
    outline: "#E6CFE0",
};

const SUGESTOES_ENDERECO = [
    "R. 10, 6 - Vila Ivonete, Rio Branco - AC",
    "Av. Brasil, 1000 - Centro, Rio Branco - AC",
    "Rua das Flores, 250 - Jardim Primavera, Rio Branco - AC",
    "Rua da Paz, 45 - Bosque, Rio Branco - AC",
    "Av. Ceará, 789 - Estação Experimental, Rio Branco - AC",
];

export default function estabelecimentoFormView() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [loading, setLoading] = useState(true);
    const [usuarioAtual, setUsuarioAtual] = useState(null);

    const [categoriaId, setCategoriaId] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [menuCategoriaVisible, setMenuCategoriaVisible] = useState(false);

    const [imgs, setImgs] = useState([]);
    const [nomeEstabelecimento, setNomeEstabelecimento] = useState("");
    const [endereco, setEndereco] = useState("");
    const [sobre, setSobre] = useState("");
    const [redesSociais, setRedesSociais] = useState("");

    const [mostrarSugestoesEndereco, setMostrarSugestoesEndereco] = useState(false);

    const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
    const [horarios, setHorarios] = useState(
        diasSemana.map(() => ({ abre: "", fecha: "", naoAbre: false }))
    );

    const [funcionarios, setFuncionarios] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const raw = await AsyncStorage.getItem("@usuarioLogado");
                if (!raw) throw new Error("Usuário não encontrado!");

                const user = JSON.parse(raw);
                setUsuarioAtual(user);

                setNomeEstabelecimento(user.nomeEstabelecimento || "");
                setCategoriaId(user.categoriaId || null);
                setEndereco(user.endereco || "");
                setSobre(user.sobre || "");
                setRedesSociais(user.redesSociais || "");
                setImgs(user.imagens || []);
                setHorarios(user.horarios || horarios);
                setFuncionarios(user.funcionarios || []);

                setCategorias(await categoriaService.listar());
            } catch (e) {
                Toast.show({ type: "error", text1: "Erro ao carregar: " + e.message });
            }
            setLoading(false);
        }
        load();
    }, []);

    async function escolherImagens() {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsMultipleSelection: true,
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        if (!result.canceled) {
            setImgs([...imgs, ...result.assets.map(i => i.uri)]);
        }
    }

    function adicionarFuncionario() {
        setFuncionarios([...funcionarios, { nome: "", area: "", imagem: null }]);
    }

    function atualizarFuncionario(index, field, value) {
        const clone = [...funcionarios];
        clone[index][field] = value;
        setFuncionarios(clone);
    }

    async function escolherFotoFuncionario(index) {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                const clone = [...funcionarios];
                if (!clone[index]) clone[index] = { nome: "", area: "" };
                clone[index] = { ...clone[index], imagem: uri };
                setFuncionarios(clone);
            }
        } catch (e) {
            console.log("Erro ao escolher foto do funcionário", e);
        }
    }

    async function salvar() {
        try {
            const payload = {
                ...usuarioAtual,
                tipoUsuario: "Estabelecimento",
                categoriaId,
                nomeEstabelecimento,
                endereco,
                sobre,
                redesSociais,
                imagens: imgs,
                horarios,
                funcionarios,
                email: usuarioAtual.email
            };

            const { ok } = await usuarioService.atualizar(payload);

            if (ok) {
                await AsyncStorage.setItem("@usuarioLogado", JSON.stringify(payload));
                Toast.show({ type: "success", text1: "Atualizado com sucesso!" });
                setTimeout(() => router.replace("/view/estabelecimentoDashboardView"), 800);
            }
        } catch (e) {
            Toast.show({ type: "error", text1: e.message });
        }
    }

    if (loading) return (
        <View style={styles.center}>
            <Text style={styles.text}>Carregando...</Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: C.bg }}>
            <Appbar.Header style={{ backgroundColor: C.bg }}>
                <Appbar.BackAction color={C.text} onPress={() => router.back()} />
                <Appbar.Content title="Editar Estabelecimento" titleStyle={{ color: C.text }} />
            </Appbar.Header>

            <KeyboardAvoidingView style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={styles.container}>

                    <Text style={styles.label}>Categoria</Text>
                    <Menu
                        visible={menuCategoriaVisible}
                        onDismiss={() => setMenuCategoriaVisible(false)}
                        anchor={
                            <TextInput
                                mode="outlined"
                                value={categorias.find(c => c.id === categoriaId)?.nome || ""}
                                placeholder="Selecione"
                                right={<TextInput.Icon icon="menu-down" onPress={() => setMenuCategoriaVisible(true)} />}
                                editable={false}
                                style={styles.input}
                            />
                        }
                    >
                        {categorias.map(cat => (
                            <Menu.Item key={cat.id} onPress={() => { setCategoriaId(cat.id); setMenuCategoriaVisible(false); }} title={cat.nome} />
                        ))}
                    </Menu>

                    <Text style={styles.label}>Imagens</Text>
                    <Button mode="outlined" onPress={escolherImagens} textColor={C.primary}>Adicionar imagens</Button>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
                        {imgs.map((uri, i) => (
                            <View key={i} style={styles.imgWrapper}>
                                <Image source={{ uri }} style={styles.imgThumb} />
                                <Pressable
                                    style={styles.deleteImgBtn}
                                    onPress={() => {
                                        const clone = imgs.filter((_, idx) => idx !== i);
                                        setImgs(clone);
                                    }}
                                >
                                    <Text style={styles.deleteImgTxt}>X</Text>
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>

                    <Text style={styles.label}>Nome fantasia</Text>
                    <TextInput mode="outlined" value={nomeEstabelecimento} onChangeText={setNomeEstabelecimento} style={styles.input} />

                    <Text style={styles.label}>Endereço</Text>
                    <TextInput mode="outlined" value={endereco}
                        onChangeText={(t) => { setEndereco(t); setMostrarSugestoesEndereco(true); }}
                        style={styles.input} />

                    {mostrarSugestoesEndereco && endereco.length > 0 && (
                        <View style={styles.dropdown}>
                            {SUGESTOES_ENDERECO
                                .filter(s => s.toLowerCase().includes(endereco.toLowerCase()))
                                .map((s, idx) => (
                                    <Pressable key={idx} onPress={() => { setEndereco(s); setMostrarSugestoesEndereco(false); }} style={styles.dropdownItem}>
                                        <Text style={styles.dropdownText}>{s}</Text>
                                    </Pressable>
                                ))}
                        </View>
                    )}

                    <Text style={styles.label}>Sobre</Text>
                    <TextInput mode="outlined" multiline value={sobre} onChangeText={setSobre} style={styles.input} />

                    <Text style={styles.label}>Redes sociais</Text>
                    <TextInput mode="outlined" value={redesSociais} onChangeText={setRedesSociais} style={styles.input} />

                    <Text style={[styles.label, { marginTop: 12 }]}>Horários</Text>
                    {diasSemana.map((dia, index) => (
                        <View key={index} style={{ marginBottom: 10 }}>
                            <Text style={styles.labelSmall}>{dia}</Text>

                            <View style={styles.row}>
                                <MaskedTextInput
                                    mask="99:99"
                                    value={horarios[index].abre}
                                    placeholder="08:00"
                                    onChangeText={(v) => {
                                        const clone = [...horarios];
                                        clone[index].abre = v;
                                        setHorarios(clone);
                                    }}
                                    editable={!horarios[index].naoAbre}
                                    style={styles.maskInput}
                                />

                                <MaskedTextInput
                                    mask="99:99"
                                    value={horarios[index].fecha}
                                    placeholder="18:00"
                                    onChangeText={(v) => {
                                        const clone = [...horarios];
                                        clone[index].fecha = v;
                                        setHorarios(clone);
                                    }}
                                    editable={!horarios[index].naoAbre}
                                    style={styles.maskInput}
                                />
                            </View>

                            <Pressable onPress={() => {
                                const clone = [...horarios];
                                clone[index].naoAbre = !clone[index].naoAbre;
                                setHorarios(clone);
                            }}>
                                <Text style={{ color: C.primary }}>
                                    {horarios[index].naoAbre ? "✔ Não abre" : "Marcar como não abre"}
                                </Text>
                            </Pressable>
                        </View>
                    ))}

                    <Text style={[styles.label, { marginTop: 18 }]}>Funcionários</Text>
                    {funcionarios.map((f, i) => (
                        <View key={i} style={styles.funcCard}>
                            <View style={styles.funcionarioFotoRow}>
                                {f.imagem ? (
                                    <Image source={{ uri: f.imagem }} style={styles.funcionarioFoto} />
                                ) : (
                                    <View style={styles.funcionarioFotoPlaceholder}>
                                        <Text style={styles.funcionarioFotoPlaceholderText}>Foto</Text>
                                    </View>
                                )}

                                <Button
                                    mode="outlined"
                                    onPress={() => escolherFotoFuncionario(i)}
                                    textColor={C.primary}
                                    style={styles.funcionarioFotoButton}
                                >
                                    Selecionar foto
                                </Button>
                            </View>

                            <TextInput mode="outlined" placeholder="Nome" value={f.nome}
                                onChangeText={v => atualizarFuncionario(i, "nome", v)}
                                style={styles.input} />

                            <TextInput mode="outlined" placeholder="Área (ex: Cabelo, Tattoo)" value={f.area}
                                onChangeText={v => atualizarFuncionario(i, "area", v)}
                                style={styles.input} />
                        </View>
                    ))}

                    <Button mode="outlined" onPress={adicionarFuncionario} textColor={C.primary}>Adicionar funcionário</Button>

                    <Button mode="contained" onPress={salvar} style={styles.btnSave}>
                        Salvar alterações
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { color: C.text },
    label: { color: C.text, fontWeight: "600", marginBottom: 6 },
    labelSmall: { color: C.text, marginBottom: 4 },

    // fix visual dos inputs
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    maskInput: {
        backgroundColor: "#FFF",
        padding: 12,
        borderWidth: 1,
        borderColor: C.outline,
        borderRadius: 6,
        width: "48%",
    },

    input: { backgroundColor: "#FFF", marginBottom: 16 },
    dropdown: {
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: C.outline,
        borderRadius: 6,
        overflow: "hidden",
        marginBottom: 10,
        marginTop: -10,
    },
    dropdownItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#EEE" },
    dropdownText: { color: C.text },
    imgWrapper: {
        position: "relative",
        marginRight: 8,
    },
    imgThumb: {
        width: 90,
        height: 90,
        borderRadius: 8,
        backgroundColor: "#EEE",
    },
    deleteImgBtn: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        width: 22,
        height: 22,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        elevation: 2
    },
    deleteImgTxt: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13
    },
    funcCard: {
        backgroundColor: "#FFF",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: C.outline,
        marginBottom: 10,
    },
    btnSave: {
        marginTop: 12,
        backgroundColor: C.primary,
        height: 48,
        justifyContent: "center",
        borderRadius: 8,
    },
    funcionarioFotoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    funcionarioFoto: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
        backgroundColor: "#EEE",
    },
    funcionarioFotoPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
        backgroundColor: "#EEE",
        justifyContent: "center",
        alignItems: "center",
    },
    funcionarioFotoPlaceholderText: {
        fontSize: 12,
        color: C.text,
    },
    funcionarioFotoButton: {
        flex: 1,
        borderColor: C.outline,
        backgroundColor: "#FFF",
    },
});
