<template>
    <div>
        <div class="toolbar">
            <el-button @click="undo">撤消</el-button>
            <el-button @click="redo">重做</el-button>
            <!-- <label for="input" class="insert">
                插入图片
                <input id="input" type="file" hidden @change="handleFileChange" />
            </label> -->

            <el-button style="margin-left: 10px;" @click="preview(false)">预览</el-button>
            <el-button @click="handleConfirm">保存</el-button>
            <el-button @click="saveTemp">保存为组合模板</el-button>
            <el-button @click="clearCanvas">清空画布</el-button>
            <el-button :disabled="!areaData.components.length" @click="compose">组合</el-button>
            <el-button :disabled="!curComponent || curComponent.isLock || curComponent.component != 'Group'" @click="decompose">
                拆分
            </el-button>

            <el-button :disabled="!curComponent || curComponent.isLock" @click="lock">锁定</el-button>
            <el-button :disabled="!curComponent || !curComponent.isLock" @click="unlock">解锁</el-button>
            <!-- <el-button @click="preview(true)">截图</el-button> -->

            <!-- <div class="canvas-config">
                <span>画布大小</span>
                <input v-model="canvasStyleData.width">
                <span>*</span>
                <input v-model="canvasStyleData.height">
            </div> -->
            <!-- <div class="canvas-config">
                <span>画布比例</span>
                <input v-model="scale" @input="handleScaleChange"> %
            </div> -->
        </div>

        <!-- 预览 -->
        <Preview v-if="isShowPreview" :is-screenshot="isScreenshot" @close="handlePreviewChange" />
    </div>
</template>

