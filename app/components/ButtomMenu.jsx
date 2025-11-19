// components/ButtomMenu.jsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
    primary: '#E36AC3',
    text: '#FFFFFF',
};

export default function ButtomMenu() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe} edges={['bottom']}>
            <SafeAreaView style={styles.footer} edges={[]}>
                <Pressable style={styles.item} onPress={() => router.push("/")}>
                    <Ionicons name="home-outline" size={22} color={C.text} />
                    <Text style={styles.label}>Início</Text>
                </Pressable>

                <Pressable style={styles.item} onPress={() => router.push("/view/buscaView")}>
                    <Ionicons name="search-outline" size={22} color={C.text} />
                    <Text style={styles.label}>Busca</Text>
                </Pressable>

                <Pressable
                    style={styles.item}
                    onPress={() => router.push("/view/agendamentosView")} // ✔ AGORA FUNCIONA
                >
                    <Ionicons name="calendar-outline" size={22} color={C.text} />
                    <Text style={styles.label}>Agenda</Text>
                </Pressable>

                <Pressable style={styles.item} onPress={() => router.push("/view/perfilView")}>
                    <Ionicons name="person-outline" size={22} color={C.text} />
                    <Text style={styles.label}>Perfil</Text>
                </Pressable>
            </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        backgroundColor: C.primary,
    },
    footer: {
        flexDirection: 'row',
        backgroundColor: C.primary,
        paddingVertical: 10,
        justifyContent: 'space-around',
        borderTopWidth: 0,
        elevation: 4,
    },
    item: { alignItems: 'center' },
    label: { fontSize: 12, color: C.text, marginTop: 2 },
});
