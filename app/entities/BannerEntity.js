export default class BannerEntity {
    constructor({ id, titulo, imagem, link, ordem, ativo }) {
        this.id = id || Date.now().toString();
        this.titulo = titulo || "";
        this.imagem = imagem || null;
        this.link = link || "";
        this.ordem = ordem || 0;
        this.ativo = ativo ?? true;
    }
}
