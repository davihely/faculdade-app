// app/view/agendamentoHorarioView.jsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    Image,
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
    primary: "#6B4EFF",
    text: "#2D2C3C",
    bg: "#F4F4F6",
    border: "#E3E1ED",
    confirm: "#6B4EFF",
};

const LABEL_DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// utils
function timeToMinutes(hhmm) {
    if (!hhmm) return 0;
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}
function minutesToTime(min) {
    const h = String(Math.floor(min / 60)).padStart(2, "0");
    const m = String(min % 60).padStart(2, "0");
    return `${h}:${m}`;
}
function gerarSlots(dia) {
    if (!dia || dia.naoAbre || !dia.abre || !dia.fecha) return [];
    const inicio = timeToMinutes(dia.abre);
    const fim = timeToMinutes(dia.fecha);
    const out = [];
    for (let t = inicio; t + 20 <= fim; t += 20) {
        out.push(minutesToTime(t));
    }
    return out;
}

// 📌 CORREÇÃO: calcular data REAL do dia escolhido
function calcularDataReal(selectedDayIndex) {
    const hoje = new Date();
    const hojeIndex = hoje.getDay(); // 0 = Domingo

    let diff = selectedDayIndex - hojeIndex;
    if (diff < 0) diff += 7; // próxima ocorrência do dia escolhido

    const data = new Date();
    data.setDate(hoje.getDate() + diff);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
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

    useEffect(() => {
        async function load() {
            const rawUser = await AsyncStorage.getItem("@usuarioLogado");
            if (rawUser) {
                const u = JSON.parse(rawUser);
                setClienteEmail(u?.email || "");
            }

            const lista = await usuarioService.listar();
            const est = lista.find((x) => String(x.id) === String(estabelecimentoId));
            if (!est) return;

            setEstabelecimento(est);

            const idx = Number(profissionalIndex);
            if (idx >= 0 && est?.funcionarios?.[idx]) {
                setProfissional(est.funcionarios[idx]);
            } else {
                setProfissional(null); // sem preferência
            }

            const horarios = est?.horarios || [];
            const diaAberto = horarios.findIndex(
                (d) => d && !d.naoAbre && d.abre && d.fecha
            );
            setSelectedDayIndex(diaAberto >= 0 ? diaAberto : 0);
        }

        load();
    }, [estabelecimentoId, profissionalIndex]);

    const horariosDia = useMemo(() => {
        if (!estabelecimento?.horarios) return [];
        const dia = estabelecimento.horarios[selectedDayIndex];
        return gerarSlots(dia);
    }, [estabelecimento, selectedDayIndex]);

    async function handleConfirmar() {
        if (!selectedHorario) {
            alert("Selecione um horário.");
            return;
        }

        // 📌 AQUI ESTÁ A CORREÇÃO CRUCIAL
        const dataISOReal = calcularDataReal(selectedDayIndex);

        const dto = {
            estabelecimentoId,

            estabelecimentoNome:
                estabelecimento?.nomeEstabelecimento ||
                estabelecimento?.nome ||
                "Estabelecimento",

            estabelecimentoEndereco:
                estabelecimento?.endereco ||
                estabelecimento?.local ||
                "Endereço não informado",

            estabelecimentoImagem:
                estabelecimento?.imagens?.[0] ||
                estabelecimento?.foto ||
                null,

            profissionalIndex: Number(profissionalIndex ?? -1),
            profissionalNome: profissional?.nome || "Sem preferência",
            profissionalArea: profissional?.area || "",
            profissionalImagem: profissional?.imagem || null,

            diaIndice: selectedDayIndex,
            diaLabel: LABEL_DIAS[selectedDayIndex],

            horario: selectedHorario,
            observacao,
            clienteEmail,

            dataISO: dataISOReal, // ✔ Data correta agora
        };

        try {
            const { ok } = await agendamentoService.criar(dto);
            if (ok) {
                alert("Agendamento confirmado!");
                router.push("/view/agendamentosView");
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
                    titleStyle={{ color: C.text, fontSize: 18, fontWeight: "600" }}
                />
            </Appbar.Header>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>

                    {/* DIAS DA SEMANA */}
                    <View style={styles.daysBar}>
                        {LABEL_DIAS.map((diaLabel, index) => {
                            const dia = estabelecimento?.horarios?.[index];
                            const disabled = !dia || dia.naoAbre || !dia.abre || !dia.fecha;
                            const selected = index === selectedDayIndex && !disabled;

                            return (
                                <Pressable
                                    key={index}
                                    disabled={disabled}
                                    onPress={() => {
                                        if (!disabled) {
                                            setSelectedDayIndex(index);
                                            setSelectedHorario("");
                                        }
                                    }}
                                    style={[
                                        styles.dayChip,
                                        selected && styles.dayChipSelected,
                                        disabled && styles.dayChipDisabled,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.dayLabel,
                                            selected && styles.dayLabelSelected,
                                            disabled && styles.dayLabelDisabled,
                                        ]}
                                    >
                                        {diaLabel}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <View style={styles.arrowDown}>
                        <Text style={{ fontSize: 18, color: "#C8C6D6" }}>⌄</Text>
                    </View>

                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 130 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Image
                                    source={{
                                        uri:
                                            profissional?.imagem ||
                                            estabelecimento?.imagens?.[0] ||
                                            estabelecimento?.foto ||
                                            "https://via.placeholder.com/100",
                                    }}
                                    style={styles.avatar}
                                />

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.servicoTitulo}>
                                        {profissional?.area || "Serviço selecionado"}
                                    </Text>
                                    <Text style={styles.servicoSub}>
                                        com {profissional?.nome || "profissional do salão"}
                                    </Text>
                                    <Text style={styles.servicoTempo}>20min</Text>
                                </View>

                                <Pressable onPress={() => router.back()}>
                                    <Text style={styles.closeX}>✕</Text>
                                </Pressable>
                            </View>

                            <Text style={styles.sectionLabel}>Selecione um horário</Text>
                            <View style={styles.horariosGrid}>
                                {horariosDia.map((h) => {
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

                            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
                                Alguma observação?
                            </Text>
                            <RNTextInput
                                placeholder="Ex.: Tenho alergia ao produto X"
                                style={styles.obsInput}
                                value={observacao}
                                onChangeText={setObservacao}
                                multiline
                            />
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Button
                            mode="contained"
                            onPress={handleConfirmar}
                            style={styles.btnConfirmar}
                            labelStyle={{
                                color: "#FFF",
                                fontSize: 16,
                                fontWeight: "600",
                            }}
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 4,
    },
    dayChip: {
        minWidth: 42,
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    dayChipSelected: {
        borderColor: C.primary,
        backgroundColor: "#FFF",
    },
    dayChipDisabled: {
        opacity: 0.35,
    },
    dayLabel: {
        fontSize: 13,
        color: "#78768A",
    },
    dayLabelSelected: {
        color: C.primary,
        fontWeight: "700",
    },
    dayLabelDisabled: {
        color: "#B0A8C0",
    },

    arrowDown: { alignItems: "center", marginBottom: 12 },

    card: {
        backgroundColor: "#FFF",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: C.border,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 12,
        backgroundColor: "#DDD",
    },
    servicoTitulo: { fontSize: 15, fontWeight: "700", color: C.text },
    servicoSub: { color: "#6C6A84", fontSize: 13 },
    servicoTempo: { color: "#9996AE", fontSize: 12, marginTop: 2 },
    closeX: { fontSize: 20, color: "#AAA" },

    sectionLabel: {
        marginTop: 6,
        marginBottom: 8,
        fontWeight: "600",
        fontSize: 14,
        color: C.text,
    },

    horariosGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    horarioChip: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: C.border,
    },
    horarioChipSelected: {
        backgroundColor: C.confirm,
        borderColor: C.confirm,
    },
    horarioText: { fontSize: 13, color: "#6A6780" },
    horarioTextSelected: { color: "#FFF", fontWeight: "600" },

    obsInput: {
        backgroundColor: "#FAFAFF",
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 10,
        padding: 12,
        minHeight: 70,
        fontSize: 13,
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
