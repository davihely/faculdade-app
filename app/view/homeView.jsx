import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const C = {
    primary: '#E36AC3',
    bg: '#FFF0FB',
    text: '#3C2A4D',
    outline: '#E6CFE0',
};

export default function HomeView() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.sectionTitleSmall}>Minha localização</Text>
            <Pressable style={styles.locationInput}>
                <Text style={styles.locationText}>R. 10, 6 - Vila Ivonete</Text>
                <Ionicons name="chevron-down-outline" size={18} color={C.text} />
            </Pressable>

            <Text style={styles.sectionTitle}>Destaques</Text>
            <Text style={styles.sectionSubtitle}>Descubra sua melhor versão com a GlowMap!</Text>

            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600' }}
                style={styles.banner}
                resizeMode="cover"
            />

            <Text style={styles.blockTitle}>O mundo de beleza e bem-estar na sua mão</Text>
            <Text style={styles.blockSubtitle}>
                Fique por dentro das novidades nos espaços parceiros
            </Text>

            <View style={styles.cardRow}>
                <View style={styles.card}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=800' }}
                        style={styles.cardImage}
                    />
                    <Text style={styles.cardText}>Estúdios de tatuagem</Text>
                </View>

                <View style={styles.card}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1593702295094-22ad6caab7e3?q=80&w=800' }}
                        style={styles.cardImage}
                    />
                    <Text style={styles.cardText}>Barbearias</Text>
                </View>

                <View style={styles.card}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1580982337567-8f6a0b7ef8a2?q=80&w=800' }}
                        style={styles.cardImage}
                    />
                    <Text style={styles.cardText}>Espaços infantis</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 16 },
    sectionTitleSmall: { marginTop: 16, color: C.text, fontWeight: '700' },
    locationInput: {
        marginTop: 8,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: C.outline,
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: { flex: 1, color: C.text },
    sectionTitle: { marginTop: 20, color: C.text, fontWeight: '800', fontSize: 18 },
    sectionSubtitle: { color: '#8A6F83', marginBottom: 12 },
    banner: { width: '100%', height: 160, borderRadius: 8 },
    blockTitle: { marginTop: 20, color: C.text, fontWeight: '800', fontSize: 18 },
    blockSubtitle: { color: '#8A6F83', marginBottom: 12 },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
    card: { width: '32%' },
    cardImage: { width: '100%', height: 110, borderRadius: 6 },
    cardText: { marginTop: 6, color: C.text, fontWeight: '700', fontSize: 12 },
});
