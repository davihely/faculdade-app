import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const C = {
    primary: "#E36AC3",
    bg: "#FFF0FB",
    text: "#3C2A4D",
    outline: "#E6CFE0",
};

export default function DashboardAdminView() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Painel Administrativo</Text>

            <Pressable style={styles.button} onPress={() => router.push("/view/categoriaListView")}>
                <Text style={styles.buttonText}>Gerenciar Categorias</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => router.push("/view/bannerListView")}>
                <Text style={styles.buttonText}>Gerenciar Banners</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => router.push("/admin/userCrudView")}>
                <Text style={styles.buttonText}>Gerenciar Usuários</Text>
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg, padding: 24 },
    title: { fontSize: 20, fontWeight: "700", color: C.text, marginBottom: 24, textAlign: "center" },
    button: {
        paddingVertical: 14,
        backgroundColor: C.primary,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 14,
    },
});
