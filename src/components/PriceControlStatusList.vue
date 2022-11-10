<template>
    <div class="price-control-status-list">
        <div v-for="(item, index) in priceStatusList" class="box" :class="`priceStatus${index}` == priceStatusIndex || (priceStatusAndControlRelevancy.priceStatusIndex && priceStatusAndControlRelevancy.name != null && index == priceStatusAndControlRelevancy.priceStatusIndex) ? 'active' : ''" :key="index" @click="handleClick(index)">
            {{arr[index].name}}
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
import { divide, im, multiply } from 'mathjs'
import { deepCopy } from '@/utils/utils'
import priceStatusList from '@/components/priceControlStatusDataList.js'

export default {
    data () {
        return {
            priceStatusIndex: undefined,
            arr: [
                { name: '零售价' },
                { name: '零售价+原价' },
                { name: '零售价+会员价' },
                { name: '零售价+胖柚价' },
            ],
            priceStatusList
            // compData: []
        }
    },
    computed: {
        ...mapState([
            'canvasStyleData',
            'curComponentIndex',
            'componentData',
            'curComponent',
            'priceStatusAndControlRelevancy',
            'priceControlStatusData'
        ]),
        compData () {
            // 关联数据
            let priceStatusAndControlRelevancy = this.priceStatusAndControlRelevancy
            // 价格控件状态数据
            let priceControlStatusData = this.priceControlStatusData
            const componentData = this.componentData
            if (priceStatusAndControlRelevancy.priceStatusIndex != null && priceStatusAndControlRelevancy.name != null) {
                this.priceStatusIndex = priceStatusAndControlRelevancy.priceStatusIndex
                priceControlStatusData[priceStatusAndControlRelevancy.priceStatusIndex] = []
                componentData.forEach(v => {
                    if (v.style.base == priceStatusAndControlRelevancy.name) {
                        priceControlStatusData[priceStatusAndControlRelevancy.priceStatusIndex]['data'].push(v)
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
            if (this.priceStatusIndex == index) return
            const componentData = deepCopy(this.componentData)
            // 循环删除价格状态相关控件
            for (let i = 0; i < componentData.length; i++) {
                const v = componentData[i];
                if (v.isPriceStatus) {
                    this.componentData.forEach((item, index) => {
                        if (v.id == item.id) {
                            this.componentData.splice(index, 1)
                        }
                    })
                }
            }

            this.priceStatusIndex = index
            this.$store.commit('setPriceStatusAndControlRelevancy', {
                priceStatusIndex: `priceStatus${index}`,
                name: this.curComponent.style.name
            })

            this.$set(this.priceStatusList[index]['style'], 'left', this.curComponent.style.left)
            this.$set(this.priceStatusList[index]['style'], 'top', this.curComponent.style.top)

            eventBus.$emit('updateName', this.priceStatusList[index])

            this.$store.commit('addComponent', { component: this.priceStatusList[index] })

            // this.$store.commit('setCurComponent', {
            //     component: this.priceStatusList[index],
            //     index: this.componentData.length - 1,
            // })

        },
        handleInput (element, value) {
            // 根据文本组件高度调整 shape 高度
            this.$store.commit('setShapeStyle', { height: this.getTextareaHeight(element, value) })
        },
        changeComponentsSizeWithScale (scale) {
            const needToChangeAttrs = ['top', 'left', 'width', 'height', 'fontSize']
            const componentData = this.priceStatusIndex ? this.compData[this.priceStatusIndex] : []
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
        padding: 5px 10px;
        // width: 200px;
        // height: 200px;
        background-color: #fff;
        border: 1px solid #d8dbdc;
        cursor: pointer;

        &:hover {
            color: #fff;
            background-color: rgba(0, 128, 255, 0.5);
        }

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
