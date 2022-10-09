<template>
    <div class="attr-container">
        <p class="title">画布属性</p>
        <el-form style="padding: 20px;">
            <el-form-item v-for="(key, index) in Object.keys(options)" :key="index" :label="options[key]">
                <el-color-picker v-if="isIncludesColor(key)" v-model="canvasStyleData[key]" show-alpha></el-color-picker>
                <el-slider class="slider" v-else-if="key == 'opacity'" v-model="canvasStyleData[key]" :min="0" :max="1" :step="0.1"></el-slider>
                <el-input v-else-if="key == 'name'" v-model.trim="canvasStyleData[key]" />
                <el-input v-else v-model.number="canvasStyleData[key]" type="number" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    data () {
        return {
            options: {
                name: '根容器名称(唯一)',
                // color: '颜色',
                // opacity: '不透明度',
                backgroundColor: '背景色',
                // fontSize: '字体大小',
                borderWidth: '边框宽度',
                borderRadius: '边框半径'
            },
        }
    },
    computed: mapState([
        'canvasStyleData',
    ]),
    methods: {
        isIncludesColor (str) {
            return str.toLowerCase().includes('color')
        },
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
        margin-top: 20px;
    }
}
</style>
