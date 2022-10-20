<template>
    <div class="child-page-list">
        <div v-for="(item, index) in 4" class="box" :class="index == pageIndex ? 'active' : ''" @click="handleClick(index)">
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
            pageIndex: 0,
        }
    },
    computed:
        mapState([
            'canvasStyleData',
            'curComponentIndex',
            'componentData',
            'childPageData'
        ])
    ,
    methods: {
        saveData () {
            for (const key in this.childPageData) {
                if (Object.hasOwnProperty.call(this.childPageData, key)) {
                    if (this.pageIndex == key) {
                        this.childPageData[key] = this.componentData
                    }
                }
            }
            eventBus.$emit('clearCanvas')
        },
        handleClick (index) {
            this.saveData()
            this.pageIndex = index
            this.$store.commit('setComponentData', this.childPageData[index])
        },
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
