<template>
    <div class="child-page-list">
        <!--   -->
        <div class="border-box" v-for="(item, index) in childPageDataList" :class="index == childPageIndex ? 'active' : ''">
            <span class="num">{{index.replace(/[^\d]/g, "") * 1 + 1}}</span>
            <div class="cont-box" :style="{
                    width: canvasStyleData.width * 0.1 + 10 + 'px',
                    height: canvasStyleData.height * 0.1 + 10 + 'px',
                }">
                <div class="box" :key="index" @click="handleClick(index)" :style="{
                    width: canvasStyleData.width * 0.1 + 'px',
                    height: canvasStyleData.height * 0.1 + 'px',
                }">
                    <div class="canvas" :style="{
                    width: changeStyleWithScale(canvasStyleData.width) + 'px',
                    height: changeStyleWithScale(canvasStyleData.height) + 'px',
                    transform: `scale(0.1)`
                }">
                        <template>
                            <ComponentWrapper v-for="(item1, index1) in item.data" :key="index1" :config="item1" />
                        </template>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>         

<script>
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'
import ComponentWrapper from './Editor/ComponentWrapper'
import { deepCopy, $ } from '@/utils/utils'
import { getStyle, getCanvasStyle } from '@/utils/style'
import { changeStyleWithScale } from '@/utils/translate'

export default {
    components: { ComponentWrapper },
    data () {
        return {
            copyData: []
        }
    },
    computed: {
        ...mapState([
            'canvasStyleData',
            'curComponentIndex',
            'componentData',
            'childPageData',
            'childPageIndex',
            'isSaveIndexPageData',
            'indexPageData',
            'deepCanvasStyleData',
        ]),
        childPageDataList () {
            const childData = deepCopy(this.$store.state.childPageData)
            let arr = []
            for (const key in childData) {
                if (Object.hasOwnProperty.call(childData, key)) {
                    const element = childData[key];
                    arr.push(element)
                }
            }
            return childData
        }
    },
    created () {

    },
    methods: {
        getStyle,
        getCanvasStyle,
        changeStyleWithScale,
        // 保存子页面数据
        saveData () {
            for (const key in this.childPageData) {
                if (Object.hasOwnProperty.call(this.childPageData, key)) {
                    if (this.childPageIndex == key) {
                        this.$store.commit('setChildPageData', {
                            childPageData: this.componentData,
                            rootData: this.canvasStyleData,
                            key
                        })
                    }
                }
            }
        },
        // 点击
        handleClick (index) {
            // 1.点击子页面初始化，如果存在数据则反显
            // 2.切换子页面时，首先保存上个子页面的数据，然后如果新子页面存在数据则反显，否则初始化
            if (index == this.childPageIndex) {
                return
            } else {
                if (this.isSaveIndexPageData) {
                    this.$store.commit('setIndexPageData', {
                        data: this.componentData,
                        rootData: this.canvasStyleData
                    })
                    this.$store.commit('setIsSaveIndexPageData', false)
                }
                if (this.childPageIndex != undefined) {
                    this.saveData()
                }
                this.initChildPage(index)
                this.$store.commit('setChildPageIndex', index)

                this.$store.commit('setCurComponent', { compoennt: null })
            }

            // 滚动条回顶
            $('.content').scrollTop = 0

        },
        // 初始化子页面数据
        initChildPage (index) {
            this.$store.commit('setCanvasStyle', this.childPageData[index]['rootData'])
            if (this.childPageData[index]['data'].length) {
                this.$store.commit('setComponentData', this.childPageData[index]['data'])
            } else {
                eventBus.$emit('clearCanvas')

                this.$store.commit('setCanvasStyle', this.canvasStyleData)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.child-page-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: flex-start;
    height: calc(100vh - 63px);
    overflow: auto;
    .border-box {
        display: flex;
        margin-top: 10px;
        .num {
            font-size: 12px;
        }
        .cont-box {
            margin-left: 10px;
            padding: 3px;
            border: 1px solid #f0efef;
            &:hover {
                // color: #fff;
                border: 1px solid #aba7a7;
            }
        }
    }
    .box {
        position: relative;
        padding: 2px;
        // flex: 0 0 80px;
        // width: 80%;
        // height: 80px;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        background-color: #fff;
        cursor: pointer;
        overflow: hidden;

        .canvas {
            position: absolute;
            left: 0;
            top: 0;
            transform-origin: 0 0;
        }
    }
    .active {
        color: rgb(0, 128, 255);
        font-weight: bold;
        .cont-box {
            border-width: 2px !important;
            border-color: rgb(0, 128, 255) !important;
        }
    }
}
</style>
