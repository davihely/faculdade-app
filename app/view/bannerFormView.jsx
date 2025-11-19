import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { Appbar, Button, Switch, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import bannerService from "../services/bannerService";

const C = {
    primary: "#E36AC3",
    text: "#3C2A4D",
    bg: "#FFF0FB",
    outline: "#C7A8C4"
};

export default function bannerFormView() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [titulo, setTitulo] = useState("");
    const [imagem, setImagem] = useState(null);
    const [link, setLink] = useState("");
    const [ordem, setOrdem] = useState("0");
    const [ativo, setAtivo] = useState(true);

    async function carregar() {
        if (!id) return;
        const data = await bannerService.buscarPorId(id);
        if (data) {
            setTitulo(data.titulo);
            setImagem(data.imagem);
            setLink(data.link);
            setOrdem(String(data.ordem));
            setAtivo(data.ativo);
        }
    }

    useEffect(() => { carregar(); }, [id]);

    async function escolherImagem() {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Toast.show({
                    type: "error",
                    text1: "Permissão necessária para acessar a galeria."
                });
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,   //🔥 AQUI É A CORREÇÃO
                quality: 1,
                base64: false
            });

            if (!result.canceled) {
                setImagem(result.assets[0].uri);
            }
        } catch (e) {
            console.log("Erro ao selecionar imagem:", e);
        }
    }

    async function salvar() {
        try {
            const payload = {
                titulo,
                imagem,
                link,
                ordem: Number(ordem),
                ativo
            };

            if (!id) {
                await bannerService.salvar(payload);
            } else {
                await bannerService.atualizar(id, payload);
            }

            Toast.show({ type: "success", text1: "Banner salvo!" });
            router.back();

        } catch (e) {
            Toast.show({ type: "error", text1: "Erro ao salvar" });
        }
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: C.bg }}>
                <Appbar.BackAction color={C.text} onPress={() => router.back()} />
                <Appbar.Content title="Banner" titleStyle={{ color: C.text }} />
            </Appbar.Header>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.form}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.label}>Título</Text>
                    <TextInput
                        value={titulo}
                        onChangeText={setTitulo}
                        mode="outlined"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Imagem</Text>
                    <Button mode="outlined" onPress={escolherImagem}>
                        Selecionar
                    </Button>

                    {imagem && <Image source={{ uri: imagem }} style={styles.preview} />}

                    <Text style={styles.label}>Link (opcional)</Text>
                    <TextInput
                        value={link}
                        onChangeText={setLink}
                        mode="outlined"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Ordem</Text>
                    <TextInput
                        value={ordem}
                        onChangeText={setOrdem}
                        mode="outlined"
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <View style={styles.switchRow}>
                        <Text style={styles.label}>Ativo</Text>
                        <Switch value={ativo} onValueChange={setAtivo} />
                    </View>

                    <Button mode="contained" style={styles.btnSave} onPress={salvar}>
                        Salvar
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    form: { padding: 20, paddingBottom: 60 },
    label: { color: C.text, fontWeight: "700", marginTop: 12 },
    input: { backgroundColor: "#FFF" },
    preview: {
        width: "100%",
        height: 180,
        borderRadius: 8,
        marginVertical: 10
    },
    switchRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    btnSave: { marginTop: 20, backgroundColor: C.primary }
});
