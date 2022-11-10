import { $ } from './utils'
import { mod360 } from './translate'
import calculateOffsetCoordinate from './calculateOffsetCoordinate'

// 将组合中的各个子组件拆分出来，并计算它们新的 style
export default function decomposeComponent (component, editorRect, parentStyle, isSetEmptyGroupStyle) {
    const componentRect = $(`#editor #component${component.id}`).getBoundingClientRect()
    // 获取元素的中心点坐标
    const center = {
        x: componentRect.left - editorRect.left + componentRect.width / 2,
        y: componentRect.top - editorRect.top + componentRect.height / 2,
    }

    component.style.rotate = mod360(component.style.rotate + parentStyle.rotate)
    component.style.width = Math.round(parseFloat(component.groupStyle.width) / 100 * parentStyle.width)
    component.style.height = Math.round(parseFloat(component.groupStyle.height) / 100 * parentStyle.height)
    // 计算出元素新的 top left 坐标
    component.style.left = Math.round(center.x - component.style.width / 2)
    component.style.top = Math.round(center.y - component.style.height / 2)
    // if (!isSetEmptyGroupStyle) {
    // component.groupStyle = {}
    // }

    calculateOffsetCoordinate(component, true)
}