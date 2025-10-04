import readlineSync from "readline-sync";
import { Aeronave } from './classes/aeronave';
import { AeronaveService } from "./services/aeronaveService";
import { Relatorio } from './classes/relatorio';
import { Peca } from './classes/peca';
import { EtapaProducao } from "./classes/etapasproducao";
import { Teste } from './classes/teste';
import { TipoAeronave } from './enums/TipoAeronave';
import { TipoPeca } from './enums/TipoPeca';
import { StatusPeca } from './enums/StatusPeca';
import { StatusEtapa } from './enums/StatusEtapa';
import { TipoTeste } from './enums/TipoTeste';
import { ResultadoTeste } from './enums/ResultadoTeste';

const aeronaveService = new AeronaveService();
const pecas: Peca[] = [];
const etapas: EtapaProducao[] = [];

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
        
        opcao = readlineSync.question("Escolha uma opcao: ");

        switch (opcao) {
            case "1": {
                const codigo = readlineSync.question("Codigo: ");
                const modelo = readlineSync.question("Modelo: ");
                
                const opcoesTipo = [...Object.values(TipoAeronave)];
                const tipoIndex = readlineSync.keyInSelect(opcoesTipo, "Tipo: ", { 
                    cancel: false 
                });
                
                if (tipoIndex === -1) {
                    console.log("Operação cancelada!");
                    break;
                }
                
                const capacidade = Number(readlineSync.question("Capacidade: "));
                const alcance = Number(readlineSync.question("Alcance: "));
                const cliente = readlineSync.question("Cliente: ");
                const dataEntrega = readlineSync.question("Data de entrega (dd/mm/aaaa): ");

                const aeronave = new Aeronave(
                    codigo,
                    modelo,
                    opcoesTipo[tipoIndex],
                    capacidade,
                    alcance,
                    cliente,
                    dataEntrega
                );

                aeronaveService.cadastrar(aeronave);
                break;
            }
            
            case "2": {
                const aeronaves = aeronaveService.listar();
                if (aeronaves.length === 0) {
                    console.log("Nenhuma aeronave cadastrada!");
                } else {
                    aeronaves.forEach(a => a.detalhes());
                }
                break;
            }
            
            case "3": {
                const nome = readlineSync.question("Nome da peça: ");
                
                const opcoesTipo = [...Object.values(TipoPeca)];
                const tipoIndex = readlineSync.keyInSelect(opcoesTipo, "Tipo: ", { 
                    cancel: false 
                });
                
                if (tipoIndex === -1) {
                    console.log("Operação cancelada!");
                    break;
                }
                
                const fornecedor = readlineSync.question("Fornecedor: ");
                
                const opcoesStatus = [...Object.values(StatusPeca)];
                const statusIndex = readlineSync.keyInSelect(opcoesStatus, "Status inicial: ", { 
                    cancel: false 
                });
                
                if (statusIndex === -1) {
                    console.log("Operação cancelada!");
                    break;
                }

                const peca = new Peca(
                    nome,
                    opcoesTipo[tipoIndex],
                    fornecedor,
                    opcoesStatus[statusIndex]
                );

                pecas.push(peca);
                console.log("Peça cadastrada!");
                break;
            }
            
            case "4": {
                const nome = readlineSync.question("Nome da peça: ");
                const peca = pecas.find(p => p.nome === nome);
                
                if (peca) {
                    const opcoesStatus = [...Object.values(StatusPeca)];
                    const statusIndex = readlineSync.keyInSelect(opcoesStatus, "Novo status: ", { 
                        cancel: false 
                    });
                    
                    if (statusIndex === -1) {
                        console.log("Operação cancelada!");
                        break;
                    }
                    
                    const status = opcoesStatus[statusIndex];
                    peca.atualizarStatus(status);
                } else {
                    console.log("Peça não encontrada!");
                }
                break;
            }
            
            case "5": {
                if (pecas.length === 0) {
                    console.log("Nenhuma peça cadastrada!");
                } else {
                    pecas.forEach(p => console.log(`${p.nome} - ${p.tipo} (${p.status})`));
                }
                break;
            }
            
            case "6": {
                const nome = readlineSync.question("Nome da etapa: ");
                const prazo = readlineSync.question("Prazo (dd/mm/aaaa): ");
                const [dia, mes, ano] = prazo.split("/").map(Number);
                const prazoDate = new Date(ano, mes - 1, dia);
                
                const etapa = new EtapaProducao(nome, prazoDate);
                etapas.push(etapa);
                console.log("Etapa cadastrada!");
                break;
            }
            
            case "7": {
                const nome = readlineSync.question("Nome da etapa: ");
                const etapa = etapas.find(e => e.nome === nome);
                
                if (etapa) {
                    etapa.iniciar();
                } else {
                    console.log("Etapa não encontrada!");
                }
                break;
            }
            
            case "8": {
                const nome = readlineSync.question("Nome da etapa: ");
                const etapa = etapas.find(e => e.nome === nome);
                
                if (etapa) {
                    etapa.finalizar();
                } else {
                    console.log("Etapa não encontrada!");
                }
                break;
            }
            
            case "9": {
                if (etapas.length === 0) {
                    console.log("Nenhuma etapa cadastrada!");
                } else {
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