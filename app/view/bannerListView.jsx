// app/view/bannerListView.jsx

import { useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, View } from "react-native";
import { Appbar, Button, Text } from "react-native-paper";
import bannerService from "../services/bannerService";

const C = {
    primary: "#E36AC3",
    text: "#3C2A4D",
    bg: "#FFF0FB"
};

export default function bannerListView() {
    const router = useRouter();
    const navigation = useNavigation();
    const [banners, setBanners] = useState([]);

    async function carregar() {
        const dados = await bannerService.listar();
        setBanners(dados);
    }

    useFocusEffect(
        useCallback(() => {
            carregar();
        }, [])
    );

    function confirmarExcluir(id) {
        Alert.alert("Excluir", "Deseja excluir este banner?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                onPress: async () => {
                    await bannerService.excluir(id);
                    carregar();
                }
            }
        ]);
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: C.bg }}>
                <Appbar.BackAction color={C.text} onPress={() => router.push("/view/admin/dashboardAdminView")} />
                <Appbar.Content title="Banners" titleStyle={{ color: C.text }} />
            </Appbar.Header>

            <FlatList
                data={banners}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum banner cadastrado</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {item.imagem && <Image source={{ uri: item.imagem }} style={styles.img} />}
                        <Text style={styles.title}>{item.titulo}</Text>

                        <View style={styles.row}>
                            <Button
                                mode="outlined"
                                onPress={() => router.push(`/view/bannerFormView?id=${item.id}`)}
                            >
                                Editar
                            </Button>
                            <Button mode="contained" onPress={() => confirmarExcluir(item.id)}>
                                Excluir
                            </Button>
                        </View>
                    </View>
                )}
            />

            <Button
                mode="contained"
                style={styles.btnAdd}
                onPress={() => router.push("/view/bannerFormView")}
            >
                Novo banner
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 10,
        marginBottom: 14,
        elevation: 2
    },
    img: { width: "100%", height: 120, borderRadius: 8, marginBottom: 8 },
    title: { fontWeight: "700", color: C.text, marginBottom: 8 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    btnAdd: { margin: 16, backgroundColor: C.primary }
});
