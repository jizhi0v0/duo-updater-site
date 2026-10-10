<!-- title: Privacidade | summary: Sem telemetria, sem análise, sem servidor — e os quatro casos que leem além do nosso próprio contêiner. | order: 4 -->

Não há telemetria, não há SDK de análise, e não há servidor nosso. Toda
requisição de rede vai direto para o fabricante do app que está sendo
verificado — ou para `api.github.com`, `formulae.brew.sh` e
`xcodereleases.com` (o índice mantido pela comunidade de onde as versões do
Xcode são lidas) e, para os ícones de fórmulas do Homebrew, para os sites
indicados logo abaixo — e não leva nada sobre você além do que a requisição
precisa: a versão do próprio app, para que o feed de um fabricante possa
responder pelo canal certo.

**Ícones de fórmulas do Homebrew.** Para uma fórmula para a qual o app não
traz um logotipo próprio, a lista do Homebrew mostra o ícone da própria
fórmula, baixado quando a linha dela aparece pela primeira vez. Ele só é
pedido onde o próprio projeto publica um: a página inicial da fórmula (os
links de ícone da página, depois `/favicon.ico`, e somente os que estão no
próprio host da página inicial ou em seus subdomínios: um link para uma CDN ou
outro host é ignorado, e um redirecionamento para outro lugar não é seguido)
ou, para um projeto no GitHub, `api.github.com/users/<owner>` e, quando o dono
é uma organização, o avatar dela em `avatars.githubusercontent.com`. O avatar
de uma pessoa nunca é baixado, e sites de hospedagem de código (SourceForge,
GitLab e afins) não são consultados. Cada um desses sites, e o GitHub, pode
portanto saber que uma fórmula deles está instalada no seu Mac. Os ícones
ficam em cache no disco; para uma fórmula sem ícone, o pedido só se repete
depois de uma semana.

Quatro coisas merecem ser destacadas explicitamente, porque envolvem leitura
fora do nosso próprio contêiner.

**CleanShot X.** Se estiver instalado, sua `activationKey` é lida das
preferências do app e usada para pedir o appcast personalizado que o próprio
atualizador do CleanShot usa. Sem a chave, o feed do CleanShot informa o
canal de avaliação, e você seria avisado sobre atualizações que não pode
instalar. A chave é enviada só para `legit.maketheweb.io`, nunca é gravada
num log, e fica excluída do cache de disco do HTTP.

**TablePlus.** Sua preferência `IsReceiveBetaBuild` é lida, para que a
detecção rode no mesmo canal em que o próprio app está configurado.

**GitHub.** Para elevar o limite da API de 60 requisições por hora para
5.000, um token é obtido de `GITHUB_TOKEN` / `GH_TOKEN` ou, na falta desses,
de `gh auth token`. Ele é enviado só para `api.github.com`, e é removido de
qualquer redirecionamento que saia desse domínio.

**Seu login na App Store.** Sempre que os dados do TestFlight são lidos, o
banco de dados de contas do sistema é lido por um único motivo: saber se os
tipos de mídia da conta ativa da App Store incluem a App Store. Isso decide
se um beta do TestFlight pode ser oferecido a você agora, e evita que o botão
de recarregar abra o TestFlight só para pedir seu login. Nada mais é lido
dali — nenhum Apple ID, nenhum nome, nenhum identificador — e nada do que é
lido ali sai do Mac.

## Seu login de Apple Developer (Xcode)

Betas e release candidates do Xcode são baixados só do site de
desenvolvedores da Apple, atrás do seu Apple ID. Se você optar por entrar em
Ajustes → Xcode, o login acontece na própria página da Apple, dentro do app:
sua senha e o código de dois fatores vão para a Apple, e o app não os lê. O
que o app guarda é a sessão resultante — os cookies de `apple.com` que a
Apple define — nas Chaves e no próprio armazenamento de dados web do app,
então reabrir o app não desconecta você. Eles são enviados só para
`*.apple.com`: para baixar o Xcode, para ler a lista de downloads do Xcode da
Apple quando você abre ou recarrega isso em Ajustes → Xcode, e uma vez por
hora para perguntar à Apple se a sessão ainda vale. Os valores deles nunca são
gravados num log; o log registra só os nomes dos cookies que a Apple devolve.
Ajustes → Xcode → Encerrar Sessão e Apagar apaga esses cookies, junto com o
cookie de "dispositivo confiável", então o próximo login volta a pedir um
código.

