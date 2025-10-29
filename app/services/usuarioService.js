// Salvar em: app/services/usuarioService.js
import UsuarioEntity from "../entities/UsuarioEntity";

// Armazenamento em memória com um usuário admin para teste
const mem = [
  {id: 'u_1', nome: 'Admin', email: 'admin@admin.com', senha: '123'}
];

export default class UsuarioService {
  /** * @param {object} d - DTO 
   * @returns {UsuarioEntity}
   */
  static toEntity(d) {
    return UsuarioEntity.fromDto(d);
  }

  /** * @returns {Promise<Array<UsuarioEntity>>} 
   */
  static async listar() {
    // Retorna uma promessa simulando uma chamada de API
    return Promise.resolve(mem.map(this.toEntity));
  }

  /** * @param {string} id
   * @returns {Promise<UsuarioEntity | null>} 
   */
  static async buscarPorId(id) {
    const d = mem.find(x => String(x.id) === String(id));
    return Promise.resolve(d ? this.toEntity(d) : null);
  }

  /** * NOVO MÉTODO PARA LOGIN
   * @param {string} email
   * @param {string} senha
   * @returns {Promise<UsuarioEntity | null>} 
   */
  static async buscarPorEmailESenha(email, senha) {
    const d = mem.find(x => x.email === email && x.senha === senha);
    return Promise.resolve(d ? this.toEntity(d) : null);
  }

  /** * @param {object} dto - DTO de usuário
   */
  static validar(dto) {
    const erros = [];
    if (!dto.nome) erros.push("Nome é obrigatório");
    if (!dto.email) erros.push("Email é obrigatório");
    // Simples validação de e-mail
    if (dto.email && !dto.email.includes('@')) erros.push("Email inválido");
    if (!dto.senha) erros.push("Senha é obrigatória");

    // Validação de duplicidade (só no criar, quando não há ID)
    if (!dto.id && mem.some(u => u.email === dto.email)) {
      erros.push("Este email já está em uso");
    }

    if (erros.length) throw new Error(erros.join("\n"));
  }

  /** * @param {object} dto - DTO de usuário
   * @returns {Promise<{ok: boolean, usuario: UsuarioEntity}>} 
   */
  static async criar(dto) {
    try {
      this.validar(dto);
      
      // Cria uma entidade para gerar um ID padronizado
      const entidade = UsuarioEntity.fromDto(dto);
      const novo = { ...dto, id: entidade.id }; 
      
      mem.push(novo);
      return Promise.resolve({ ok: true, usuario: this.toEntity(novo) });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /** * @param {object} dto - DTO de usuário (deve conter ID)
   * @returns {Promise<{ok: boolean, usuario: UsuarioEntity}>} 
   */
  static async atualizar(dto) {
    try {
      if (!dto.id) throw new Error("ID é obrigatório para atualizar");
      this.validar(dto); // Valida os campos
      
      const idx = mem.findIndex(x => String(x.id) === String(dto.id));
      if (idx === -1) throw new Error("Usuário não encontrado");

      // Atualiza o objeto na memória
      mem[idx] = { ...mem[idx], ...dto }; 
      
      return Promise.resolve({ ok: true, usuario: this.toEntity(mem[idx]) });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /** * @param {string} id
   * @returns {Promise<boolean>} 
   */
  static async remover(id) {
    const idx = mem.findIndex(x => String(x.id) === String(id));
    if (idx === -1) {
      return Promise.resolve(false);
    }
    mem.splice(idx, 1);
    return Promise.resolve(true);
  }
}