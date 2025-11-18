// app/view/agendamentoHorarioView.jsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    TextInput as RNTextInput,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import agendamentoService from "../services/agendamentoService";
import usuarioService from "../services/usuarioService";

const C = {
    primary: "#E36AC3",
    bg: "#F4F4F8",
    text: "#3C2A4D",
    outline: "#E6CFE0",
    chip: "#FFF",
    chipBorder: "#D5CFEB",
    confirm: "#6B4EFF",
};

const LABEL_DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

// util simples: HH:MM → minutos
function timeToMinutes(hhmm) {
    if (!hhmm) return 0;
    const [h, m] = hhmm.split(":").map((n) => parseInt(n || "0", 10));
    return h * 60 + m;
}

// minutos → "HH:MM"
function minutesToTime(min) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    const hStr = h < 10 ? `0${h}` : String(h);
    const mStr = m < 10 ? `0${m}` : String(m);
    return `${hStr}:${mStr}`;
}

// gera slots de 20min entre abre/fecha
function gerarSlots(dia) {
    if (!dia || dia.naoAbre || !dia.abre || !dia.fecha) return [];
    const inicio = timeToMinutes(dia.abre);
    const fim = timeToMinutes(dia.fecha);
    const step = 20; // 20min conforme layout
    const slots = [];
    for (let t = inicio; t + step <= fim; t += step) {
        slots.push(minutesToTime(t));
    }
    return slots;
}

