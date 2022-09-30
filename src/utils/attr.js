import { exp } from "mathjs"
export const baseStyleData = [
    { key: 'parent', label: '上级控件' },
    { key: 'name', label: '控件名称（唯一）' },
    { key: 'base', label: '对齐控件' },
    { key: 'objAlign', label: '控件对齐方式' },
    { key: 'left', label: 'x 坐标' },
    { key: 'top', label: 'y 坐标' },
    { key: 'xOffset', label: '偏移横坐标' },
    { key: 'yOffset', label: '偏移纵坐标' },
]

export const styleData = [
    { key: 'str', label: '内容' },
    { key: 'numStr', label: '内容' },
    { key: 'url', label: '图片' },
    { key: 'width', label: '宽' },
    { key: 'height', label: '高' },
    { key: 'color', label: '颜色' },
    { key: 'backgroundColor', label: '背景色' },
    { key: 'borderWidth', label: '边框宽度' },
    // { key: 'borderStyle', label: '边框风格' },
    { key: 'borderColor', label: '边框颜色' },
    { key: 'borderRadius', label: '边框半径' },
    // { key: 'font', label: '字体库路径' },
    { key: 'fontSize', label: '字体大小' },
    { key: 'fontWeight', label: '字体粗细' },
    // { key: 'lineHeight', label: '行高' },
    // { key: 'letterSpacing', label: '字间距' },
    { key: 'textAlign', label: '左右对齐' },
    // { key: 'longMode', label: '长文本模式' },
    { key: 'verticalAlign', label: '上下对齐' },
    { key: 'rotate', label: '旋转角度' },
    { key: 'opacity', label: '不透明度' },
    { key: 'percentage', label: '进度值' },
    { key: 'display', label: '是否隐藏' }
]

export const styleMap = {
    str: '内容',
    numStr: '内容',
    url: '图片',
    width: '宽',
    height: '高',
    color: '颜色',
    backgroundColor: '背景色',
    borderWidth: '边框宽度',
    // borderStyle: '边框风格',
    borderColor: '边框颜色',
    borderRadius: '边框半径',
    // font: '字体库路径',
    fontSize: '字体大小',
    fontWeight: '字体粗细',
    // lineHeight: '行高',
    // letterSpacing: '字间距',
    textAlign: '左右对齐',
    // longMode: '长文本模式',
    verticalAlign: '上下对齐',
    rotate: '旋转角度',
    opacity: '不透明度',
    percentage: '进度值',
    display: '是否隐藏'
}

export const textAlignOptions = [
    {
        label: 'LV_LABEL_ALIGN_LEFT',
        value: 'left',
    },
    {
        label: 'LV_LABEL_ALIGN_CENTER',
        value: 'center',
    },
    {
        label: 'LV_LABEL_ALIGN_RIGHT',
        value: 'right',
    },
    {
        label: 'LV_LABEL_ALIGN_AUTO',
        value: 'auto',
    },
]

export const borderStyleOptions = [
    {
        label: '实线',
        value: 'solid',
    },
    {
        label: '虚线',
        value: 'dashed',
    },
]

export const verticalAlignOptions = [
    {
        label: '上对齐',
        value: 'top',
    },
    {
        label: '居中对齐',
        value: 'middle',
    },
    {
        label: '下对齐',
        value: 'bottom',
    },
]

// 控件对齐方式
export const controlAlignmentOptions = [
    { label: 'LV_ALIGN_CENTER', value: 0 },    //中对齐
    { label: 'LV_ALIGN_IN_TOP_LEFT', value: 1 },  //内部上左
    { label: 'LV_ALIGN_IN_TOP_MID', value: 2 },  //内部上中
    { label: 'LV_ALIGN_IN_TOP_RIGHT', value: 3 },  //内部上右
    { label: 'LV_ALIGN_IN_BOTTOM_LEFT', value: 4 },  //内部下左
    { label: 'LV_ALIGN_IN_BOTTOM_MID', value: 5 },  //内部下中
    { label: 'LV_ALIGN_IN_BOTTOM_RIGHT', value: 6 },  //内部下右
    { label: 'LV_ALIGN_IN_LEFT_MID', value: 7 },  //内部左中
    { label: 'LV_ALIGN_IN_RIGHT_MID', value: 8 },  //内部右中
    { label: 'LV_ALIGN_OUT_TOP_LEFT', value: 9 },  //外部上左
    { label: 'LV_ALIGN_OUT_TOP_MID', value: 10 }, //外部上中
    { label: 'LV_ALIGN_OUT_TOP_RIGHT', value: 11 }, //外部上右
    { label: 'LV_ALIGN_OUT_BOTTOM_LEFT', value: 12 }, //外部下左
    { label: 'LV_ALIGN_OUT_BOTTOM_MID', value: 13 }, //外部下中
    { label: 'LV_ALIGN_OUT_BOTTOM_RIGHT', value: 14 }, //外部下右
    { label: 'LV_ALIGN_OUT_LEFT_TOP', value: 15 }, //外部左上
    { label: 'LV_ALIGN_OUT_LEFT_MID', value: 16 }, //外部左中
    { label: 'LV_ALIGN_OUT_LEFT_BOTTOM', value: 17 }, //外部左下
    { label: 'LV_ALIGN_OUT_RIGHT_TOP', value: 18 }, //外部右上
    { label: 'LV_ALIGN_OUT_RIGHT_MID', value: 19 }, //外部右中
    { label: 'LV_ALIGN_OUT_RIGHT_BOTTOM', value: 20 }, //外部右下
]

// 长文本模式
export const longModeOptions = [
    { label: 'LV_LABEL_LONG_EXPAND', value: 0 }, // 将对象大小扩展到文本大小
    { label: 'LV_LABEL_LONG_BREAK', value: 1 }, //保持对象宽度，打断过长的线条并展开对象高度
    { label: 'LV_LABEL_LONG_DOT', value: 2 }, //保留大小，如果文本太长，则在末尾写点 
    { label: 'LV_LABEL_LONG_SROLL', value: 3 }, // 左右滚动文本
    { label: 'LV_LABEL_LONG_SROLL_CIRC', value: 4 }, // 保持大小并循环滚动文本
    { label: 'LV_LABEL_LONG_CROP', value: 5 }, //保留大小并裁剪文本
]

export const rotateOptions = [
    { label: '0', value: 0 },
    { label: '90', value: 90 },
    { label: '180', value: 180 },
    { label: '270', value: 270 },
]

export const selectKey = ['textAlign', 'borderStyle', 'verticalAlign', 'parent', 'base', 'objAlign', 'longMode', 'rotate']

export const optionMap = {
    textAlign: textAlignOptions,
    borderStyle: borderStyleOptions,
    verticalAlign: verticalAlignOptions,
    objAlign: controlAlignmentOptions,
    longMode: longModeOptions,
    rotate: rotateOptions
}
