<!-- title: O comando duo | summary: O mesmo motor como ferramenta de linha de comando, e as duas coisas que ele se recusa a fazer pela metade. | order: 5 -->

O mesmo motor tem uma linha de comando. O `duo` é vinculado ao
`DuoUpdaterCore` de verdade, então ele usa as mesmas fontes na mesma ordem, a
mesma política de instalação e as mesmas regras de ignorar e pular que a
barra de menus — uma divergência entre os dois é um bug, não uma diferença de
opinião.

```sh
make cli          # → ~/.local/libexec/duo, com um link simbólico em ~/.local/bin/duo

duo list                     # o que está instalado, sem tocar na rede
duo check --json             # o que tem atualização, um objeto JSON por linha
duo install Cursor           # aplica uma, ou --all
duo doctor                   # se esta máquina realmente consegue instalar algo
duo backups                  # lista os pontos de reversão, ou recoloca um no lugar
```

`duo check` e `duo list` também aceitam `--source sparkle,github,…` e
`--include-hidden`. `duo ignore` e `duo skip` gravam as mesmas preferências que
o app lê, então esconder algo num deles esconde no outro também.

## Duas coisas que ele se recusa a fazer pela metade

**Atualizações da App Store.** Esse caminho precisa do auxiliar privilegiado
— cujo registro via `SMAppService` exige um bundle de app — ou da API de
Acessibilidade controlando o App Store.app. Uma ferramenta de linha de
comando não tem nenhum dos dois, então ela avisa isso em vez de falhar no
meio do caminho.

**Tomar a trava de instalação à força.** Se o app da barra de menus está no
meio de uma instalação, o `duo` encerra e diz quem está segurando a trava, em
vez de trocar um bundle debaixo dele.

## O lado de manutenção

`duo verify`, `duo triage` e `duo reconcile` varrem cada receita escrita à mão
contra seu endpoint em produção, perguntam a um modelo por que uma receita quebrada
deixou de funcionar, e transformam o resultado em issues. É isso que a verificação
noturna roda. Eles não são necessários para o uso comum.
