<template>
    <div class="child-page-list">
        <div v-for="(item, index) in 8" class="box" :class="`childPage${index}` == childPageIndex ? 'active' : ''" @click="handleClick(index)">
            子页面{{index + 1}}

            <div class="canvas" :style="{
                    ...getCanvasStyle(canvasStyleData),
                    width: changeStyleWithScale(canvasStyleData.width) + 'px',
                    height: changeStyleWithScale(canvasStyleData.height) + 'px',
                    transform: `scale(0.1)`
                }">
                <template v-if="copyData.length && `childPage${index}` == childPageIndex">
                    <ComponentWrapper v-for="(item1, index) in copyData" :key="index" :config="item1" />
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'
import ComponentWrapper from './Editor/ComponentWrapper'
import { deepCopy } from '@/utils/utils'
import { getStyle, getCanvasStyle } from '@/utils/style'
import { changeStyleWithScale } from '@/utils/translate'

export default {
    components: { ComponentWrapper },
    data () {
        return {
            copyData: []
        }
    },
    computed:
        mapState([
            'canvasStyleData',
            'curComponentIndex',
            'componentData',
            'childPageData',
            'childPageIndex',
            'isSaveIndexPageData',
            'indexPageData',
            'deepCanvasStyleData',
        ])
    ,
    created () {
        eventBus.$on('childPageCanvas', (childPageIndex) => {
            // this.$set(this, 'copyData', deepCopy(this.childPageData[childPageIndex].data))
        })
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
            if (`childPage${index}` == this.childPageIndex) {
                this.saveData()
                this.$store.commit('setChildPageIndex', undefined)
                this.$store.commit('setIsSaveIndexPageData', true)
                eventBus.$emit('clearCanvas')
                this.$store.commit('setComponentData', this.indexPageData['data'])
                this.$store.commit('setCanvasStyle', this.indexPageData['rootData'])
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
                this.$store.commit('setChildPageIndex', `childPage${index}`)
            }
        },
        // 初始化子页面数据
        initChildPage (index) {
            this.$store.commit('setCanvasStyle', this.childPageData[`childPage${index}`]['rootData'])
            if (this.childPageData[`childPage${index}`]['data'].length) {
                this.$store.commit('setComponentData', this.childPageData[`childPage${index}`]['data'])
            } else {
                eventBus.$emit('clearCanvas')
                this.$store.commit('setCanvasStyle', { // 页面全局初始数据
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
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.child-page-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc(100vh - 63px);
    overflow: auto;
    .box {
        position: relative;
        margin-top: 10px;
        flex: 0 0 80px;
        width: 80%;
        height: 80px;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        background-color: #fff;
        border: 1px solid #f2f2f2;
        cursor: pointer;
        &:hover {
            color: #fff;
            background-color: rgba(0, 128, 255, 0.5);
        }

        .canvas {
            position: absolute;
            left: 0;
            top: 0;
            transform-origin: 0 0;
        }
    }
    .active {
        border: 2px solid rgb(0, 128, 255);
    }
}
</style>
