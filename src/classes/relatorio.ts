import { Aeronave } from "./aeronave";
import { FileManager } from "./fileManager";
import { Peca } from "./peca";
import { EtapaProducao } from "./etapasproducao";
import { Teste } from "./teste";

export class Relatorio {
    
    gerarRelatorio(aeronave: Aeronave, pecas: Peca[], etapas: EtapaProducao[], testes: Teste[]): void {
        const relatorio = this.criarRelatorioDetalhado(aeronave, pecas, etapas, testes);
        console.log(relatorio);
    }
    
    salvarEmArquivo(aeronave: Aeronave, pecas: Peca[], etapas: EtapaProducao[], testes: Teste[]): void {
        const relatorio = this.criarRelatorioDetalhado(aeronave, pecas, etapas, testes);
        const nomeArquivo = `relatorios/relatorio_aeronave_${aeronave.codigo}_${new Date().toISOString().split('T')[0]}.txt`;
        
        FileManager.salvar(nomeArquivo, [relatorio]);
        console.log(`Relatório salvo em: ${nomeArquivo}`);
    }

    private criarRelatorioDetalhado(aeronave: Aeronave, pecas: Peca[], etapas: EtapaProducao[], testes: Teste[]): string {
        return `
RELATÓRIO FINAL DA AERONAVE - PRONTA PARA ENTREGA
==================================================

INFORMAÇÕES DETALHADAS DA AERONAVE:
-----------------------------------
• Código: ${aeronave.codigo}
• Modelo: ${aeronave.modelo}
• Tipo: ${aeronave.tipo}
• Capacidade: ${aeronave.capacidade} passageiros
• Alcance: ${aeronave.alcance} km

PEÇAS UTILIZADAS:
----------------
${pecas.length > 0 
    ? pecas.map((peca, index) => 
        `${index + 1}. ${peca.nome} | Tipo: ${peca.tipo} | Fornecedor: ${peca.fornecedor} | Status: ${peca.status}`
      ).join('\n')
    : 'Nenhuma peça registrada'}

ETAPAS DE PRODUÇÃO REALIZADAS:
-----------------------------
${etapas.length > 0 
    ? etapas.map((etapa, index) => 
        `${index + 1}. ${etapa.nome} | Prazo: ${etapa.prazoConclusao.toLocaleDateString('pt-BR')} | Status: ${etapa.status}`
      ).join('\n')
    : 'Nenhuma etapa registrada'}

RESULTADOS DOS TESTES:
----------------------
${testes.length > 0 
    ? testes.map((teste, index) => 
        `${index + 1}. ${teste.tipo} | Resultado: ${teste.resultado}`
      ).join('\n')
    : 'Nenhum teste registrado'}

DATA DE EMISSÃO: ${new Date().toLocaleDateString('pt-BR')}
==================================================
        `.trim();
    }
}