<template>
    <div class="compose-list" @dragstart="handleDragStart">
        <div v-for="(item, index) in componentTempData" :key="index" class="list" draggable :data-index="index" :data-type="'group'">
            <span class="iconfont" :class="'icon-' + item.icon"></span>
            <span>{{item.style.name}}</span>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
        }
    },
    computed: {
        componentTempData () {
            return this.$store.state.componentTempData
        }
    },
    methods: {
        handleDragStart (e) {
            e.dataTransfer.setData('index', e.target.dataset.index)
            e.dataTransfer.setData('type', e.target.dataset.type)
        },
    },
}
</script>

<style lang="scss" scoped>
.compose-list {
    max-height: 30%;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .list {
        width: 100%;
        height: 40px;
        border: 1px solid #ddd;
        cursor: grab;
        text-align: center;
        color: #333;
        margin-bottom: 10px;
        padding: 2px 5px;
        display: flex;
        align-items: center;
        &:last-child {
            margin-bottom: 0;
        }
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
