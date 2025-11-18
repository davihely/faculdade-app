// app/view/categoriaFormView.jsx

import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Appbar, Button, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import categoriaService from "../services/categoriaService";

const C = {
    primary: "#E36AC3",
    text: "#3C2A4D",
    bg: "#FFF0FB",
    outline: "#C7A8C4"
};

export default function categoriaFormView() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [nome, setNome] = useState("");
    const [imagem, setImagem] = useState(null);

    async function carregar() {
        if (!id) return;
        const data = await categoriaService.buscarPorId(id);
        if (data) {
            setNome(data.nome);
            setImagem(data.imagem);
        }
    }

    useEffect(() => { carregar(); }, [id]);

    async function escolherImagem() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setImagem(base64Img);
        }
    }

    async function salvar() {
        try {
            const payload = { nome, imagem: imagem ?? null };

            if (!id) {
                await categoriaService.criar(payload);
            } else {
                await categoriaService.atualizar(id, payload);
            }

            Toast.show({ type: "success", text1: "Categoria salva!" });
            router.back();

        } catch (e) {
            console.log(e);
            Toast.show({ type: "error", text1: "Erro ao salvar categoria" });
        }
    }

    return (
        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: C.bg }}>
                <Appbar.BackAction onPress={() => router.back()} color={C.text} />
                <Appbar.Content title="Categoria" titleStyle={{ color: C.text }} />
            </Appbar.Header>

            <View style={styles.form}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                    mode="outlined"
                    value={nome}
                    onChangeText={setNome}
                    outlineColor={C.outline}
                    activeOutlineColor={C.primary}
                    style={styles.input}
                />

                <Text style={styles.label}>Imagem</Text>
                <Button mode="outlined" onPress={escolherImagem}>
                    Selecionar imagem
                </Button>

                {imagem && <Image source={{ uri: imagem }} style={styles.preview} />}

                <Button mode="contained" onPress={salvar} style={styles.btnSave}>
                    Salvar
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: C.bg },
    form: { padding: 20 },
    label: { color: C.text, fontWeight: "600", marginTop: 10 },
    input: { backgroundColor: "#FFF" },
    preview: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: C.outline
    },
    btnSave: { marginTop: 20, backgroundColor: C.primary }
});
