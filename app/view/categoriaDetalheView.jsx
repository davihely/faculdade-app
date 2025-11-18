// app/view/categoriaDetalheView.jsx

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Appbar, Menu, Text, TextInput } from "react-native-paper";
import categoriaService from "../services/categoriaService";
import usuarioService from "../services/usuarioService";

const C = {
    primary: "#E36AC3",
    bg: "#FFF0FB",
    text: "#3C2A4D",
    outline: "#E6CFE0",
};

export default function CategoriaDetalheView() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const idParam = params.id;
    const nomeParam = params.nome;

    const [categorias, setCategorias] = useState([]);
    const [menuCategoriaVisible, setMenuCategoriaVisible] = useState(false);

    const [categoriaId, setCategoriaId] = useState(idParam || null);
    const [categoriaNome, setCategoriaNome] = useState(nomeParam || "");

    const [listaBase, setListaBase] = useState([]);    // lista original da categoria
    const [listaFiltrada, setListaFiltrada] = useState([]); // lista filtrada pelo endereço

    const [enderecoBusca, setEnderecoBusca] = useState("");
    const [loading, setLoading] = useState(true);

    async function carregarCategorias() {
        try {
            const list = await categoriaService.listar();
            setCategorias(list);

            // se não tiver nome vindo por param, tenta achar pelo id
            if (!categoriaNome && idParam) {
                const atual = list.find((c) => String(c.id) === String(idParam));
                if (atual) setCategoriaNome(atual.nome);
            }
        } catch (e) {
            console.log("Erro ao carregar categorias:", e);
        }
    }

    async function carregarEstabelecimentos(idCat) {
        if (!idCat) {
            setListaBase([]);
            setListaFiltrada([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const todos = await usuarioService.listar();

            const filtrados = (todos || [])
                .filter(
                    (u) =>
                        u &&
                        u.tipoUsuario === "Estabelecimento" &&
                        String(u.categoriaId) === String(idCat)
                );

            setListaBase(filtrados);
        } catch (e) {
            console.log("Erro ao carregar estabelecimentos:", e);
        } finally {
            setLoading(false);
        }
    }

    // Carrega categorias uma vez
    useEffect(() => {
        carregarCategorias();
    }, []);

    // Carrega estabelecimentos sempre que a categoria mudar
    useEffect(() => {
        carregarEstabelecimentos(categoriaId);
    }, [categoriaId]);

    // Aplica filtro por endereço na listaBase
    useEffect(() => {
        const texto = String(enderecoBusca || "").trim().toLowerCase();

        if (!texto) {
            setListaFiltrada(listaBase);
            return;
        }

        const filtrados = (listaBase || []).filter((est) => {
            const end = String(est?.endereco || "").toLowerCase();
            return end.includes(texto);
        });

        setListaFiltrada(filtrados);
    }, [enderecoBusca, listaBase]);

    return (
        <View style={{ flex: 1, backgroundColor: C.bg }}>
            {/* HEADER */}
            <Appbar.Header style={{ backgroundColor: C.bg, elevation: 0 }}>
                <Appbar.BackAction color={C.text} onPress={() => router.back()} />
                <Appbar.Content
                    title={categoriaNome || "Categoria"}
                    titleStyle={{ color: C.text, fontWeight: "600" }}
                />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.container}>

                {/* CAMPO 1 – SELETOR DE CATEGORIA */}
                <Text style={styles.label}>Categoria</Text>
                <Menu
                    visible={menuCategoriaVisible}
                    onDismiss={() => setMenuCategoriaVisible(false)}
                    anchor={
                        <TextInput
                            mode="outlined"
                            placeholder="Selecione uma categoria"
                            value={categoriaNome}
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
                                title={cat.nome}
                                onPress={() => {
                                    setCategoriaId(cat.id);
                                    setCategoriaNome(cat.nome);
                                    setMenuCategoriaVisible(false);
                                }}
                            />
                        ))
                    )}
                </Menu>

                {/* CAMPO 2 – ENDEREÇO DO USUÁRIO / PERTO DE MIM */}
                <Text style={styles.label}>Endereço (para filtrar estabelecimentos perto)</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Digite seu endereço ou bairro"
                    value={enderecoBusca}
                    onChangeText={setEnderecoBusca}
                    style={styles.input}
                    outlineColor={C.outline}
                    activeOutlineColor={C.primary}
                />

                {/* LISTAGEM */}
                {loading ? (
                    <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 30 }} />
                ) : listaFiltrada.length === 0 ? (
                    <Text style={{ color: C.text, marginTop: 20 }}>
                        Nenhum estabelecimento encontrado para esses filtros.
                    </Text>
                ) : (
                    listaFiltrada.map((est) => {
                        if (!est || !est.id) return null;

                        return (
                            <Pressable
                                key={est.id}
                                style={styles.card}
                                onPress={() =>
                                    router.push({
                                        pathname: "/view/estabelecimentoDetalheView",
                                        params: { id: est.id },
                                    })
                                }
                            >
                                <Image
                                    source={{
                                        uri:
                                            est?.imagens?.[0] ||
                                            "https://via.placeholder.com/300?text=Sem+Imagem",
                                    }}
                                    style={styles.cardImg}
                                />

                                <View style={{ padding: 10 }}>
                                    <Text style={styles.cardTitle}>
                                        {est?.nomeEstabelecimento || est?.nome || "Sem nome"}
                                    </Text>
                                    <Text style={styles.cardAddress}>
                                        {est?.endereco || "Endereço não informado"}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: C.bg,
    },
    label: {
        fontWeight: "600",
        color: C.text,
        marginBottom: 4,
        marginTop: 8,
    },
    input: {
        backgroundColor: "#FFF",
        borderRadius: 0,
        marginBottom: 12,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: C.outline,
    },
    cardImg: {
        width: "100%",
        height: 130,
        backgroundColor: "#DDD",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: C.text,
        marginBottom: 4,
    },
    cardAddress: {
        fontSize: 13,
        color: "#8A6F83",
    },
});
