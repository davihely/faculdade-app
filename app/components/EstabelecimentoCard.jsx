import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const C = {
    primary: "#E36AC3",
    bg: "#FFF",
    text: "#3C2A4D",
};

export default function EstabelecimentoCard({ data }) {
    const router = useRouter();

    return (
        <Pressable
            style={styles.card}
            onPress={() => router.push({ pathname: "/view/estabelecimentoDetalheView", params: { id: data.id } })}
        >
            <Image
                source={{ uri: data.imagem || "https://via.placeholder.com/300x200.png?text=Sem+Foto" }}
                style={styles.img}
                resizeMode="cover"
            />

            <View style={styles.body}>
                <Text style={styles.nome}>{data.nome}</Text>
                <Text style={styles.endereco}>{data.endereco || "Endereço não informado"}</Text>

                <View style={styles.rateRow}>
                    <Text style={styles.stars}>⭐ {data.avaliacao || "Novo"}</Text>
                    <Text style={styles.tag}>{data.status || "Ativo"}</Text>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "100%",
        backgroundColor: C.bg,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#E6CFE0",
    },
    img: { width: "100%", height: 140, backgroundColor: "#ccc" },
    body: { padding: 10 },
    nome: { fontSize: 16, fontWeight: "800", color: C.text, marginBottom: 3 },
    endereco: { fontSize: 12, color: "#7A6C82", marginBottom: 6 },
    rateRow: { flexDirection: "row", justifyContent: "space-between" },
    stars: { fontWeight: "600", color: "#FFB400" },
    tag: { fontWeight: "600", color: C.primary, textTransform: "uppercase" },
});
