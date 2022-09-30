<template>
    <el-collapse-item title="基本" name="base" class="base-container">
        <!--  label-position="right" label-width="120px" -->
        <el-form>
            <el-form-item v-for="({ key, label }, index) in baseStyleData" :key="index" :label="label">
                <template v-if="selectKey.includes(key)">
                    <el-select v-if="key == 'parent'" v-model="curComponent.style[key]" clearable placeholder="请选择" @change="handleParentChange" @clear="handleClear">
                        <el-option v-for="(item, i) in parentOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                    <el-select v-else-if="key == 'base'" clearable v-model="curComponent.style[key]" placeholder="请选择" @change="handleBaseChange" @clear="handleClear">
                        <el-option v-for="(item, i) in parentOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                    <el-select v-else v-model="curComponent.style[key]" placeholder="请选择" @change="handlecontrolChange">
                        <el-option v-for="(item, i) in controlAlignmentOptions" :key="item.value" :value="item.value" :label="item.labelCn">
                            <!-- <span style="float:left;margin-right:10px;color: #8492a6; font-size: 13px">{{ item.labelCn }}</span>
                            <span style="float:right">{{ item.label }}</span> -->
                        </el-option>
                    </el-select>
                    <!-- <el-select :ref="`select_${key}`" v-model="curComponent.style[key]" placeholder="请选择" @change="handleChange" @blur="handleBlur">
                        <el-option v-for="(item, i) in (key == 'parent' || key == 'base' ? parentOptions : controlAlignmentOptions)" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select> -->
                </template>
                <el-input v-else-if="inputKey.includes(key)" v-model="curComponent.style[key]" placeholder="请输入"></el-input>
                <el-input v-else v-model.number="curComponent.style[key]" type="number" @input="handleNumInput" />
            </el-form-item>
        </el-form>
    </el-collapse-item>
</template>

<script>
import { baseStyleData, controlAlignmentOptions } from '@/utils/attr'
import calculateOffsetCoordinate from '@/utils/calculateOffsetCoordinate'

