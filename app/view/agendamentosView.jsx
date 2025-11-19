// app/view/agendamentosView.jsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import agendamentoService from "../services/agendamentoService";

const C = {
    primary: "#6B4EFF",
    text: "#2D2C3C",
    bg: "#F4F4F6",
    cardBg: "#FFFFFF",
    border: "#E3E1ED",
    muted: "#9A98AE",
};

function parseDateTime(a) {
    if (!a?.dataISO || !a?.horario) return null;
    return new Date(`${a.dataISO}T${a.horario}:00`);
}

function formatDateLabel(dataISO, diaLabel) {
    if (!dataISO) return diaLabel || "";
    const [y, m, d] = dataISO.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    const diasSemana = [
        "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
        "Quinta-feira", "Sexta-feira", "Sábado",
    ];
    const diaSemana = diasSemana[date.getDay()];
    return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y} - ${diaSemana}`;
}

function agruparPorData(lista) {
    const grupos = {};
    lista.forEach((a) => {
        const key = a.dataISO || "semData";
        if (!grupos[key]) grupos[key] = [];
        grupos[key].push(a);
    });

    return Object.entries(grupos)
        .sort(([d1], [d2]) => d1.localeCompare(d2))
        .map(([dataISO, itens]) => ({ dataISO, itens }));
}

export default function AgendamentosView() {
    const router = useRouter();

    const [tab, setTab] = useState("proximos");
    const [anteriores, setAnteriores] = useState([]);
    const [proximos, setProximos] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            async function load() {
                try {
                    setLoading(true);

                    const rawUser = await AsyncStorage.getItem("@usuarioLogado");
                    const email = rawUser ? JSON.parse(rawUser).email : null;

                    const lista = await agendamentoService.listar();
                    const meus = lista.filter(
                        (a) => !email || a.clienteEmail === email
                    );

                    const now = new Date();

                    const futuros = [];
                    const passados = [];

                    meus.forEach((a) => {
                        const dt = parseDateTime(a);
                        if (!dt) futuros.push(a);
                        else if (dt >= now) futuros.push(a);
                        else passados.push(a);
                    });

                    const sortFn = (a, b) =>
                        (parseDateTime(a) || new Date(0)) -
                        (parseDateTime(b) || new Date(0));

                    futuros.sort(sortFn);
                    passados.sort(sortFn);

                    setProximos(futuros);
                    setAnteriores(passados);
                } catch (e) {
                    console.log("Erro ao listar agendamentos", e);
                } finally {
                    setLoading(false);
                }
            }

            load();
        }, [])
    );

    const listaAgrupada =
        tab === "proximos"
            ? agruparPorData(proximos)
            : agruparPorData(anteriores);

    return (
        <View style={styles.container}>
            <View style={styles.tabsRow}>
                <Text
                    onPress={() => setTab("anteriores")}
                    style={[
                        styles.tabLabel,
                        tab === "anteriores" && styles.tabLabelActive,
                    ]}
                >
                    Anteriores
                </Text>

                <Text
                    onPress={() => setTab("proximos")}
                    style={[
                        styles.tabLabel,
                        tab === "proximos" && styles.tabLabelActive,
                    ]}
                >
                    Próximos
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <Text style={{ marginTop: 20, textAlign: "center" }}>
                        Carregando...
                    </Text>
                ) : listaAgrupada.length === 0 ? (
                    <Text style={{ marginTop: 20, textAlign: "center" }}>
                        Nenhum agendamento.
                    </Text>
                ) : (
                    listaAgrupada.map((grupo) => (
                        <View key={grupo.dataISO} style={{ marginTop: 20 }}>
                            <Text style={styles.dateTitle}>
                                {formatDateLabel(grupo.dataISO, grupo.itens[0]?.diaLabel)}
                            </Text>

                            {grupo.itens.map((a, idx) => (
                                <Pressable
                                    key={idx}
                                    style={styles.card}
                                    onPress={() =>
                                        router.push(`/view/detalhesAgendamentoView?id=${a.id}`)
                                    }
                                >
                                    <View style={styles.cardHeader}>
                                        <Image
                                            source={{
                                                uri:
                                                    a.estabelecimentoImagem ||
                                                    "https://via.placeholder.com/40",
                                            }}
                                            style={styles.logoCircle}
                                        />

                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.estabelecimentoNome}>
                                                {a.estabelecimentoNome}
                                            </Text>

                                            <Text style={styles.horarioLinha}>
                                                Às {a.horario} — {(a.duracaoMinutos || 20)} min
                                            </Text>
                                        </View>

                                        <Text style={styles.menuDots}>›</Text>
                                    </View>

                                    <View style={styles.statusRow}>
                                        <View
                                            style={[
                                                styles.statusDot,
                                                a.status === "Presença confirmada" && {
                                                    backgroundColor: "green",
                                                },
                                            ]}
                                        />

                                        <Text
                                            style={[
                                                styles.statusText,
                                                a.status === "Presença confirmada" && {
                                                    color: "green",
                                                },
                                            ]}
                                        >
                                            {a.status}
                                        </Text>
                                    </View>

                                    <View style={styles.divider} />

                                    <Text style={styles.endereco}>
                                        {a.estabelecimentoEndereco}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    tabsRow: {
        flexDirection: "row",
        paddingTop: 16,
        paddingHorizontal: 16,
        gap: 20,
    },
    tabLabel: { fontSize: 16, color: C.muted },
    tabLabelActive: { color: C.primary, fontWeight: "700" },

    dateTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: C.text,
        marginBottom: 8,
    },

    card: {
        backgroundColor: C.cardBg,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: 10,
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    logoCircle: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 12,
    },

    estabelecimentoNome: {
        fontSize: 15,
        fontWeight: "700",
        color: C.text,
    },

    horarioLinha: {
        color: C.muted,
        marginTop: 2,
    },

    menuDots: {
        fontSize: 22,
        color: C.muted,
    },

    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
    },

    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: C.primary,
        marginRight: 8,
    },

    statusText: {
        fontWeight: "600",
        color: C.primary,
    },

    divider: {
        height: 1,
        backgroundColor: "#EEE",
        marginVertical: 10,
    },

    endereco: {
        color: C.muted,
        fontSize: 13,
    },
});
