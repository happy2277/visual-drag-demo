<!-- eslint-disable vue/no-v-html -->
<template>
    <!-- <div v-if="editMode == 'edit'" class="v-text" @keydown="handleKeydown" @keyup="handleKeyup">
        tabindex >= 0 使得双击时聚焦该元素
        <div ref="text" :contenteditable="canEdit" :class="{ 'can-edit': canEdit }" tabindex="0" :style="{ verticalAlign: element.style.verticalAlign }" @dblclick="setEdit" @paste="clearStyle" @mousedown="handleMousedown" @blur="handleBlur" @input="handleInput" v-html="element.propValue"></div>
    </div>
    <div v-else class="v-text preview">
        <div :style="{ verticalAlign: element.style.verticalAlign }" v-html="element.propValue"></div>
    </div> -->
    <div>
        <!-- 循环滚动 长文本模式4 -->
        <div v-if="element.style.str && element.style.longMode == 4" id="scroll-div">
            <div class="v-text" id="scroll-begin">{{element.style.str}}</div>
            <div id="scroll-end"></div>
        </div>
        <div v-else class="v-text preview" :class="className">
            {{element.style.str || element.style.numStr}}
        </div>
    </div>

</template>


<script>
import { mapState } from 'vuex'
import { keycodes } from '@/utils/shortcutKey.js'
import { $ } from '@/utils/utils'

import eventBus from '@/utils/eventBus'

export default {

    props: {
        // propValue: {
        //     type: String,
        //     required: true,
        //     default: '',
        // },
        element: {
            type: Object,
            default: () => { },
        },
    },
    data () {
        return {
            canEdit: false,
            ctrlKey: 17,
            isCtrlDown: false,
            className: '',
            timer: null
        }
    },
    watch: {
        'element.style.longMode': {
            handler (val) {
                this.getClass(val)
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        ...mapState([
            'editMode',
            'curComponent',
        ]),

    },
    created () {
        eventBus.$on('componentClick', this.onComponentClick)
    },
    beforeDestroy () {
        eventBus.$off('componentClick', this.onComponentClick)
    },
    methods: {
        getClass (longMode) {
            if (longMode != 4) {
                clearInterval(this.timer)
            }
            switch (longMode) {
                case 0: case 1:
                    this.className = ''
                    break;
                case 2:
                    this.className = 'dot'
                    break;
                case 3:
                    this.className = 'scroll'
                    break;
                case 4:
                    this.$nextTick(() => {
                        this.scrollStr()
                    })
                    break;
                case 5:
                    this.className = 'crop'
                    break;
                default:
                    break;
            }
        },
        // 长文本模式4  循环滚动 
        scrollStr () {
            var speed = 20 //初始化速度 也就是字体的整体滚动速度
            var scroll_begin = $('#scroll-begin') //获取滚动的开头id
            var scroll_end = $('#scroll-end') //获取滚动的结束id
            var scroll_div = $('#scroll-div') //获取整体的开头id
            scroll_end.innerHTML = scroll_begin.innerHTML //滚动的是html内部的内容,原生知识!
            function Marquee () {
                if (scroll_end.offsetWidth - scroll_div.scrollLeft <= -20) {
                    scroll_div.scrollLeft -= (scroll_begin.offsetWidth)
                } else {
                    scroll_div.scrollLeft++
                }
            }
            this.timer = setInterval(Marquee, speed)
        },
        onComponentClick () {
            // 如果当前点击的组件 id 和 VText 不是同一个，需要设为不允许编辑 https://github.com/woai3c/visual-drag-demo/issues/90
            if (this.curComponent.id !== this.element.id) {
                this.canEdit = false
            }
        },

        handleInput (e) {
            this.$emit('input', this.element, e.target.innerHTML)
        },

        handleKeydown (e) {
            // 阻止冒泡，防止触发复制、粘贴组件操作
            this.canEdit && e.stopPropagation()
            if (e.keyCode == this.ctrlKey) {
                this.isCtrlDown = true
            } else if (this.isCtrlDown && this.canEdit && keycodes.includes(e.keyCode)) {
                e.stopPropagation()
            } else if (e.keyCode == 46) { // deleteKey
                e.stopPropagation()
            }
        },

        handleKeyup (e) {
            // 阻止冒泡，防止触发复制、粘贴组件操作
            this.canEdit && e.stopPropagation()
            if (e.keyCode == this.ctrlKey) {
                this.isCtrlDown = false
            }
        },

        handleMousedown (e) {
            if (this.canEdit) {
                e.stopPropagation()
            }
        },

        clearStyle (e) {
            e.preventDefault()
            const clp = e.clipboardData
            const text = clp.getData('text/plain') || ''
            if (text !== '') {
                document.execCommand('insertText', false, text)
            }

            this.$emit('input', this.element, e.target.innerHTML)
        },

        handleBlur (e) {
            this.element.propValue = e.target.innerHTML || '&nbsp;'
            const html = e.target.innerHTML
            if (html !== '') {
                this.element.propValue = e.target.innerHTML
            } else {
                this.element.propValue = ''
                this.$nextTick(() => {
                    this.element.propValue = '&nbsp;'
                })
            }
            this.canEdit = false
        },

        setEdit () {
            if (this.element.isLock) return

            this.canEdit = true
            // 全选
            this.selectText(this.$refs.text)
        },

        selectText (element) {
            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(element)
            selection.removeAllRanges()
            selection.addRange(range)
        },
    },
}
</script>

<style lang="scss" scoped>
#scroll-div {
    overflow: hidden;
    white-space: nowrap;
}
#scroll-begin,
#scroll-end {
    display: inline;
    padding-right: 20px;
}
.v-text {
    // width: 100%;
    // height: 100%;
}
.dot {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.scroll {
    white-space: nowrap;
    overflow: auto;
}
.auto {
    overflow-x: auto;
}
.crop {
    overflow: hidden;
}

.preview {
    user-select: none;
}
</style>