export default {
    data () {
        return {
            baseStyleData,
            controlAlignmentOptions,
            inputKey: ['name', 'base'],
            selectKey: ['parent', 'objAlign', 'base'],
            parent: '',
            base: '',
            objAlign: 1,
            clearStatus: false,
        }
    },
    computed: {
        curComponent () {
            return this.$store.state.curComponent
        },
        componentData () {
            return this.$store.state.componentData
        },
        parentOptions () {
            return this.$store.state.componentParents
        },
        canvasStyleData () {
            return this.$store.state.canvasStyleData
        },
        isNeedCalcOffset () {
            return this.$store.state.isNeedCalcOffset
        }
    },
    watch: {
        'curComponent': {
            handler (val) {
                if (!this.isNeedCalcOffset) return
                calculateOffsetCoordinate(this.curComponent, this.isNeedCalcOffset)
            },
            deep: true
        }
    },
    created () {
        this.parent = this.curComponent.style.parent
        this.base = this.curComponent.style.base
        this.objAlign = this.curComponent.style.objAlign
    },
    methods: {
        // 父级选择
        handleParentChange (val) {
            this.parent = val
            if (!this.curComponent.style.base) {
                this.getComponentOption(this.objAlign)
            }
        },
        handleNumInput () {
            this.$store.commit('setIsNeedCalcOffset', true)
        },
        // 对齐控件选择
        handleBaseChange (val) {
            this.base = val

            if (val) {
                this.getComponentOption(this.objAlign)
            }
        },
        // 控件对齐方式选择
        handlecontrolChange (val) {
            // if (!this.parent && !this.base) {
            //     this.objAlign = ''
            //     this.curComponent.style['objAlign'] = ''
            //     this.$message.warning('请先选择父级或需要对齐的控件')
            //     return
            // }
            this.objAlign = val

            if (val !== '' || val !== null || val !== undefined) {
                this.getComponentOption(val)
            }
        },
        // 清空上级控件或对齐控件
        handleClear () {
            this.getComponentOption(this.objAlign)
        },
        // 获取控件属性
        getComponentOption (val) {
            // 当前控件
            const curComponent = this.curComponent
            // 对齐控件
            let alignComponent = this.componentData.find(v => {
                return v.style.name == this.base
            })
            // 如果没有选择对齐控件，则对齐上级控件，上级控件默认为画布大小
            if (!alignComponent) {
                alignComponent = this.componentData.find(v => {
                    return v.style.name == this.parent
                })
            }
            // 如果对齐控件及父级控件都没有，则return
            // if (!alignComponent) {
            //     return this.$message.warning('请先选择上级控件或需要对齐的控件')
            // }
            if (val === '' || val == null || val == undefined) return

            let alignL, alignT, alignW, alignH
            // 存在上级控件或对齐控件
            if (alignComponent) {
                alignL = alignComponent.style.left
                alignT = alignComponent.style.top
                alignW = alignComponent.style.width
                alignH = alignComponent.style.height
            } else {
                // 不在上级或对齐控件，则直接对齐底部画布
                alignL = 0
                alignT = 0
                alignW = this.canvasStyleData.width
                alignH = this.canvasStyleData.height
            }
            let curW = curComponent.style.width
            let curH = curComponent.style.height

            this.handleAlign({
                val,
                curComponent,
                curW,
                curH,
                alignL,
                alignT,
                alignW,
                alignH
            })
        },
        // 对齐
        handleAlign (value) {
            const {
                val, // 控件对齐方式
                curComponent, // 当前控件
                curW, // 当前控件宽
                curH, // 当前控件高
                alignL, // 对齐控件X坐标
                alignT, // 对齐控件Y坐标
                alignW, // 对齐控件宽
                alignH // 对齐控件高
            } = value
            // 控件对齐方式：默认1；
            // LV_ALIGN_CENTER = 0,//中对齐1
            // LV_ALIGN_IN_TOP_LEFT=1,//内部上左1
            // LV_ALIGN_IN_TOP_MID=2,//内部上中1
            // LV_ALIGN_IN_TOP_RIGHT=3,//内部上右1
            // LV_ALIGN_IN_BOTTOM_LEFT=4,//内部下左1
            // LV_ALIGN_IN_BOTTOM_MID=5,//内部下中1
            // LV_ALIGN_IN_BOTTOM_RIGHT=6,//内部下右1
            // LV_ALIGN_IN_LEFT_MID=7,//内部左中1
            // LV_ALIGN_IN_RIGHT_MID=8,//内部右中1
            // LV_ALIGN_OUT_TOP_LEFT=9,//外部上左1
            // LV_ALIGN_OUT_TOP_MID=10,//外部上中1
            // LV_ALIGN_OUT_TOP_RIGHT=11,//外部上右1
            // LV_ALIGN_OUT_BOTTOM_LEFT=12,//外部下左1
            // LV_ALIGN_OUT_BOTTOM_MID=13,//外部下中1
            // LV_ALIGN_OUT_BOTTOM_RIGHT=14,//外部下右1
            // LV_ALIGN_OUT_LEFT_TOP=15,//外部左上1
            // LV_ALIGN_OUT_LEFT_MID=16,//外部左中1
            // LV_ALIGN_OUT_LEFT_BOTTOM=17,//外部左下1
            // LV_ALIGN_OUT_RIGHT_TOP=18,//外部右上1
            // LV_ALIGN_OUT_RIGHT_MID=19,//外部右中1
            // LV_ALIGN_OUT_RIGHT_BOTTOM=20,//外部右下
            const style = curComponent.style
            let midX, midY, inBottomY, outInX, outY, outBottomX, outBottomMidY, outRight
            midX = alignL + alignW / 2 - curW / 2 // 中X
            midY = alignT + alignH / 2 - curH / 2 // 中Y
            inBottomY = alignT + alignH - curH // 内下
            outInX = alignL + (alignW - curW) // 内右
            outY = alignT - curH // 外Y
            outBottomX = alignL - curW
            outBottomMidY = alignT + alignH
            outRight = alignL + alignW
            switch (val) {
                case 0:
                    this.commonSet({ style, left: midX, top: midY })
                    break;
                case 1:
                    this.commonSet({ style, left: alignL, top: alignT })
                    break;
                case 2:
                    this.commonSet({ style, left: midX, top: alignT })
                    break;
                case 3:
                    this.commonSet({ style, left: outInX, top: alignT })
                    break;
                case 4:
                    this.commonSet({ style, left: alignL, top: inBottomY })
                    break;
                case 5:
                    this.commonSet({ style, left: midX, top: inBottomY })
                    break;
                case 6:
                    this.commonSet({ style, left: outInX, top: inBottomY })
                    break;
                case 7:
                    this.commonSet({ style, left: alignL, top: midY })
                    break;
                case 8:
                    this.commonSet({ style, left: outInX, top: midY })
                    break;
                case 9:
                    this.commonSet({ style, left: alignL, top: outY })
                    break;
                case 10:
                    this.commonSet({ style, left: midX, top: outY })
                    break;
                case 11:
                    this.commonSet({ style, left: outRight, top: outY })
                    break;
                case 12:
                    this.commonSet({ style, left: alignL, top: outBottomMidY })
                    break;
                case 13:
                    this.commonSet({ style, left: midX, top: outBottomMidY })
                    break;
                case 14:
                    this.commonSet({ style, left: outRight, top: outBottomMidY })
                    break;
                case 15:
                    this.commonSet({ style, left: outBottomX, top: alignT })
                    break;
                case 16:
                    this.commonSet({ style, left: outBottomX, top: midY })
                    break;
                case 17:
                    this.commonSet({ style, left: outBottomX, top: outBottomMidY })
                    break;
                case 18:
                    this.commonSet({ style, left: outRight, top: alignT })
                    break;
                case 19:
                    this.commonSet({ style, left: outRight, top: midY })
                    break;
                default:
                    this.commonSet({ style, left: outRight, top: inBottomY })
                    break;
            }
            curComponent.style.xOffset = 0
            curComponent.style.yOffset = 0

            this.$store.commit('setIsNeedCalcOffset', false)
            calculateOffsetCoordinate('', this.isNeedCalcOffset)
        },
        commonSet ({ style, left, top }) {
            this.$set(style, 'left', left)
            this.$set(style, 'top', top)
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
