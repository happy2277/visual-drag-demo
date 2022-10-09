import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import compose from './compose'
import contextmenu from './contextmenu'
import copy from './copy'
import event from './event'
import layer from './layer'
import snapshot from './snapshot'
import lock from './lock'
import toast from '@/utils/toast'
import { unique } from '@/utils/utils'

Vue.use(Vuex)



const data = {
    state: {
        ...compose.state,
        ...contextmenu.state,
        ...copy.state,
        ...event.state,
        ...layer.state,
        ...snapshot.state,
        ...lock.state,

        editMode: 'edit', // 编辑器模式 edit preview
        canvasStyleData: { // 页面全局数据
            name: 'cont_par',
            width: 800,
            height: 1280,
            scale: 100,
            // color: 'rgba(0, 0, 0, 1)',
            backgroundColor: 'rgba(255, 255, 255, 1)',
            fontSize: 14,
            borderWidth: 0,
            borderRadius: 0,
            opacity: 1,
            rotate: 0
        },
        isInEdiotr: false, // 是否在编辑器中，用于判断复制、粘贴组件时是否生效，如果在编辑器外，则无视这些操作
        componentData: [], // 画布组件数据
        componentTempData: [], // 模板数据
        curComponent: null,
        curComponentIndex: null,
        // 点击画布时是否点中组件，主要用于取消选中组件用。
        // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
        isClickComponent: false,
        componentParents: [], // 父级数据
        isNeedCalcOffset: true // 是否需要计算偏移值
    },
    mutations: {
        ...compose.mutations,
        ...contextmenu.mutations,
        ...copy.mutations,
        ...event.mutations,
        ...layer.mutations,
        ...snapshot.mutations,
        ...lock.mutations,

        setClickComponentStatus (state, status) {
            state.isClickComponent = status
        },

        setEditMode (state, mode) {
            state.editMode = mode
        },

        setInEditorStatus (state, status) {
            state.isInEdiotr = status
        },

        setCanvasStyle (state, style) {
            state.canvasStyleData = style
        },

        setComponentTempData (state, componentTempData = []) {
            state.componentTempData = componentTempData
        },

        setCurComponent (state, { component, index }) {
            state.curComponent = component
            state.curComponentIndex = index
            state.componentParents = []
            state.componentData.length && state.componentData.forEach(v => {
                if (component?.id != v.id && v.style.parent != component?.id && v.style.name) {
                    state.componentParents.push({
                        label: v.style.name,
                        value: v.style.name
                    })
                }
            })
            // state.componentParents = unique(state.componentParents, 'value')
        },

        setShapeStyle ({ curComponent }, { top, left, width, height, rotate, xOffset, yOffset }) {
            if (top) curComponent.style.top = Math.round(top)
            if (left) curComponent.style.left = Math.round(left)
            if (width) curComponent.style.width = Math.round(width)
            if (height) curComponent.style.height = Math.round(height)
            if (rotate) curComponent.style.rotate = Math.round(rotate)
            if (xOffset) curComponent.style.xOffset = Math.round(xOffset)
            if (yOffset) curComponent.style.yOffset = Math.round(yOffset)
        },

        setShapeSingleStyle ({ curComponent }, { key, value }) {
            curComponent.style[key] = value
        },

        setComponentData (state, componentData = []) {
            Vue.set(state, 'componentData', componentData)
        },

        addComponent (state, { component, index }) {
            if (index !== undefined) {
                state.componentData.splice(index, 0, component)
            } else {
                state.componentData.push(component)
            }
            state.componentParents = []
            state.componentData.length && state.componentData.forEach(v => {
                if (component?.id != v.id && v.style.name) {
                    state.componentParents.push({
                        label: v.style.name,
                        value: v.style.name
                    })
                }
            })
            // state.componentParents = unique(state.componentParents, 'value')
        },

        // setComponentParents (state, component) {
        //     state.componentParents.push({
        //         label: component.name,
        //         value: component.name
        //     })
        // },

        deleteComponent (state, index) {
            if (index === undefined) {
                index = state.curComponentIndex
            }

            if (index == state.curComponentIndex) {
                state.curComponentIndex = null
                state.curComponent = null
            }

            if (/\d/.test(index)) {
                state.componentData.splice(index, 1)
            }
        },

        setIsNeedCalcOffset (state, isNeedCalcOffset) {
            state.isNeedCalcOffset = isNeedCalcOffset
        }
    },
}

export default new Vuex.Store(data)
