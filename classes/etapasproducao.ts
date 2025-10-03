import { StatusEtapa } from "../enums/StatusEtapa";
import { Funcionario } from "./funcionario";     

export class EtapaProducao {
    public nome: string;
    public prazoConclusao: Date;
    public status: StatusEtapa = StatusEtapa.Pendente;
    public funcionarios: Funcionario[] = [];

    constructor(nome: string, prazoConclusao: Date, status: StatusEtapa = StatusEtapa.Pendente) {
        this.nome = nome;
        this.prazoConclusao = prazoConclusao;
        this.status = status;
    }

    public iniciar(): void {
        if (this.status === StatusEtapa.Pendente) {
            this.status = StatusEtapa.EmAndamento;
            console.log(`A etapa "${this.nome}" foi iniciada.`);
        } else {
            console.log(`A etapa "${this.nome}" não pode ser iniciada.`);
        }
    }

    public finalizar(): void {
        if (this.status === StatusEtapa.EmAndamento) {
            this.status = StatusEtapa.Concluido;
            console.log(`A etapa "${this.nome}" foi finalizada.`);
        } else {
            console.log(`A etapa "${this.nome}" não pode ser finalizada.`);
        }
    }

    public associarFuncionario(funcionarioParaAdicionar: Funcionario): void {
        if (this.funcionarios.some(f => f.id === funcionarioParaAdicionar.id)) {
            console.log(`O funcionário ${funcionarioParaAdicionar.nome} já está nesta etapa.`);
            return;
        }
        this.funcionarios.push(funcionarioParaAdicionar);
        console.log(`Funcionário ${funcionarioParaAdicionar.nome} foi associado à etapa "${this.nome}".`);
    }

    public listarFuncionarios(): Funcionario[] {
        return this.funcionarios;
    }
}