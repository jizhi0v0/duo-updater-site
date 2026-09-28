<!-- title: duo 指令 | summary: 同一套引擎化身為命令列工具，以及它拒絕半途而廢的兩件事。 | order: 5 -->

同一套引擎，也有一個命令列版本。`duo` 連結的是真正的 `DuoUpdaterCore`，所以它用的更新來源與順序、安裝政策，以及忽略與略過規則，都和選單列版本完全一樣——兩者之間如果出現分歧，那是 bug，不是各有各的看法。

```sh
make cli          # → 產生 ~/.local/libexec/duo，並在 ~/.local/bin/duo 建立符號連結

duo list                     # 列出已安裝的項目，不會連上網路
duo check --json             # 列出有更新的項目，每行一個 JSON 物件
duo install Cursor           # 套用單一更新，或加上 --all
duo doctor                   # 檢查這台機器實際上能不能安裝東西
duo backups                  # 列出還原點，或把某一個還原回去
```

`duo check` 和 `duo list` 也接受 `--source sparkle,github,…` 和 `--include-hidden`。`duo ignore` 和 `duo skip` 寫入的，是和 App 讀取的同一份偏好設定，所以在其中一邊隱藏某個項目，另一邊也會跟著隱藏。

## 它寧可拒絕、也不做到一半的兩件事

**App Store 更新。** 這條路線需要具權限的輔助程式——它的 `SMAppService` 註冊需要一個 App 套件——或是靠輔助使用 API 操作 App Store.app。命令列工具兩者都沒有，所以它會直接說明，而不是半途失敗。

**強行取得安裝鎖。** 如果選單列版的 App 正在進行安裝，`duo` 會結束並說出目前持有安裝鎖的是誰，而不是從它手上硬把套件換掉。

## 維護面向

`duo verify`、`duo triage` 和 `duo reconcile` 會針對每一條手寫規則，對照它的即時端點逐一檢查，向模型詢問某條失效的規則為什麼會失效，再把結果轉成議題（issue）。這就是夜間檢查在做的事。一般使用並不需要用到它們。
