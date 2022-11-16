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
import eventBus from '@/utils/eventBus'
import decomposeComponent from '@/utils/decomposeComponent'

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
            name: 'bg_scr',
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
        curComponent: null, // 当前组件
        curComponentIndex: null, // 当前组件索引
        // 点击画布时是否点中组件，主要用于取消选中组件用。
        // 如果没点中组件，并且在画布空白处弹起鼠标，则取消当前组件的选中状态
        isClickComponent: false,
        componentParents: [], // 父级数据
        isNeedCalcOffset: true, // 是否需要计算偏移值
        childPageData: {
            childPage0: {
                data: [],
                rootData: {}
            },
            childPage1: {
                data: [],
                rootData: {}
            },
            childPage2: {
                data: [],
                rootData: {}
            },
            childPage3: {
                data: [],
                rootData: {}
            },
            childPage4: {
                data: [],
                rootData: {}
            },
        }, // 子页面数据
        priceControlStatusData: {
            priceStatus0: {
                data: [],
            },
            priceStatus1: {
                data: [],
            },
            priceStatus2: {
                data: [],
            },
            priceStatus3: {
                data: [],
            },
        }, // 价格控件状态数据
        priceStatusAndControlRelevancy: {
            priceStatusIndex: undefined,
            name: undefined
        }, // 价格控件状态与控件绑定
        childPageIndex: 'childPage0', // 子页面索引
        indexPageData: {
            data: [],
            rootData: {}
        }, // 初始页数据
        isSaveIndexPageData: true, // 是否保存到初始页数据属性
        whichGoodsNum: 0, // 第几个商品
        priceStatusIndex: { // 各价格状态 索引状态 true->存在价状  false->不存在价状
            index0: {
                isChange: false,
                changeIndex: 0
            },
            index1: {
                isChange: false,
                changeIndex: 0
            },
            index2: {
                isChange: false,
                changeIndex: 0
            },
            index3: {
                isChange: false,
                changeIndex: 0
            },
        }
    },
    mutations: {
        ...compose.mutations,
        ...contextmenu.mutations,
        ...copy.mutations,
        ...event.mutations,
        ...layer.mutations,
        ...snapshot.mutations,
        ...lock.mutations,

        setPriceStatusIndex (state, { index, isChange, changeIndex }) {
            if (index != undefined && isChange != this.undefined && changeIndex != undefined) {
                Vue.set(state.priceStatusIndex[`index${index}`], 'isChange', isChange)
                Vue.set(state.priceStatusIndex[`index${index}`], 'changeIndex', changeIndex)
            }

        },

        setIsSaveIndexPageData (state, isSaveIndexPageData) {
            state.isSaveIndexPageData = isSaveIndexPageData
        },

        setWhichGoodsNum (state, whichGoodsNum) {
            state.whichGoodsNum = whichGoodsNum
        },

        setPriceControlStatusData (state, { PriceControlStatusData, key }) {
            Vue.set(state.childPageData[key], 'data', PriceControlStatusData)
        },

        setIndexPageData (state, { data, rootData }) {
            state.indexPageData = {
                data,
                rootData
            }
        },

        setChildPageIndex (state, childPageIndex) {
            state.childPageIndex = childPageIndex
        },

        setPriceStatusAndControlRelevancy (state, priceStatusAndControlRelevancy) {
            state.priceStatusAndControlRelevancy = priceStatusAndControlRelevancy
        },

        setInitChildPageData (state, childPageDatas) {
            state.childPageData = childPageDatas
        },

        setChildPageData (state, { childPageData, rootData, key }) {
            if (childPageData != undefined && key) {
                Vue.set(state.childPageData[key], 'data', childPageData)
                Vue.set(state.childPageData[key], 'rootData', rootData)
            }
        },

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

        setCanvasScale (state, scale) {
            state.canvasStyleData.scale = scale
        },

        setComponentTempData (state, componentTempData = []) {
            state.componentTempData = componentTempData.filter(v => v.type == 'group')
        },

        setCurComponent (state, { component, index }) {
            state.curComponent = component
            state.curComponentIndex = index

            // 获取上层options
            state.componentParents = [{ label: 'bg_scr', value: 'bg_scr' }]
            const componentData = [...state.componentData]
            componentData.length && componentData.forEach(v => {
                if (component?.id != v?.id && v.style.parent != component?.name && v.style.name) {
                    state.componentParents.push({
                        label: v.style.name,
                        value: v.style.name
                    })
                }
            })
            eventBus.$emit('clearPriceStatusChecked')
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

            // 获取上层options
            state.componentParents = [{ label: 'bg_scr', value: 'bg_scr' }]
            const componentData = [...state.componentData]
            componentData.length && componentData.forEach(v => {
                if (component?.id != v.id && v.style.name) {
                    state.componentParents.push({
                        label: v.style.name,
                        value: v.style.name
                    })
                }
            })

            this.commit('setChildPageData', {
                childPageData: state.componentData,
                rootData: state.canvasStyleData,
                key: state.childPageIndex
            })
        },

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
