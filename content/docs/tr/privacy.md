<!-- title: Gizlilik | summary: Telemetri yok, analiz yok, sunucu yok — ve kendi konteynerimizin dışını okuyan dört durum. | order: 4 -->

Telemetri yoktur, analiz SDK'sı yoktur, bize ait bir sunucu yoktur. Her ağ isteği, denetlenen uygulamanın üreticisine — ya da `api.github.com`, `formulae.brew.sh` ve `xcodereleases.com`'a (Xcode sürümlerinin okunduğu topluluk tarafından tutulan dizin), Homebrew formül simgeleri için de hemen aşağıda adı geçen sitelere — doğrudan gider ve isteğin ihtiyaç duyduğundan fazla sizinle ilgili hiçbir şey taşımaz: yalnızca uygulamanın kendi sürümü, böylece bir üreticinin akışı doğru kanal için yanıt verebilir.

**Homebrew formül simgeleri.** Uygulamanın bir logo içermediği bir formül için CLI sekmesindeki Homebrew grubu formülün kendi simgesini gösterir; simge, formülün satırı ilk kez göründüğünde indirilir. Simge yalnızca projenin kendisinin yayımladığı yerden istenir: formülün ana sayfasından (önce sayfanın simge bağlantıları, sonra `/favicon.ico`; yalnızca ana sayfanın kendi sunucusundakiler ya da onun alt alan adlarındakiler: bir CDN'ye veya başka bir sunucuya giden bağlantı atlanır, başka bir yere yapılan yönlendirme izlenmez) ya da GitHub'daki bir proje için `api.github.com/users/<owner>` adresinden ve, sahibi bir kuruluşsa, `avatars.githubusercontent.com` üzerinden kuruluşun avatarı olarak. Bir kişinin avatarı asla indirilmez ve kod barındırma sitelerine (SourceForge, GitLab ve benzerleri) istek gönderilmez. Bu nedenle bu sitelerin her biri ve GitHub, kendi formüllerinden birinin Mac'inizde yüklü olduğunu anlayabilir. Simgeler diskte önbelleğe alınır; simgesi olmayan bir formül için bir hafta boyunca yeniden istek gönderilmez.

Açıkça belirtilmesi gereken dört şey var, çünkü bunlar kendi konteynerimizin dışını okumayı içeriyor.

**CleanShot X.** Yüklüyse, tercihlerinden `activationKey` değeri okunur ve CleanShot'ın kendi güncelleyicisinin kullandığı kişiselleştirilmiş appcast'i istemek için kullanılır. Bu anahtar olmadan CleanShot'ın akışı deneme kanalını bildirir ve size yükleyemeyeceğiniz güncellemeler haber verilirdi. Anahtar yalnızca `legit.maketheweb.io`'ya gönderilir, hiçbir zaman bir günlüğe yazılmaz ve HTTP disk önbelleğinin dışında tutulur.

**TablePlus.** `IsReceiveBetaBuild` tercihi okunur; böylece saptama, uygulamanın kendisinin ayarlı olduğu kanalla aynı kanalda çalışır.

**GitHub.** API hız sınırını saatte 60 istekten 5.000'e çıkarmak için `GITHUB_TOKEN` / `GH_TOKEN` değişkeninden, o da yoksa `gh auth token`'dan bir token alınır. Yalnızca `api.github.com`'a gönderilir ve bu adresten çıkan her yönlendirmeden (redirect) ayıklanır.

**App Store oturum açma bilginiz.** TestFlight verisi her okunduğunda, sistem hesapları veritabanından tek bir şey okunur: etkin App Store hesabının medya türleri arasında App Store'un olup olmadığı. Bu, bir TestFlight betasının şu anda size sunulup sunulamayacağına karar verir ve yenile düğmesinin sizi oturum açmaya davet etmek için TestFlight'ı başlatmasını engeller. Bunun dışında hiçbir şey okunmaz — Apple ID yok, ad yok, tanımlayıcı yok — ve orada okunan hiçbir şey Mac'inizden çıkmaz.

## Apple Developer oturum açma bilginiz (Xcode)

Xcode betaları ve sürüm adayları yalnızca Apple'ın geliştirici sitesinden, Apple ID'nizle oturum açılarak indirilir. Ayarlar → Xcode'da oturum açmayı seçerseniz, oturum açma uygulamanın içinde Apple'ın kendi sayfasında gerçekleşir: parolanız ve iki faktörlü kimlik doğrulama kodunuz Apple'a gider, uygulama bunları okumaz. Uygulamanın tuttuğu şey, ortaya çıkan oturumdur — Apple'ın ayarladığı `apple.com` çerezleri — bu da Anahtar Zinciri'nde ve uygulamanın kendi web veri deposunda saklanır; böylece yeniden başlatma sizi oturumdan çıkarmaz. Bu çerezler yalnızca `*.apple.com`'a gönderilir: Xcode'u indirmek için, Ayarlar → Xcode'da açtığınızda veya yenilediğinizde Apple'ın Xcode indirme listesini okumak için ve saatte bir oturumun hâlâ geçerli olup olmadığını Apple'a sormak için. Değerleri hiçbir zaman bir günlüğe yazılmaz; günlük yalnızca Apple'ın gönderdiği çerezlerin adlarını kaydeder. Ayarlar → Xcode → Oturumu Kapat ve Temizle bunları, "güvenilen cihaz" çereziyle birlikte siler; böylece bir sonraki oturum açma yeniden bir kod ister.

Apple, kendi tarafında oturumu birkaç saat sonra sonlandırır — testlerimizde yaklaşık sekiz saat. Uygulama oturumun sona erdiğini fark ettiğinde (saatlik denetimde ya da bir Xcode indirmesi başlattığınızda), Apple'ın oturum açma sayfasını bir kez, gizli olarak, aynı web veri deposunda yükler. Apple bu Mac'in oturumunu hâlâ tanıyorsa, parolanız olmadan yeni bir oturum döndürür. Hiçbir pencere görünmez ve hiçbir şey yazılmaz; Apple parolanızı istiyorsa sayfa 30 saniye sonra bırakılır ve Xcode satırı yeniden oturum açmanızı ister. Bu, oturum her sona erdiğinde en fazla bir kez gerçekleşir ve Ayarlar → Xcode → Oturumu arka planda yenile altından kapatabilirsiniz.

## Kimlik bilgileri Anahtar Zinciri'nde kalır

Kendiniz girdiğiniz her şey — bir GitHub token'ı, bir Alcove lisansı, yukarıdaki Apple Developer oturumu — oturum açma Anahtar Zinciri'nde `AfterFirstUnlockThisDeviceOnly` olarak saklanır. iCloud'a eşzamanlanmaz, bir plist'e yazılmaz.

## Üretici sayfaları arkalarında çerez bırakmaz

Yalnızca üreticinin kendi web sayfası olarak gösterilebilen sürüm notları, kalıcı olmayan bir veri deposuyla bir `WKWebView` içinde işlenir; böylece üretici çerezleri bir yeniden başlatmayı atlatmaz. Tek istisna, yukarıda anlatıldığı gibi oturumunu kasıtlı olarak tutan Apple Developer oturum açma penceresi ve onun gizli yenileme sayfasıdır.

## Bu web sitesi

Yukarıdakilerin tümü uygulamayla ilgili. Şu an okuduğunuz bu sayfa ayrı bir şeydir ve bir şeyler toplar; bu yüzden sizi bunu uygulamanın davranışından çıkarmaya bırakmak yerine açıkça belirtmekte fayda var.

Site, ikisi de Vercel'den ve ikisi de birinci taraf olan iki betik çalıştırır.

**Vercel Web Analytics** sayfa görüntülemelerini sayar. Vercel'in kendi belgelerine göre her görüntüleme için şunları kaydeder: zaman, URL ve rota deseni, yönlendiren (referrer), filtrelenmiş sorgu parametreleri, yaklaşık bir konum (ülke, bölge, şehir), sürümleriyle birlikte tarayıcı ve işletim sistemi, ve cihaz türü.

**Vercel Speed Insights**, sayfanın sizin için gerçekte ne kadar hızlı yüklendiğini ölçer. Vercel'in kendi belgelerine göre her ölçüm şunları taşır: URL ve rota deseni, bildirilen Web Vital ve ona atfedilen öğe (`html>body img.header` gibi bir CSS seçici), bağlantı sınıfı (`4g`, `3g`, …), tarayıcı, cihaz türü ve cihaz işletim sistemi, iki harfli bir kod olarak ülke, ölçüm paketinin sürümü ve olayın alındığı zaman. Konumun burada daha dar olduğuna dikkat edin: yalnızca ülke; Analytics ise şehir düzeyine kadar iner.

Hiçbirinin yapmadığı şey: üçüncü taraf çerez yoktur. Analytics, bir ziyaretçiyi cihazınızda saklanan bir şeyle değil, gelen istekten türetilen bir özet (hash) ile tanır ve bu kimliği 24 saat sonra atar — bu yüzden sizi siteler arasında takip edemez ve burada bir hafta önce ne yaptığınızı yeniden kuramaz. Speed Insights'ın hiç ziyaretçi kimliği yoktur; Vercel, bir tarama oturumunun sayfalar arasında yeniden kurulmasına izin verecek hiçbir şey toplamadığını ve depolamadığını, ayrıca hiçbir özelliğin veri noktalarını bir IP adresine bağlamadığını belirtir.

Bundan başka hiçbir şey yoktur. Reklam ağı yok, oturum kaydı yok, hiçbir türden üçüncü taraf betik yok. İndirme düğmesi doğrudan GitHub'a bağlanır ve sürüm notları bu sitenin kendi deposundaki bir dosyadan gelir.

Ölçülmek istemiyorsanız, herhangi bir içerik engelleyici her iki betiği de engeller ve site onlar olmadan da tıpatıp aynı şekilde çalışır.
