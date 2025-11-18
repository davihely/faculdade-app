// app/view/categoriaListView.jsx

import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import categoriaService from "../services/categoriaService";

const C = {
    primary: "#E36AC3",
    text: "#3C2A4D",
    bg: "#FFF0FB",
    outline: "#C7A8C4"
};

export default function categoriaListView() {
    const router = useRouter();
    const [lista, setLista] = useState([]);

    async function carregar() {
        const data = await categoriaService.listar();
        setLista(data);
    }

    // 🔥 Correção — agora atualiza sempre ao focar na tela
    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    function excluir(id) {
        Alert.alert("Excluir", "Deseja realmente excluir?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    await categoriaService.excluir(id);
                    carregar();
                },
            },
        ]);
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: C.bg }}>
                <Appbar.BackAction onPress={() => router.push("/view/admin/dashboardAdminView")} color={C.text} />
                <Appbar.Content title="Categorias" titleStyle={{ color: C.text }} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Button
                    mode="contained"
                    onPress={() => router.push("/view/categoriaFormView")}
                    style={styles.btnNew}
                >
                    Nova Categoria
                </Button>

                {lista.map((item) => (
                    <View key={item.id} style={styles.card}>
                        {item.imagem && (
                            <Image source={{ uri: item.imagem }} style={styles.thumb} />
                        )}
                        <Text style={styles.nome}>{item.nome}</Text>

                        <View style={styles.actions}>
                            <Pressable onPress={() => router.push(`/view/categoriaFormView?id=${item.id}`)}>
                                <Text style={styles.edit}>Editar</Text>
                            </Pressable>

                            <Pressable onPress={() => excluir(item.id)}>
                                <Text style={styles.del}>Excluir</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    btnNew: { backgroundColor: C.primary, marginBottom: 20 },
    card: {
        backgroundColor: "#FFF",
        padding: 12,
        borderRadius: 10,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: C.outline,
        flexDirection: "row",
        alignItems: "center"
    },
    thumb: { width: 50, height: 50, borderRadius: 6, marginRight: 12 },
    nome: { flex: 1, fontWeight: "700", color: C.text },
    actions: { flexDirection: "row", gap: 16 },
    edit: { color: "#0090FF", fontWeight: "600" },
    del: { color: "#D90429", fontWeight: "600" }
});
