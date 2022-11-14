<template>
    <div class="price-control-status-list">
        <div v-for="(item, index) in priceStatusList" class="box" :class="index == statusIndex? 'active' : ''" :key="index" @click="handleClick(index)">
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
import generateID from '@/utils/generateID'

export default {
    data () {
        return {
            statusIndex: undefined,
            arr: [
                { name: '零售价' },
                { name: '零售价+原价' },
                { name: '零售价+会员价' },
                { name: '零售价+胖柚价' },
            ],
            priceStatusList
        }
    },
    computed: {
        ...mapState([
            'canvasStyleData',
            'curComponentIndex',
            'componentData',
            'curComponent',
            'priceStatusAndControlRelevancy',
            'priceControlStatusData',
            'priceStatusIndex'
        ]),
        // compData () {
        //     // 关联数据
        //     let priceStatusAndControlRelevancy = this.priceStatusAndControlRelevancy
        //     // 价格控件状态数据
        //     let priceControlStatusData = this.priceControlStatusData
        //     const componentData = this.componentData
        //     if (priceStatusAndControlRelevancy.priceStatusIndex != null && priceStatusAndControlRelevancy.name != null) {
        //         this.statusIndex = priceStatusAndControlRelevancy.priceStatusIndex
        //         priceControlStatusData[priceStatusAndControlRelevancy.priceStatusIndex] = []
        //         componentData.forEach(v => {
        //             if (v.style.base == priceStatusAndControlRelevancy.name) {
        //                 priceControlStatusData[priceStatusAndControlRelevancy.priceStatusIndex]['data'].push(v)
        //             }
        //         })
        //     }
        //     return priceControlStatusData[priceStatusAndControlRelevancy.priceStatusIndex]
        // }
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
            const deepIndex = deepCopy(this.statusIndex)
            for (let i = 0; i < this.componentData.length; i++) {
                const element = this.componentData[i];
                if (this.curComponent?.style.name == element.style.name) {
                    this.statusIndex = deepIndex
                    break
                } else {
                    this.statusIndex = undefined
                }
            }
        })

        eventBus.$on('setStatusIndex', () => {
            if (!this.priceStatusIndex[`index${this.statusIndex}`]?.isChange) {
                this.statusIndex = undefined
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
            /*  if (!this.curComponent) {
                return this.$message.warning('请选择要进行关联的容器控件')
            } else if (this.curComponent.type != 'cont') {
                return this.$message.warning('请选择容器控件')
             } */
            if (this.statusIndex == index) return

            // 深拷贝价格状态数据，否则使用源数据会导致数据错乱
            const priceStatusList = deepCopy(this.priceStatusList)

            // 获取价格面板父级数字
            const contIndex = this.curComponent.style.parent.replace(/[^\d]/g, "")

            // 如果存在已选，则删除
            // 删除当前商品容器下的所有相关控件
            const isChange = this.priceStatusIndex[`index${contIndex}`]['isChange']
            if (isChange) {
                const componentData = deepCopy(this.componentData)
                // 循环删除价格状态相关控件
                componentData.forEach(v => {
                    // 价格状态控件存在 isPriceStatus  && 父级 == 某个商品容器名
                    if (v.isPriceStatus && v.style.parent == `ga${contIndex}`) {
                        this.componentData.forEach((item, index) => {
                            if (v.id == item.id) {
                                this.componentData.splice(index, 1)
                            }
                        })
                    }
                })
            }

            // 存储面板选择的价格状态索引
            this.$store.commit('setPriceStatusIndex', {
                index: contIndex,
                isChange: true,
                changeIndex: index
            })

            this.statusIndex = index
            // this.$store.commit('setPriceStatusAndControlRelevancy', {
            //     priceStatusIndex: `priceStatus${index}`,
            //     name: this.curComponent.style.name
            // })

            this.$set(priceStatusList[index]['style'], 'left', this.curComponent.style.left)
            this.$set(priceStatusList[index]['style'], 'top', this.curComponent.style.top)
            this.$set(priceStatusList[index], 'id', generateID())
            this.$set(priceStatusList[index], 'isChange', true)
            this.$set(priceStatusList[index], 'changeIndex', index)
            // 重新赋值id，否则可能导致重复id
            priceStatusList[index]?.propValue.forEach(v => {
                this.$set(v, 'id', generateID())
            })

            eventBus.$emit('updateName', priceStatusList[index])

            this.$store.commit('addComponent', { component: priceStatusList[index] })
        },
        changeComponentsSizeWithScale (scale) {
            const needToChangeAttrs = ['top', 'left', 'width', 'height', 'fontSize']
            const componentData = this.statusIndex ? this.compData[this.statusIndex] : []
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
