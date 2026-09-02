import type { VisualSchema } from '../types/visual-editor'

type Field = [string, string]
const schema = (name: string, visualKey: string, fields: Field[]): VisualSchema => ({
  name,
  visualKey,
  schemas: fields.map(([label, propName]) => ({ label, propName })),
})

// 每项都是管理端可编辑的业务内容字段；颜色、尺寸、间距等展示配置不进入数据源。
export const schemaCatalog: VisualSchema[] = [
  schema('音频', 'VisualAudio', [
    ['音频地址', 'src'],
    ['标题', 'title'],
  ]),
  schema('按钮', 'VisualButton', [
    ['按钮文案', 'text'],
    ['跳转链接', 'link'],
  ]),
  schema('轮播图', 'VisualCarousel', [
    ['图片地址', 'image'],
    ['图片标题', 'title'],
  ]),
  schema('评论列表', 'VisualComment', [
    ['头像', 'avatar'],
    ['昵称', 'nickname'],
    ['评论内容', 'content'],
    ['时间', 'time'],
    ['评分', 'rating'],
  ]),
  schema('倒计时', 'VisualCountDown', [
    ['前置标题', 'title'],
    ['结束时间', 'endTime'],
    ['左侧图片', 'image'],
  ]),
  schema('领券', 'VisualCoupon', [
    ['面额', 'amountText'],
    ['门槛说明', 'conditionText'],
    ['券名称', 'titleText'],
    ['按钮文案', 'btnText'],
    ['角标文案', 'badgeText'],
  ]),
  schema('在线咨询', 'VisualCustomerService', [
    ['入口文案', 'text'],
    ['电话号码', 'phone'],
    ['跳转链接', 'link'],
  ]),
  schema('事件容器', 'VisualEventContainer', [
    ['链接地址', 'actionUrl'],
    ['提示内容', 'actionText'],
  ]),
  schema('限时秒杀', 'VisualFlashSale', [
    ['标题', 'title'],
    ['结束时间', 'endTime'],
    ['秒杀价', 'price'],
    ['原价', 'originPrice'],
    ['已抢数量', 'soldNum'],
    ['总数', 'totalNum'],
    ['按钮文案', 'buttonText'],
    ['跳转链接', 'buyLink'],
  ]),
  schema('弹性布局', 'VisualFlex', []),
  schema('悬浮按钮', 'VisualFloatAction', [
    ['电话号码', 'phone'],
    ['跳转链接', 'link'],
  ]),
  schema('表单', 'VisualForm', [
    ['提交按钮文案', 'submitText'],
    ['提交链接', 'submitLink'],
  ]),
  schema('宫格', 'VisualGrid', [
    ['图标名称', 'icon'],
    ['文字', 'text'],
  ]),
  schema('图文卡片', 'VisualImageTextCard', [
    ['作者头像', 'authorAvatar'],
    ['作者名称', 'authorName'],
    ['封面图片', 'cover'],
    ['发布时间', 'publishTime'],
    ['文章标题', 'title'],
  ]),
  schema('图文列表', 'VisualImageTextList', [
    ['作者头像', 'authorAvatar'],
    ['作者名称', 'authorName'],
    ['封面图片', 'cover'],
    ['发布时间', 'publishTime'],
    ['文章标题', 'title'],
  ]),
  schema('图片', 'VisualImage', [['图片地址', 'src']]),
  schema('地图', 'VisualMap', [
    ['标题', 'title'],
    ['纬度', 'latitude'],
    ['经度', 'longitude'],
  ]),
  schema('公告栏', 'VisualNoticeBar', [['公告内容', 'text']]),
  schema('对象', 'VisualObject', []),
  schema('对象数组', 'VisualObjectArray', []),
  schema('图片列表', 'VisualPictureWrap', [
    ['标题', 'title'],
    ['图片地址', 'image'],
  ]),
  schema('弹窗', 'VisualPopup', [
    ['背景图', 'bgImage'],
    ['标题', 'title'],
    ['描述', 'description'],
    ['按钮文案', 'buttonText'],
    ['按钮链接', 'buttonLink'],
  ]),
  schema('海报', 'VisualPoster', [
    ['背景图', 'bgImage'],
    ['标题', 'title'],
    ['副标题', 'subtitle'],
    ['底部文案', 'footerText'],
    ['二维码内容', 'qrContent'],
    ['按钮文案', 'buttonText'],
    ['跳转链接', 'shareLink'],
  ]),
  schema('商品卡片', 'VisualProductCard', [
    ['商品图', 'cover'],
    ['商品标题', 'title'],
    ['售价', 'price'],
    ['原价', 'originPrice'],
    ['商品角标', 'tag'],
    ['按钮文案', 'buttonText'],
    ['商品链接', 'buyLink'],
  ]),
  schema('商品卡片列表', 'VisualProductCardList', [
    ['商品封面', 'cover'],
    ['商品标题', 'title'],
    ['售价', 'price'],
    ['原价', 'originPrice'],
    ['商品角标', 'tag'],
    ['商品链接', 'buyLink'],
  ]),
  schema('商品列表', 'VisualProductList', [
    ['商品封面', 'cover'],
    ['商品标题', 'title'],
    ['售价', 'price'],
    ['原价', 'originPrice'],
    ['商品角标', 'tag'],
    ['商品链接', 'buyLink'],
  ]),
  schema('二维码', 'VisualQrcode', [['内容', 'content']]),
  schema('评分', 'VisualRating', [
    ['星星数量', 'max'],
    ['默认评分', 'value'],
  ]),
  schema('富文本', 'VisualRichText', [['HTML 内容', 'html']]),
  schema('搜索', 'VisualSearch', [
    ['占位文本', 'placeholder'],
    ['按钮文案', 'buttonText'],
    ['跳转链接', 'confirmLink'],
  ]),
  schema('标题栏', 'VisualSection', [
    ['标题', 'title'],
    ['描述信息', 'description'],
  ]),
  schema('统计卡片', 'VisualStatCard', [
    ['标题', 'title'],
    ['数值', 'value'],
    ['环比说明', 'delta'],
  ]),
  schema('页签', 'VisualTabs', [['页签名称', 'label']]),
  schema('文本', 'VisualText', [['文本', 'text']]),
  schema('时间轴', 'VisualTimeline', [
    ['标题', 'title'],
    ['时间', 'time'],
    ['内容', 'content'],
    ['状态', 'status'],
  ]),
  schema('视频', 'VisualVideo', [
    ['标题', 'title'],
    ['视频地址', 'src'],
  ]),
]
