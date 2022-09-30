<template>
    <div class="rect-shape">
        <!-- :prop-value="element.propValue" -->
        <v-text :element="element" />
    </div>
</template>

<script>


export default {

    props: {
        propValue: {
            type: String,
            default: '',
        },
        element: {
            type: Object,
            default: () => { },
        },
    },
}
</script>

<style lang="scss" scoped>
.rect-shape {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>
