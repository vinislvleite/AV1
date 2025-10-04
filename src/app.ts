import readlineSync from "readline-sync";
import { Aeronave } from './classes/aeronave';
import { AeronaveService } from "./services/aeronaveService";
import { Relatorio } from './classes/relatorio';
import { Peca } from './classes/peca';
import { EtapaProducao } from "./classes/etapasproducao";
import { Teste } from './classes/teste';
import { Funcionario } from './classes/funcionario';
import { TipoAeronave } from './enums/TipoAeronave';
import { TipoPeca } from './enums/TipoPeca';
import { StatusPeca } from './enums/StatusPeca';
import { StatusEtapa } from './enums/StatusEtapa';
import { TipoTeste } from './enums/TipoTeste';
import { ResultadoTeste } from './enums/ResultadoTeste';
import { Permissao } from './enums/NivelPermissao';

const aeronaveService = new AeronaveService();
const pecas: Peca[] = [];
const etapas: EtapaProducao[] = [];
const testes: Teste[] = [];
const funcionarios: Funcionario[] = [];
let usuarioLogado: Funcionario | null = null;

process.on('SIGINT', () => {
    console.log('\n\nSaindo do sistema...');
    process.exit(0);
});

function fazerLogin(): boolean {
    console.log("\n=== LOGIN ===");
    const usuario = readlineSync.question("Usuario: ");
    const senha = readlineSync.question("Senha: ", { hideEchoBack: true });
    
    const funcionario = funcionarios.find(f => f.autenticar(usuario, senha));
    
    if (funcionario) {
        usuarioLogado = funcionario;
        console.log(`\nBem-vindo, ${funcionario.nome}! (${funcionario.nivelPermissao})`);
        return true;
    } else {
        console.log("Usuario ou senha invalidos");
        return false;
    }
}

function temPermissao(permissaoRequerida: Permissao): boolean {
    if (!usuarioLogado) return false;
    
    const hierarquia = {
        [Permissao.OPERADOR]: 1,
        [Permissao.ENGENHEIRO]: 2,
        [Permissao.ADMINSTRADOR]: 3
    };
    
    return hierarquia[usuarioLogado.nivelPermissao] >= hierarquia[permissaoRequerida];
}

function menuFuncionarios() {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== GERENCIAR FUNCIONARIOS ===");
        console.log("1. Cadastrar Funcionario");
        console.log("2. Listar Funcionarios");
        console.log("0. Voltar");
        
        opcao = readlineSync.question("Escolha uma opcao: ");

        switch (opcao) {
            case "1": {
                if (!temPermissao(Permissao.ADMINSTRADOR)) {
                    console.log("Acesso negado!\nApenas administradores podem cadastrar funcionarios.");
                    break;
                }
                
                const id = readlineSync.question("ID: ");
                const nome = readlineSync.question("Nome: ");
                const telefone = readlineSync.question("Telefone: ");
                const endereco = readlineSync.question("Endereco: ");
                const usuario = readlineSync.question("Usuario: ");
                const senha = readlineSync.question("Senha: ", { hideEchoBack: true });
                
                const opcoesPermissao = [...Object.values(Permissao)];
                const permissaoIndex = readlineSync.keyInSelect(opcoesPermissao, "Nivel de Permissao: ", { 
                    cancel: false 
                });
                
                const funcionario = new Funcionario(
                    id, nome, telefone, endereco, usuario, senha, opcoesPermissao[permissaoIndex]
                );
                
                funcionarios.push(funcionario);
                funcionario.salvar();
                console.log("Funcionario cadastrado com sucesso");
                break;
            }
            
            case "2": {
                if (funcionarios.length === 0) {
                    console.log("Nenhum funcionario cadastrado");
                } else {
                    funcionarios.forEach(f => {
                        console.log(`${f.id} - ${f.nome} - ${f.nivelPermissao} - ${f.usuario}`);
                    });
                }
                break;
            }
            
            case "0":
                break;
                
            default:
                console.log("Opcao invalida");
        }
    }
}

