import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import usuarioService from "../services/usuarioService";

const C = {
    primary: "#E36AC3",
    text: "#3C2A4D",
    bg: "#FFF",
    border: "#E6CFE0",
};

export default function SelecionarProfissionalView() {
    const { id } = useLocalSearchParams(); // id do ESTABELECIMENTO
    const router = useRouter();
    const [estabelecimento, setEstabelecimento] = useState(null);
    const [loading, setLoading] = useState(true);

    async function carregar() {
        try {
            const lista = await usuarioService.listar();
            const item = lista.find(
                (x) => String(x.id) === String(id) && x.tipoUsuario === "Estabelecimento"
            );
            setEstabelecimento(item || null);
        } catch (e) {
            console.log("Erro ao buscar estabelecimento", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    if (loading) return <ActivityIndicator style={{ marginTop: 30 }} />;

    const funcionarios = estabelecimento?.funcionarios || [];

    function irParaAgendamento(profissionalIndexOuNull) {
        // profissionalIndexOuNull === null → "Sem preferência"
        router.push({
            pathname: "/view/agendamentoHorarioView",
            params: {
                estabelecimentoId: estabelecimento.id,
                profissionalIndex:
                    profissionalIndexOuNull === null ? "-1" : String(profissionalIndexOuNull),
            },
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecionar profissional</Text>

            <FlatList
                data={funcionarios}
                keyExtractor={(_, index) => index.toString()}
                ListHeaderComponent={
                    <Pressable
                        style={styles.card}
                        onPress={() => irParaAgendamento(null)}
                    >
                        <Image
                            source={{
                                uri:
                                    estabelecimento?.imagens?.[0] ||
                                    "https://via.placeholder.com/60?text=User",
                            }}
                            style={styles.avatar}
                        />
                        <View style={styles.info}>
                            <Text style={styles.nome}>Sem preferência</Text>
                            <Text style={styles.sub}>20min</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </Pressable>
                }
                renderItem={({ item, index }) => (
                    <Pressable
                        style={styles.card}
                        onPress={() => irParaAgendamento(index)}
                    >
                        <Image
                            source={{
                                uri:
                                    item.imagem ||
                                    estabelecimento?.imagens?.[0] ||
                                    "https://via.placeholder.com/60",
                            }}
                            style={styles.avatar}
                        />
                        <View style={styles.info}>
                            <Text style={styles.nome}>{item.nome}</Text>
                            <Text style={styles.sub}>{item.area}</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9F9FB", padding: 15 },
    title: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 15,
        color: C.text,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.bg,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: "#DDD",
    },
    info: { flex: 1, marginLeft: 12 },
    nome: { fontWeight: "700", color: C.text },
    sub: { fontSize: 12, color: "#7A6C82" },
    arrow: { fontSize: 22, color: "#AAA" },
});
