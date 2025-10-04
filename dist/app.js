"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const aeronave_1 = require("./classes/aeronave");
const aeronaveService_1 = require("./services/aeronaveService");
const peca_1 = require("./classes/peca");
const etapasproducao_1 = require("./classes/etapasproducao");
const TipoAeronave_1 = require("./enums/TipoAeronave");
const TipoPeca_1 = require("./enums/TipoPeca");
const StatusPeca_1 = require("./enums/StatusPeca");
const aeronaveService = new aeronaveService_1.AeronaveService();
const pecas = [];
const etapas = [];
function menu() {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== MENU PRINCIPAL ===");
        console.log("1. Cadastrar Aeronave");
        console.log("2. Listar Aeronaves");
        console.log("3. Cadastrar Peça");
        console.log("4. Atualizar Status de Peça");
        console.log("5. Listar Peças");
        console.log("6. Cadastrar Etapa");
        console.log("7. Iniciar Etapa");
        console.log("8. Finalizar Etapa");
        console.log("9. Listar Etapas");
        console.log("0. Sair");
        opcao = readline_sync_1.default.question("Escolha uma opcao: ");
        switch (opcao) {
            case "1": {
                const codigo = readline_sync_1.default.question("Codigo: ");
                const modelo = readline_sync_1.default.question("Modelo: ");
                const opcoesTipo = [...Object.values(TipoAeronave_1.TipoAeronave)];
                const tipoIndex = readline_sync_1.default.keyInSelect(opcoesTipo, "Tipo: ", {
                    cancel: false
                });
                if (tipoIndex === -1) {
                    console.log("Operação cancelada!");
                    break;
                }
                const capacidade = Number(readline_sync_1.default.question("Capacidade: "));
                const alcance = Number(readline_sync_1.default.question("Alcance: "));
                const cliente = readline_sync_1.default.question("Cliente: ");
                const dataEntrega = readline_sync_1.default.question("Data de entrega (dd/mm/aaaa): ");
                const aeronave = new aeronave_1.Aeronave(codigo, modelo, opcoesTipo[tipoIndex], capacidade, alcance, cliente, dataEntrega);
                aeronaveService.cadastrar(aeronave);
                break;
            }
            case "2": {
                const aeronaves = aeronaveService.listar();
                if (aeronaves.length === 0) {
                    console.log("Nenhuma aeronave cadastrada!");
                }
                else {
                    aeronaves.forEach(a => a.detalhes());
                }
                break;
            }
            case "3": {
                const nome = readline_sync_1.default.question("Nome da peça: ");
                const opcoesTipo = [...Object.values(TipoPeca_1.TipoPeca)];
                const tipoIndex = readline_sync_1.default.keyInSelect(opcoesTipo, "Tipo: ", {
                    cancel: false
                });
                if (tipoIndex === -1) {
                    console.log("Operação cancelada!");
                    break;
                }
                const fornecedor = readline_sync_1.default.question("Fornecedor: ");
                const opcoesStatus = [...Object.values(StatusPeca_1.StatusPeca)];
                const statusIndex = readline_sync_1.default.keyInSelect(opcoesStatus, "Status inicial: ", {
                    cancel: false
                });
                if (statusIndex === -1) {
                    console.log("Operação cancelada!");
                    break;
                }
                const peca = new peca_1.Peca(nome, opcoesTipo[tipoIndex], fornecedor, opcoesStatus[statusIndex]);
                pecas.push(peca);
                console.log("Peça cadastrada!");
                break;
            }
            case "4": {
                const nome = readline_sync_1.default.question("Nome da peça: ");
                const peca = pecas.find(p => p.nome === nome);
                if (peca) {
                    const opcoesStatus = [...Object.values(StatusPeca_1.StatusPeca)];
                    const statusIndex = readline_sync_1.default.keyInSelect(opcoesStatus, "Novo status: ", {
                        cancel: false
                    });
                    if (statusIndex === -1) {
                        console.log("Operação cancelada!");
                        break;
                    }
                    const status = opcoesStatus[statusIndex];
                    peca.atualizarStatus(status);
                }
                else {
                    console.log("Peça não encontrada!");
                }
                break;
            }
            case "5": {
                if (pecas.length === 0) {
                    console.log("Nenhuma peça cadastrada!");
                }
                else {
                    pecas.forEach(p => console.log(`${p.nome} - ${p.tipo} (${p.status})`));
                }
                break;
            }
            case "6": {
                const nome = readline_sync_1.default.question("Nome da etapa: ");
                const prazo = readline_sync_1.default.question("Prazo (dd/mm/aaaa): ");
                const [dia, mes, ano] = prazo.split("/").map(Number);
                const prazoDate = new Date(ano, mes - 1, dia);
                const etapa = new etapasproducao_1.EtapaProducao(nome, prazoDate);
                etapas.push(etapa);
                console.log("Etapa cadastrada!");
                break;
            }
            case "7": {
                const nome = readline_sync_1.default.question("Nome da etapa: ");
                const etapa = etapas.find(e => e.nome === nome);
                if (etapa) {
                    etapa.iniciar();
                }
                else {
                    console.log("Etapa não encontrada!");
                }
                break;
            }
            case "8": {
                const nome = readline_sync_1.default.question("Nome da etapa: ");
                const etapa = etapas.find(e => e.nome === nome);
                if (etapa) {
                    etapa.finalizar();
                }
                else {
                    console.log("Etapa não encontrada!");
                }
                break;
            }
            case "9": {
                if (etapas.length === 0) {
                    console.log("Nenhuma etapa cadastrada!");
                }
                else {
                    etapas.forEach(e => console.log(`${e.nome} - Prazo: ${e.prazoConclusao.toLocaleDateString()} - (${e.status})`));
                }
                break;
            }
            case "0":
                console.log("Saindo...");
                break;
            default:
                console.log("Opção inválida!");
        }
    }
}
menu();
