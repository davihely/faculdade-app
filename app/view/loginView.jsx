import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import usuarioService from "../services/usuarioService";

const C = {
    primary: "#E36AC3",
    bg: "#FFF0FB",
    text: "#3C2A4D",
    outline: "#E6CFE0",
};

const ADMIN_EMAIL = "admin@glowmap.app";

export default function loginView() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [showNotFoundModal, setShowNotFoundModal] = useState(false);

    async function handleEntrar() {
        const mail = String(email || "").trim().toLowerCase();
        if (!mail || !mail.includes("@")) {
            Toast.show({ type: "error", text1: "Digite um e-mail válido" });
            return;
        }

        if (mail === ADMIN_EMAIL.toLowerCase()) {
            router.push({ pathname: "/view/loginSenhaView", params: { email: mail } });
            return;
        }

        try {
            const user = await usuarioService.buscarPorEmail(mail);
            if (user && user.email) {
                router.push({ pathname: "/view/loginSenhaView", params: { email: mail } });
            } else {
                setShowNotFoundModal(true);
            }
        } catch (e) {
            Toast.show({ type: "error", text1: "Erro ao verificar e-mail" });
        }
    }

    return (
        <View style={styles.container}>
            <Image source={require("../logo.png")} style={styles.logo} resizeMode="contain" />

            <View style={{ width: "100%" }}>
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                    mode="outlined"
                    placeholder="seuemail@glowmap.app"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    outlineColor={C.outline}
                    activeOutlineColor={C.primary}
                />
            </View>

            <Button
                mode="contained"
                onPress={handleEntrar}
                style={styles.loginButton}
                contentStyle={{ height: 48 }}
                labelStyle={styles.loginButtonText}
            >
                Entrar com e-mail
            </Button>

            <Text style={styles.orText}>ou</Text>

            <Button
                mode="outlined"
                icon="google"
                onPress={() => Toast.show({ type: "info", text1: "Google (teste)" })}
                style={styles.googleButton}
                contentStyle={{ height: 48 }}
                textColor="#DB4437"
                labelStyle={styles.googleLabel}
            >
                Entrar com Google
            </Button>

            <Pressable onPress={() => setEmail("")}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            <Modal visible={showNotFoundModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Não encontramos sua conta</Text>

                        <Pressable onPress={() => setShowNotFoundModal(false)}>
                            <Text style={styles.modalLink}>Alterar meu e-mail</Text>
                        </Pressable>

                        <Button
                            mode="contained"
                            onPress={() => {
                                setShowNotFoundModal(false);
                                router.push({
                                    pathname: "/view/usuarioFormView",
                                    params: { email: String(email || "").trim().toLowerCase() },
                                });
                            }}
                            style={styles.modalButton}
                            contentStyle={{ height: 48 }}
                            labelStyle={styles.modalButtonText}
                        >
                            Criar minha conta
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
    logo: { width: 180, height: 110, marginBottom: 40, marginTop: -40 },
    label: { fontWeight: "600", color: C.text, marginBottom: 4 },
    input: { width: "100%", backgroundColor: "#FFF", marginBottom: 20, borderRadius: 0 },
    loginButton: { width: "100%", backgroundColor: C.primary, borderRadius: 0, marginBottom: 20, elevation: 0 },
    loginButtonText: { color: "#FFF", fontWeight: "600" },
    orText: { color: "#8A6F83", marginBottom: 20 },
    googleButton: { width: "100%", backgroundColor: "#FFF", borderColor: C.primary, borderRadius: 0, marginBottom: 30, elevation: 0 },
    googleLabel: { fontWeight: "600", color: C.primary },
    cancelText: { color: C.primary, textDecorationLine: "underline" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
    modalBox: { backgroundColor: "#FFF", padding: 24, alignItems: "center" },
    modalTitle: { fontSize: 16, fontWeight: "700", color: C.text, marginBottom: 16 },
    modalLink: { color: C.primary, textDecorationLine: "underline", marginBottom: 20 },
    modalButton: { width: "100%", backgroundColor: C.primary },
    modalButtonText: { color: "#FFF", fontWeight: "600" },
});
