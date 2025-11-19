// app/view/detalhesAgendamentoView.jsx

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";
import agendamentoService from "../services/agendamentoService";
import usuarioService from "../services/usuarioService";

const C = {
    primary: "#6B4EFF",
    text: "#2D2C3C",
    bg: "#FFFFFF",
    muted: "#9A98AE",
    border: "#EDECF3",
};

export default function DetalhesAgendamentoView() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [ag, setAg] = useState(null);
    const [est, setEst] = useState(null);
    const [prof, setProf] = useState(null);

    async function load() {
        const lista = await agendamentoService.listar();
        const found = lista.find((x) => String(x.id) === String(id));
        if (!found) return;
        setAg(found);

        const estabelecimentos = await usuarioService.listar();
        const estItem = estabelecimentos.find(
            (x) => String(x.id) === String(found.estabelecimentoId)
        );
        setEst(estItem || null);

        if (found.profissionalIndex >= 0 && estItem?.funcionarios) {
            setProf(estItem.funcionarios[found.profissionalIndex]);
        }
    }

    async function confirmarPresenca() {
        await agendamentoService.atualizar(id, { status: "Presença confirmada" });
        alert("Presença confirmada!");
        load(); // Recarrega detalhes
    }

    useEffect(() => {
        load();
    }, [id]);

    if (!ag) {
        return (
            <View style={{ marginTop: 50 }}>
                <Text style={{ textAlign: "center" }}>Carregando...</Text>
            </View>
        );
    }

    const isConfirmado = ag.status === "Presença confirmada";

    return (
        <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
            <Appbar.Header style={{ backgroundColor: "#FAFAFA", elevation: 0 }}>
                <Appbar.BackAction onPress={() => router.back()} color="#444" />
                <Appbar.Content
                    title="Detalhes"
                    titleStyle={{ color: "#444", fontWeight: "600" }}
                />
            </Appbar.Header>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* CARD PRINCIPAL */}
                <View style={styles.card}>
                    <View style={styles.headerRow}>
                        <Image
                            source={{
                                uri:
                                    est?.imagens?.[0] ||
                                    est?.foto ||
                                    ag.estabelecimentoImagem ||
                                    "https://via.placeholder.com/80",
                            }}
                            style={styles.logo}
                        />

                        <View style={{ flex: 1 }}>
                            <Text style={styles.nomeEst}>
                                {est?.nomeEstabelecimento ||
                                    est?.nome ||
                                    ag.estabelecimentoNome}
                            </Text>

                            <Text style={styles.horario}>
                                Às <Text style={{ fontWeight: "700" }}>{ag.horario}</Text>
                            </Text>
                        </View>
                    </View>

                    {/* STATUS */}
                    <View style={styles.statusRow}>
                        <Text
                            style={[
                                styles.statusDot,
                                { color: isConfirmado ? "green" : C.primary },
                            ]}
                        >
                            ●
                        </Text>

                        <Text
                            style={[
                                styles.status,
                                { color: isConfirmado ? "green" : C.primary },
                            ]}
                        >
                            {ag.status}
                        </Text>

                        {!isConfirmado && (
                            <Pressable onPress={confirmarPresenca}>
                                <Text style={styles.link}>Confirmar presença →</Text>
                            </Pressable>
                        )}
                    </View>
                </View>

                {/* QUANDO / LOCAL */}
                <View style={styles.section}>
                    <View style={styles.col}>
                        <Text style={styles.title}>Quando</Text>
                        <Text style={styles.value}>
                            {ag.dataISO?.split("-").reverse().join("/")}
                        </Text>
                        <Text style={styles.sub}>{ag.diaLabel}</Text>
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.title}>Local</Text>
                        <Text style={styles.value}>
                            {est?.endereco || est?.local || ag.estabelecimentoEndereco}
                        </Text>
                    </View>
                </View>

                {/* SERVIÇO */}
                <Text style={styles.servicosTitle}>Serviço</Text>

                <View style={styles.servicoCard}>
                    <Image
                        source={{
                            uri:
                                prof?.imagem ||
                                ag.profissionalImagem ||
                                "https://via.placeholder.com/60",
                        }}
                        style={styles.profPic}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.profNome}>
                            {prof?.nome || ag.profissionalNome}
                        </Text>
                        <Text style={styles.profSub}>
                            {prof?.area || ag.profissionalArea}
                        </Text>
                    </View>

                    <Text style={styles.preco}>R$ 0,00</Text>
                </View>

                {/* TOTAL */}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValor}>R$ 0,00</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFF",
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 60,
        marginRight: 12,
    },
    nomeEst: {
        fontSize: 17,
        fontWeight: "700",
        color: C.text,
    },
    horario: {
        marginTop: 3,
        color: C.muted,
    },
    statusRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18,
        alignItems: "center",
    },
    statusDot: {
        fontSize: 20,
        marginRight: 6,
    },
    status: {
        fontWeight: "600",
        fontSize: 14,
    },
    link: {
        color: C.primary,
        fontWeight: "600",
    },

    section: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 18,
        backgroundColor: "#FFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: 20,
    },

    col: { width: "48%" },
    title: {
        fontWeight: "700",
        color: C.text,
        marginBottom: 6,
    },
    value: {
        fontSize: 15,
        fontWeight: "600",
        color: C.text,
    },
    sub: {
        fontSize: 13,
        color: C.muted,
    },

    servicosTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
        color: C.text,
    },

    servicoCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: 20,
    },

    profPic: {
        width: 42,
        height: 42,
        borderRadius: 42,
        marginRight: 12,
    },
    profNome: {
        fontWeight: "700",
        color: C.text,
    },
    profSub: {
        fontSize: 12,
        color: C.muted,
        marginTop: 2,
    },
    preco: {
        fontWeight: "700",
        color: C.text,
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 14,
        backgroundColor: "#FFF",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: 30,
    },

    totalLabel: {
        fontWeight: "700",
        color: C.text,
    },
    totalValor: {
        fontWeight: "700",
        color: C.text,
    },
});
