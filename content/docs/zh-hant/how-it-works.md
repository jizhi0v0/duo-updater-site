<!-- title: 運作方式 | summary: 每個版本號從哪裡來，以及為什麼每個 App 走的安裝管道不一樣。 | order: 1 -->

DuoUpdater 會掃描 `/Applications`、`/Applications/Utilities` 和 `~/Applications`，然後依優先順序，拿掃到的結果去比對幾種更新來源。第一個能辨識某個 App 的來源就會為它作答，其餘來源不會再被詢問。

1. **Mac App Store** — Apple 的 iTunes lookup API，具備商店與地區判斷能力。只信任原生的 `mac-software` 結果；iOS 版 App 在 Mac 上執行的那種會被跳過，因為它們的版本號各走各的，否則會被誤判為永遠裝不上的更新。
2. **Xcode Releases** — 不是從 App Store 來的 Xcode 建置：每一個 Beta 版與候選版（RC），都會比對到你實際安裝的那個通道。從 App Store 安裝的 Xcode 已經在上一項處理過了。
3. **Homebrew Cask** — 依 `.app` 檔名比對，找不到時退而求其次比對 bundle ID，所以安裝的是 `pkg` 而非 App 套件的 cask 也找得到。它只為 Homebrew 自己安裝、且持續維護更新的 App 作答（標成 `auto_updates` 的 cask 不算），因此更新之後 Homebrew 的紀錄仍保持最新，`brew upgrade` 不會把同一個版本再裝一次。
4. **Sparkle** — App 自己的 `SUFeedURL` appcast，和 App 內建更新程式讀的是同一份 feed。
5. **GitHub Releases** — 針對用這種方式發行的 App，做能分辨通道的比對。除非某條 App 專屬規則已經指名並核實過一個可安裝的 Mac 資產，否則只做偵測，不提供安裝。
6. **Alcove** — 它需要驗證身分的更新端點，且僅限你已輸入授權的情況。沒有授權時，這個來源完全不存在，Alcove 會落到下面的公開廠商探測。
7. **廠商探測** — 針對廠商自家端點手寫的規則，涵蓋所有既不發布 feed、也沒有商店頁面的 App。

## 兩種完全跳過這份清單的 App

由 **JetBrains Toolbox** 管理的 App，以及從 **TestFlight** 安裝的 App，會在上述七項都還沒被詢問之前就先得到答案。這些 App 的更新分別由 Toolbox 和 TestFlight 負責，沒有值得再問一次的第二意見，所以這份清單完全不會為它們執行。

## 它會依每個 App 預期的方式來更新它

大多數更新工具只挑一種機制，再把所有 App 都套進去。這一套用的是 App 自己已經具備的機制，所以按鈕實際會做的事，因每一列而異：

| 管道 | 按下「更新」之後會發生什麼事 |
| --- | --- |
| Sparkle | 下載、執行下方的檢查、置換 App 套件——接著結束並重新開啟 App，除非你已經關閉這個選項 |
| Mac App Store | 透過商店做完整下載。若無法這麼做——背景輔助程式尚未核准，或 App 被鎖在另一個地區——該列會改為交給 App Store App 處理 |
| 自行更新（Electron、Squirrel） | 打開 App，讓它自己的更新程式處理 |
| Homebrew App cask | `brew install --cask --force` |
| Homebrew `pkg` cask | 下載官方安裝套件，並開啟系統安裝程式 |

當 App 附帶自己的更新程式時，DuoUpdater 會交棒，而不是跟它搶。遇到無法安全完成的情況，那一列會直接說明，而不是用猜的。

## 命令列工具與字型

清單最底部有一整列，涵蓋 Homebrew 安裝、但**不是 App** 的一切：命令列 formula，以及不會安裝任何 `.app` 的 cask——CLI 工具、字型、驅動程式。這些都不需要逐一決定，也沒有套件可以掃描，所以若沒有這一列，它們就會完全不可見。

會安裝 App 的 cask，會照常得到獨立的一列，且不會被這最底部一列的更新動作碰到，所以不會重複計算。
