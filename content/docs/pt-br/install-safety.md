<!-- title: Segurança na instalação | summary: O que é verificado antes de um app ser substituído, e o que nunca é feito de propósito. | order: 2 -->

Ser o dono da instalação é o que torna essas verificações possíveis. Cada uma
delas cobre algo que pode dar errado quando um software substitui outro
software no seu Mac.

## Ele nunca força o encerramento de um app aberto

O instalador nunca encerra nada. Reiniciar um app depois de atualizado é uma
etapa separada, ativada por padrão e desativável em Ajustes — e, quando roda,
o encerramento é um simples `terminate()`. O app mostra seus próprios avisos
para salvar e pode se recusar. Um que se recusa continua aberto e mantém um
botão **Reabrir**, então o trabalho não salvo nunca corre risco por causa de
um encerramento forçado.

Vale saber: a reinicialização acontece *depois* que a nova versão já está no
disco. Então, se você recusar o encerramento, fica com um bundle atualizado ao
lado de um processo que ainda roda o código antigo, até você mesmo reabrir o
app. É isso que o botão Reabrir na linha representa.

## Cinco verificações antes de qualquer coisa ser substituída

**EdDSA**, quando o próprio app fornece uma chave pública. Alguns fabricantes
publicam um feed sem assinatura; esses não são recusados de cara, só precisam
passar sozinhos pelas verificações restantes. Um app que *de fato* publica uma
chave precisa produzir uma assinatura válida — com uma exceção deliberada,
abaixo.

Depois, independentemente da fonte, quatro verificações no bundle baixado:

- **Assinatura Developer ID**, validada de forma estrita e até o fim — toda
  arquitetura, código aninhado incluído, não só o bundle externo.
- **Team ID**, que precisa corresponder ao do app sendo substituído.
- **Identificador do bundle**, obtido da *assinatura*, e não do
  `Info.plist`, então um plist reescrito não consegue burlar essa verificação.
- **Arquitetura executável**, lida das fatias (slices) Mach-O reais. Um build que
  este Mac não consegue abrir é recusado em vez de instalado e deixado
  quebrado.

Um download que resolve para um desenvolvedor diferente é recusado, não
instalado.

A exceção: quando um fabricante troca sua chave de assinatura sem publicar um
build de transição, a chave antiga deixa de conseguir validar qualquer coisa
que ele publique. Em vez de deixar o app abandonado para sempre, uma
assinatura EdDSA inválida é retida em vez de descartada, e a instalação ainda
pode prosseguir **se as outras quatro verificações passarem** e o bundle
baixado trouxer uma chave nova que valide o feed. As verificações de
Developer ID e Team ID são o que sustenta a confiança nesse caso.

## Atualizações de versão principal passam por um aviso

Um salto para uma nova versão principal fica atrás de um aviso em vez de um
botão de um clique só, porque para um app comercial isso pode exigir uma nova
licença. Você decide; o DuoUpdater não decide por você tornando isso fácil.

## Tudo é verificado de novo imediatamente antes de instalar

Uma lista que ficou aberta por uma hora está desatualizada. Antes da troca, a
verificação roda de novo, então uma instalação redundante nunca dispara contra
um app que outra coisa já atualizou nesse meio-tempo.

## Backups para reversão

O bundle sendo substituído é mantido, e pode ser recolocado no lugar. O `duo
backups` lista os pontos de reversão pela linha de comando; o app expõe a
mesma coisa.

## Detecção de reinicialização pendente

Se um app foi atualizado no disco, mas ainda está rodando um build mais
antigo — comparado via LaunchServices, não estimado —, isso aparece com uma
ação **Reabrir** em vez de ser reportado como atualizado. A versão em disco
e a versão em execução são dois fatos diferentes, e a linha diz qual dos dois
está desatualizado.
