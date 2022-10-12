<template>
    <div class="home">
        <Toolbar />

        <main>
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
            <section class="center">
                <div class="content" @drop="handleDrop" @dragover="handleDragOver" @mousedown="handleMouseDown" @mouseup="deselectCurComponent">
                    <Editor />
                </div>
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
    components: { Editor, ComponentList, Toolbar, RealTimeComponentList, CanvasAttr, ComposeList },
    data () {
        return {
            activeName: 'attr',
            reSelectAnimateIndex: undefined,
            labelIndex: 0,
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
    ]),
    created () {
        this.restore()
        // 全局监听按键事件
        listenGlobalKeyDown()
    },
    methods: {
        restore () {
            // 用保存的数据恢复画布
            if (localStorage.getItem('canvasData')) {
                const canvasData = JSON.parse(localStorage.getItem('canvasData'))
                setDefaultcomponentData(canvasData)
                canvasData.forEach((v, i) => {
                    if (v.rootParent) {
                        canvasData.splice(i, 1)
                    }
                    switch (v.type) {
                        case 'label':
                            this.labelIndex++
                            break;
                        case 'img':
                            this.imgIndex++
                            break;
                        case 'line':
                            this.lineIndex++
                            break;
                        case 'cont':
                            this.contIndex++
                            break;
                        case 'bar':
                            this.barIndex++
                            break;
                        default:
                            break;
                    }
                })
                this.$store.commit('setComponentData', canvasData)
            }

            if (localStorage.getItem('canvasStyle')) {
                this.$store.commit('setCanvasStyle', JSON.parse(localStorage.getItem('canvasStyle')))
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
            const rectInfo = this.editor.getBoundingClientRect()
            const y = Math.floor(e.clientY - rectInfo.y)
            const x = Math.floor(e.clientX - rectInfo.x)

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
                    const element = arrKeyObj[key];
                    switch (key) {
                        case 'label':
                            this.labelIndex = element.length
                            break;
                        case 'img':
                            this.imgIndex = element.length
                            break;
                        case 'cont':
                            this.contIndex = element.length
                            break;
                        case 'line':
                            this.lineIndex = element.length
                            break;
                        case 'group':
                            this.groupIndex = element.length
                            break;
                        default:
                            break;
                    }
                }
            }

            if (index) {
                let component
                // 拖拽单个组件
                if (type == 'single') {
                    component = deepCopy(componentList[index])
                    component.style.top = y
                    component.style.left = x
                    component.style.xOffset = x
                    component.style.yOffset = y
                    // component.style.objAlign = 1
                    component.id = generateID()
                    switch (component.type) {
                        case 'label':
                            if (component.label == '文字') {
                                component.style.name = `label_text_${this.labelIndex}`
                            } else {
                                component.style.name = `label_price_${this.labelIndex}`
                            }
                            this.labelIndex++
                            break;
                        case 'img':
                            component.style.name = `img_${this.imgIndex}`
                            this.imgIndex++
                            break;
                        case 'cont':
                            component.style.name = `cont_${this.contIndex}`
                            this.contIndex++
                            break;
                        case 'line':
                            component.style.name = `line_${this.lineIndex}`
                            this.lineIndex++
                            break
                        case 'bar':
                            component.style.name = `bar_${this.barIndex}`
                            this.barIndex++
                            break
                        default:
                            break;
                    }
                } else { // 拖拽组合组件
                    component = deepCopy(this.componentTempData[index])
                    component.style.top = y
                    component.style.left = x
                    component.id = generateID()
                    component.style.objAlign = 1
                    component.style.name = `group_${this.groupIndex}`
                    this.groupIndex++

                    setTimeout(() => {
                        const editorRect = this.editor.getBoundingClientRect()
                        component.propValue.forEach(v => {
                            decomposeComponent(v, editorRect, component.style)
                        })
                    }, 100)
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
            }
        },

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
            left: 0;
            top: 0;
            background-color: #fff;

            & > div {
                overflow: auto;
            }

            .collapse {
                height: 100%;
                // .el-collapse-item {
                //     max-height: 33.33%;
                //     overflow: hidden;
                //     ::deep .el-collapse-item__wrap {
                //         height: calc(100% - 48px);
                //         overflow: auto;
                //     }
                // }
            }
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
            margin-left: 200px;
            margin-right: 288px;
            background: #f5f5f5;
            height: 100%;
            overflow: auto;
            padding: 20px;

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
