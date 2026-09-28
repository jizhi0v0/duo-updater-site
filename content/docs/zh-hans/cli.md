<!-- title: duo 命令 | summary: 同一个引擎做成的命令行工具，以及它宁可拒绝、也不肯只做一半的两件事。 | order: 5 -->

同一个引擎也提供了命令行形式。`duo` 链接的是真正的 `DuoUpdaterCore`，所以它使用和菜单栏应用相同顺序的相同源、相同的安装策略，以及相同的忽略与跳过规则——两者之间如果结果不一致，那是个 bug，不是看法不同。

```sh
make cli          # → 生成 ~/.local/libexec/duo，并在 ~/.local/bin/duo 建立符号链接

duo list                     # 列出已安装的内容，不联网
duo check --json             # 列出有更新的内容，每行一个 JSON 对象
duo install Cursor           # 安装其中一个，或用 --all 安装全部
duo doctor                   # 检查这台机器目前到底能不能安装
duo backups                  # 列出回滚点，或恢复其中一个
```

`duo check` 和 `duo list` 也支持 `--source sparkle,github,…` 和 `--include-hidden` 参数。`duo ignore` 和 `duo skip` 写入的偏好设置和应用读取的是同一份，所以在其中一个里隐藏了什么，在另一个里也会被隐藏。

## 它宁可拒绝、也不肯只做一半的两件事

**App Store 更新。** 这条路线要么需要特权助理——它的 `SMAppService` 注册需要一个应用包——要么需要通过辅助功能 API 驱动 App Store.app。命令行工具两者都不具备，所以它会直接说明这一点，而不是做到一半才失败。

**强行获取安装锁。** 如果菜单栏应用正在安装中，`duo` 会退出并说明锁被谁占用着，而不会趁它安装到一半时把应用包换掉。

## 维护相关的部分

`duo verify`、`duo triage` 和 `duo reconcile` 会把每一条手写的 recipe 拿去对照厂商真实的接口逐一核实，让一个模型分析出错的 recipe 为什么出错，并把结果转成 issue。夜间检查跑的就是这几个命令。日常使用不需要它们。
