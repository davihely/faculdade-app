// app/view/homeView.jsx

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
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
                ?.filter((b) => b?.ativo)
                ?.sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

            setCategorias(catList || []);
            setBanners(bannersFiltrados || []);

            console.log("BANNERS LOADED: ", bannersFiltrados);

        } catch (error) {
            console.error("Erro ao carregar:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [])
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

            {/* LOCALIZAÇÃO */}
            <Text style={styles.sectionTitleSmall}>Minha localização</Text>
            <Pressable style={styles.locationInput}>
                <Text style={styles.locationText}>R. 10, 6 - Vila Ivonete</Text>
                <Ionicons name="chevron-down-outline" size={18} color={C.text} />
            </Pressable>

            {/* BANNERS */}
            <Text style={styles.sectionTitle}>Destaques</Text>

            {loading ? (
                <ActivityIndicator size="large" color={C.primary} />
            ) : banners?.length > 0 ? (
                <Carousel
                    width={width - 32}
                    height={160}
                    data={banners}
                    loop
                    scrollAnimationDuration={700}
                    style={{ alignSelf: "center" }}
                    renderItem={({ item }) => (
                        <View style={styles.bannerBox}>
                            <Image
                                source={{ uri: item?.imagem || "" }}
                                style={styles.banner}
                                onError={() => console.log("Erro imagem banner:", item)}
                            />
                        </View>
                    )}
                />
            ) : (
                <Text style={{ marginTop: 10, color: C.text }}>Nenhum banner cadastrado</Text>
            )}

            {/* TEXTO */}
            <Text style={styles.blockTitle}>O mundo de beleza e bem-estar na sua mão</Text>
            <Text style={styles.blockSubtitle}>
                Fique por dentro das novidades nos espaços parceiros
            </Text>

            {/* CATEGORIAS */}
            <Text style={styles.sectionTitle}>Categorias</Text>

            <View style={styles.cardContainer}>
                {categorias.map((cat) => (
                    <Pressable
                        key={cat.id}
                        style={styles.card}
                        onPress={() =>
                            router.push({
                                pathname: "/view/categoriaDetalheView",
                                params: { id: cat.id, nome: cat.nome },
                            })
                        }
                    >
                        <Image
                            source={{ uri: cat?.imagem || "https://via.placeholder.com/200" }}
                            style={styles.cardImage}
                        />
                        <Text style={styles.cardText}>{cat.nome}</Text>
                    </Pressable>
                ))}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 16 },

    /* localização */
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

    /* banners */
    sectionTitle: { marginTop: 25, color: C.text, fontWeight: "800", fontSize: 18 },
    bannerBox: {
        width: "100%",
        height: 160,
        backgroundColor: "#ddd",
        overflow: "hidden",
        borderRadius: 12,
    },
    banner: {
        width: "100%",
        height: "100%",
    },

    /* text blocks */
    blockTitle: { marginTop: 22, color: C.text, fontWeight: "800", fontSize: 18 },
    blockSubtitle: { color: "#8A6F83", marginBottom: 10 },

    /* categorias */
    cardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 14,
    },
    card: {
        width: (width - 48) / 3, // 3 cards por linha
        alignItems: "center",
    },
    cardImage: {
        width: "100%",
        height: 95,
        borderRadius: 10,
        backgroundColor: "#ddd",
    },
    cardText: {
        marginTop: 5,
        color: C.text,
        fontWeight: "700",
        fontSize: 12,
        textAlign: "center",
    },
});
