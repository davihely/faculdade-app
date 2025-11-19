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

            {/* BANNERS — só aparece se existir */}
            {loading ? (
                <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 20 }} />
            ) : banners.length > 0 ? (
                <>
                    <Text style={styles.sectionTitle}>Destaques</Text>
                    <Carousel
                        width={width - 32}
                        height={160}
                        data={banners}
                        loop
                        scrollAnimationDuration={700}
                        style={{ alignSelf: "center", marginTop: 10 }}
                        renderItem={({ item }) => (
                            <View style={styles.bannerBox}>
                                <Image
                                    source={{ uri: item?.imagem || "" }}
                                    style={styles.banner}
                                />
                            </View>
                        )}
                    />
                </>
            ) : null}

            {/* TEXTO */}
            <Text style={styles.blockTitle}>O mundo de beleza e bem-estar na sua mão</Text>
            <Text style={styles.blockSubtitle}>
                Fique por dentro das novidades nos espaços parceiros
            </Text>

            {/* CATEGORIAS — horizontal, deslizando, mais altas */}
            <Text style={styles.sectionTitle}>Categorias</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
            >
                {categorias.map((cat) => (
                    <Pressable
                        key={cat.id}
                        style={styles.categoryCard}
                        onPress={() =>
                            router.push({
                                pathname: "/view/categoriaDetalheView",
                                params: { id: cat.id, nome: cat.nome },
                            })
                        }
                    >
                        <Image
                            source={{ uri: cat?.imagem || "https://via.placeholder.com/200" }}
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>{cat.nome}</Text>
                    </Pressable>
                ))}
            </ScrollView>

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

    /* categorias horizontais */
    categoryScroll: {
        paddingVertical: 10,
        paddingRight: 8,
    },
    categoryCard: {
        width: 115,
        marginRight: 14,
        alignItems: "center",
    },
    categoryImage: {
        width: "100%",
        height: 150, // ← mais alto
        borderRadius: 12,
        backgroundColor: "#ddd",
    },
    categoryText: {
        marginTop: 6,
        color: C.text,
        fontWeight: "700",
        fontSize: 13,
        textAlign: "center",
    },
});
