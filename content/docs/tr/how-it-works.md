<!-- title: Nasıl çalışır | summary: Her sürüm numarasının nereden geldiği ve yükleme yönteminin uygulamadan uygulamaya neden farklı olduğu. | order: 1 -->

DuoUpdater `/Applications`, `/Applications/Utilities` ve `~/Applications` klasörlerini tarar, ardından bulduklarını belirli bir öncelik sırasına göre birkaç güncelleme kaynağıyla karşılaştırır. Bir uygulamayı tanıyan ilk kaynak o uygulama için yanıt verir; kalan kaynaklara hiç başvurulmaz.

1. **Mac App Store** — Apple'ın iTunes arama API'si, mağaza ve bölge bilgisi gözetilerek. Yalnızca yerel `mac-software` sonuçlarına güvenilir; iOS-on-Mac uygulamaları atlanır, çünkü bunların sürüm numaraları bağımsız ilerler ve aksi hâlde asla yüklenemeyecek güncellemeler gibi görünürlerdi.
2. **Xcode Releases** — App Store'dan gelmeyen Xcode derlemeleri: her beta ve sürüm adayı, gerçekten yüklemiş olduğunuz kanalla eşleştirilir. Mağazadan yüklenmiş bir Xcode zaten yukarıda yanıtlanmıştır.
3. **Homebrew Cask** — `.app` dosya adına göre eşleştirilir, bulunamazsa bundle id'ye geri düşülür; böylece bir `pkg` kuran ve uygulama paketi kurmayan cask'lar da bulunabilir. Yalnızca Homebrew'un kurduğu ve güncel tuttuğu uygulamalar için yanıt verir (`auto_updates` olarak işaretlenmiş cask'lar için değil); böylece birini güncellemek Homebrew'un kaydını güncel tutar ve `brew upgrade` aynı sürümü yeniden kurmaz.
4. **Sparkle** — uygulamanın kendi `SUFeedURL` appcast'i; uygulamanın yerleşik güncelleyicisinin okuduğu akışla aynısı.
5. **GitHub Releases** — bu şekilde dağıtılan uygulamalar için kanala duyarlı eşleştirme. Yalnızca saptama yapılır, meğer ki uygulamaya özel bir kural o uygulama için kurulabilir bir Mac dosyası adlandırıp onaylamış olsun.
6. **Alcove** — kimlik doğrulamalı güncelleme uç noktası, yalnızca bir lisans girdiyseniz. Lisans yoksa bu kaynak tamamen devre dışı kalır ve Alcove aşağıdaki genel üretici probuna düşer.
7. **Üretici probları (vendor probes)** — ne bir akış ne de bir mağaza listesi yayımlayan her şey için, doğrudan üreticinin kendi uç noktasına karşı elle yazılmış kurallar.

## Listenin tamamını atlayan iki tür uygulama

**JetBrains Toolbox** tarafından yönetilen bir uygulama ile **TestFlight**'tan kurulmuş bir uygulama, yukarıdaki yedi kaynağın hiçbirine başvurulmadan yanıtlanır. Toolbox ve TestFlight, bu uygulamaların güncellemesini kendileri üstlenir ve alınacak yararlı bir ikinci görüş yoktur; bu yüzden liste onlar için hiç çalışmaz.

## Her uygulamayı, o uygulamanın beklediği şekilde günceller

Çoğu güncelleyici tek bir yöntem seçer ve her uygulamayı bu yöntemden geçirir. DuoUpdater ise uygulamanın zaten sahip olduğu neyse onu kullanır; düğmenin satıra göre farklı bir şey yapmasının nedeni budur.

| Kanal | Güncelle'ye bastığınızda ne olur |
| --- | --- |
| Sparkle | İndirir, aşağıdaki denetimleri yapar, paketi değiştirir — ardından, bunu kapatmadıysanız, uygulamadan çıkıp yeniden açar |
| Mac App Store | Mağaza üzerinden tam bir indirme. Bu mümkün değilse — arka plan yardımcısı onaylanmamışsa veya uygulama başka bir bölgeye kilitliyse — satır bunun yerine App Store uygulamasına devreder |
| Kendini güncelleyen (Electron, Squirrel) | Uygulamayı açar ve işi kendi güncelleyicisine bırakır |
| Homebrew uygulama cask'ı | `brew install --cask --force` |
| Homebrew `pkg` cask'ı | Resmî paketi indirir ve sistem yükleyicisini açar |

Bir uygulama kendi güncelleyicisiyle geliyorsa DuoUpdater onunla çekişmek yerine işi devreder. Bir şey güvenle yapılamıyorsa, tahmin yürütmek yerine bunu satırda açıkça söyler.

## Komut satırı araçları ve fontlar

Listenin en altındaki tek bir satır, Homebrew'un kurduğu ve **uygulama olmayan** her şeyi kapsar: komut satırı formülleri ve hiçbir `.app` kurmayan cask'lar — bir CLI, bir font, bir sürücü. Bunların hiçbiri uygulama başına bir karar gerektirmez ve taranacak bir paketleri yoktur; bu satır olmasa tamamen görünmez kalırlardı.

Bir uygulama kuran cask ise her zamanki gibi sıradan bir satır alır ve en alttaki satırdaki güncellemeden asla etkilenmez; böylece hiçbir şey iki kez sayılmaz.
