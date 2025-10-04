import readlineSync from "readline-sync";
import { Aeronave } from "./classes/aeronave";
import { AeronaveService } from "./services/aeronaveService";
import { Relatorio } from "./classes/relatorio";
import { Peca } from "./classes/peca";
import { PecaService } from "./services/pecaService";
import { EtapaProducao } from "./classes/etapasproducao";
import { EtapaService } from "./services/etapaService";
import { Teste } from "./classes/teste";
import { TesteService } from "./services/testeService";
import { Funcionario } from "./classes/funcionario";
import { FuncionarioService } from "./services/funcionarioService";
import { TipoAeronave } from "./enums/TipoAeronave";
import { TipoPeca } from "./enums/TipoPeca";
import { StatusPeca } from "./enums/StatusPeca";
import { TipoTeste } from "./enums/TipoTeste";
import { ResultadoTeste } from "./enums/ResultadoTeste";
import { Permissao } from "./enums/NivelPermissao";

const aeronaveService = new AeronaveService();
const pecaService = new PecaService();
const etapaService = new EtapaService();
const testeService = new TesteService();
const funcionarioService = new FuncionarioService();
let usuarioLogado: Funcionario | null = null;

process.on("SIGINT", () => {
  console.log("\n\nSaindo do aerocode");
  process.exit(0);
});

function fazerLogin(): boolean {
  console.log("\n=== Login ===");
  const usuario = readlineSync.question("Usuario: ");
  const senha = readlineSync.question("Senha: ", { hideEchoBack: true });

  const funcionario = funcionarioService.autenticar(usuario, senha);
  if (funcionario) {
    usuarioLogado = funcionario;
    console.log(`\nBem-vindo, ${funcionario.nome}! (${funcionario.nivelPermissao})`);
    return true;
  } else {
    console.log("Usuario ou senha invalidos");
    return false;
  }
}

const hierarquia: Record<Permissao, number> = {
  [Permissao.OPERADOR]: 1,
  [Permissao.ENGENHEIRO]: 2,
  [Permissao.ADMINISTRADOR]: 3,
};

function temPermissao(permissaoRequerida: Permissao): boolean {
  if (!usuarioLogado) return false;

  const hierarquia: Record<string, number> = {
    operador: 1,
    engenheiro: 2,
    administrador: 3,
  };

  const nivel = String(usuarioLogado.nivelPermissao).toLowerCase();
  const req = String(permissaoRequerida).toLowerCase();

  const nivelVal = hierarquia[nivel] ?? 0;
  const reqVal = hierarquia[req] ?? 0;

  return nivelVal >= reqVal;
}

function menuFuncionarios() {
  let opcao = "";
  while (opcao !== "0") {
    console.log("\n=== Gerenciar funcionarios ===");
    console.log("1. Cadastrar Funcionario");
    console.log("2. Listar Funcionarios");
    console.log("0. Voltar");
    opcao = readlineSync.question("Escolha: ");

    switch (opcao) {
      case "1":
        if (!temPermissao(Permissao.ADMINISTRADOR)) {
          console.log("Acesso negado");
          break;
        }
        const id = readlineSync.question("ID: ");
        const nome = readlineSync.question("Nome: ");
        const telefone = readlineSync.question("Telefone: ");
        const endereco = readlineSync.question("Endereco: ");
        const usuario = readlineSync.question("Usuario: ");
        const senha = readlineSync.question("Senha: ", { hideEchoBack: true });
        const opcoesPerm = [...Object.values(Permissao)];
        const idxPerm = readlineSync.keyInSelect(opcoesPerm, "Permissao:", { cancel: false });
        funcionarioService.cadastrar(new Funcionario(id, nome, telefone, endereco, usuario, senha, opcoesPerm[idxPerm]));
        break;

      case "2":
        const funcs = funcionarioService.listar();
        funcs.length === 0
          ? console.log("Nenhum funcionário cadastrado")
          : funcs.forEach(f => console.log(`${f.id} - ${f.nome} (${f.nivelPermissao})`));
        break;
    }
  }
}