function menuTestes() {
    let opcao = "";
    while (opcao !== "0") {
        console.log("\n=== GERENCIAR TESTES ===");
        console.log("1. Cadastrar Teste");
        console.log("2. Listar Testes");
        console.log("0. Voltar");
        
        opcao = readlineSync.question("Escolha uma opcao: ");

        switch (opcao) {
            case "1": {
                if (!temPermissao(Permissao.ENGENHEIRO)) {
                    console.log("Acesso negado!\nApenas engenheiros podem cadastrar testes.");
                    break;
                }
                
                const opcoesTipo = [...Object.values(TipoTeste)];
                const tipoIndex = readlineSync.keyInSelect(opcoesTipo, "Tipo de Teste: ", { 
                    cancel: false 
                });
                
                const opcoesResultado = [...Object.values(ResultadoTeste)];
                const resultadoIndex = readlineSync.keyInSelect(opcoesResultado, "Resultado: ", { 
                    cancel: false 
                });
                
                const teste = new Teste(opcoesTipo[tipoIndex], opcoesResultado[resultadoIndex]);
                testes.push(teste);
                teste.salvar();
                console.log("Teste cadastrado");
                break;
            }
            
            case "2": {
                if (testes.length === 0) {
                    console.log("Nenhum teste cadastrado");
                } else {
                    testes.forEach((t, index) => {
                        console.log(`${index + 1}. ${t.tipo} - Resultado: ${t.resultado}`);
                    });
                }
                break;
            }
            
            case "0":
                break;
                
            default:
                console.log("Opcao invalida");
        }
    }
}

function gerarRelatorio() {
    if (!temPermissao(Permissao.ENGENHEIRO)) {
        console.log("Acesso negado!\nApenas engenheiros podem gerar relatorios.");
        return;
    }
    
    const aeronaves = aeronaveService.listar();
    if (aeronaves.length === 0) {
        console.log("Nenhuma aeronave cadastrada para gerar relatorio");
        return;
    }
    
    console.log("\n=== GERAR RELATORIO ===");
    aeronaves.forEach((a, index) => {
        console.log(`${index + 1}. ${a.codigo} - ${a.modelo}`);
    });
    
    const escolha = Number(readlineSync.question("Escolha a aeronave: ")) - 1;
    
    if (escolha >= 0 && escolha < aeronaves.length) {
        const aeronaveSelecionada = aeronaves[escolha];
        const relatorio = new Relatorio();
        
        console.log("\nGerando relatorio");
        relatorio.gerarRelatorio(aeronaveSelecionada, pecas, etapas, testes);
        
        const salvar = readlineSync.keyInYN("Deseja salvar o relatorio em arquivo?");
        if (salvar) {
            relatorio.salvarEmArquivo(aeronaveSelecionada, pecas, etapas, testes);
        }
    } else {
        console.log("Opcao invalida");
    }
}

