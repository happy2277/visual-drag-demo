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
        <div class="v-text preview" :class="className">
            {{element.style.str || element.style.numStr}}
        </div>
    </div>

</template>


<script>
import { mapState } from 'vuex'
import { keycodes } from '@/utils/shortcutKey.js'
import { $ } from '@/utils/utils'

import eventBus from '@/utils/eventBus'
import { log } from 'mathjs'

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
        },
        'element.style.str': {
            handler (val) {
                this.getClass(this.element.style.longMode)
            },
            deep: true,
            immediate: true
        },
        'element.style.numStr': {
            handler (val) {
                this.getClass(this.element.style.longMode)
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

        eventBus.$on('isRefreshLongModeText', (data) => {
            if (data && this.curComponent.style.longMode == 4) {
                clearInterval(this.timer)
                this.getClass(4)
            } else {
                this.getClass(this.curComponent.style.longMode)
            }
        })
    },
    beforeDestroy () {
        eventBus.$off('componentClick', this.onComponentClick)
    },
    methods: {
        getClass (longMode) {
            clearInterval(this.timer)
            const style = this.curComponent.style
            let flag = true
            if (style.str != undefined && style.str) {
                flag = true
            } else if (style.numStr != undefined && style.numStr) {
                flag = true
            } else {
                flag = false
            }
            if (!flag) return

            if (longMode != 4) {
                this.$nextTick(() => {
                    const dom = $(`#component${this.curComponent.id} .v-text`)
                    dom.style.left = 0
                    dom.style.position = 'static'
                })
            }
            const textSize = this.getTextSize(style.fontSize, '', style.str || style.numStr)
            switch (longMode) {
                case 0:
                    switch (style.objAlign) {
                        // 基点在右
                        case 3: case 6: case 8: case 11: case 14: case 18: case 19: case 20:
                            this.curComponent.style.left = style.left - (textSize.width - style.width)
                            break;
                        // 基点在中
                        case 0: case 2: case 5: case 10: case 13:
                            this.curComponent.style.left = style.left - (textSize.width - style.width) / 2
                            break;
                        default:
                            break;
                    }
                    this.curComponent.style.width = textSize.width
                    this.curComponent.style.height = textSize.height
                    this.className = ''
                    break;
                case 1:
                    this.curComponent.style.height = textSize.height * Math.ceil((textSize.width / style.width))
                    this.className = ''
                    break;
                case 2:
                    this.curComponent.style.height = textSize.height
                    this.className = 'dot'
                    break;
                case 3:
                    this.className = 'scroll'
                    this.curComponent.style.height = textSize.height
                    break;
                case 4:
                    this.$nextTick(() => {
                        this.scrollStr()
                        this.curComponent.style.height = textSize.height
                    })
                    break;
                case 5:
                    this.className = ''
                    this.curComponent.style.height = textSize.height
                    $(`#component${this.curComponent.id}`).style.overflow = 'hidden'
                    break;
                default:
                    break;
            }
        },
        // 长文本模式4  循环滚动 
        scrollStr () {
            const componentDom = $(`#component${this.curComponent.id}`)
            const componentW = componentDom.getBoundingClientRect().width
            const vTextDom = $(`#component${this.curComponent.id} .v-text`)
            const textW = vTextDom.getBoundingClientRect().width
            let i = 0
            const textSize = (this.getTextSize(this.curComponent.style.fontSize, '', this.curComponent.style.str))
            this.curComponent.style.height = textSize.height
            this.timer = setInterval(() => {
                i--
                if (i < -textSize.width) {
                    i = componentW
                }
                vTextDom.style.position = 'absolute'
                vTextDom.style.left = `${i}px`
                componentDom.style.overflow = `hidden`
            }, 20);
        },
        // 获取文本宽高
        getTextSize (fontSize, fontFamily, text) {
            var span = document.createElement("span");
            var result = {};
            span.setAttribute("id", "label-span");
            result.width = span.offsetWidth;
            result.height = span.offsetHeight;
            span.style.visibility = "hidden";
            span.style.fontSize = fontSize + 'px';
            span.style.fontFamily = fontFamily;
            span.style.display = "inline-block";
            document.body.appendChild(span);
            if (typeof span.textContent != "undefined") {
                span.textContent = text;
            } else {
                span.innerText = text;
            }
            result.width = Math.round(parseFloat(span.getBoundingClientRect().width) - result.width);
            result.height = Math.round(parseFloat(span.getBoundingClientRect().height) - result.height);
            document.body.removeChild(span)
            return result;
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
// .v-text {
// width: 100%;
// height: 100%;
// }
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

.preview {
    user-select: none;
}
</style>