function menuAeronaves() {
  let opcao = "";
  while (opcao !== "0") {
    console.log("\n=== Gerenciar aeronaves ===");
    console.log("1. Cadastrar Aeronave");
    console.log("2. Listar Aeronaves");
    console.log("3. Gerenciar Etapas de Producao");
    console.log("0. Voltar");
    opcao = readlineSync.question("Escolha: ");

    switch (opcao) {
      case "1": {
        if (!temPermissao(Permissao.ENGENHEIRO)) return console.log("Acesso negado");
        const codigo = readlineSync.question("Codigo: ");
        const modelo = readlineSync.question("Modelo: ");
        const tipoIdx = readlineSync.keyInSelect(Object.values(TipoAeronave), "Tipo:", { cancel: false });
        const capacidade = Number(readlineSync.question("Capacidade: "));
        const alcance = Number(readlineSync.question("Alcance: "));
        const cliente = readlineSync.question("Cliente: ");
        const dataEntrega = readlineSync.question("Data de entrega (dd/mm/aaaa): ");
        const aeronave = new Aeronave(codigo, modelo, Object.values(TipoAeronave)[tipoIdx], capacidade, alcance, cliente, dataEntrega);
        aeronaveService.cadastrar(aeronave);
        break;
      }

      case "2": {
        const aeronaves = aeronaveService.listar();
        aeronaves.length === 0
          ? console.log("Nenhuma aeronave cadastrada")
          : aeronaves.forEach(a => console.log(a.detalhes()));
        break;
      }

      case "3":
        menuEtapas();
        break;
    }
  }
}

function menuEtapas() {
  let opcao = "";
  while (opcao !== "0") {
    console.log("\n=== Etapas de producao ===");
    console.log("1. Cadastrar Etapa");
    console.log("2. Iniciar Etapa");
    console.log("3. Finalizar Etapa");
    console.log("4. Listar Etapas de Aeronave");
    console.log("5. Associar Funcionario a uma Etapa");
    console.log("6. Listar Funcionarios de uma Etapa");
    console.log("0. Voltar");
    opcao = readlineSync.question("Escolha: ");

    const aeronaves = aeronaveService.listar();
    if (["1", "2", "3", "4", "5", "6"].includes(opcao) && aeronaves.length === 0) {
      console.log("Nenhuma aeronave cadastrada para gerenciar etapas.");
      continue;
    }

    switch (opcao) {
      case "1": {
        if (!temPermissao(Permissao.ENGENHEIRO)) { console.log("Acesso negado"); break; }
        const idx = selecionarAeronave(aeronaves);
        if (idx === -1) break;
        const nome = readlineSync.question("Nome da etapa: ");
        const prazo = readlineSync.question("Prazo (dd/mm/aaaa): ");
        const [d, m, a] = prazo.split("/").map(Number);
        const etapa = new EtapaProducao(nome, new Date(a, m - 1, d));
        const ordem = Number(readlineSync.question("Ordem da Etapa (1, 2, 3...): "));
        etapaService.cadastrarEtapa(etapa, aeronaves[idx].codigo, ordem);
        break;
      }

      case "2": {
        if (!temPermissao(Permissao.OPERADOR)) { console.log("Acesso negado"); break; }
        const idx = selecionarAeronave(aeronaves);
        if (idx === -1) break;
        const nome = readlineSync.question("Nome da etapa a iniciar: ");
        etapaService.iniciarEtapaValidacao(nome, aeronaves[idx].codigo);
        break;
      }

      case "3": {
        if (!temPermissao(Permissao.OPERADOR)) { console.log("Acesso negado"); break; }
        const idx = selecionarAeronave(aeronaves);
        if (idx === -1) break;
        const nome = readlineSync.question("Nome da etapa a finalizar: ");
        etapaService.finalizarEtapaValidacao(nome, aeronaves[idx].codigo);
        break;
      }

      case "4": {
        const idx = selecionarAeronave(aeronaves);
        if (idx === -1) break;
        const etapas = etapaService.listarEtapasAeronave(aeronaves[idx].codigo);
        if (etapas.length === 0) {
          console.log("Nenhuma etapa cadastrada para esta aeronave.");
        } else {
          console.log("\n--- Etapas da Aeronave ---")
          etapas.forEach(e => console.log(`- ${e.nome} | Prazo: ${e.prazoConclusao.toLocaleDateString()} | Status: ${e.status}`));
        }
        break;
      }

      case "5": {
        if (!temPermissao(Permissao.ENGENHEIRO)) { console.log("Acesso negado"); break; }
        
        console.log("\n--- Associar Funcionário a uma Etapa ---");
        const idxAeronave = selecionarAeronave(aeronaves);
        if (idxAeronave === -1) break;
        const aeronave = aeronaves[idxAeronave];

        const etapas = etapaService.listarEtapasAeronave(aeronave.codigo);
        if (etapas.length === 0) { console.log("Nenhuma etapa cadastrada para esta aeronave."); break; }
        const etapaSelecionada = selecionarEtapa(etapas);
        if (!etapaSelecionada) { console.log("Seleção de etapa cancelada."); break; }

        const funcionarios = funcionarioService.listar();
        if (funcionarios.length === 0) { console.log("Nenhum funcionário cadastrado no sistema."); break; }
        const funcionarioSelecionado = selecionarFuncionario(funcionarios);
        if (!funcionarioSelecionado) { console.log("Seleção de funcionário cancelada."); break; }

        etapaService.associarFuncionario(aeronave.codigo, etapaSelecionada.nome, funcionarioSelecionado);
        break;
      }

      case "6": {
        console.log("\n--- Listar Funcionários de uma Etapa ---");
        const idxAeronave = selecionarAeronave(aeronaves);
        if (idxAeronave === -1) break;
        const aeronave = aeronaves[idxAeronave];

        const etapas = etapaService.listarEtapasAeronave(aeronave.codigo);
        if (etapas.length === 0) { console.log("Nenhuma etapa cadastrada para esta aeronave."); break; }
        const etapaSelecionada = selecionarEtapa(etapas);
        if (!etapaSelecionada) { console.log("Seleção de etapa cancelada."); break; }

        const funcionariosDaEtapa = etapaSelecionada.listarFuncionarios();
        if (funcionariosDaEtapa.length === 0) {
          console.log(`Nenhum funcionário associado à etapa "${etapaSelecionada.nome}".`);
        } else {
          console.log(`\n--- Funcionários da Etapa "${etapaSelecionada.nome}" ---`);
          funcionariosDaEtapa.forEach(f => console.log(`- ID: ${f.id} | Nome: ${f.nome}`));
        }
        break;
      }
    }
  }
}

