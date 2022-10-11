<template>
    <div class="component-list" @dragstart="handleDragStart">
        <div v-for="(item, index) in componentList" :key="index" class="list" draggable :data-index="index" :data-type="'single'" @click="handleAddComponent(item)">
            <span class="iconfont" :class="'icon-' + item.icon"></span>
            <span>{{item.label}}</span>
        </div>
        <!-- <el-collapse class="collapse" v-model="activeNames">
            <el-collapse-item title="控件" name="1">
            </el-collapse-item>
            <el-collapse-item title="组合控件" name="2">
            </el-collapse-item>
            <el-collapse-item title="已选控件" name="3">
            </el-collapse-item>
        </el-collapse> -->
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
            activeNames: ['1', '2', '3']
        }
    },
    computed: mapState([
        'componentData',
    ]),
    methods: {
        handleDragStart (e) {
            e.dataTransfer.setData('index', e.target.dataset.index)
            e.dataTransfer.setData('type', e.target.dataset.type)
        },
        handleAddComponent (item) {
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

            switch (component.type) {
                case 'label':
                    component.style.name = `label_${this.labelIndex}`
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
.component-list {
    height: 20%;
    padding: 10px;
    display: grid;
    grid-gap: 10px 19px;
    grid-template-columns: repeat(auto-fill, 80px);
    grid-template-rows: repeat(auto-fill, 40px);

    .list {
        width: 80px;
        height: 40px;
        border: 1px solid #ddd;
        cursor: grab;
        text-align: center;
        color: #333;
        padding: 2px 5px;
        display: flex;
        align-items: center;
        justify-content: center;

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
