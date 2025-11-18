import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Appbar, Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import usuarioService from '../services/usuarioService';

const C = {
    primary: '#E36AC3',
    bg: '#FFF0FB',
    text: '#3C2A4D',
    outline: '#E6CFE0',
};

export default function loginSenhaView() {
    const router = useRouter();
    const { email } = useLocalSearchParams();
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    async function handleLogin() {
        try {
            const { ok, usuario } = await usuarioService.autenticar(email.toLowerCase(), senha);

            if (ok && usuario) {
                await AsyncStorage.setItem("@usuarioLogado", JSON.stringify(usuario));

                Toast.show({ type: 'success', text1: 'Bem-vinda(o)!' });

                if (usuario.tipoUsuario === "Admin") {
                    router.replace('/view/admin/dashboardAdminView');
                }
                else if (usuario.tipoUsuario === "Estabelecimento") {
                    router.replace('/view/estabelecimentoDashboardView');
                }
                else {
                    router.replace('/view/homeView');
                }
            }

        } catch (e) {
            Toast.show({ type: 'error', text1: e.message });
        }
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={() => router.back()} color={C.text} />
                <Appbar.Content title="Entrar" titleStyle={{ fontWeight: '600', color: C.text }} />
            </Appbar.Header>

            <Image source={require('../logo.png')} style={styles.logo} resizeMode="contain" />

            <Text style={styles.title}>Encontramos sua conta</Text>
            <Text style={styles.subtitle}>Digite sua senha para continuar</Text>

            <Text style={styles.label}>E-mail</Text>
            <TextInput mode="outlined" value={String(email)} disabled style={styles.input} />

            <Text style={styles.label}>Senha</Text>
            <TextInput
                mode="outlined"
                placeholder="••••••"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                right={<TextInput.Icon icon={mostrarSenha ? 'eye-off' : 'eye'} onPress={() => setMostrarSenha(!mostrarSenha)} />}
                style={styles.input}
                outlineColor={C.outline}
                activeOutlineColor={C.primary}
            />

            <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                contentStyle={{ height: 48 }}
                labelStyle={styles.loginButtonText}
            >
                Entrar
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 24 },
    header: { backgroundColor: 'transparent', elevation: 0 },
    logo: { width: 150, height: 100, alignSelf: 'center', marginTop: 20, marginBottom: 20 },
    title: { fontWeight: '700', color: C.text, textAlign: 'center', fontSize: 16 },
    subtitle: { color: '#8A6F83', textAlign: 'center', marginBottom: 30 },
    label: { fontWeight: '600', color: C.text, marginBottom: 4 },
    input: { backgroundColor: '#FFF', width: '100%', borderRadius: 0, marginBottom: 16 },
    loginButton: { width: '100%', backgroundColor: C.primary, borderRadius: 0, marginTop: 20, marginBottom: 16 },
    loginButtonText: { color: '#FFF', fontWeight: '600' },
});
