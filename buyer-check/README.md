# 买前看：本地功能验证

这是本地开发版本，围绕用户手动粘贴的商品描述、卖家回复和实机记录进行基于规则的提取与对照。仅识别部分明确写出的字段，所有结果需用户复核；不调用模型、不读取闲鱼、不分析图片，不提供实机鉴定、账号或付款。输入仅保留在当前页面内存，刷新即消失。

2026-11-06：手机销售地区为选填、待核实。安卓仅记录国行；iPhone 可选国行、港版、台版、美版、日版、欧版，欧版需另确认具体销售国家。选择是用户输入，不等于自动鉴定。型号与系统按中国大陆适用范围整理；部分通用操作仍参考其他地区厂商文档，并标明国行适用性待核实。美版、日版的 eSIM 提示按具体机型及官方资料限定，需结合运营商核实。

第一步支持设备类型、品牌与型号的搜索建议和手动输入，也可点击“确认并识别”从商品描述中匹配并填入可识别的信息。识别使用本地文字规则，存在漏识别和误识别，必须自行确认；不会读取链接。目录是人工整理的初始常用建议，不是全量型号数据库或规格认证；来源和未逐项核实的范围见 `型号目录来源.md`。核对清单按设备大类区分，尚未做到每一个具体型号的专属专业检查。

2026-11-05 扩展了部分风险表达，包括电池鼓包、进水、运营商锁、分期或租赁未结清、站外转账、未知部件和屏幕异常。提示仅指出原文线索，不判断真假或交易是否合法；仅能识别规则覆盖的表达。相关参考：[Apple 二手 iPhone 检查](https://support.apple.com/zh-cn/104999)、[运营商锁](https://support.apple.com/zh-cn/109316)、[部件与维修历史](https://support.apple.com/zh-cn/102658)、[iPhone 安全信息](https://support.apple.com/zh-cn/guide/iphone/iph301fc905/27/ios/27)、[张家港警方交易提示](https://www.zjg.gov.cn/zjgszwz/yjxx/202403/d71d0a7ddd164dccaa91b2f258ccd8fe.shtml)。

验机清单按设备类型区分，具体操作按需展开；手机、电脑、相机和镜头补充了检查步骤，其余设备保留适用的基础提示。电池损伤线索存在时暂停展示展开操作，避免提示通电测试。步骤参考 [Apple Mac 电池循环](https://support.apple.com/zh-cn/102888)、[Sony 相机与镜头清洁注意事项](https://www.sony.com/zh-cn/electronics/support/e-mount-body-ilce-7-series/ilce-7rm3/articles/00027109)及上述 iPhone 资料；非 Apple 设备的系统菜单和可查项目须以具体品牌和型号为准。

品牌步骤覆盖苹果、华为的手机和电脑，入口按已填写的设备类型、品牌和已识别的型号选择；型号与品牌或类型明显不符时回退通用步骤。iPhone 14 及更早款与 15 及更新款的电池路径不同；华为电脑区分 Windows 与部分鸿蒙机型。官方依据：[Apple iPhone 电池](https://support.apple.com/zh-cn/guide/iphone/iphd453d043a/27/ios/27)、[Apple Mac 部件与维修](https://support.apple.com/zh-cn/123123)、[华为手机电池最大容量](https://consumer.huawei.com/cn/support/content/zh-cn15817608/)、[华为服务记录](https://consumer.huawei.com/cn/support/content/zh-cn15887303/)、[华为 Windows 笔记本电池报告](https://consumer.huawei.com/cn/support/content/zh-cn00698549/)、[华为鸿蒙电脑电池信息（部分机型）](https://consumer.huawei.com/cn/support/matebook-pro-s-care/)以及各步骤中的官方来源链接。未查询真实设备或授权记录；当前信息依官方公开说明，使用时仍需按地区、系统、型号和实际菜单复核。

## 运行

环境 Node 22；项目固定 `pnpm@10.28.2`。在此目录执行：

```sh
npx -y pnpm@10.28.2 install
npx -y pnpm@10.28.2 dev --port 3187 --strictPort
```

打开 `http://127.0.0.1:3187/`。服务只监听本机；端口已占用时可去掉端口参数，由 Vite 选择并查看实际地址。

```sh
npx -y pnpm@10.28.2 test
npx -y pnpm@10.28.2 build
```

功能和产品边界见上一级 `二手购买助手_Demo与MVP_PRD_v0.2.md`。闲鱼研究见本目录 `闲鱼链接读取研究.md`。

## 验证和限制

- 核对对象范围：手工粘贴的文本；未实现任意商品链接读取或截图 OCR。
- 规则有限：自然语言、完整型号、GPU、拆机事实、照片和保修真实性均不能保证识别。未知和不完整不能视为无风险。
- 会话保存在当前页面内存，刷新/关闭后消失；没有账号、跨设备恢复或云存储。不要输入密码、验证码及不必要的个人信息。
- 本地网站、模拟手机视口、自动化测试均不等于真实客户、真机、平台、正式支付或生产环境验收。

网站 SOP：DS-002B V2.5，文件 SHA-256 `5b70133e7a155a713c130d07d883afffbd1f57eaa7bfc7c2e2c3dfc9f9bb926a`，mtime 2026-08-09 16:00:52 +0800。此版本仅为本地功能验证，无部署、正式支付、真实用户数据权限。
