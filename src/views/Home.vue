<template>
    <div class="home">
        <Toolbar />

        <main>
            <!-- 子页面 -->
            <section class="child-page">
                <ChildPageList />
            </section>
            <!-- 左侧组件列表 -->
            <section class="left">
                <el-collapse class="collapse" v-model="activeNames">
                    <el-collapse-item title="控件" name="1">
                        <ComponentList />
                    </el-collapse-item>
                    <el-collapse-item title="组合控件" name="2">
                        <ComposeList />
                    </el-collapse-item>
                    <el-collapse-item title="已选控件" name="3">
                        <RealTimeComponentList />
                    </el-collapse-item>
                </el-collapse>
            </section>

            <!-- 中间画布 -->
            <section class="center" :style="{paddingBottom: curComponent?.style.name.startsWith('contPrice') ? '50px':'20px'}">
                <div class="content" @drop="handleDrop" @dragover="handleDragOver" @mousedown="handleMouseDown" @mouseup="deselectCurComponent">
                    <Editor />
                </div>

                <PriceControlStatusList v-if="curComponent?.style.name.startsWith('contPrice')" />
            </section>
            <!-- 右侧属性列表 -->
            <section class="right">
                <div class="box" v-if="curComponent">
                    <p class="title">控件属性</p>
                    <component :is="curComponent.component + 'Attr'" />
                </div>
                <CanvasAttr v-else></CanvasAttr>
            </section>
        </main>
    </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import Editor from '@/components/Editor/index'
