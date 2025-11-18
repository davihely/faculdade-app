// app/entities/CategoriaEntity.js

export default class CategoriaEntity {
    constructor({ id, nome, imagem }) {
        this.id = id || Date.now().toString(); // gera id único simples
        this.nome = nome;
        this.imagem = imagem || null; // URI da imagem local salva pelo expo-image-picker
    }

    static fromDto(dto) {
        return new CategoriaEntity({
            id: dto.id,
            nome: dto.nome,
            imagem: dto.imagem || null
        });
    }
}
