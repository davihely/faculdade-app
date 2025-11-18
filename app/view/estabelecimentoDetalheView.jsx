// app/view/estabelecimentoDetalheView.jsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import usuarioService from "../services/usuarioService";

const C = {
    primary: "#E36AC3",
    bg: "#FFF0FB",
    text: "#3C2A4D",
    outline: "#E6CFE0",
    gray: "#8A6F83",
};

// Função para pegar o dia de hoje
function getDiaHoje() {
    const dias = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    return dias[new Date().getDay()];
}

export default function EstabelecimentoDetalheView() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [estabelecimento, setEstabelecimento] = useState(null);

    useEffect(() => {
        async function load() {
            const todos = await usuarioService.listar();
            const est = todos.find(
                (u) => u.id === id && u.tipoUsuario === "Estabelecimento"
            );
            setEstabelecimento(est || null);
        }
        load();
    }, []);

    if (!estabelecimento) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: C.text }}>Carregando...</Text>
            </View>
        );
    }

    const diaHoje = getDiaHoje();

    return (
        <View style={{ flex: 1, backgroundColor: "#FFF" }}>

            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="chevron-back-outline" size={26} color={C.text} />
                </Pressable>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    {estabelecimento.nomeEstabelecimento}
                </Text>

                <View style={styles.headerIcons}>
                    <Ionicons name="heart-outline" size={24} color={C.text} />
                    <Ionicons
                        name="share-outline"
                        size={24}
                        color={C.text}
                        style={{ marginLeft: 18 }}
                    />
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 140 }} // espaço pro botão flutuante
            >

                {/* BANNER */}
                {estabelecimento?.imagens?.[0] && (
                    <Image
                        source={{ uri: estabelecimento.imagens[0] }}
                        style={styles.banner}
                        resizeMode="cover"
                    />
                )}

                {/* NOME + SELO */}
                <View style={styles.infoWrapper}>
                    <View style={styles.row}>
                        <Image
                            source={{ uri: estabelecimento.imagens?.[0] || "https://via.placeholder.com/80" }}
                            style={styles.logo}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.nome}>{estabelecimento.nomeEstabelecimento}</Text>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Novo no app</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ENDEREÇO */}
                <Text style={styles.sectionTitle}>Endereço</Text>
                <View style={[styles.row, { paddingHorizontal: 16 }]}>
                    <Ionicons name="location-outline" size={20} color={C.text} />
                    <Text style={styles.endereco}>{estabelecimento.endereco}</Text>
                </View>
                <Pressable
                    onPress={() =>
                        Linking.openURL(
                            `https://www.google.com/maps/search/${encodeURIComponent(
                                estabelecimento.endereco || ""
                            )}`
                        )
                    }
                >
                    <Text style={styles.link}>Ver no mapa</Text>
                </Pressable>

                {/* SOBRE */}
                <Text style={styles.sectionTitle}>Sobre</Text>
                <Text style={styles.descricao}>{estabelecimento.sobre}</Text>

                {/* REDES SOCIAIS */}
                {estabelecimento.redesSociais && (
                    <>
                        <Text style={styles.sectionTitle}>Redes sociais</Text>
                        <Pressable
                            onPress={() => Linking.openURL(estabelecimento.redesSociais)}
                        >
                            <View style={[styles.row, { paddingHorizontal: 16 }]}>
                                <MaterialCommunityIcons
                                    name="instagram"
                                    size={22}
                                    color={C.text}
                                />
                                <Text style={styles.link}>{estabelecimento.redesSociais}</Text>
                            </View>
                        </Pressable>
                    </>
                )}

                {/* HORÁRIOS */}
                <Text style={styles.sectionTitle}>Horário de funcionamento</Text>
                {estabelecimento.horarios?.map((dia, index) => {
                    const diasSemana = [
                        "Segunda",
                        "Terça",
                        "Quarta",
                        "Quinta",
                        "Sexta",
                        "Sábado",
                        "Domingo",
                    ];
                    const nomeDia = diasSemana[index];
                    const isHoje = nomeDia === diaHoje;

                    return (
                        <View style={styles.horarioLinha} key={index}>
                            <Text
                                style={[styles.horarioDia, isHoje ? styles.bold : null]}
                            >
                                {isHoje ? "Hoje  " : ""}
                                {nomeDia}
                            </Text>
                            <Text
                                style={[styles.horarioTexto, isHoje ? styles.bold : null]}
                            >
                                {dia.naoAbre ? "Fechado" : `${dia.abre} - ${dia.fecha}`}
                            </Text>
                        </View>
                    );
                })}

                {/* PROFISSIONAIS */}
                {!!estabelecimento.funcionarios?.length && (
                    <>
                        <Text style={styles.sectionTitle}>Profissionais</Text>
                        {estabelecimento.funcionarios.map((f, i) => (
                            <View key={i} style={styles.profCard}>
                                <Ionicons
                                    name="person-circle-outline"
                                    size={30}
                                    color={C.text}
                                />
                                <View>
                                    <Text style={styles.profNome}>{f.nome}</Text>
                                    <Text style={styles.profArea}>{f.area}</Text>
                                </View>
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>

            {/* BOTÃO AGENDAR (FLUTUANTE NO RODAPÉ, ACIMA DO MENU) */}
            <View style={styles.footer}>
                <Button
                    mode="contained"
                    style={styles.agendarBtn}
                    labelStyle={{
                        fontSize: 17,
                        fontWeight: "700",
                        color: "#FFF",
                    }}
                    onPress={() => { }}
                >
                    Agendar
                </Button>
            </View>
        </View>
    );
}

// =========== Styles ============

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },

    header: {
        paddingTop: 45,
        paddingBottom: 14,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: C.text,
        flex: 1,
        textAlign: "center",
        marginHorizontal: 8,
    },
    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
    },

    banner: { width: "100%", height: 180 },
    infoWrapper: { padding: 16, paddingBottom: 0 },
    row: { flexDirection: "row", alignItems: "center" },
    logo: { width: 65, height: 65, borderRadius: 50, marginRight: 14 },
    nome: { fontSize: 18, fontWeight: "700", color: C.text },

    tag: {
        backgroundColor: "#F6EEDA",
        paddingHorizontal: 10,
        paddingVertical: 3,
        alignSelf: "flex-start",
        borderRadius: 20,
        marginTop: 4,
    },
    tagText: { color: "#C19C56", fontSize: 11, fontWeight: "600" },

    sectionTitle: {
        marginTop: 22,
        marginBottom: 6,
        fontWeight: "700",
        fontSize: 16,
        color: C.text,
        marginLeft: 16,
    },
    endereco: {
        flex: 1,
        color: C.text,
        fontSize: 14,
        marginLeft: 6,
        flexWrap: "wrap",
    },
    link: {
        color: "#6B4EFF",
        textDecorationLine: "underline",
        marginLeft: 16,
        marginTop: 4,
    },
    descricao: { color: C.gray, fontSize: 14, marginHorizontal: 16 },

    horarioLinha: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 16,
        paddingVertical: 3,
    },
    horarioDia: { fontSize: 14, color: C.text },
    horarioTexto: { fontSize: 14, color: C.text },
    bold: { fontWeight: "700" },

    profCard: {
        backgroundColor: "#FFF",
        marginHorizontal: 16,
        marginTop: 8,
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: C.outline,
        alignItems: "center",
        gap: 10,
    },
    profNome: { fontWeight: "700", color: C.text },
    profArea: { fontSize: 13, color: C.gray },

    footer: {
        position: "absolute",
        bottom: 80,          // sobe pra não ficar embaixo do BottomMenu
        left: 16,
        right: 16,
        alignItems: "center",
    },
    agendarBtn: {
        width: "100%",
        backgroundColor: "#6B4EFF",
        borderRadius: 10,
        paddingVertical: 6,
        elevation: 3,
    },
});
