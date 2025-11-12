// app/entities/UsuarioEntity.js
function normalizeId(raw) {
    return raw != null ? String(raw) : null;
}
function newId() {
    return `u${Date.now()}`;
}

/** @typedef {{id?:string,nome:string,genero:string,dataNascimento:string,cpf:string,ddi:string,celular:string,email:string,senha:string}} UsuarioDTO */

export default class UsuarioEntity {
    /** @param {UsuarioDTO} param0 */
    constructor({
        id = null,
        nome = "",
        genero = "",
        dataNascimento = "",
        cpf = "",
        ddi = "55",
        celular = "",
        email = "",
        senha = "",
    } = {}) {
        this.id = normalizeId(id) ?? newId();
        this.nome = nome;
        this.genero = genero;
        this.dataNascimento = dataNascimento; // manter string (YYYY-MM-DD ou dd/mm/yyyy conforme tela)
        this.cpf = cpf;
        this.ddi = ddi;
        this.celular = celular;
        this.email = String(email || "").toLowerCase().trim();
        this.senha = senha;
    }

    /** @param {UsuarioDTO|null|undefined} d */
    static fromDto(d) {
        return d ? new UsuarioEntity(d) : null;
    }

    get key() {
        return String(this.id);
    }
}
