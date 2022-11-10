<template>
    <div class="v-common-attr">
        <el-collapse v-model="activeName" @change="onChange">
            <BaseStyle ref="baseStyle"></BaseStyle>
            <el-collapse-item title="样式" name="style">
                <el-form>
                    <el-form-item v-for="({ key, label }, index) in styleKeys" :key="index" :label="showLabel({key, label})" :style="{'margin-bottom': showLabel({key, label}) == '' || label == ''? 0 : `18px` }">
                        <!-- 颜色 -->
                        <el-color-picker v-if="isIncludesColor(key)" v-model="curComponent.style[key]" show-alpha></el-color-picker>
                        <!-- 选择 -->
                        <template v-else-if="selectKey.includes(key)">
                            <el-select v-if="key != 'rotate' && curComponent.type != 'img' && key != 'longMode'" v-model="curComponent.style[key]">
                                <el-option v-for="item in optionMap[key]" :key="item.value" :label="item.labelCn" :value="item.value"></el-option>
                            </el-select>
                            <el-select v-if="key == 'rotate' && curComponent.type == 'img'" v-model="curComponent.style[key]">
                                <el-option v-for="item in optionMap[key]" :key="item.value" :label="item.labelCn" :value="item.value"></el-option>
                            </el-select>
                            <el-select v-if="key == 'longMode' && curComponent.type == 'label'" v-model="curComponent.style[key]">
                                <el-option v-for="item in optionMap[key]" :key="item.value" :label="item.labelCn" :value="item.value"></el-option>
                            </el-select>
                        </template>
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
                        <template v-else-if="curComponent.type != 'group'">
                            <el-input v-if="key =='fontSize'" v-model.number="curComponent.style[key]" type="number" @change="handleFontSizeChange" />
                            <el-input v-else-if="numTypeKeys.includes(key)" v-model.number="curComponent.style[key]" type="number" />
                            <el-input v-else v-model.trim="curComponent.style[key]" type="text" @input="handlePriceInput" />
                        </template>
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
import BaseStyle from './BaseStyle'
import { $ } from '@/utils/utils'
import eventBus from '@/utils/eventBus'

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
            fileList: [],
            numTypeKeys: ['width', 'height', 'borderWidth', 'borderRadius', 'fontWeight']
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
        // 'curComponent.style.fontSize': {
        //     handler (val) {
        //         this.getTextHeight(this.curComponent)
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
    beforeDestroy () {
        clearInterval(this.timer)
    },
    methods: {
        handleFontSizeChange (val) {
            // console.log(val)
            this.curComponent.style.fontSize = val
            eventBus.$emit('isRefreshLongModeText', true, this.curComponent)
        },
        showLabel ({ key, label }) {
            const res = this.curComponent.type != 'group' && this.curComponent.type != 'img' && key != 'rotate' ? label
                : this.curComponent.type != 'group' && this.curComponent.type == 'img' ? label
                    : this.curComponent.type == 'group' && key == 'opacity' ? label
                        : ''
            return res
        },
        // 获取文本高度 限制字体大小
        getTextHeight ({ id }) {
            const dom = $(`#component${id} .v-text`)
            const { height } = dom.getBoundingClientRect()
            if (height > this.curComponent.style.height) {
                this.curComponent.style.height = this.curComponent.style.height
                this.curComponent.style.fontSize = this.curComponent.style.fontSize - 1
                this.$message.warning('已至该控件可容纳最大尺寸')
            }
        },

        handlePriceInput (val) {
            this.curComponent.style.numStr = val.replace(/[^\d^\.]/g, '')
        },

        onChange () {

        },

        isIncludesColor (str) {
            return str.toLowerCase().includes('color')
        },
        handleUploadChange (file, fileList) {
            this.fileList = fileList
            // this.compressImage(file.raw).then(res => {
            //     console.log(res)
            // })
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
        /**
        * @param { * } file input选择后返回的file对象
        */
        compressImage (file) {
            // 参数file,是通过input 选择本地文件获取的
            return new Promise((resolve, reject) => {
                const { type, name, size } = file
                let img = new Image()

                // 创建一个reader实例
                let reader = new FileReader()

                // 读取拿到的文件
                reader.readAsDataURL(file)
                reader.onload = (e) => {

                    // 文件加载成功后去转成Img对象，为了拿到图片的原始宽高
                    img.src = e.target.result
                    img.onload = () => {
                        // 创建画布canvas
                        let canvas = document.createElement('canvas')
                        let content = canvas.getContext('2d')

                        // 设置画布的宽高
                        canvas.width = img.width // 需要压缩到的图片宽度
                        canvas.height = img.width * (img.height / img.width)

                        // 将图片画在画布上
                        content.drawImage(img, 0, 0, canvas.width, canvas.height)

                        //画布转成blob格式的图片
                        canvas.toBlob((blob) => {
                            // blob 格式的图片 转成file对象，这里主要看接口支不支持blob格式的文件上传，如果支持就没有必要转
                            let file = new File([blob], name, { type: type, size: size })
                            resolve({ type: type, compressFile: file })
                        }, `image/${type.split('/')[1]}`, 0.3) // 0.7 是文件压缩程度
                    }
                }
            })
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
