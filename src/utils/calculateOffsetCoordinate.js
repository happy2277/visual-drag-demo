import { $ } from './utils'
import store from '@/store'

export default function calculateOffsetCoordinate (curComponent, isNeedCalcOffset) {
    if (!isNeedCalcOffset) return
    // 获取根容器信息 
    let rectInfo
    const componentData = store.state.componentData
    const parentRectInfo = $('#editor').getBoundingClientRect()
    let baseComponentData // 对齐组件
    let { left, top, width, height, objAlign, base } = curComponent.style
    // 存在对齐组件
    if (base && base != 'bg_scr') {
        // 如果对齐组件为根容器
        componentData.forEach(v => {
            if (v.style.name == base) {
                rectInfo = $(`#component${v.id}`).getBoundingClientRect()
                baseComponentData = v.style
            }
        })
    } else {
        // 否则 对齐根容器
        rectInfo = parentRectInfo
    }
    // 获取基准点
    const curX = Number(left) // 当前组件left
    const curY = Number(top) // 当前组件top
    let calcPoint = { x: 0, y: 0 } // 计算坐标点

    let xCenter, // x中心
        xInRight, // y内右
        yCenter, // y中心
        yBottom, // y下
        yOutBottom, // y外下
        yOutTop, // y外上
        xOutRight, // x外右
        xOutLeft, // x外左
        xStart, // x起始
        yStart, // y起始
        baseLeft, // 对齐组件left
        baseTop, // 对齐组件top
        baseWidth, // 对齐组件width
        baseHeight // 对齐组件height
    if (base && base != 'bg_scr') {
        baseLeft = baseComponentData.left
        baseTop = baseComponentData.top
        baseWidth = baseComponentData.width
        baseHeight = baseComponentData.height

        yOutBottom = baseTop + baseHeight
        xOutRight = baseLeft + baseWidth
        xCenter = baseLeft + baseWidth / 2 - width / 2
        yCenter = baseTop + baseHeight / 2 - height / 2
        xInRight = xOutRight - width
        yBottom = yOutBottom - height
        yOutTop = baseTop - height
        xOutLeft = baseLeft - width
        xStart = baseLeft
        yStart = baseTop
    } else {
        yOutBottom = rectInfo.height
        xOutRight = rectInfo.width
        xCenter = xOutRight / 2 - width / 2
        yCenter = yOutBottom / 2 - height / 2
        xInRight = xOutRight - width
        yBottom = yOutBottom - height
        yOutTop = -height
        xOutLeft = -width
        xStart = 0
        yStart = 0
    }


    switch (objAlign) {
        case 0:
            calcPoint = { x: xCenter, y: yCenter }
            break;
        case 1:
            calcPoint = { x: xStart, y: yStart }
            break;
        case 2:
            calcPoint = { x: xCenter, y: yStart }
            break;
        case 3:
            calcPoint = { x: xInRight, y: yStart }
            break;
        case 4:
            calcPoint = { x: xStart, y: yBottom }
            break;
        case 5:
            calcPoint = { x: xCenter, y: yBottom }
            break;
        case 6:
            calcPoint = { x: xInRight, y: yBottom }
            break;
        case 7:
            calcPoint = { x: xStart, y: yCenter }
            break;
        case 8:
            calcPoint = { x: xInRight, y: yCenter }
            break;
        case 9:
            calcPoint = { x: xStart, y: yOutTop }
            break;
        case 10:
            calcPoint = { x: xCenter, y: yOutTop }
            break;
        case 11:
            calcPoint = { x: xOutRight, y: yOutTop }
            break;
        case 12:
            calcPoint = { x: xStart, y: yOutBottom }
            break;
        case 13:
            calcPoint = { x: xCenter, y: yOutBottom }
            break;
        case 14:
            calcPoint = { x: xOutRight, y: yOutBottom }
            break;
        case 15:
            calcPoint = { x: xOutLeft, y: yStart }
            break;
        case 16:
            calcPoint = { x: xOutLeft, y: yCenter }
            break;
        case 17:
            calcPoint = { x: xOutLeft, y: yOutBottom }
            break;
        case 18:
            calcPoint = { x: xOutRight, y: yStart }
            break;
        case 19:
            calcPoint = { x: xOutRight, y: yCenter }
            break;
        case 20:
            calcPoint = { x: xOutRight, y: yBottom }
            break;
        default:
            break;
    }

    curComponent.style.xOffset = Math.round(curX - calcPoint.x)
    curComponent.style.yOffset = Math.round(curY - calcPoint.y)
}