function menuPecas() {
  let opcao = "";
  while (opcao !== "0") {
    console.log("\n=== Gerenciar pecas ===");
    console.log("1. Cadastrar Peca");
    console.log("2. Atualizar Status de Peca");
    console.log("3. Listar Pecas");
    console.log("0. Voltar");
    opcao = readlineSync.question("Escolha: ");

    switch (opcao) {
      case "1":
        if (!temPermissao(Permissao.OPERADOR)) return console.log("Acesso negado");
        const nome = readlineSync.question("Nome: ");
        const tipoIdx = readlineSync.keyInSelect(Object.values(TipoPeca), "Tipo:", { cancel: false });
        const fornecedor = readlineSync.question("Fornecedor: ");
        const statusIdx = readlineSync.keyInSelect(Object.values(StatusPeca), "Status:", { cancel: false });
        const peca = new Peca(nome, Object.values(TipoPeca)[tipoIdx], fornecedor, Object.values(StatusPeca)[statusIdx]);
        pecaService.cadastrar(peca);
        break;

      case "2":
        const n = readlineSync.question("Nome da peca: ");
        const p = pecaService.buscarPorNome(n);
        if (!p) return console.log("Peca nao encontrada");
        const idx = readlineSync.keyInSelect(Object.values(StatusPeca), "Novo status:", { cancel: false });
        pecaService.atualizarStatus(n, Object.values(StatusPeca)[idx]);
        break;

      case "3":
        const pecas = pecaService.listar();
        pecas.length === 0
          ? console.log("Nenhuma peca cadastrada")
          : pecas.forEach(p => console.log(`${p.nome} - ${p.tipo} (${p.status})`));
        break;
    }
  }
}