function menu() {
    while (!usuarioLogado) {
        if (!fazerLogin()) {
            const continuar = readlineSync.keyInYN("Deseja tentar novamente?");
            if (!continuar) {
                console.log("Saindo...");
                return;
            }
        }
    }

    const usuarioAtual = usuarioLogado;
    
    let opcao = "";
    while (opcao !== "0") {
        console.log(`\n=== BEM VINDO A AEROCODE (${usuarioAtual.nome} - ${usuarioAtual.nivelPermissao}) ===`);
        console.log("1. Gerenciar Funcionarios");
        console.log("2. Cadastrar Aeronave");
        console.log("3. Listar Aeronaves");
        console.log("4. Cadastrar Peca");
        console.log("5. Atualizar Status de Peca");
        console.log("6. Listar Pecas");
        console.log("7. Cadastrar Etapa");
        console.log("8. Iniciar Etapa");
        console.log("9. Finalizar Etapa");
        console.log("10. Listar Etapas");
        console.log("11. Gerenciar Testes");
        console.log("12. Gerar Relatorio");
        console.log("0. Sair da aerocode");
        
        try {
            opcao = readlineSync.question("Escolha uma opcao: ");
        } catch (error) {
            console.log("\nSaindo do aerocode");
            break;
        }

        switch (opcao) {
            case "1":
                menuFuncionarios();
                break;
                
            case "2": {
                if (!temPermissao(Permissao.ENGENHEIRO)) {
                    console.log("Acesso negado!\nApenas engenheiros podem cadastrar aeronaves.");
                    break;
                }
                
                const codigo = readlineSync.question("Codigo: ");
                const modelo = readlineSync.question("Modelo: ");
                
                const opcoesTipo = [...Object.values(TipoAeronave)];
                const tipoIndex = readlineSync.keyInSelect(opcoesTipo, "Tipo: ", { 
                    cancel: false 
                });
                
                if (tipoIndex === -1) {
                    console.log("Operacao cancelada!");
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
            
            case "3": {
                const aeronaves = aeronaveService.listar();
                if (aeronaves.length === 0) {
                    console.log("Nenhuma aeronave cadastrada");
                } else {
                    aeronaves.forEach(a => console.log(a.detalhes()));
                }
                break;
            }
            
            case "4": {
                if (!temPermissao(Permissao.OPERADOR)) {
                    console.log("Acesso negado!\nApenas operadores podem cadastrar pecas.");
                    break;
                }
                
                const nome = readlineSync.question("Nome da peca: ");
                
                const opcoesTipo = [...Object.values(TipoPeca)];
                const tipoIndex = readlineSync.keyInSelect(opcoesTipo, "Tipo: ", { 
                    cancel: false 
                });
                
                if (tipoIndex === -1) {
                    console.log("Operacao cancelada");
                    break;
                }
                
                const fornecedor = readlineSync.question("Fornecedor: ");
                
                const opcoesStatus = [...Object.values(StatusPeca)];
                const statusIndex = readlineSync.keyInSelect(opcoesStatus, "Status inicial: ", { 
                    cancel: false 
                });
                
                if (statusIndex === -1) {
                    console.log("Operacao cancelada");
                    break;
                }

                const peca = new Peca(
                    nome,
                    opcoesTipo[tipoIndex],
                    fornecedor,
                    opcoesStatus[statusIndex]
                );

                pecas.push(peca);
                peca.salvar();
                console.log("Peca cadastrada");
                break;
            }
            
            case "5": {
                if (!temPermissao(Permissao.OPERADOR)) {
                    console.log("Acesso negado!\nApenas operadores podem atualizar status de pecas.");
                    break;
                }
                
                const nome = readlineSync.question("Nome da peca: ");
                const peca = pecas.find(p => p.nome === nome);
                
                if (peca) {
                    const opcoesStatus = [...Object.values(StatusPeca)];
                    const statusIndex = readlineSync.keyInSelect(opcoesStatus, "Novo status: ", { 
                        cancel: false 
                    });
                    
                    if (statusIndex === -1) {
                        console.log("Operacao cancelada");
                        break;
                    }
                    
                    const status = opcoesStatus[statusIndex];
                    peca.atualizarStatus(status);
                    peca.salvar();
                } else {
                    console.log("Peca nao encontrada");
                }
                break;
            }
            
            case "6": {
                if (pecas.length === 0) {
                    console.log("Nenhuma peca cadastrada");
                } else {
                    pecas.forEach(p => console.log(`${p.nome} - ${p.tipo} (${p.status})`));
                }
                break;
            }
            
            case "7": {
                if (!temPermissao(Permissao.ENGENHEIRO)) {
                    console.log("Acesso negado!\nApenas engenheiros podem cadastrar etapas.");
                    break;
                }
                
                const nome = readlineSync.question("Nome da etapa: ");
                const prazo = readlineSync.question("Prazo (dd/mm/aaaa): ");
                const [dia, mes, ano] = prazo.split("/").map(Number);
                const prazoDate = new Date(ano, mes - 1, dia);
                
                const etapa = new EtapaProducao(nome, prazoDate);
                etapas.push(etapa);
                console.log("Etapa cadastrada");
                break;
            }
            
            case "8": {
                if (!temPermissao(Permissao.OPERADOR)) {
                    console.log("Acesso negado! Apenas operadores podem iniciar etapas.");
                    break;
                }
                
                const nome = readlineSync.question("Nome da etapa: ");
                const etapa = etapas.find(e => e.nome === nome);
                
                if (etapa) {
                    etapa.iniciar();
                } else {
                    console.log("Etapa nao encontrada");
                }
                break;
            }
            
            case "9": {
                if (!temPermissao(Permissao.OPERADOR)) {
                    console.log("Acesso negado! Apenas operadores podem finalizar etapas.");
                    break;
                }
                
                const nome = readlineSync.question("Nome da etapa: ");
                const etapa = etapas.find(e => e.nome === nome);
                
                if (etapa) {
                    etapa.finalizar();
                } else {
                    console.log("Etapa nao encontrada");
                }
                break;
            }
            
            case "10": {
                if (etapas.length === 0) {
                    console.log("Nenhuma etapa cadastrada");
                } else {
                    etapas.forEach(e => console.log(`${e.nome} - Prazo: ${e.prazoConclusao.toLocaleDateString()} - (${e.status})`));
                }
                break;
            }
            
            case "11":
                menuTestes();
                break;
                
            case "12":
                gerarRelatorio();
                break;
            
            case "0":
                console.log("Saindo...");
                usuarioLogado = null;
                break;
                
            default:
                console.log("Opcao invalida");
        }
    }
}

if (funcionarios.length === 0) {
    const admin = new Funcionario(
        "1",
        "Administrador",
        "000000000",
        "Endereco Admin",
        "admin",
        "1234",
        Permissao.ADMINSTRADOR
    );
    funcionarios.push(admin);
    admin.salvar();
    console.log("Usuario admin criado: admin / 1234");
}

menu();