<template>
    <!-- <div class="component-list-box">
        <template v-for="{key, value} in tags">
            <div class="component-list" @dragstart="handleDragStart">
                <p>{{value}}</p>
                <div class="component-list-item">
                    <div v-for="(item, index) in componentList[key]" :key="index" class="list" draggable :data-index="index" :data-type="'single'" :data-tag="key" @click="handleAddComponent(item)">
                        <span class="iconfont" :class="'icon-' + item.icon"></span>
                        <span>{{item.label}}</span>
                    </div>
                </div>
            </div>
        </template>
    </div> -->

    <div class="component-list" @dragstart="handleDragStart">
        <div v-for="(item, index) in componentList" :key="index" class="list" draggable :data-index="index" :data-type="'single'" @click="handleAddComponent(item)">
            <span class="iconfont" :class="'icon-' + item.icon"></span>
            <span>{{item.label}}</span>
        </div>
    </div>

</template>

<script>
import componentList from '@/custom-component/component-list'
import { deepCopy } from '@/utils/utils'
import generateID from '@/utils/generateID'
import { mapState } from 'vuex'
import { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'

export default {
    data () {
        return {
            componentList,
            labelIndex: 0,
            imgIndex: 0,
            contIndex: 0,
            lineIndex: 0,
            barIndex: 0,
            groupIndex: 0,
            activeNames: ['normal', 'price', 'img'],
            tags: [{ key: 'normal', value: '普通' }, { key: 'price', value: '价格' }, { key: 'img', value: '图片' }]
        }
    },
    computed: mapState([
        'componentData',
    ]),
    methods: {
        handleDragStart (e) {
            e.dataTransfer.setData('index', e.target.dataset.index)
            e.dataTransfer.setData('type', e.target.dataset.type)
            e.dataTransfer.setData('tag', e.target.dataset.tag)
        },
        handleAddComponent (item) {
            return
            const component = deepCopy(item)
            component.style.top = 0
            component.style.left = 0
            component.style.xOffset = 0
            component.style.yOffset = 0
            component.id = generateID()

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
                    this[`${key}Index`] = element.length
                }
            }

            switch (component.type) {
                case 'label':
                    if (component.label == '文本') {
                        component.style.name = `label_text_${this.labelIndex}`
                    } else {
                        component.style.name = `label_price_${this.labelIndex}`
                    }
                    this.labelIndex++
                    break;
                default:
                    component.style.name = `${component.type}_${this[`${component.type}Index`]}`
                    break;
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
}
</script>

<style lang="scss" scoped>
.component-list-box {
    height: 380px;
}
.component-list {
    padding: 10px;
    display: grid;
    grid-gap: 10px 19px;
    // grid-template-columns: repeat(auto-fill, 80px);
    grid-template-rows: repeat(auto-fill, 40px);
    .component-list-item {
        display: flex;
        flex-wrap: wrap;
    }

    .list {
        // margin: 10px 10px 0 0;
        // width: 80px;
        height: 40px;
        border: 1px solid #ddd;
        cursor: grab;
        text-align: center;
        color: #333;
        padding: 2px 5px;
        display: flex;
        align-items: center;
        // justify-content: center;

        &:active {
            cursor: grabbing;
        }

        .iconfont {
            margin-right: 4px;
            font-size: 20px;
        }

        .icon-wenben,
        .icon-biaoge {
            font-size: 18px;
        }

        .icon-tupian {
            font-size: 16px;
        }
    }
}
</style>
