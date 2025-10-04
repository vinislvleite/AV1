"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtapaProducao = void 0;
const StatusEtapa_1 = require("../enums/StatusEtapa");
class EtapaProducao {
    constructor(nome, prazoConclusao, status = StatusEtapa_1.StatusEtapa.PENDENTE) {
        this.status = StatusEtapa_1.StatusEtapa.PENDENTE;
        this.funcionarios = [];
        this.nome = nome;
        this.prazoConclusao = prazoConclusao;
        this.status = status;
    }
    iniciar() {
        if (this.status === StatusEtapa_1.StatusEtapa.PENDENTE) {
            this.status = StatusEtapa_1.StatusEtapa.ANDAMENTO;
            console.log(`A etapa "${this.nome}" foi iniciada.`);
        }
        else {
            console.log(`A etapa "${this.nome}" não pode ser iniciada.`);
        }
    }
    finalizar() {
        if (this.status === StatusEtapa_1.StatusEtapa.ANDAMENTO) {
            this.status = StatusEtapa_1.StatusEtapa.CONCLUIDO;
            console.log(`A etapa "${this.nome}" foi finalizada.`);
        }
        else {
            console.log(`A etapa "${this.nome}" não pode ser finalizada.`);
        }
    }
    associarFuncionario(f) {
        if (this.funcionarios.some(f => f.id === f.id)) {
            console.log(`O funcionário ${f.nome} já está nesta etapa.`);
            return;
        }
        this.funcionarios.push(f);
        console.log(`Funcionário ${f.nome} foi associado à etapa "${this.nome}".`);
    }
    listarFuncionarios() {
        return this.funcionarios;
    }
}
exports.EtapaProducao = EtapaProducao;
