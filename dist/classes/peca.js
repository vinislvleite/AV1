"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Peca = void 0;
const StatusPeca_1 = require("../enums/StatusPeca");
const TipoPeca_1 = require("../enums/TipoPeca");
class Peca {
    constructor(nome, tipo, fornecedor, status) {
        this.nome = nome;
        this.fornecedor = fornecedor;
        if (!Object.values(TipoPeca_1.TipoPeca).includes(tipo)) {
            throw new Error(`Tipo de peça inválido!\nValores aceitos: ${Object.values(TipoPeca_1.TipoPeca).join(", ")}.`);
        }
        this.tipo = tipo;
        if (!Object.values(StatusPeca_1.StatusPeca).includes(status)) {
            throw new Error(`Status de peça inválido!\nValores aceitos: ${Object.values(StatusPeca_1.StatusPeca).join(", ")}.`);
        }
        this.status = status;
    }
    atualizarStatus(novoStatus) {
        if (!Object.values(StatusPeca_1.StatusPeca).includes(novoStatus)) {
            throw new Error(`Novo status inválido`);
        }
        console.log(`Peça: "${this.nome}" status atualizado de "${this.status}" para "${novoStatus}".`);
        this.status = novoStatus;
    }
    salvar() {
        console.log(`Peça "${this.nome}" salva com sucesso.`);
    }
    carregar() {
        console.log(`Dados da peça "${this.nome}" carregados.`);
    }
}
exports.Peca = Peca;
