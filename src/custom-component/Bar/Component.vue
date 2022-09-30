<template>
    <div class="bar">
        <el-progress :text-inside="true" :stroke-width="element.style.height" :color="element.style.color" :percentage="element.style.percentage"></el-progress>
    </div>
</template>

<script>

export default {
    props: {
        element: {
            type: Object,
            default: () => { },
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
