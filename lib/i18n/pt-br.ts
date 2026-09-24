import type { Messages } from "./en";

export const ptbr = {
  meta: {
    title: "DuoUpdater — atualize seus apps do Mac como eles esperam",
    description:
      "Um app da barra de menus do macOS que encontra atualizações para os apps que você já tem e as instala do jeito que cada app espera ser atualizado.",
  },
  nav: { docs: "Documentação", changelog: "Novidades", github: "GitHub" },
  footer: {
    appClaim:
      "O app não envia telemetria nem se comunica com nenhum servidor nosso. Apple Silicon, macOS 15+.",
    source: "Código-fonte",
    releases: "Versões",
    licence: "Licença",
    thisSite: "Este site",
  },
  hero: {
    title: ["Atualize os apps do seu Mac", "do jeito que cada um espera."],
    body: "A maioria dos atualizadores escolhe um único mecanismo e faz todos os apps passarem por ele. O DuoUpdater lê o canal de lançamento de cada app — o appcast do Sparkle, a página na App Store, o cask do Homebrew, o feed de versões do fabricante — e usa esse canal.",
  },
  download: {
    button: "Baixar para Mac",
    note: "Apple Silicon, macOS 15 ou posterior. Gratuito e de código aberto.",
    allReleases: "Todas as versões",
  },
  menuBar: {
    alt: "O popover da barra de menus do DuoUpdater, com o título “58 updates available” (58 atualizações disponíveis), um botão “Update All” e um campo de busca. Cada linha mostra a versão instalada, a nova versão, um pequeno selo indicando com o que o app foi feito e um botão “Update”; a linha do Amp mostra de 1.0 (374) para 1.0 (390). Um cartão que aparece ao passar o cursor sobre o selo do AndroMeld diz: “Native — a native Mac app, built straight on Apple's frameworks, not a cross-platform runtime. Links AppKit and SwiftUI. Built with the macOS 26.5 SDK.” (app nativo de Mac, feito com AppKit e SwiftUI e o SDK do macOS 26.5). Uma linha na parte inferior informa “3 Homebrew packages not checked” (3 pacotes do Homebrew não verificados).",
    caption: [
      [
        "Cada linha mostra de qual versão para qual você vai, e o botão diz o que de fato vai acontecer: ",
        { strong: "Update" },
        " instala; ",
        { strong: "Relaunch" },
        " significa que o app já está atualizado no disco e só a cópia em execução está desatualizada. Um ponto verde marca um app que está aberto, para você saber antes de clicar se algo está prestes a ser encerrado e reaberto.",
      ],
      "O selo ao lado de um nome diz com o que o app foi feito — Electron, Qt, Chromium, uma JVM embutida, Flutter, Tauri, Catalyst ou um app de iPhone rodando em Apple Silicon — e, ao passar o cursor sobre ele, aparecem o nome do runtime e a sua versão. Cada informação é lida de algo que o empacotador de fato incluiu, nunca do nome do app ou do fabricante; por isso, um pacote que não informa fica sem selo em vez de receber um palpite.",
    ],
  },
  differently: {
    title: "O que ele faz de diferente",
    handsOver: {
      title: "Ele delega em vez de brigar",
      body: "Quando um app traz o próprio atualizador, é esse atualizador que faz o trabalho. Quando algo não pode ser feito com segurança, a linha diz isso em vez de tentar adivinhar.",
    },
    neverForceQuits: {
      title: "Ele nunca força o encerramento",
      body: "O encerramento é um pedido comum para terminar — o app mostra os próprios avisos para salvar e pode recusar. Um app que recusa continua com o botão Relaunch.",
    },
    checksSigner: {
      title: "Ele confere quem assinou o download",
      body: "EdDSA quando o app publica uma chave; depois, assinatura Developer ID, Team ID, bundle id e arquitetura, que precisam todos corresponder ao app que está sendo substituído — além de um backup para o qual você pode reverter.",
    },
    language: {
      title: "Ele fala vários idiomas",
      body: "{languages}. Não há ajuste de idioma — ele usa o idioma que já estiver definido no macOS.",
    },
    noServer: {
      title: "Ele não tem servidor",
      body: "Sem telemetria e sem SDK de análise. Cada requisição vai direto ao fabricante do app que está sendo verificado, sem levar nada sobre você.",
    },
  },
  workbench: {
    alt: "A janela de trabalho: uma barra lateral com todos os apps verificados e as notas de versão do app selecionado exibidas como texto nativo — título da versão, data e um item por alteração.",
    caption:
      "Ao abrir a janela, você vê tudo o que ele verificou e as notas de versão do que selecionar. Quando um fabricante publica notas num formato que vale a pena interpretar, elas são decompostas e exibidas como texto nativo em vez de uma página web embutida.",
  },
  releaseLog: {
    alt: "A linha do tempo do “Release Log” (registro de versões): versões agrupadas por dia, cada uma mostrando o app, a versão, a origem e um horário exato de publicação ou uma janela aproximada.",
    caption:
      "Toda versão que ele vê é registrada, então, com o tempo, você tem um histórico de quando o software que você usa realmente é lançado. Um horário de lançamento só é chamado de exato quando o próprio feed do fabricante traz a data e a hora; todo o resto aparece como uma janela com ≈, porque é tudo o que sabemos com honestidade.",
  },
  settings: {
    alt: "Os ajustes gerais (“General”) do DuoUpdater, ao lado de uma barra lateral com “Folders”, “Updates”, “GitHub”, “Alcove”, “Ignored” e “Diagnostics”: abrir ao iniciar sessão, intervalo de verificação, ocultar o ícone no Dock, mostrar ou não com o que cada app foi feito, notificações, reabertura automática, backups para reversão e o espaço que ocupam, quantos apps verificar ao mesmo tempo e o encaminhamento da instalação para atualizações da App Store, apps que se atualizam sozinhos e betas do TestFlight.",
    caption:
      "A maioria dos ajustes trata de quanta autonomia você quer dar a ele — se deve reiniciar apps por você, se deve manter um backup para reversão e como encaminhar os dois casos complicados: apps da Mac App Store e apps que trazem o próprio atualizador.",
  },
} satisfies Messages;
