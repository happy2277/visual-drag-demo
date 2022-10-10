<template>
    <div class="v-common-attr">
        <el-collapse v-model="activeName" accordion @change="onChange">
            <BaseStyle ref="baseStyle"></BaseStyle>
            <el-collapse-item title="样式" name="style">
                <el-form>
                    <el-form-item v-for="({ key, label }, index) in styleKeys" :key="index" :label="label">
                        <!-- 颜色 -->
                        <el-color-picker v-if="isIncludesColor(key)" v-model="curComponent.style[key]" show-alpha></el-color-picker>
                        <!-- 选择 -->
                        <el-select v-else-if="selectKey.includes(key)" v-model="curComponent.style[key]" @change="handleChange">
                            <el-option v-for="item in optionMap[key]" :key="item.value" :label="item.labelCn" :value="item.value"></el-option>
                        </el-select>
                        <!-- 滑块 -->
                        <el-slider class="slider" v-else-if="sliderKey.includes(key)" v-model="curComponent.style[key]" :min="0" :max="key == 'opacity' ? 1 : 100" :step="key == 'opacity' ? 0.1 : 1"></el-slider>
                        <!-- 上传图片 -->
                        <template v-else-if="key == 'url'">
                            <el-upload v-show="!curComponent.propValue.url" action="#" list-type="picture-card" :auto-upload="false" :file-list="fileList" :on-change="handleUploadChange">
                                <i slot="default" class="el-icon-plus"></i>
                            </el-upload>
                            <div v-show="curComponent.propValue.url" class="el-upload">
                                <ul class="el-upload-list el-upload-list--picture-card">
                                    <li tabindex="0" class="el-upload-list__item is-ready focusing">
                                        <img class="el-upload-list__item-thumbnail" :src="curComponent.propValue.url" alt="">
                                        <span class="el-upload-list__item-actions">
                                            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview()">
                                                <i class="el-icon-zoom-in"></i>
                                            </span>
                                            <span class="el-upload-list__item-delete" @click="handleRemove()">
                                                <i class="el-icon-delete"></i>
                                            </span>
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </template>
                        <!-- 开关 -->
                        <el-switch v-else-if="key == 'display'" v-model="curComponent.style[key]" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                        <!-- 文本输入 -->
                        <el-input v-else-if="key == 'str'" v-model.trim="curComponent.style[key]" />
                        <!-- 数字输入 -->
                        <el-input v-else v-model.number="curComponent.style[key]" type="number" @input="handleNumInput" />
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>

        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { styleData, textAlignOptions, borderStyleOptions, verticalAlignOptions, controlAlignmentOptions, longModeOptions, selectKey, optionMap } from '@/utils/attr'
import BaseStyle from './baseStyle.vue'

export default {
    components: { BaseStyle },
    data () {
        return {
            optionMap,
            styleData,
            textAlignOptions,
            borderStyleOptions,
            verticalAlignOptions,
            controlAlignmentOptions,
            longModeOptions,
            selectKey,
            activeName: 'base',
            sliderKey: ['opacity', 'percentage'],
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            fileList: []
        }
    },
    computed: {
        parentOptions () {
            return this.$store.state.componentParents
        },
        styleKeys () {
            if (this.curComponent) {
                const curComponentStyleKeys = Object.keys(this.curComponent.style)
                return this.styleData.filter(item => curComponentStyleKeys.includes(item.key))
            }

            return []
        },
        curComponent () {
            return this.$store.state.curComponent
        },
    },
    watch: {
        // 'curComponent.style.width': {
        //     handler (val) {
        //         this.$nextTick(() => {
        //             this.$refs.baseStyle.getComponentOption(this.curComponent.style.objAlign)
        //         })
        //     },
        //     deep: true
        // },
        // 'curComponent.style.height': {
        //     handler (val) {
        //         console.log(111111)
        //     },
        //     deep: true
        // }
    },
    created () {
        // this.activeName = this.curComponent.collapseName
        const url = this.curComponent.propValue.url
        if (url) {
            const imgName = url.substring(url.lastIndexOf("/") + 1)
            this.fileList = [{ name: imgName, url }]
            this.curComponent.propValue.url = url
            this.curComponent.style.url = `./res/img/${imgName}`
        }
    },
    methods: {
        handleChange (val) {
            console.log(val)
            switch (val) {
                case 'LV_LABEL_LONG_EXPAND':
                    this.$set(this.curComponent.style, 'width', 'auto')
                    break;
                case 'LV_LABEL_LONG_BREAK':

                    break;
                case 'LV_LABEL_LONG_DOT':

                    break;
                case 'LV_LABEL_LONG_SROLL':

                    break;
                case 'LV_LABEL_LONG_SROLL_CIRC':

                    break;
                case 'LV_LABEL_LONG_CROP':
                    break;
                default:
                    break;
            }
        },
        onChange () {
            // this.curComponent.collapseName = this.activeName
        },

        isIncludesColor (str) {
            return str.toLowerCase().includes('color')
        },
        handleUploadChange (file, fileList) {
            this.fileList = fileList
            this.$set(this.curComponent.propValue, 'url', file.url)
            this.$set(this.curComponent.style, 'url', `./res/img/${file.name}`)
        },

        handleRemove () {
            this.curComponent.propValue.url = ''
            this.fileList = []
        },
        handlePictureCardPreview () {
            this.dialogImageUrl = this.curComponent.propValue.url;
            this.dialogVisible = true;
        },
        handleNumInput (val) {
            // console.log(val)
            // const { objAlign, left, top, xOffset, yOffset } = this.curComponent.style
            // switch (objAlign) {
            //     case 0:
            //         left = val + left
            //         top = val + top
            //         break;

            //     default:
            //         break;
            // }
        },
        calculateOffset () {

        }
    },
}
</script>

<style lang="scss">
.v-common-attr {
    .el-input-group__prepend {
        padding: 0 10px;
    }
    .slider {
        margin-top: 20px;
    }
}
</style>