function menuTestes() {
  let opcao = "";
  while (opcao !== "0") {
    console.log("\n=== Gerenciar teste ===");
    console.log("1. Cadastrar Teste");
    console.log("2. Listar Testes");
    console.log("0. Voltar");
    opcao = readlineSync.question("Escolha: ");

    switch (opcao) {
      case "1":
        if (!temPermissao(Permissao.ENGENHEIRO)) return console.log("Acesso negado");
        const tipoIdx = readlineSync.keyInSelect(Object.values(TipoTeste), "Tipo:", { cancel: false });
        const resIdx = readlineSync.keyInSelect(Object.values(ResultadoTeste), "Resultado:", { cancel: false });
        testeService.cadastrar(new Teste(Object.values(TipoTeste)[tipoIdx], Object.values(ResultadoTeste)[resIdx]));
        break;
      case "2":
        const testes = testeService.listar();
        testes.length === 0
          ? console.log("Nenhum teste cadastrado")
          : testes.forEach((t, i) => console.log(`${i + 1}. ${t.tipo} - ${t.resultado}`));
        break;
    }
  }
}

function menuRelatorios() {
  if (!temPermissao(Permissao.ENGENHEIRO)) return console.log("Acesso negado");
  const aeronaves = aeronaveService.listar();
  if (aeronaves.length === 0) return console.log("Nenhuma aeronave cadastrada");

  const idx = selecionarAeronave(aeronaves);
  if (idx === -1) return;
  const rel = new Relatorio();
  rel.gerarRelatorio(aeronaves[idx], pecaService.listar(), etapaService.listarEtapasAeronave(aeronaves[idx].codigo), testeService.listar());
  if (readlineSync.keyInYN("Deseja salvar o relatorio em arquivo?"))
    rel.salvarEmArquivo(aeronaves[idx], pecaService.listar(), etapaService.listarEtapasAeronave(aeronaves[idx].codigo), testeService.listar());
}

function selecionarAeronave(aeronaves: Aeronave[]): number {
  aeronaves.forEach((a, i) => console.log(`${i + 1}. ${a.codigo} - ${a.modelo}`));
  const idx = Number(readlineSync.question("Escolha uma aeronave (0 para cancelar): ")) - 1;
  return idx >= 0 && idx < aeronaves.length ? idx : -1;
}

function selecionarEtapa(etapas: EtapaProducao[]): EtapaProducao | null {
  etapas.forEach((e, i) => console.log(`${i + 1}. ${e.nome} (${e.status})`));
  const idx = Number(readlineSync.question("Escolha uma etapa (0 para cancelar): ")) - 1;
  if (idx >= 0 && idx < etapas.length) {
    return etapas[idx];
  }
  return null;
}

function selecionarFuncionario(funcionarios: Funcionario[]): Funcionario | null {
  funcionarios.forEach((f, i) => console.log(`${i + 1}. ${f.nome} (ID: ${f.id})`));
  const idx = Number(readlineSync.question("Escolha um funcionario (0 para cancelar): ")) - 1;
  if (idx >= 0 && idx < funcionarios.length) {
    return funcionarios[idx];
  }
  return null;
}

function menuPrincipal() {
  while (!usuarioLogado) {
    if (!fazerLogin()) {
      if (!readlineSync.keyInYN("Tentar novamente?")) return;
    }
  }

  let opcao = "";
  while (opcao !== "0") {
    console.log(`\n=== Bem vindo a aerocode ===`);
    console.log("1. Gerenciar Funcionários");
    console.log("2. Gerenciar Aeronaves");
    console.log("3. Gerenciar Peças");
    console.log("4. Gerenciar Testes");
    console.log("5. Gerar Relatórios");
    console.log("0. Sair");
    opcao = readlineSync.question("Escolha: ");

    switch (opcao) {
      case "1": menuFuncionarios(); break;
      case "2": menuAeronaves(); break;
      case "3": menuPecas(); break;
      case "4": menuTestes(); break;
      case "5": menuRelatorios(); break;
      case "0": usuarioLogado = null; console.log("Saindo"); break;
      default: console.log("Opção inválida");
    }
  }
}

if (funcionarioService.listar().length === 0) {
  funcionarioService.cadastrar(new Funcionario("1", "Administrador", "000000000", "Endereço Admin", "admin", "1234", Permissao.ADMINISTRADOR));
}

console.log("Usuario admin criado: admin / 1234");

menuPrincipal();