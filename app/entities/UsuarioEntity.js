// app/entities/UsuarioEntity.js
function normalizeId(raw) {
    return raw != null ? String(raw) : null;
}
function newId() {
    return `u${Date.now()}`;
}

/**
 * @typedef {{
 *  id?: string,
 *  nome: string,
 *  genero?: string,
 *  dataNascimento?: string,
 *  cpf?: string,
 *  ddi?: string,
 *  celular?: string,
 *  email: string,
 *  senha: string,
 *  tipoUsuario?: string,
 *  imagens?: string[],
 *  nomeEstabelecimento?: string,
 *  endereco?: string,
 *  sobre?: string,
 *  redesSociais?: string,
 *  horarios?: any,
 *  funcionarios?: any,
 *  categoriaId?: string|null
 * }} UsuarioDTO
 */

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
        tipoUsuario = "Usuário Comum",
        imagens = [],
        nomeEstabelecimento = "",
        endereco = "",
        sobre = "",
        redesSociais = "",
        horarios = null,
        funcionarios = null,
        categoriaId = null,
    } = {}) {
        this.id = normalizeId(id) ?? newId();
        this.nome = nome;
        this.genero = genero;
        this.dataNascimento = dataNascimento;
        this.cpf = cpf;
        this.ddi = ddi;
        this.celular = celular;
        this.email = String(email || "").toLowerCase().trim();
        this.senha = senha;

        // Campos extras para Estabelecimento
        this.tipoUsuario = tipoUsuario;          // "Usuário Comum" ou "Estabelecimento"
        this.imagens = imagens || [];
        this.nomeEstabelecimento = nomeEstabelecimento;
        this.endereco = endereco;
        this.sobre = sobre;
        this.redesSociais = redesSociais;
        this.horarios = horarios;
        this.funcionarios = funcionarios;
        this.categoriaId = categoriaId;
    }

    /** @param {UsuarioDTO|null|undefined} d */
    static fromDto(d) {
        return d ? new UsuarioEntity(d) : null;
    }

    get key() {
        return String(this.id);
    }
}
