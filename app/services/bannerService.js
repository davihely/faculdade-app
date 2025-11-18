import AsyncStorage from "@react-native-async-storage/async-storage";
import BannerEntity from "../entities/BannerEntity";

const STORAGE_KEY = "@banners";

async function listar() {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
}

async function buscarPorId(id) {
    const lista = await listar();
    return lista.find((i) => i.id === id);
}

async function salvar({ titulo, imagem, link, ordem, ativo }) {
    const lista = await listar();
    const novo = new BannerEntity({ titulo, imagem, link, ordem, ativo });
    lista.push(novo);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    return novo;
}

async function atualizar(id, dados) {
    const lista = await listar();
    const index = lista.findIndex((i) => i.id === id);
    if (index < 0) throw new Error("Banner não encontrado");

    lista[index] = { ...lista[index], ...dados };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    return lista[index];
}

async function excluir(id) {
    const lista = await listar();
    const novaLista = lista.filter((i) => i.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
}

export default { listar, buscarPorId, salvar, atualizar, excluir };
