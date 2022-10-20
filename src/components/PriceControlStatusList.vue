<template>
    <div class="price-control-status-list">
        <div v-for="(item, index) in 4" class="box" :class="index == priceStatusIndex || (priceStatusAndControlRelevancy.priceStatusIndex != null && priceStatusAndControlRelevancy.name != null && index == priceStatusAndControlRelevancy.priceStatusIndex) ? 'active' : ''" @click="handleClick(index)">
            价格控件状态{{index + 1}}
            <!-- <template v-if="compData.length">
                <div v-for="(item, index) in compData" :key="item.id" :default-style="item.style" :style="getShapeStyle(item.style)" :active="item.id === (curComponent || {}).id" :element="item" :index="index" :class="{ lock: item.isLock }" class="component">
                    <component :is="item.component" v-if="item.component != 'VText'" :id="'component' + item.id" class="component" :style="getComponentStyle(item.style)" :prop-value="item.propValue" :element="item" :request="item.request" />

                    <component :is="item.component" v-else :id="'component' + item.id" class="component" :style="getComponentStyle(item.style)" :prop-value="item.propValue" :element="item" :request="item.request" @input="handleInput" />
                </div>
            </template> -->
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { getStyle, getComponentRotatedStyle, getShapeStyle, getSVGStyle, getCanvasStyle } from '@/utils/style'
import eventBus from '@/utils/eventBus'
import { divide, multiply } from 'mathjs'
import { deepCopy } from '@/utils/utils'

export default {
    data () {
        return {
            priceStatusIndex: undefined,
            // compData: []
        }
    },
    computed: {
        ...mapState([
            'canvasStyleData',
            'curComponentIndex',
            'componentData',
            'curComponent',
            'priceStatusAndControlRelevancy'
        ]),
        compData () {
            let priceStatusAndControlRelevancy = this.$store.state.priceStatusAndControlRelevancy
            let priceControlStatusData = this.$store.state.priceControlStatusData
            const componentData = this.$store.state.componentData
            if (priceStatusAndControlRelevancy.priceStatusIndex != null && priceStatusAndControlRelevancy.name != null) {
                this.priceStatusIndex = priceStatusAndControlRelevancy.priceStatusIndex
                priceControlStatusData[priceStatusAndControlRelevancy.priceStatusIndex] = []
                componentData.forEach(v => {
                    if (v.style.base == priceStatusAndControlRelevancy.name) {
                        priceControlStatusData[priceStatusAndControlRelevancy.priceStatusIndex].push(v)
                    }
                })
            }
            return priceControlStatusData[priceStatusAndControlRelevancy.priceStatusIndex]
        }
    },
    watch: {
        compData: {
            handler (val) {
                // this.changeComponentsSizeWithScale(30)
            }
        }
    },
    created () {
        eventBus.$on('clearPriceStatusChecked', () => {
            const deepIndex = deepCopy(this.priceStatusIndex)
            for (let i = 0; i < this.componentData.length; i++) {
                const element = this.componentData[i];
                if (this.curComponent?.style.name == element.style.name) {
                    this.priceStatusIndex = deepIndex
                    break
                } else {
                    this.priceStatusIndex = undefined
                }
            }
        })
    },
    methods: {
        getShapeStyle,
        getPriceStatusStyle () {

        },
        getComponentStyle (style) {
            return getStyle(style, this.svgFilterAttrs)
        },
        handleClick (index) {
            if (!this.curComponent) {
                return this.$message.warning('请选择要进行关联的容器控件')
            } else if (this.curComponent.type != 'cont') {
                return this.$message.warning('请选择容器控件')
            }
            this.priceStatusIndex = index
            this.$store.commit('setPriceStatusAndControlRelevancy', {
                priceStatusIndex: index,
                name: this.curComponent.style.name
            })
        },
        handleInput (element, value) {
            // 根据文本组件高度调整 shape 高度
            this.$store.commit('setShapeStyle', { height: this.getTextareaHeight(element, value) })
        },
        changeComponentsSizeWithScale (scale) {
            const needToChangeAttrs = ['top', 'left', 'width', 'height', 'fontSize']
            const componentData = this.priceStatusIndex != undefined ? this.compData[this.priceStatusIndex] : []
            componentData.length && componentData.forEach(component => {
                Object.keys(component.style).forEach(key => {
                    if (needToChangeAttrs.includes(key)) {
                        if (key === 'fontSize' && component.style[key] === '') return

                        // 根据原来的比例获取样式原来的尺寸
                        // 再用原来的尺寸 * 现在的比例得出新的尺寸
                        component.style[key] = this.format(this.getOriginStyle(component.style[key], 30), scale)
                    }
                })
            })
            // this.$store.commit('setComponentData', componentData)
            // 更新画布数组后，需要重新设置当前组件，否则在改变比例后，直接拖动圆点改变组件大小不会生效 https://github.com/woai3c/visual-drag-demo/issues/74
            // this.$store.commit('setCurComponent', { component: componentData[this.$store.state.curComponentIndex], index: this.$store.state.curComponentIndex })

        },
        format (value, scale) {
            return multiply(value, divide(parseFloat(scale), 100))
        },
        getOriginStyle (value, scale) {
            return divide(value, divide(parseFloat(scale), 100))
        }
    },
}
</script>

<style lang="scss" scoped>
.price-control-status-list {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    width: 100%;
    .box {
        position: relative;
        margin: 0 10px;
        width: 200px;
        height: 200px;
        background-color: #fff;
        border: 1px solid #606266;

        .component {
            position: absolute;
            z-index: 2;
        }
    }
    .active {
        color: #fff;
        background-color: rgb(0, 128, 255);
    }
}
</style>
