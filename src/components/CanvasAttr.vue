<template>
    <div class="attr-container">
        <p class="title">根容器属性</p>
        <el-form style="padding: 20px;" label-position="left" label-width="80px">
            <el-form-item v-for="(key, index) in Object.keys(options)" :key="index" :label="options[key]">
                <el-color-picker v-if="isIncludesColor(key)" v-model="canvasStyleData[key]" show-alpha></el-color-picker>
                <el-slider class="slider" v-else-if="key == 'opacity'" v-model="canvasStyleData[key]" :min="0" :max="1" :step="0.1"></el-slider>
                <el-input v-else-if="key == 'name'" v-model.trim="canvasStyleData[key]" disabled />
                <div v-else-if="key == 'size'" class="size-config">
                    <el-input v-model.number="canvasStyleData['width']" type="number" disabled />
                    <span>*</span>
                    <el-input v-model.number="canvasStyleData['height']" type="number" disabled />
                </div>
                <template v-else-if="sliderKey.includes(key)">
                    <el-slider class="slider" v-model="canvasStyleData[key]" :min="0" :max="100" :step="1" :show-tooltip="false"></el-slider>
                    <span class="slider-num">{{canvasStyleData[key]}}</span>
                </template>
                <el-input v-else v-model.number="canvasStyleData[key]" type="number" />
            </el-form-item>
            <!-- <el-form-item label="比例">
                <el-input-number size="mini" label="%" :min="10" :step="10" v-model="rootScale" @change="handleChange"></el-input-number> %
            </el-form-item> -->
        </el-form>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data () {
        return {
            options: {
                name: '名称',
                size: '大小',
                // color: '颜色',
                // opacity: '不透明度',
                backgroundColor: '背景色',
                // fontSize: '字体大小',
                borderWidth: '边框宽度',
                borderRadius: '边框半径',
            },
            sliderKey: ['borderRadius', 'borderWidth']

        }
    },
    computed:
        mapState([
            'canvasStyleData',
            'curComponentIndex',
            'componentData',
        ])
    ,
    methods: {
        isIncludesColor (str) {
            return str.toLowerCase().includes('color')
        },

        handleChange (val) {
            console.log(val)
            this.$store.commit('setScale', val / 100)
            // this.$store.commit('setComponentData', this.componentData)
            // this.$store.commit('setCurComponent', { component: this.componentData[this.curComponentIndex], index: this.curComponentIndex })
        }
    },
}
</script>

<style lang="scss">
.attr-container {
    .title {
        text-align: center;
        margin-bottom: 10px;
        height: 40px;
        line-height: 40px;
        border-bottom: 2px solid #e4e7ed;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
    }
    .slider {
        width: 75%;
        // margin-top: 20px;
    }
    .slider-num {
        position: absolute;
        right: 0;
        top: 3px;
    }
    .size-config {
        .el-input {
            width: 75px;
        }
        span {
            margin: 0 5px;
        }
    }
}
</style>
