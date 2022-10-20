<template>
    <div class="child-page-list">
        <div v-for="(item, index) in 4" class="box" :class="index == childPageIndex ? 'active' : ''" @click="handleClick(index)">
            子页面{{index + 1}}
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import eventBus from '@/utils/eventBus'

export default {
    data () {
        return {
        }
    },
    computed:
        mapState([
            'canvasStyleData',
            'curComponentIndex',
            'componentData',
            'childPageData',
            'childPageIndex'
        ])
    ,
    methods: {
        // 保存子页面数据
        saveData () {
            for (const key in this.childPageData) {
                if (Object.hasOwnProperty.call(this.childPageData, key)) {
                    if (this.childPageIndex == key) {
                        this.childPageData[key] = this.componentData
                    }
                }
            }
        },
        // 点击
        handleClick (index) {
            // 1.点击子页面初始化，如果存在数据则反显
            // 2.切换子页面时，首先保存上个子页面的数据，然后如果新子页面存在数据则反显，否则初始化
            if (index == this.childPageIndex) {
                this.saveData()
                this.$store.commit('setChildPageIndex', undefined)
                eventBus.$emit('clearCanvas')
                eventBus.$emit('restore')
            } else {
                if (this.childPageIndex != undefined) {
                    this.saveData()
                }
                this.initChildPage(index)
                this.$store.commit('setChildPageIndex', index)
            }
        },
        // 初始化子页面数据
        initChildPage (index) {
            if (this.childPageData[index].length) {
                this.$store.commit('setComponentData', this.childPageData[index])
            } else {
                eventBus.$emit('clearCanvas')
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.child-page-list {
    display: flex;
    flex-direction: column;
    .box {
        width: 80px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        background-color: #fff;
        border: 1px solid #f2f2f2;
        cursor: pointer;
        &:nth-child(n + 2) {
            margin-top: 10px;
        }
    }
    .active {
        color: #fff;
        background-color: rgb(0, 128, 255);
    }
}
</style>
