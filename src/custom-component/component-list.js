// 公共样式
export const commonStyle = {
    rotate: 0,
    opacity: 1,
}

export const commonAttr = {
    groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
    isLock: false, // 是否锁定组件
    collapseName: 'base', // 编辑组件时记录当前使用的是哪个折叠面板，再次回来时恢复上次打开的折叠面板，优化用户体验
}

// 编辑器左侧组件列表
const list = [
    {
        component: 'RectShape',
        label: '容器',
        propValue: '',
        type: 'cont',
        icon: 'juxing',
        style: {
            name: '',
            parent: '',
            width: 200,
            height: 200,
            // fontSize: '14',
            // fontWeight: 400,
            // lineHeight: '',
            // letterSpacing: 0,
            // textAlign: 'left',
            // color: '',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 1,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderStyle: 'solid',
            borderRadius: '',
            // verticalAlign: 'middle',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'RectShape',
        label: '商品容器',
        propValue: '',
        type: 'cont',
        icon: 'juxing',
        style: {
            name: '',
            parent: '',
            width: 200,
            height: 200,
            // fontSize: '14',
            // fontWeight: 400,
            // lineHeight: '',
            // letterSpacing: 0,
            // textAlign: 'left',
            // color: '',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 1,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderStyle: 'solid',
            borderRadius: '',
            // verticalAlign: 'middle',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'LineShape',
        label: '线条',
        propValue: '',
        type: 'line',
        icon: 'zhixian',
        style: {
            name: '',
            parent: '',
            width: 200,
            height: 1,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            display: 0,
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'Picture',
        label: '背景图',
        icon: 'tupian',
        type: 'img',
        propValue: {
            url: require('@/assets/img/pangyou.gif'),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            url: '',
            name: '',
            parent: '',
            width: 300,
            height: 200,
            borderRadius: '',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0,
            rotate: 0
        },
    },
    {
        component: 'RectShape',
        label: '媒体播放区',
        propValue: '',
        type: 'cont',
        icon: 'juxing',
        style: {
            name: '',
            parent: '',
            width: 200,
            height: 200,
            // fontSize: '14',
            // fontWeight: 400,
            // lineHeight: '',
            // letterSpacing: 0,
            // textAlign: 'left',
            // color: '',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 1,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderStyle: 'solid',
            borderRadius: '',
            // verticalAlign: 'middle',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'VText',
        label: '商品名称',
        type: 'label',
        propValue: '',
        icon: 'wenben',
        style: {
            parent: '',
            name: '',
            base: '',
            str: '商品名称',
            width: 200,
            height: 60,
            font: './res/font/bls.ttf',
            fontSize: '14',
            fontWeight: 400,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: 'left',
            longMode: 0,
            baseLine: 6,
            color: 'rgba(0, 0, 0, 1)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            display: 0,
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'Picture',
        label: '商品图',
        icon: 'tupian',
        type: 'img',
        propValue: {
            url: require('@/assets/img/pangyou.gif'),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            url: '',
            name: '',
            parent: '',
            width: 300,
            height: 200,
            borderRadius: '',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0,
            rotate: 0
        },
    },
    {
        component: 'Picture',
        label: '胖柚Logo',
        icon: 'tupian',
        type: 'img',
        propValue: {
            url: require('@/assets/img/pangyou.gif'),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            url: '',
            name: '',
            parent: '',
            width: 300,
            height: 200,
            borderRadius: '',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0,
            rotate: 0
        },
    },
    {
        component: 'Picture',
        label: '商家Logo',
        icon: 'tupian',
        type: 'img',
        propValue: {
            url: require('@/assets/img/pangyou.gif'),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            url: '',
            name: '',
            parent: '',
            width: 300,
            height: 200,
            borderRadius: '',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0,
            rotate: 0
        },
    },
    {
        component: 'VText',
        label: '价签名称',
        type: 'label',
        propValue: '',
        icon: 'wenben',
        style: {
            parent: '',
            name: '',
            base: '',
            str: '价签名称',
            width: 200,
            height: 60,
            font: './res/font/bls.ttf',
            fontSize: '14',
            fontWeight: 400,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: 'left',
            longMode: 0,
            baseLine: 6,
            color: 'rgba(0, 0, 0, 1)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            display: 0,
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'Picture',
        label: '价签SN码',
        icon: 'tupian',
        type: 'img',
        propValue: {
            url: require('@/assets/img/pangyou.gif'),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            url: '',
            name: '',
            parent: '',
            width: 300,
            height: 200,
            borderRadius: '',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0,
            rotate: 0
        },
    },
    {
        component: 'Picture',
        label: '商品一维码',
        icon: 'tupian',
        type: 'img',
        propValue: {
            url: require('@/assets/img/pangyou.gif'),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            url: '',
            name: '',
            parent: '',
            width: 300,
            height: 200,
            borderRadius: '',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0,
            rotate: 0
        },
    },
    {
        component: 'Picture',
        label: '商品二维码（溯源码）',
        icon: 'tupian',
        type: 'img',
        propValue: {
            url: require('@/assets/img/pangyou.gif'),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            url: '',
            name: '',
            parent: '',
            width: 300,
            height: 200,
            borderRadius: '',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0,
            rotate: 0
        },
    },
    {
        component: 'VText',
        label: '单位',
        type: 'label',
        propValue: '',
        icon: 'wenben',
        style: {
            parent: '',
            name: '',
            base: '',
            str: '单位',
            width: 200,
            height: 60,
            font: './res/font/bls.ttf',
            fontSize: '14',
            fontWeight: 400,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: 'left',
            longMode: 0,
            baseLine: 6,
            color: 'rgba(0, 0, 0, 1)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            display: 0,
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'VText',
        label: '商品附加信息',
        type: 'label',
        propValue: '',
        icon: 'wenben',
        style: {
            parent: '',
            name: '',
            base: '',
            str: '商品附加信息',
            width: 200,
            height: 60,
            font: './res/font/bls.ttf',
            fontSize: '14',
            fontWeight: 400,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: 'left',
            longMode: 0,
            baseLine: 6,
            color: 'rgba(0, 0, 0, 1)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            display: 0,
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'Picture',
        label: '胖柚APP二维码',
        icon: 'tupian',
        type: 'img',
        propValue: {
            url: require('@/assets/img/pangyou.gif'),
            flip: {
                horizontal: false,
                vertical: false,
            },
        },
        style: {
            url: '',
            name: '',
            parent: '',
            width: 300,
            height: 200,
            borderRadius: '',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0,
            rotate: 0
        },
    },
    {
        component: 'RectShape',
        label: '价格面板',
        propValue: '',
        type: 'cont',
        icon: 'juxing',
        style: {
            name: '',
            parent: '',
            width: 200,
            height: 200,
            // fontSize: '14',
            // fontWeight: 400,
            // lineHeight: '',
            // letterSpacing: 0,
            // textAlign: 'left',
            // color: '',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 1,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            borderStyle: 'solid',
            borderRadius: '',
            // verticalAlign: 'middle',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'VText',
        label: '价格    ',
        type: 'label',
        propValue: '',
        icon: 'wenben',
        style: {
            parent: '',
            name: '',
            base: '',
            numStr: '100',
            width: 200,
            height: 60,
            font: './res/font/bls_pri.ttf',
            fontSize: '14',
            fontWeight: 400,
            lineHeight: '',
            letterSpacing: 0,
            textAlign: 'left',
            longMode: 0,
            baseLine: 7,
            color: 'rgba(0, 0, 0, 1)',
            backgroundColor: 'rgba(255, 255, 255, 0)',
            display: 0,
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    }
    // {
    //     component: 'Bar',
    //     label: '进度条',
    //     propValue: '',
    //     type: 'bar',
    //     icon: 'zhixian',
    //     style: {
    //         name: '',
    //         parent: '',
    //         width: 200,
    //         height: 26,
    //         // backgroundColor: 'rgba(255, 255, 255, 0)',
    //         color: '',
    //         percentage: 0
    //     },
    // },
]
for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    item.style = { ...commonStyle, ...item.style }
    list[i] = { ...commonAttr, ...item }
}

export default list