A Apple encerra a sessão do lado dela depois de algumas horas — cerca de oito,
nos nossos testes. Quando o app percebe que ela acabou (na verificação de
hora em hora, ou quando você inicia um download do Xcode), ele carrega a
página de login da Apple uma vez, de forma oculta, nesse mesmo armazenamento
de dados web. Se a Apple ainda reconhecer o login deste Mac, ela devolve uma
sessão nova sem pedir sua senha. Nenhuma janela aparece e nada é digitado; se
a Apple pedir sua senha, a página é descartada depois de 30 segundos, e a
linha do Xcode pede para você entrar de novo. Isso acontece no máximo uma vez
a cada vez que a sessão termina, e você pode desativar isso em Ajustes →
Xcode → Renovar a sessão em segundo plano.

## Credenciais ficam nas Chaves

Qualquer coisa que você mesmo informa — um token do GitHub, uma licença do
Alcove, a sessão de Apple Developer acima — é guardada nas chaves de início de sessão
como `AfterFirstUnlockThisDeviceOnly`. Não é sincronizada com o iCloud, nem
gravada num plist.

## Páginas de fabricantes não deixam cookies para trás

Notas de versão que só podem ser mostradas como a própria página web do
fabricante são renderizadas numa `WKWebView` com um armazenamento de dados
não persistente, então os cookies do fabricante não sobrevivem a uma
reabertura do app. A única exceção é o login de Apple Developer descrito
acima — sua janela e sua página oculta de renovação —, que mantém a sessão de
propósito, como explicado ali.

## Este site

Tudo acima é sobre o app. Esta página que você está lendo é uma coisa
separada, e ela sim coleta algo, então vale a pena dizer isso claramente em
vez de deixar você inferir a partir do comportamento do app.

O site roda dois scripts, ambos da Vercel, ambos próprios (first-party).

**Vercel Web Analytics** conta visualizações de página. Segundo a própria
documentação da Vercel, ela registra, para cada visualização: o horário, a
URL e seu padrão de rota, o referenciador, parâmetros de consulta filtrados,
uma localização aproximada (país, região, cidade), o navegador e o sistema
operacional com suas versões, e o tipo de dispositivo.

**Vercel Speed Insights** mede quão rápido a página de fato carregou para
você. Segundo a própria documentação da Vercel, cada medição carrega: a URL e
seu padrão de rota, o Web Vital reportado e o elemento a que ele foi
atribuído (um seletor CSS como `html>body img.header`), a classe de conexão
(`4g`, `3g`, …), o navegador, o tipo de dispositivo e o sistema operacional
do dispositivo, o país como um código de duas letras, a versão do pacote de
medição, e o horário em que o evento foi recebido. Note a localização mais
estreita: só o país, enquanto o Analytics vai até a cidade.

O que nenhum dos dois faz: não há cookies de terceiros. O Analytics
identifica um visitante por um hash derivado da requisição recebida, em vez
de algo armazenado na sua máquina, e descarta essa identidade depois de 24
horas — então ele não consegue seguir você por outros sites, nem reconstruir
o que você fez aqui há uma semana. O Speed Insights não tem identidade de
visitante nenhuma; a Vercel declara que não coleta nem armazena nada que
permitiria reconstruir uma sessão de navegação entre páginas, e que nenhum
dos dois recursos vincula seus dados a um endereço IP.

Não há mais nada. Nenhuma rede de publicidade, nenhuma gravação de sessão,
nenhum script de terceiros de qualquer tipo. O botão de download leva direto
ao GitHub, e as notas de versão vêm de um arquivo no próprio repositório
deste site.

Se você preferir não ser medido, qualquer bloqueador de conteúdo remove os
dois scripts, e o site funciona exatamente igual sem eles.
