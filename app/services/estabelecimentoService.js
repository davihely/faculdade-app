// Salvar em: app/services/estabelecimentoService.js
import EstabelecimentoEntity from "../entities/EstabelecimentoEntity";

// Armazenamento em memória
const mem = [
  { id: 'e_1', nome: 'Salão da Maria', endereco: 'Rua das Flores, 123', telefone: '31 99999-1111' },
  { id: 'e_2', nome: 'Barbearia do Zé', endereco: 'Av. Principal, 456', telefone: '31 98888-2222' },
];

export default class EstabelecimentoService {
  static toEntity(d) {
    return EstabelecimentoEntity.fromDto(d);
  }

  static async listar() {
    return mem.map(this.toEntity);
  }

  static async buscarPorId(id) {
    const d = mem.find(x => String(x.id) === String(id));
    return d ? this.toEntity(d) : null;
  }

  static validar(dto) {
    const erros = [];
    if (!dto.nome) erros.push("Nome é obrigatório");
    if (!dto.endereco) erros.push("Endereço é obrigatório");
    if (erros.length) throw new Error(erros.join("\n"));
  }

  static async criar(dto) {
    this.validar(dto);
    const novo = { ...dto, id: EstabelecimentoEntity.fromDto(dto).id };
    mem.push(novo);
    return { ok: true, estabelecimento: this.toEntity(novo) };
  }

  static async atualizar(dto) {
    if (!dto.id) throw new Error("ID é obrigatório para atualizar");
    this.validar(dto);
    
    const idx = mem.findIndex(x => String(x.id) === String(dto.id));
    if (idx === -1) throw new Error("Estabelecimento não encontrado");

    mem[idx] = { ...mem[idx], ...dto };
    return { ok: true, estabelecimento: this.toEntity(mem[idx]) };
  }

  static async remover(id) {
    const idx = mem.findIndex(x => String(x.id) === String(id));
    if (idx === -1) return false;
    mem.splice(idx, 1);
    return true;
  }
}