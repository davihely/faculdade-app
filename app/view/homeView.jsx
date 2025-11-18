// app/view/homeView.jsx

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import bannerService from "../services/bannerService";
import categoriaService from "../services/categoriaService";

const width = Dimensions.get("window").width;

const C = {
    primary: "#E36AC3",
    bg: "#FFF0FB",
    text: "#3C2A4D",
    outline: "#E6CFE0",
};

export default function HomeView() {
    const router = useRouter();

    const [categorias, setCategorias] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    async function carregarDados() {
        try {
            setLoading(true);
            
            const catList = await categoriaService.listar();
            const bannerList = await bannerService.listar();

            const bannersFiltrados = bannerList
                .filter((b) => b.ativo === true)   // apenas ativos
                .sort((a, b) => a.ordem - b.ordem); // ordem crescente

            setCategorias(catList);
            setBanners(bannersFiltrados);

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    // Atualiza quando a tela volta ao foco
    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [])
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>

            {/* LOCALIZAÇÃO */}
            <Text style={styles.sectionTitleSmall}>Minha localização</Text>
            <Pressable style={styles.locationInput}>
                <Text style={styles.locationText}>R. 10, 6 - Vila Ivonete</Text>
                <Ionicons name="chevron-down-outline" size={18} color={C.text} />
            </Pressable>

            {/* CARROSSEL DE BANNERS */}
            <Text style={styles.sectionTitle}>Destaques</Text>

            {loading ? (
                <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 20 }} />
            ) : banners.length > 0 ? (
                <Carousel
                    width={width - 32}
                    height={160}
                    data={banners}
                    style={{ borderRadius: 10, alignSelf: "center" }}
                    scrollAnimationDuration={600}
                    renderItem={({ item }) => (
                        <Image
                            source={{ uri: item.imagem }}
                            style={styles.banner}
                            resizeMode="cover"
                        />
                    )}
                />
            ) : (
                <Text style={{ color: C.text, marginTop: 8 }}>Nenhum banner disponível</Text>
            )}

            {/* TEXTO */}
            <Text style={styles.blockTitle}>O mundo de beleza e bem-estar na sua mão</Text>
            <Text style={styles.blockSubtitle}>
                Fique por dentro das novidades nos espaços parceiros
            </Text>

            {/* LISTAGEM CATEGORIAS */}
            <Text style={styles.sectionTitle}>Categorias</Text>

            {loading ? (
                <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 20 }} />
            ) : (
                <View style={styles.cardRowWrapper}>
                    {categorias.map((cat) => (
                        <Pressable
                            key={cat.id}
                            style={styles.card}
                            onPress={() =>
                                router.push({
                                    pathname: "/view/categoriaDetalheView",
                                    params: { id: cat.id, nome: cat.nome }
                                })
                            }
                        >
                            <Image
                                source={{ uri: cat?.imagem || "https://via.placeholder.com/300?text=Sem+imagem" }}
                                style={styles.cardImage}
                            />
                            <Text style={styles.cardText}>{cat.nome}</Text>
                        </Pressable>
                    ))}
                </View>
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 16 },
    sectionTitleSmall: { marginTop: 16, color: C.text, fontWeight: "700" },
    locationInput: {
        marginTop: 8,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: C.outline,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    locationText: { flex: 1, color: C.text },
    sectionTitle: { marginTop: 25, color: C.text, fontWeight: "800", fontSize: 18 },
    blockTitle: { marginTop: 20, color: C.text, fontWeight: "800", fontSize: 18 },
    blockSubtitle: { color: "#8A6F83", marginBottom: 12 },
    banner: { width: "100%", height: 160, borderRadius: 10 },
    cardRowWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 14
    },
    card: { width: "32%", marginBottom: 14 },
    cardImage: { width: "100%", height: 110, borderRadius: 6, backgroundColor: "#ddd" },
    cardText: { marginTop: 6, color: C.text, fontWeight: "700", fontSize: 12, textAlign: "center" },
});
