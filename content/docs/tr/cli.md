<!-- title: duo komutu | summary: Aynı motor bir komut satırı aracı olarak, ve yarım bırakmayı reddettiği iki şey. | order: 5 -->

Aynı motorun bir komut satırı vardır. `duo`, gerçek `DuoUpdaterCore`'a bağlanır; bu yüzden aynı kaynakları aynı sırayla, aynı yükleme ilkesini ve menü çubuğuyla aynı yok sayma (ignore) ve atlama (skip) kurallarını kullanır — ikisi arasındaki bir anlaşmazlık, bir görüş farkı değil, bir hatadır.

```sh
make cli          # → ~/.local/libexec/duo, ~/.local/bin/duo altında sembolik bağlantıyla

duo list                     # ağa dokunmadan neyin yüklü olduğu
duo check --json             # neyin güncellemesi olduğu, satır başına bir JSON nesnesi
duo install Cursor           # birini uygula, ya da --all
duo doctor                   # bu makinenin gerçekten bir şey yükleyip yükleyemeyeceği
duo backups                  # geri alma noktalarını listele, ya da birini geri koy
```

`duo check` ve `duo list` ayrıca `--source sparkle,github,…` ve `--include-hidden` parametrelerini de alır. `duo ignore` ve `duo skip`, uygulamanın okuduğu tercihlerin aynısını yazar; bu yüzden bir şeyi birinde gizlemek diğerinde de gizler.

## Yarım bırakmak yerine reddettiği iki şey

**App Store güncellemeleri.** Bu yol ya `SMAppService` kaydı bir uygulama paketi gerektiren ayrıcalıklı yardımcıya, ya da App Store.app'i süren Erişilebilirlik API'sine ihtiyaç duyar. Bir komut satırı aracının hiçbiri yoktur; bu yüzden yarı yolda başarısız olmak yerine bunu söyler.

**Yükleme kilidini zorla almak.** Menü çubuğu uygulaması bir yükleme sırasındaysa, `duo` paketi elinin altından değiştirmek yerine çıkar ve kilidi kimin tuttuğunu adlandırır.

## Bakım tarafı

`duo verify`, `duo triage` ve `duo reconcile`, elle yazılmış her tarifi (recipe) kendi canlı uç noktasına karşı tarar, bozulan bir tarifin neden bozulduğunu bir modele sorar ve sonucu sorunlara (issue) dönüştürür. Gece yapılan denetim bunu çalıştırır. Sıradan kullanım için gerekli değillerdir.
