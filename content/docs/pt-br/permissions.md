<!-- title: Permissões | summary: O que o macOS vai pedir, o que cada uma garante, e o que você perde ao recusar. | order: 3 -->

O macOS pede algumas permissões na primeira vez que são necessárias, e uma
delas ele nunca chega a pedir. **Nada aqui é obrigatório para ver seus
apps** — a lista, as verificações de versão e as notas de versão funcionam
com tudo negado. O que segue é o que cada permissão garante, para quais dos
seus apps ela importa, e o custo de ficar sem ela. As seções de Acesso Total
ao Disco e Automação foram medidas no macOS 27, com um app ao qual nada havia
sido concedido.

## Acesso Total ao Disco — só para betas do TestFlight e para o CotEditor

O macOS nunca pede essa: você mesmo adiciona o DuoUpdater em **Ajustes do
Sistema → Privacidade e Segurança → Acesso Total ao Disco**. Como o app é
assinado com uma identidade estável, a concessão sobrevive a qualquer
atualização futura. Ela só importa se você tiver um destes casos:

- **Um beta instalado pelo TestFlight.** O DuoUpdater lê os builds que o
  TestFlight oferece a você a partir dos próprios registros do TestFlight.
  Sem essa permissão, o beta ainda é reconhecido, mas sua linha mostra um
  ponto de interrogação em vez do build mais recente.
- **O CotEditor.** Ele mantém seu canal de atualização dentro do próprio
  contêiner de sandbox. Sem essa permissão, o CotEditor é verificado contra
  suas versões estáveis mesmo que você tenha pedido pré-versões para ele; uma
  pré-versão que você já roda continua sendo reconhecida pela própria versão.

Nada mais que o DuoUpdater analisa precisa dela. O canal de atualização do
Fork, do TablePlus, do OrbStack, do IINA, do Tailscale, do CleanShot e dos
outros apps que ele conhece, a loja da sua conta na App Store, e os arquivos
em Application Support são todos lidos sem essa permissão.

Sem Acesso Total ao Disco, o DuoUpdater nem tenta essas duas leituras — toda
tentativa seria recusada, e no macOS 27 uma leitura do TestFlight recusada
gera um aviso "Acesso aos dados bloqueado". Se você tiver um beta do TestFlight
ou o CotEditor, abrir o menu explica para que serve a permissão e onde
concedê-la: uma vez, e mais uma vez só se outro app assim aparecer. A janela
de boas-vindas e **Ajustes → Diagnóstico** sempre mostram se ela foi
concedida, com um botão que abre o lugar certo nos Ajustes do Sistema. Tocar
no ponto de interrogação numa linha do TestFlight explica por que ele está ali
e oferece o mesmo botão quando a permissão faltando é o motivo. Um CotEditor
estável traz um pequeno cadeado ao lado do nome que faz a mesma coisa.

## Gerenciamento de Apps — obrigatório para instalar qualquer coisa

Substituir um app em `/Applications` que outro instalador colocou ali depende
dessa permissão, e o macOS não oferece nenhuma API para pedi-la com
antecedência, então a primeira instalação já dispara o aviso do sistema.
Recuse e a detecção continua funcionando; as instalações falham, e o
DuoUpdater abre o ajuste correspondente para você.

## Notificações — totalmente opcional

Pedida na abertura, só para avisar que atualizações foram encontradas e para
o número no ícone do Dock. Note que o número precisa especificamente do
interruptor **Avisos** (Badges), não só dos alertas — com Avisos
desativado, o número simplesmente desaparece, mesmo que as notificações
continuem aparecendo.

## Auxiliar em segundo plano — para atualizações da App Store

As atualizações da App Store passam por um item em segundo plano que o macOS
pede para você aprovar uma vez, em **Itens de Início de Sessão e
Extensões**. Sem isso, as atualizações da App Store falham, e o DuoUpdater
diz onde ativar essa opção.

## Acessibilidade — não é necessária por padrão

Usada se você trocar as instalações da App Store para o caminho da interface
gráfica em Ajustes, e para fechar a janela do Instalador depois de uma
atualização por pacote; sem ela, essa janela fica aberta para você fechar. O
caminho padrão para a App Store usa um download completo e não pede nada
extra.

## Automação — não é solicitada

Encerrar e reabrir um app depois de atualizá-lo não pede essa permissão.
