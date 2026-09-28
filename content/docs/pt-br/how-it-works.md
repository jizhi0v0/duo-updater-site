<!-- title: Como funciona | summary: De onde vem cada número de versão, e por que a forma de instalar muda de um app para outro. | order: 1 -->

O DuoUpdater varre `/Applications`, `/Applications/Utilities` e `~/Applications`,
e então confere o que encontrou em várias fontes de atualização, em ordem de
prioridade. A primeira fonte que reconhece um app responde por ele; as demais
não são consultadas.

1. **Mac App Store** — a API de busca do iTunes da Apple, com reconhecimento de
   loja e região. Só resultados nativos de `mac-software` são considerados;
   apps de iOS rodando no Mac são ignorados, porque os números de versão deles
   avançam de forma independente e, se não fossem, apareceriam como
   atualizações que nunca poderiam ser instaladas.
2. **Xcode Releases** — as versões do Xcode que não vêm da App Store: todo
   beta e toda release candidate, casada com o canal que você realmente tem
   instalado. Um Xcode instalado pela loja já foi respondido no item anterior.
3. **Homebrew Cask** — a correspondência é feita pelo nome do arquivo `.app`
   e, na falta dele, pelo bundle id, então casks que instalam um `pkg` em vez
   de um bundle de app também são encontrados. Só responde pelos apps que o
   Homebrew instalou e mantém atualizados (não os casks marcados como
   `auto_updates`), então atualizar um deles deixa o registro do Homebrew em
   dia, e o `brew upgrade` seguinte não instala de novo a mesma versão.
4. **Sparkle** — o appcast `SUFeedURL` do próprio app, o mesmo feed que o
   atualizador embutido do app lê.
5. **GitHub Releases** — correspondência com reconhecimento de canal, para
   apps distribuídos dessa forma. Apenas detecção, a menos que uma regra
   específica do app já tenha indicado e validado um artefato de Mac
   instalável para ele.
6. **Alcove** — seu endpoint de atualização autenticado, e só se você tiver
   informado uma licença. Sem ela, essa fonte fica totalmente ausente, e o
   Alcove passa a usar a sondagem pública do fabricante, abaixo.
7. **Sondagens de fabricante** — regras escritas à mão contra o endpoint do
   próprio fabricante, para tudo que não publica nem um feed nem uma página na
   loja.

## Dois tipos de app que ficam de fora dessa lista inteira

Um app gerenciado pelo **JetBrains Toolbox** e um app instalado pelo
**TestFlight** são respondidos antes mesmo de qualquer uma das sete fontes
acima ser consultada. O Toolbox e o TestFlight são donos da atualização
desses apps, e não há uma segunda opinião útil a se ter, então a lista nunca
roda para eles.

## Ele atualiza cada app do jeito que o app espera

A maioria dos atualizadores escolhe um único mecanismo e faz todos os apps
passarem por ele. Este usa o que quer que o app já traga, e é por isso que o
botão faz algo diferente dependendo da linha:

| Canal | O que acontece quando você clica em Atualizar |
| --- | --- |
| Sparkle | Baixa, roda as verificações abaixo, troca o bundle — depois encerra e reabre o app, a menos que você tenha desativado isso |
| Mac App Store | Um download completo pela loja. Onde isso não é possível — o auxiliar em segundo plano não está aprovado, ou o app está bloqueado para outra região —, a linha passa a tarefa para o app App Store |
| Que se atualiza sozinho (Electron, Squirrel) | Abre o app e deixa o atualizador dele próprio fazer o trabalho |
| Cask de app do Homebrew | `brew install --cask --force` |
| Cask `pkg` do Homebrew | Baixa o pacote oficial e abre o instalador do sistema |

Quando um app traz o próprio atualizador, o DuoUpdater passa a tarefa para ele
em vez de brigar com ele. Quando algo não pode ser feito com segurança, ele
diz isso na linha em vez de arriscar um palpite.

## Ferramentas de linha de comando e fontes

Uma única linha, na parte de baixo da lista, cobre tudo que o Homebrew
instala que **não é um app**: fórmulas de linha de comando, e casks que não
instalam nenhum `.app` — uma CLI, uma fonte, um driver. Nenhum desses precisa
de uma decisão específica por app, e eles não têm bundle para ser varrido,
então, sem essa linha, ficariam totalmente invisíveis.

Um cask que *de fato* instala um app recebe uma linha comum, como qualquer
outro, e nunca é tocado pela atualização daquela linha de baixo, então nada é
contado duas vezes.
