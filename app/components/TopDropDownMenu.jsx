import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from 'react-native';

const C = {
    primary: '#E36AC3',
    text: '#FFFFFF',
};

export default function TopDropDownMenu() {
    const router = useRouter();

    async function handleLogout() {
        await AsyncStorage.removeItem("@usuarioLogado");
        router.replace("/"); 
    }

    return (
        <View style={styles.header}>
            <Image
                source={require('../logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* BOTÃO DE LOGOUT */}
            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                <MaterialIcons name="logout" size={26} color="#FFF" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: C.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        elevation: 3,
    },
    logo: {
        width: 130,
        height: 60,
    },
    logoutBtn: {
        padding: 6,
        borderRadius: 50,
    },
});