import ComponentList from '@/components/ComponentList' // 左侧列表组件
import componentList from '@/custom-component/component-list' // 左侧列表数据
import ComposeList from '@/components/ComposeList' // 左侧组合列表数据
import ChildPageList from '@/components/ChildPageList' // 子页面
import PriceControlStatusList from '@/components/PriceControlStatusList' // 价格控件状态
import Toolbar from '@/components/Toolbar'
import { deepCopy } from '@/utils/utils'
import { mapState } from 'vuex'
import generateID from '@/utils/generateID'
import { listenGlobalKeyDown } from '@/utils/shortcutKey'
import RealTimeComponentList from '@/components/RealTimeComponentList'
import CanvasAttr from '@/components/CanvasAttr'
import { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'
import { setDefaultcomponentData } from '@/store/snapshot'
import decomposeComponent from '@/utils/decomposeComponent'

export default {
    components: { Editor, ComponentList, Toolbar, RealTimeComponentList, CanvasAttr, ComposeList, ChildPageList, PriceControlStatusList },
    data () {
        return {
            activeName: 'attr',
            reSelectAnimateIndex: undefined,
            // 控件索引
            controlIndex: {
                labelGnIndex: 0, // 商品名称
                labelGiIndex: 0, // 商品附加信息
                labelGuIndex: 0, // 单位
                imgGpIndex: 0, // 商品图片
                imgGbpIndex: 0, // 条码图片
                contGaIndex: 0, // 商品容器
                contPIndex: 0, // 价格面板容器
                lineGpulIndex: 0, // 线条
            },
            imgIndex: 0,
            contIndex: 0,
            lineIndex: 0,
            barIndex: 0,
            groupIndex: 0,
            activeNames: ['1', '2', '3']
        }
    },
    computed: mapState([
        'componentData',
        'componentTempData',
        'curComponent',
        'isClickComponent',
        'canvasStyleData',
        'editor',
        'childPageIndex'
    ]),
    created () {
        this.initChildPageData()
        this.restore()
        // 全局监听按键事件
        listenGlobalKeyDown()

        eventBus.$on('restore', () => {
            this.restore()
        })
        eventBus.$on('updateIndex', () => {
            for (const key in this.controlIndex) {
                if (Object.hasOwnProperty.call(this.controlIndex, key)) {
                    this.controlIndex[key] = 0
                }
            }
        })
        eventBus.$on('updateName', (component) => {
            if (component.type == 'cont') return
            const par = this.handleGetPar(component) || ''
            const deepG = par.replace(/[^\d]/g, "") || this.$store.state.whichGoodsNum
            this.dragUpdate(component, par, deepG)
        })
    },
    methods: {
        initChildPageData () {
            let keys = []
            let data = {}
            for (let i = 0; i < 8; i++) {
                keys.push(`childPage${i}`)
            }
            keys.forEach(v => {
                this.$set(data, v, { data: [], rootData: [] })
            })
            this.$store.commit('setInitChildPageData', data)
        },
        restore () {
            // 用保存的数据恢复画布
            const canvasData = JSON.parse(localStorage.getItem('canvasData'))
            if (localStorage.getItem('canvasData')) {
                setDefaultcomponentData(canvasData[this.childPageIndex].data)

                for (const key in canvasData) {
                    if (Object.hasOwnProperty.call(canvasData, key)) {
                        const item = canvasData[key]
                        const data = item.data;
                        const rootData = item.rootData
                        data.forEach((v, i) => {
                            if (v.rootParent) {
                                data.splice(i, 1)
                            }
                            this[`${v.type}Index`]++
                        })
                        if (key.startsWith('childPage')) {
                            this.$store.commit('setChildPageData', { childPageData: data, rootData, key })
                        }
                    }
                }

                this.$store.commit('setComponentData', canvasData[this.childPageIndex].data)
            }

            if (localStorage.getItem('canvasStyle')) {
                // this.$store.commit('setCanvasStyle', JSON.parse(localStorage.getItem('canvasStyle'))) 
                this.$store.commit('setCanvasStyle', canvasData[this.childPageIndex].rootData)
            }

            if (localStorage.getItem('canvasTempData')) {
                this.$store.commit('setComponentTempData', JSON.parse(localStorage.getItem('canvasTempData')))
            }
        },

        handleDrop (e) {
            e.preventDefault()
            e.stopPropagation()
            const index = e.dataTransfer.getData('index')
            const type = e.dataTransfer.getData('type')
            // const tag = e.dataTransfer.getData('tag')
            const rectInfo = this.editor.getBoundingClientRect()
            const y = Math.floor(e.clientY - rectInfo.y)
            const x = Math.floor(e.clientX - rectInfo.x)

            let component,
                G  // 表示第几个位置商品,0位置开始

            // 拖拽单个组件
            if (type == 'single') {
                // component = deepCopy(componentList[tag][index])
                component = deepCopy(componentList[index])
                component.style.top = y
                component.style.left = x
                component.style.xOffset = x
                component.style.yOffset = y
                // component.style.objAlign = 1
                component.id = generateID()
                const par = this.handleGetPar(component) || ''
                component.style.parent = par
                component.style.base = par
                const deepG = this.$store.state.whichGoodsNum
                if (par.startsWith('ga')) {
                    G = par.replace(/[^\d]/g, "")
                    if (deepG != G) {
                        this.$store.commit('setWhichGoodsNum', G)
                    }
                    this.updateIndex(G)
                } else {
                    this.updateIndex()
                }
                this.setName(component, par, G)
            } else { // 拖拽组合组件
                component = deepCopy(this.componentTempData[index])
                component.style.top = y
                component.style.left = x
                component.id = generateID()
                component.style.objAlign = 1
                component.style.name = `group_${this.groupIndex}`
                this.groupIndex++
            }

            // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
            changeComponentSizeWithScale(component)

            this.$store.commit('addComponent', { component })
            this.$store.commit('recordSnapshot')

            // 拖拽并选中
            this.$store.commit('setCurComponent', {
                component: component,
                index: this.componentData.length - 1,
            })

            eventBus.$emit('setOldName', component.style.name)
            eventBus.$emit('childPageCanvas', this.childPageIndex)
        },

        dragUpdate (component, par, G) {
            if (par == component.style.parent) return
            this.updateIndex(G)
            component.style.parent = par
            component.style.base = par
            if (par.startsWith('ga')) {
                switch (component.type) {
                    case 'label':
                        let arr = []
                        if (component.label == '商品附加信息') {
                            const index = this.getIndex(`gi${G}`)
                            component.style.name = `gi${G}_${index}`
                        }
                        break;
                    case 'group':
                        this.$set(component.style, 'name', `groupGa${G}`)
                        component.propValue.map(v => {
                            v.style.name = v.style.name.replace('G', G)
                            v.style.parent = par
                            v.style.base = par
                            return v
                        })
                        break
                    default:
                        break;
                }
            }
        },
        // 获取索引 赋值给名称
        getIndex (key) {
            let keyArr = [], resIndex = 0
            this.componentData.forEach(v => {
                // 在同一个商品区域下的数据
                if (v.style.name.startsWith(`gi`) && key.startsWith((v.style.name.split('_'))[0])) {
                    // 获取控件名称索引
                    const val = (v.style.name.split('_'))[1]
                    keyArr.push(val)
                }
            })
            // 索引值数组排序
            const sortKeyArr = keyArr.sort((a, b) => a - b)
            // 索引与值不相等 就赋值索引 跳出循环
            for (let i = 0; i < sortKeyArr.length; i++) {
                const v = sortKeyArr[i];
                // 索引 != 值 
                if (v != i) {
                    resIndex = i
                    break
                } else {
                    resIndex = i + 1
                }
            }
            return resIndex
        },

        // 控件名称设置
        setName (component, par, G) {
            this.updateIndex(G)
            console.log(G)
            switch (component.type) {
                case 'label':
                    if (par.startsWith('ga')) {
                        if (component.label == '商品名称') {
                            component.style.name = `gn${this.controlIndex.labelGnIndex}`
                            this.controlIndex.labelGnIndex++
                        } else if (component.label == '商品附加信息') {
                            component.style.name = `gi${G}_${this.controlIndex.labelGiIndex}`
                            this.controlIndex.labelGiIndex++
                        } else if (component.label == '单位') {
                            component.style.name = `gu${G}_${this.controlIndex.labelGuIndex}`
                            this.controlIndex.labelGuIndex++
                        } else {
                            component.style.name = `label_price_${this.labelIndex}`
                        }
                    }
                    break;
                case 'img':
                    if (par.startsWith('ga')) {
                        if (component.label == '商品图') {
                            component.style.name = `gp${this.controlIndex.imgGpIndex}`
                            this.controlIndex.imgGpIndex++
                        } else if (component.label == '商品一维码') {
                            component.style.name = `gbp${this.controlIndex.imgGbpIndex}`
                            this.controlIndex.imgGbpIndex++
                        }
                    }
                    break
                case 'line':
                    if (par.startsWith('ga')) {
                        if (component.label == '线条') {
                            component.style.name = `gpul${this.controlIndex.lineGpulIndex}`
                            this.controlIndex.lineGpulIndex++
                        }
                    }
                    break
                case 'cont':
                    if (component.label == '商品容器') {
                        component.style.name = `ga${this.controlIndex.contGaIndex}`
                        this.controlIndex.contGaIndex++
                    } else if (component.label == '媒体播放区') {
                        component.style.name = `video`
                    } else if (component.label == '价格面板') {
                        component.style.name = `contPrice${this.controlIndex.contPIndex}`
                        this.controlIndex.contPIndex++
                    }
                    break
                case 'group':
                    if (par.startsWith('ga')) {
                        this.$set(component.style, 'name', `groupGa${G}`)
                    }
                    break
                default:
                    component.style.name = `${component.type}_${this[`${component.type}Index`]}`
                    break;
            }
        },

        // 更新控件index
        updateIndex (G) {
            let arrKeyObj = {
                label: [],
                img: [],
                cont: [],
                line: [],
                group: []
            }
            // 获取各类组件已存在的数量
            this.componentData.forEach(v => {
                for (const key in arrKeyObj) {
                    if (Object.hasOwnProperty.call(arrKeyObj, key)) {
                        const element = arrKeyObj[key];
                        if (v.type == key) {
                            element.push(v)
                        }
                    }
                }
            })
            // 刷新各类组件初始索引
            for (const key in arrKeyObj) {
                if (Object.hasOwnProperty.call(arrKeyObj, key)) {
                    const item = arrKeyObj[key];
                    switch (key) {
                        case 'label':
                            let giArr = [], guArr = []
                            item.forEach(v => {
                                if (v.label == '商品附加信息' || v.label == '单位') {
                                    const num = (v.style.name.split('_'))[0].replace(/[^\d]/g, "")
                                    if (num == G) {
                                        if (v.label == '商品附加信息') {
                                            giArr.push(v)
                                        } else {
                                            guArr.push(v)
                                        }
                                    }
                                }
                            })
                            this.controlIndex.labelGiIndex = giArr.length
                            this.controlIndex.labelGuIndex = guArr.length
                            break;
                        case 'line':
                            this.controlIndex.lineGpulIndex = item.length
                            break;
                        case 'cont':
                            let gaArr = []
                            item.forEach(v => {
                                if (v.style.name.startsWith('ga')) {
                                    gaArr.push(v)
                                } else {

                                }
                            })
                            this.controlIndex.contGaIndex = gaArr.length
                            break;
                        case 'img':
                            let gbpArr = [], gpArr = []
                            item.forEach(v => {
                                if (v.label == '商品图') {
                                    gpArr.push(v)
                                } else if (v.label == '商品一维码') {
                                    gbpArr.push(v)
                                }
                            })
                            this.controlIndex.imgGbpIndex = gbpArr.length
                            this.controlIndex.imgGpIndex = gpArr.length
                            break;
                        default:
                            break;
                    }
                }
            }
        },

        // 获取父级控件名称
        handleGetPar (component) {
            const componentData = this.componentData
            const curComp = component
            let parArr = []
            componentData.forEach(v => {
                const parX = v.style.left
                const parY = v.style.top
                const curX = curComp.style.left
                const curY = curComp.style.top
                const parRBX = parX + v.style.width
                const parRBY = parY + v.style.height
                const curRBX = curX + curComp.style.width
                const curRBY = curY + curComp.style.height
                // 左上角 与 右下角 坐标比较 获取所有包含当前控件的控件
                if ((v.id != curComp.id) && (v.type == 'cont') && (curX >= parX) && (curY >= parY) && (curRBX <= parRBX) && (curRBY <= parRBY)) {
                    parArr.push(v)
                }
            })

            let par
            if (parArr.length) {
                for (let i = 0; i < parArr.length; i++) {
                    const v = parArr[i];
                    if (v.style.name.startsWith('ga')) {
                        par = v.style.name
                        break
                    } else {
                        par = 'bg_scr'
                    }
                }
            } else {
                par = 'bg_scr'
            }

            return par
        },

        // ArrayCallback (arr, label) {
        //     let ary = []
        //     arr.forEach(v => {
        //         if (v.style.name.startsWith('ga')) {
        //             ary.push(v)
        //         } else if (v.style.label == label) {
        //             ary.push(v)
        //         }
        //     })
        //     return ary
        // },

        handleDragOver (e) {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        },

        handleMouseDown (e) {
            e.stopPropagation()
            this.$store.commit('setClickComponentStatus', false)
            this.$store.commit('setInEditorStatus', true)
        },

        deselectCurComponent (e) {
            if (!this.isClickComponent) {
                this.$store.commit('setCurComponent', { component: null, index: null })
            }

            // 0 左击 1 滚轮 2 右击
            if (e.button != 2) {
                this.$store.commit('hideContextMenu')
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.home {
    height: 100vh;
    background: #fff;

    main {
        height: calc(100% - 64px);
        position: relative;

        .left {
            margin-left: 10px;
            position: absolute;
            height: 100%;
            width: 210px;
            left: 150px;
            top: 0;
            background-color: #fff;
            // box-shadow: 0 0 8px 10px #f2f2f2;
            z-index: 1;

            & > div {
                overflow: auto;
            }

            .collapse {
                height: 100%;
                .el-collapse-item:nth-child(1) {
                    padding-bottom: 50px;
                    height: 50%;
                    overflow: hidden;
                    ::v-deep .el-collapse-item__wrap {
                        height: 100%;
                        overflow: auto;
                    }
                }
            }
        }

        .child-page {
            position: absolute;
            left: 0;
            top: 0;
            width: 150px;
            background-color: #fff;
            border-right: 1px solid #f2f2f2;
            z-index: 10;
        }

        .right {
            position: absolute;
            height: 100%;
            width: 288px;
            right: 0;
            top: 0;

            .el-select {
                width: 100%;
            }
            .title {
                text-align: center;
                margin-bottom: 10px;
                // height: 40px;
                line-height: 40px;
                border-bottom: 2px solid #e4e7ed;
                font-size: 14px;
                font-weight: 500;
                color: #303133;
            }
        }

        .center {
            position: relative;
            padding: 20px 20px 50px;
            margin-left: 360px;
            margin-right: 288px;
            height: 100%;
            background: #f5f5f5;
            overflow: auto;

            .content {
                width: 100%;
                height: 100%;
                overflow: auto;
            }
        }
    }

    .placeholder {
        text-align: center;
        color: #333;
    }

    .global-attr {
        padding: 10px;
    }
}
</style>
