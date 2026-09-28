<!-- title: İzinler | summary: macOS'in ne isteyeceği, her iznin ne kazandırdığı ve reddetmenin bedeli. | order: 3 -->

macOS bazı izinleri ilk gerektiğinde ister, birini ise hiç sormaz. **Uygulamalarınızı görmek için burada hiçbir şey zorunlu değildir** — liste, sürüm denetimleri ve sürüm notlarının tümü her şey reddedilmiş olsa bile çalışır. Aşağıda her iznin ne kazandırdığı, hangi uygulamalarınız için önemli olduğu ve onsuz kalmanın bedeli anlatılıyor. Tam Disk Erişimi ve Otomasyon bölümleri, hiçbir izin verilmemiş bir uygulamayla macOS 27'de ölçülmüştür.

## Tam Disk Erişimi — yalnızca TestFlight betaları ve CotEditor için

macOS bunu asla sormaz: DuoUpdater'ı **Sistem Ayarları → Gizlilik ve Güvenlik → Tam Disk Erişimi**'ne kendiniz eklersiniz. Uygulama sabit bir kimlikle imzalandığı için bu izin gelecekteki tüm güncellemelerden sonra da geçerliliğini korur. Yalnızca aşağıdakilerden birine sahipseniz önemlidir:

- **TestFlight'tan kurulmuş bir beta.** DuoUpdater, TestFlight'ın size sunduğu derlemeleri TestFlight'ın kendi kayıtlarından okur. Bu izin olmadan beta yine tanınır, ancak satırında en son derleme yerine bir soru işareti görünür.
- **CotEditor.** Güncelleme kanalını kendi sandbox konteynerinin içinde tutar. Bu izin olmadan CotEditor, ön sürümleri istemiş olsanız bile kararlı sürümlerine göre denetlenir; zaten çalıştırdığınız bir ön sürüm ise yine kendi sürümünden tanınır.

DuoUpdater'ın baktığı başka hiçbir şey buna ihtiyaç duymaz. Fork, TablePlus, OrbStack, IINA, Tailscale, CleanShot ve tanıdığı diğer uygulamaların sürüm kanalı, App Store mağazanız ve Application Support altındaki dosyalar, bu izin olmadan da okunur.

Tam Disk Erişimi yokken DuoUpdater bu iki okumayı hiç denemez — her deneme reddedilirdi ve macOS 27'de reddedilen bir TestFlight okuması bir "Veri Erişimi Engellendi" uyarısı gösterir. Bir TestFlight betanız veya CotEditor'ınız varsa, menüyü açmak iznin ne için olduğunu ve nereden verileceğini bir kez açıklar — ve böyle başka bir uygulama ortaya çıkarsa bir kez daha. Karşılama penceresi ve **Ayarlar → Tanılama**, verilip verilmediğini her zaman gösterir; Sistem Ayarları'nda doğru yeri açan bir düğmeyle birlikte. Bir TestFlight satırındaki soru işaretine dokunmak nedenini söyler ve nedeni eksik izinse aynı düğmeyi sunar. Kararlı bir CotEditor da adının yanında aynı işi gören küçük bir kilit taşır.

## Uygulama Yönetimi — herhangi bir şeyi yüklemek için zorunlu

`/Applications` içinde başka bir yükleyicinin koyduğu bir uygulamayı değiştirmek buna bağlıdır ve macOS bunu önceden istemek için bir API sunmaz; bu yüzden ilk yükleme sistem uyarısını tetikler. Reddederseniz saptama yine çalışır; yüklemeler başarısız olur ve DuoUpdater sizin için ilgili ayarı açar.

## Bildirimler — tamamen isteğe bağlı

Başlangıçta istenir, yalnızca güncelleme bulunduğunu size bildirmek ve Dock işareti sayısı için. Dikkat: işaret yalnızca uyarılar değil, özellikle **İşaretler** anahtarını ister — İşaretler kapalıyken, uyarılar görünse bile sayı sessizce gösterilmez.

## Arka plan yardımcısı — App Store güncellemeleri için

App Store güncellemeleri, macOS'in bir kez onaylamanızı istediği **Oturum Açma Öğeleri ve Genişletmeler** altındaki bir arka plan öğesi üzerinden çalışır. Bu olmadan App Store güncellemeleri başarısız olur ve DuoUpdater size nerede açacağınızı söyler.

## Erişilebilirlik — varsayılan olarak gerekmez

Ayarlar'da App Store yüklemelerini GUI yoluna geçirirseniz ve bir paket güncellemesinden sonra Yükleyici'nin penceresini kapatmak için kullanılır; bu izin olmadan pencere kapatmanız için açık kalır. Varsayılan App Store yolu tam bir indirme kullanır ve fazladan hiçbir şey istemez.

## Otomasyon — hiç istenmez

Bir uygulamayı güncelledikten sonra kapatıp yeniden açmak bunu sormaz.
