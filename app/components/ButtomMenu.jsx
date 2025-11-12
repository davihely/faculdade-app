import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const C = {
    primary: '#E36AC3',
    text: '#FFFFFF',
};

export default function ButtomMenu() {
    return (
        <View style={styles.footer}>
            <Pressable style={styles.item}>
                <Ionicons name="home-outline" size={22} color={C.text} />
                <Text style={styles.label}>Início</Text>
            </Pressable>

            <Pressable style={styles.item}>
                <Ionicons name="search-outline" size={22} color={C.text} />
                <Text style={styles.label}>Busca</Text>
            </Pressable>

            <Pressable style={styles.item}>
                <Ionicons name="calendar-outline" size={22} color={C.text} />
                <Text style={styles.label}>Agenda</Text>
            </Pressable>

            <Pressable style={styles.item}>
                <Ionicons name="person-outline" size={22} color={C.text} />
                <Text style={styles.label}>Perfil</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        backgroundColor: C.primary,
        paddingVertical: 8,
        justifyContent: 'space-around',
        borderTopWidth: 0,
        elevation: 4,
    },
    item: { alignItems: 'center' },
    label: { fontSize: 12, color: C.text, marginTop: 2 },
});