<script>
import generateID from '@/utils/generateID'
import toast from '@/utils/toast'
import { mapState } from 'vuex'
import Preview from '@/components/Editor/Preview'
import { commonStyle, commonAttr } from '@/custom-component/component-list'
import eventBus from '@/utils/eventBus'
import { $, deepCopy } from '@/utils/utils'
import changeComponentsSizeWithScale, { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'

export default {
    components: { Preview },
    data () {
        return {
            isShowPreview: false,
            timer: null,
            isScreenshot: false,
            scale: 100,
        }
    },
    computed: mapState([
        'componentData',
        'canvasStyleData',
        'areaData',
        'curComponent',
        'curComponentIndex',
    ]),
    created () {
        eventBus.$on('preview', this.preview)
        eventBus.$on('save', this.save)
        eventBus.$on('clearCanvas', this.clearCanvas)

        this.scale = this.canvasStyleData.scale
    },
    methods: {
        handleScaleChange () {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                // 画布比例设一个最小值，不能为 0
                // eslint-disable-next-line no-bitwise
                this.scale = (~~this.scale) || 1
                changeComponentsSizeWithScale(this.scale)
            }, 1000)
        },

        lock () {
            this.$store.commit('lock')
        },

        unlock () {
            this.$store.commit('unlock')
        },

        compose () {
            this.$store.commit('compose')
            this.$store.commit('recordSnapshot')
        },

        decompose () {
            this.$store.commit('decompose')
            this.$store.commit('recordSnapshot')
        },

        undo () {
            this.$store.commit('undo')
        },

        redo () {
            this.$store.commit('redo')
        },

        handleFileChange (e) {
            const file = e.target.files[0]
            if (!file.type.includes('image')) {
                toast('只能插入图片')
                return
            }

            const reader = new FileReader()
            reader.onload = (res) => {
                const fileResult = res.target.result
                const img = new Image()
                img.onload = () => {
                    const component = {
                        ...commonAttr,
                        id: generateID(),
                        component: 'Picture',
                        label: '图片',
                        icon: '',
                        propValue: {
                            url: fileResult,
                            flip: {
                                horizontal: false,
                                vertical: false,
                            },
                        },
                        style: {
                            ...commonStyle,
                            top: 0,
                            left: 0,
                            width: img.width,
                            height: img.height,
                        },
                    }

                    // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
                    changeComponentSizeWithScale(component)

                    this.$store.commit('addComponent', { component })
                    this.$store.commit('recordSnapshot')

                    // 修复重复上传同一文件，@change 不触发的问题
                    $('#input').setAttribute('type', 'text')
                    $('#input').setAttribute('type', 'file')
                }

                img.src = fileResult
            }

            reader.readAsDataURL(file)
        },

        preview (isScreenshot) {
            this.isScreenshot = isScreenshot
            this.isShowPreview = true
            this.$store.commit('setEditMode', 'preview')
        },
        // 是否重复的name
        isRepeat (arr) {
            var hash = {};
            for (let i = 0; i < arr.length; i++) {
                if (!hash[arr[i].style.name]) {
                    hash[arr[i].style.name] = true;
                }
            }
            if (Object.keys(hash).length > 1) {
                return false
            } else {
                return true
            }
        },

        // 确定保存
        handleConfirm () {
            this.$confirm('确定保存?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success'
            }).then(() => {
                this.save()
            }).catch(() => {
            });
        },

        save () {
            const componentData = deepCopy(this.componentData)
            let flag = false
            const isRepeat = componentData.length > 1 ? this.isRepeat(componentData) : false
            if (isRepeat) return this.$message.warning('存在重复的控件名称，请检查！')

            componentData.some(v => {
                if (!v.style.name) {
                    flag = true
                    return this.$message.warning('存在未填写控件名称的控件，请检查！')
                }
            })
            if (flag) return
            let data = []
            const canvasStyleData = this.canvasStyleData
            // 根容器
            const allComponentParent = {
                type: 'cont',
                rootParent: true,
                style: {
                    xOffset: 0,
                    yOffset: 0,
                    name: canvasStyleData.name,
                    width: canvasStyleData.width,
                    height: canvasStyleData.height,
                    borderRadius: canvasStyleData.borderRadius,
                    borderWidth: canvasStyleData.borderWidth,
                    backgroundColor: canvasStyleData.backgroundColor,
                    fontSize: canvasStyleData.fontSize
                }
            }
            componentData.unshift(allComponentParent)
            componentData.forEach(v => {
                const { style } = v
                const common = {
                    type: v.type,
                    name: style.name,
                    par: style.parent || canvasStyleData.name,
                    base: style.base || canvasStyleData.name,
                    obj_align: style.objAlign ?? 1,
                    x: style.xOffset,
                    y: style.yOffset
                }
                let obj
                // 非组合
                if (v.type != 'group') {
                    obj = this.commonSwitch(v)
                    const res = {
                        ...common,
                        ...obj
                    }
                    data.push(res)
                } else {
                    // 组合
                    v.propValue.forEach(item => {
                        obj = this.commonSwitch(item)
                        const res = {
                            ...common,
                            ...obj,
                            name: item.style.name || canvasStyleData.name,
                            type: item.type,
                            par: item.style.parent || canvasStyleData.name,
                            base: item.style.base ?? '',
                            obj_align: item.style.objAlign
                        }
                        data.push(res)
                    })
                }

            })
            // 删除根容器的par、base
            delete data[0].par
            delete data[0].base

            console.table(data)
            localStorage.setItem('canvasData', JSON.stringify(componentData))
            localStorage.setItem('canvasStyle', JSON.stringify(this.canvasStyleData))
            this.$message.success('保存成功')
            this.clearCanvas()
        },

        commonSwitch (v) {
            const { style, propValue } = v
            const w = style.width
            const h = style.height
            const reg = /(?<=\()(.+?)(?=\))/g;
            let obj, bgColorVal, bgColorObj, resBgClVal, colorVal, colorObj, resClVal
            if (style.backgroundColor) {
                bgColorVal = (style.backgroundColor.match(reg))[0].split(',')
                bgColorObj = this.getColorObj(bgColorVal)
                resBgClVal = this.colorCalc(bgColorObj)
            }
            switch (v.type) {
                case 'cont':
                    obj = {
                        w,
                        h,
                        radius: style.borderRadius,
                        border_width: style.borderWidth,
                        bg_color: resBgClVal
                    }
                    break;
                case 'img':
                    obj = {
                        w,
                        h,
                        opa: style.opacity * 255,
                        path: style.url,
                        angle: style.rotate
                    }
                    break;
                case 'line':
                    obj = {
                        width: style.width,
                        // round: style.,
                        color: resBgClVal,
                        point: [{ x: style.left, y: style.top }, { x: style.left + style.width, y: style.top }],
                        // hide
                    }
                    break;
                case 'label':
                    colorVal = (style.color.match(reg))[0].split(',')
                    colorObj = this.getColorObj(colorVal)
                    resClVal = this.colorCalc(colorObj)
                    const textAlign = style.textAlign == 'left' ?
                        0 : style.textAlign == 'center' ?
                            1 : style.textAlign == 'right' ?
                                2 : 3
                    obj = {
                        w,
                        h,
                        radius: style.opacity,
                        text_color: resClVal,
                        bg_color: resBgClVal,
                        font: style.font,
                        size: style.fontSize,
                        bold: style.fontWeight,
                        base_line: style.baseLine,
                        text_align: textAlign,
                        long_mode: style.longMode ?? '',
                        str: style.str || style.numStr,
                        hide: style.display == 'block' ? 1 : 0
                    }
                    break;
                case 'bar':
                    obj = {
                        w,
                        h,
                        // min,
                        // max,
                        // anim_time,
                        // anim_on,
                        value: style.percentage
                    }
                    break;
                default:
                    break;
            }
            return obj
        },

        getColorObj (colorVal) {
            let obj = {}
            obj.r = colorVal[0]
            obj.g = colorVal[1]
            obj.b = colorVal[2]
            obj.a = colorVal[3]
            return obj
        },
        colorCalc ({ r, g, b, a }) {
            return a * 255 * 256 * 256 * 256 + r * 256 * 256 + g * 256 + b * 1
        },

        saveTemp () {
            const componentData = deepCopy(this.componentData)
            let flag = false
            if (!componentData.length) {
                return this.$message.warning('无控件，请先添加控件！')
            }

            const isRepeat = componentData.length > 1 ? this.isRepeat(componentData) : false
            if (isRepeat) return this.$message.warning('存在重复的控件名称，请检查！')

            for (let i = 0; i < componentData.length; i++) {
                const v = componentData[i];
                if (v.type == 'group') {
                    flag = true
                    break
                }
            }
            // 不存在组合
            if (!flag) {
                this.$confirm('不存在组合，将所有控件保存为一个模板控件，是否确定?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    eventBus.$emit('saveTemp', true)
                    this.clearCanvas()
                }).catch(() => { });
            } else {
                // 存在组合
                this.$confirm('存在组合控件，是否将组合控件保存为模板控件?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$store.commit('setComponentTempData', componentData)
                    localStorage.setItem('canvasTempData', JSON.stringify(this.$store.state.componentTempData))
                    localStorage.setItem('canvasStyle', JSON.stringify(this.canvasStyleData))
                    this.$message.success('保存成功')
                    this.clearCanvas()
                }).catch(() => { });
            }
        },

        clearCanvas () {
            this.$store.commit('setCurComponent', { component: null, index: null })
            this.$store.commit('setComponentData', [])
            this.$store.commit('recordSnapshot')
        },

        handlePreviewChange () {
            this.isShowPreview = false
            this.$store.commit('setEditMode', 'edit')
        },
    },
}
</script>

<style lang="scss" scoped>
.toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 10px;
    white-space: nowrap;
    overflow-x: auto;
    background: #fff;
    border-bottom: 1px solid #ddd;

    .canvas-config {
        display: inline-block;
        margin-left: 10px;
        font-size: 14px;
        color: #606266;

        input {
            width: 50px;
            margin-left: 4px;
            outline: none;
            padding: 0 5px;
            border: 1px solid #ddd;
            color: #606266;
        }

        span {
            margin-left: 10px;
        }
    }

    .insert {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #dcdfe6;
        color: #606266;
        appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        margin: 0;
        transition: 0.1s;
        font-weight: 500;
        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
        margin-left: 10px;

        &:active {
            color: #3a8ee6;
            border-color: #3a8ee6;
            outline: 0;
        }

        &:hover {
            background-color: #ecf5ff;
            color: #3a8ee6;
        }
    }
}
</style>
