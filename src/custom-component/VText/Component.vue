<!-- eslint-disable vue/no-v-html -->
<template>
    <!-- <div v-if="editMode == 'edit'" class="v-text" @keydown="handleKeydown" @keyup="handleKeyup">
        tabindex >= 0 使得双击时聚焦该元素
        <div ref="text" :contenteditable="canEdit" :class="{ 'can-edit': canEdit }" tabindex="0" :style="{ verticalAlign: element.style.verticalAlign }" @dblclick="setEdit" @paste="clearStyle" @mousedown="handleMousedown" @blur="handleBlur" @input="handleInput" v-html="element.propValue"></div>
    </div>
    <div v-else class="v-text preview">
        <div :style="{ verticalAlign: element.style.verticalAlign }" v-html="element.propValue"></div>
    </div> -->
    <div class="v-text preview" :class="className">
        {{element.style.str || element.style.numStr}}
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
            intervalId: null
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
            switch (longMode) {
                case 0:

                    break;
                case 1:

                    break;
                case 2:
                    this.className = 'dot'
                    break;
                case 3:
                    this.className = 'auto'
                    clearInterval(this.intervalId)
                    this.intervalId = null
                    break;
                case 4:
                    $(`#component${this.element.id}`)
                    console.log($(`#component${this.element.id}`).style.width)
                    if (this.intervalId != null) return
                    //箭头解决this指向问题，由内部的指向外部
                    this.intervalId = setInterval(() => {
                        //获取到头的第一个字符
                        var start = this.element.style.str.substring(0, 1)
                        //获取到后面的所有字符
                        var end = this.element.style.str.substring(1)
                        //重新拼接得到新的字符串，并赋值给this.msg
                        this.element.style.str = end + start
                        //注意：vm实例，会监听自己身上data中所有数据的改变，只要数据一发生变化，就会把最新数据，从data上同步到页面中去
                    }, 100)
                    break;
                case 5:
                    this.className = 'crop'
                    break;
                default:
                    break;
            }
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
.v-text {
    width: 100%;
    height: 100%;
}
.dot {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
