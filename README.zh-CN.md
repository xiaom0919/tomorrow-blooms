# 明天会开花

睡前把愿望折成纸船，随机漂给另一位用户。对方写下建议，次日清晨撕下挂历，让愿望开花并读到回信。

## 本地运行

需要 Node.js 22.13 或更高版本。安装依赖后运行 `npm run dev`，打开终端输出的本地地址。

数据库使用 Cloudflare D1。本项目已经生成 `drizzle/0000_far_ogun.sql`。首次启动先运行 `npm run build`，然后：

```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_far_ogun.sql
```

## 三分钟演示

直接点击首页“先体验一夜花开”，可以体验许愿、漂流、接船回复、入睡和清晨开花。此演示单独运行并明确标注，不会伪造真实用户消息。

完整的真实数据库演示：

1. 页脚“本地演示工具”切到“窗前的甲”，写愿望并放船。
2. 切换“窗前的乙”，打开“来访的纸船”，写回信并浇水。
3. 切回甲，此时回信封存，不能提前读取。
4. 点击“我要睡了”，感受关灯场景，再返回池塘。
5. 在本地工具中让甲的清晨到来，撕下挂历，打开花与回信。
6. 送回感谢，在“我的花园”留下后记。

## 已实现规则

- 每人每晚一个愿望，凌晨许愿归入前一晚，按北京时间早上 6 点揭晓。
- 匿名随机匹配其他用户，排除本人和自己跳过的纸船；超时两小时重新漂流。
- 回复需要后台验证接船身份。信件必须在揭晓时间后撕页才能读取。
- 没收到回信也能开花；后续回信会保存在该朵花中。
- 感谢和愿望后记持久保存。用户身份使用 Sites 的 ChatGPT 登录。
- 本地身份切换和时间快进仅适用于 loopback 地址，不在线上启用。

## 验证

`node node_modules/typescript/bin/tsc --noEmit` 检查类型，`npm run build` 构建。`node scripts/test-pond.mjs` 对本地服务器运行真实双人流程测试；会创建本地甲乙测试数据。

访问范围由 Sites 分享设置控制。新网站默认私有，正式邀请其他用户需要在分享设置中授予访问权限。
