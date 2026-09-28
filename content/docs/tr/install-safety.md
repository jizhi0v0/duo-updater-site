<!-- title: Yükleme güvenliği | summary: Bir uygulama değiştirilmeden önce nelerin denetlendiği ve nelerin kasıtlı olarak hiç yapılmadığı. | order: 2 -->

Yüklemeyi kendi elinde tutmak, bu denetimleri mümkün kılan şeydir. Bunların her biri, bir yazılım Mac'inizdeki başka bir yazılımın yerini alırken ters gidebilecek bir şeydir.

## Çalışan bir uygulamayı asla zorla kapatmaz

Yükleyici hiçbir şeyi kapatmaz. Güncellenen bir uygulamayı yeniden başlatmak ayrı bir adımdır; varsayılan olarak açıktır ve Ayarlar'dan kapatılabilir — çalıştığında ise kapatma isteği sıradan bir `terminate()` çağrısıdır. Uygulama kendi kaydetme uyarılarını gösterir ve çıkmayı reddedebilir. Reddeden bir uygulama çalışır durumda bırakılır ve bir **Yeniden Başlat** düğmesi taşımaya devam eder; böylece kaydedilmemiş çalışma zorla kapatmadan asla etkilenmez.

Bilmekte fayda var: yeniden başlatma, yeni sürüm zaten diske yazıldıktan *sonra* gerçekleşir. Yani kapatmayı reddederseniz, siz kendiniz yeniden başlatana kadar, güncellenmiş paketin yanında hâlâ eski kodu çalıştıran bir süreç bulunur. Satırdaki Yeniden Başlat düğmesinin anlamı budur.

## Bir şey değiştirilmeden önce beş denetim

**EdDSA**, uygulamanın kendisi bir genel anahtar sağlıyorsa. Bazı üreticiler imzasız bir akış yayımlar; bunlar doğrudan reddedilmez, yalnızca kalan denetimleri kendi başlarına geçmek zorundadırlar. Bir anahtar *yayımlayan* bir uygulama ise geçerli bir imza üretmek zorundadır — aşağıda açıklanan bilinçli bir istisna dışında.

Ardından, kaynak ne olursa olsun, indirilen paket üzerinde dört denetim:

- **Developer ID imzası**, sıkı biçimde ve sonuna kadar doğrulanır — yalnızca dış paket değil, her mimari ve iç içe geçmiş kod da dâhil.
- **Team ID**, yerini alacağı uygulamayla eşleşmek zorundadır.
- **Bundle identifier**, `Info.plist`'ten değil *imzadan* alınır; böylece değiştirilmiş bir plist bu denetimi atlatamaz.
- **Çalıştırılabilir mimari**, gerçek Mach-O dilimlerinden okunur. Bu Mac'in başlatamayacağı bir derleme, kurulup bozuk bırakılmak yerine reddedilir.

Farklı bir geliştiriciye çıkan bir indirme kurulmaz, reddedilir.

İstisna şu: bir üretici, geçiş sürümü yayımlamadan imzalama anahtarını değiştirdiğinde, eski anahtar artık onların yayımladığı hiçbir şeyi doğrulayamaz. Uygulamayı sonsuza dek askıda bırakmamak için geçersiz bir EdDSA imzası hemen hata olarak fırlatılmaz, bekletilir; ve **diğer dört denetim geçerse** ve indirilen paket akışı doğrulayan yeni bir anahtar taşıyorsa yükleme yine de sürebilir. Bu durumda güveni taşıyan, Developer ID ve Team ID kapılarıdır.

## Büyük sürüm yükseltmeleri onayınızı gerektirir

Yeni bir büyük sürüme geçiş, tek tıkla bir düğme yerine bir uyarının arkasına konur; çünkü ücretli bir uygulama için yeni bir lisans gerekebilir. Karar sizindir; DuoUpdater bunu kolaylaştırarak sizin yerinize karar vermez.

## Her şey yüklemeden hemen önce yeniden denetlenir

Bir saattir açık kalmış bir liste bayatlamıştır. Değişimden hemen önce denetim yeniden çalışır; böylece bu sırada başka bir şey tarafından zaten güncellenmiş bir uygulamaya karşı gereksiz bir yükleme asla tetiklenmez.

## Geri alma (rollback) yedekleri

Yerini alınan paket saklanır ve geri konabilir. `duo backups` geri alma noktalarını komut satırından listeler; uygulama da aynısını sunar.

## Yeniden başlatma saptaması

Bir uygulama diskte güncellenmiş ama hâlâ daha eski bir derlemeyi çalıştırıyorsa — bu, LaunchServices üzerinden karşılaştırılır, tahmin edilmez — güncel olarak bildirilmek yerine bir **Yeniden Başlat** eylemiyle gösterilir. Diskteki sürüm ile çalışan sürüm iki ayrı gerçektir ve satır size hangisinin bayat olduğunu söyler.