export default function AgendamentoHorarioView() {
    const router = useRouter();
    const { estabelecimentoId, profissionalIndex } = useLocalSearchParams();

    const [estabelecimento, setEstabelecimento] = useState(null);
    const [profissional, setProfissional] = useState(null);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedHorario, setSelectedHorario] = useState("");
    const [observacao, setObservacao] = useState("");
    const [clienteEmail, setClienteEmail] = useState("");

    // carregar usuário logado (cliente) + estabelecimento
    useEffect(() => {
        async function load() {
            try {
                const rawUser = await AsyncStorage.getItem("@usuarioLogado");
                if (rawUser) {
                    const u = JSON.parse(rawUser);
                    setClienteEmail(u?.email || "");
                }

                const lista = await usuarioService.listar();
                const est = lista.find(
                    (x) =>
                        String(x.id) === String(estabelecimentoId) &&
                        x.tipoUsuario === "Estabelecimento"
                );
                if (!est) return;

                setEstabelecimento(est);

                const idx = Number(profissionalIndex ?? -1);
                if (idx >= 0 && est.funcionarios && est.funcionarios[idx]) {
                    setProfissional(est.funcionarios[idx]);
                } else {
                    // Sem preferência → profissional = null (mas mantemos card com dados genéricos)
                    setProfissional(null);
                }

                // seleciona primeiro dia que abre
                const horarios = est.horarios || [];
                const i = horarios.findIndex((d) => d && !d.naoAbre && d.abre && d.fecha);
                setSelectedDayIndex(i >= 0 ? i : 0);
            } catch (e) {
                console.log("Erro ao carregar agendamento", e);
            }
        }
        load();
    }, [estabelecimentoId, profissionalIndex]);

    const horariosDiaSelecionado = useMemo(() => {
        if (!estabelecimento?.horarios) return [];
        const dia = estabelecimento.horarios[selectedDayIndex];
        return gerarSlots(dia);
    }, [estabelecimento, selectedDayIndex]);

    async function handleConfirmar() {
        if (!selectedHorario) {
            alert("Selecione um horário.");
            return;
        }
        if (!estabelecimento) return;

        const diaObj = estabelecimento.horarios?.[selectedDayIndex] || {};
        const diaLabel = LABEL_DIAS[selectedDayIndex] || "";

        try {
            const dto = {
                estabelecimentoId: estabelecimento.id,
                profissionalIndex: Number(profissionalIndex ?? -1),
                profissionalNome: profissional?.nome || "Sem preferência",
                profissionalArea: profissional?.area || "",
                profissionalImagem: profissional?.imagem || null,
                diaIndice: selectedDayIndex,
                diaLabel,
                horario: selectedHorario,
                observacao,
                clienteEmail,
            };

            const { ok } = await agendamentoService.criar(dto);
            if (ok) {
                alert("Agendamento confirmado!");
                router.back(); // volta para tela anterior
            }
        } catch (e) {
            console.log("Erro ao salvar agendamento", e);
            alert("Erro ao salvar agendamento.");
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: C.bg }}>
            <Appbar.Header style={{ backgroundColor: C.bg, elevation: 0 }}>
                <Appbar.BackAction onPress={() => router.back()} color={C.text} />
                <Appbar.Content
                    title="Escolha o dia e o horário"
                    titleStyle={{ color: C.text, fontWeight: "600" }}
                />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>
                    {/* barra de dias da semana */}
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={LABEL_DIAS}
                        keyExtractor={(_, i) => i.toString()}
                        contentContainerStyle={styles.daysBar}
                        renderItem={({ item, index }) => {
                            const dia = estabelecimento?.horarios?.[index];
                            const desabilitado =
                                !dia || dia.naoAbre || !dia.abre || !dia.fecha;
                            const selected = index === selectedDayIndex && !desabilitado;

                            return (
                                <Pressable
                                    disabled={desabilitado}
                                    onPress={() => {
                                        if (!desabilitado) {
                                            setSelectedDayIndex(index);
                                            setSelectedHorario("");
                                        }
                                    }}
                                    style={[
                                        styles.dayChip,
                                        selected && styles.dayChipSelected,
                                        desabilitado && styles.dayChipDisabled,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.dayLabel,
                                            selected && styles.dayLabelSelected,
                                            desabilitado && styles.dayLabelDisabled,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </Pressable>
                            );
                        }}
                    />

                    <View style={styles.arrowDown}>
                        <Text style={{ fontSize: 16, color: "#C0C0D0" }}>⌄</Text>
                    </View>

                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* CARD DE SERVIÇO + PROFISSIONAL */}
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.avatarCircle}>
                                    {/* sem imagem real aqui; foco é layout */}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.servicoTitulo}>
                                        {profissional?.area || "Serviço selecionado"}
                                    </Text>
                                    <Text style={styles.servicoSub}>
                                        com{" "}
                                        {profissional?.nome || "profissional do salão"}
                                    </Text>
                                    <Text style={styles.servicoTempo}>20min</Text>
                                </View>
                                <Text style={styles.closeX}>✕</Text>
                            </View>

                            {/* selecione horário */}
                            <Text style={styles.sectionLabel}>Selecione um horário</Text>

                            {horariosDiaSelecionado.length === 0 ? (
                                <Text style={styles.semHorario}>
                                    Nenhum horário disponível para este dia.
                                </Text>
                            ) : (
                                <View style={styles.horariosGrid}>
                                    {horariosDiaSelecionado.map((h) => {
                                        const selected = selectedHorario === h;
                                        return (
                                            <Pressable
                                                key={h}
                                                onPress={() => setSelectedHorario(h)}
                                                style={[
                                                    styles.horarioChip,
                                                    selected && styles.horarioChipSelected,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.horarioText,
                                                        selected && styles.horarioTextSelected,
                                                    ]}
                                                >
                                                    {h}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            )}

                            {/* observação */}
                            <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
                                Alguma observação?
                            </Text>
                            <RNTextInput
                                placeholder="Ex.: Tenho alergia ao produto X"
                                value={observacao}
                                onChangeText={setObservacao}
                                style={styles.obsInput}
                                multiline
                            />
                        </View>
                    </ScrollView>

                    {/* botão confirmar fixo no rodapé */}
                    <View style={styles.footer}>
                        <Button
                            mode="contained"
                            onPress={handleConfirmar}
                            style={styles.btnConfirmar}
                            contentStyle={{ height: 48 }}
                            labelStyle={{ fontWeight: "600", color: "#FFF" }}
                        >
                            Confirmar
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16 },
    daysBar: {
        paddingVertical: 10,
        marginBottom: 4,
    },
    dayChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "transparent",
        marginRight: 8,
        backgroundColor: "transparent",
    },
    dayChipSelected: {
        backgroundColor: "#FFF",
        borderColor: C.primary,
    },
    dayChipDisabled: {
        opacity: 0.4,
    },
    dayLabel: {
        fontSize: 13,
        color: "#746E8B",
    },
    dayLabelSelected: {
        color: C.primary,
        fontWeight: "700",
    },
    dayLabelDisabled: {
        color: "#B0A8C0",
    },
    arrowDown: {
        alignItems: "center",
        marginBottom: 10,
    },

    card: {
        backgroundColor: "#FFF",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E1DFEE",
        elevation: 1,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#DDD",
        marginRight: 12,
    },
    servicoTitulo: {
        fontWeight: "700",
        color: C.text,
        fontSize: 14,
    },
    servicoSub: {
        color: "#716F85",
        fontSize: 13,
    },
    servicoTempo: {
        color: "#9A98AE",
        fontSize: 12,
        marginTop: 2,
    },
    closeX: {
        fontSize: 18,
        color: "#B0AEBE",
        marginLeft: 8,
    },

    sectionLabel: {
        marginTop: 4,
        marginBottom: 8,
        fontWeight: "600",
        color: C.text,
        fontSize: 14,
    },
    horariosGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    horarioChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: C.chipBorder,
        backgroundColor: C.chip,
    },
    horarioChipSelected: {
        backgroundColor: C.confirm,
        borderColor: C.confirm,
    },
    horarioText: {
        fontSize: 13,
        color: "#6A6780",
    },
    horarioTextSelected: {
        color: "#FFF",
        fontWeight: "600",
    },
    semHorario: {
        fontSize: 13,
        color: "#8C889B",
    },

    obsInput: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: C.outline,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        backgroundColor: "#FAFAFF",
        minHeight: 70,
        textAlignVertical: "top",
    },

    footer: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
    },
    btnConfirmar: {
        backgroundColor: C.confirm,
        borderRadius: 8,
    },
});
