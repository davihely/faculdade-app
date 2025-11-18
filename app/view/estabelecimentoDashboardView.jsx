// app/view/estabelecimentoDashboardView.jsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";

const C = {
    primary: "#E36AC3",
    bg: "#FFF0FB",
    text: "#3C2A4D",
};

export default function estabelecimentoDashboardView() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const raw = await AsyncStorage.getItem("@usuarioLogado");
                if (raw) setUser(JSON.parse(raw));
            } catch (error) {
                console.log("Erro ao carregar usuário", error);
            }
            setLoading(false);
        }
        load();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Carregando...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Erro ao carregar dados do estabelecimento.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: C.bg, elevation: 0 }}>
                <Appbar.Content title="Meu Estabelecimento" titleStyle={{ color: C.text, fontWeight: "bold" }} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>

                <Text style={styles.welcome}>Olá, {user.nomeEstabelecimento || user.nome} 👋</Text>

                <Text style={styles.info}>
                    Aqui você poderá atualizar imagens, agenda, serviços, horários, descrição, redes sociais e muito mais.
                </Text>

                <Text style={styles.block}>📍 Endereço: {user.endereco || "Não informado"}</Text>
                <Text style={styles.block}>📁 Categoria ID: {user.categoriaId || "Não selecionada"}</Text>

                <Button
                    mode="contained"
                    onPress={() => router.push(`/view/estabelecimentoFormView?id=${user.id}`)}
                    style={styles.btnEdit}
                    labelStyle={{ color: "#FFF", fontWeight: "600" }}
                >
                    Editar meus dados
                </Button>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    btnEdit: {
        backgroundColor: C.primary,
        marginTop: 20,
        borderRadius: 6,
        paddingVertical: 4,
    },
    container: { flex: 1, backgroundColor: C.bg },
    center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: C.bg },
    text: { color: C.text, fontSize: 15 },
    welcome: { fontSize: 20, fontWeight: "700", color: C.text, marginBottom: 10 },
    info: { color: "#6D5F78", fontSize: 14, marginBottom: 20 },
    block: {
        backgroundColor: "#FFF",
        padding: 12,
        borderRadius: 6,
        marginBottom: 10,
        color: C.text,
        fontSize: 14
    },
});
