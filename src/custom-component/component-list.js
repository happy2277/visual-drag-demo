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
        component: 'VText',
        label: '文本',
        type: 'label',
        propValue: '',
        icon: 'wenben',
        tag: 'normal',
        style: {
            parent: '',
            name: '',
            base: '',
            str: 'label',
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
        label: '价格    ',
        type: 'label',
        propValue: '',
        icon: 'wenben',
        tag: 'price',
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
    },
    // {
    //     component: 'VText',
    //     label: '零售价',
    //     type: 'label',
    //     propValue: '',
    //     icon: 'wenben',
    //     tag: 'price',
    //     style: {
    //         parent: '',
    //         name: '',
    //         base: '',
    //         numStr: '',
    //         width: 200,
    //         height: 60,
    //         font: './res/font/bls_pri.ttf',
    //         fontSize: '14',
    //         fontWeight: 400,
    //         lineHeight: '',
    //         letterSpacing: 0,
    //         textAlign: 'left',
    //         longMode: 0,
    //         baseLine: 7,
    //         color: 'rgba(0, 0, 0, 1)',
    //         backgroundColor: 'rgba(255, 255, 255, 0)',
    //         objAlign: 1,
    //         xOffset: 0,
    //         yOffset: 0
    //     },
    // },
    // {
    //     component: 'VText',
    //     label: '会员价',
    //     type: 'label',
    //     propValue: '',
    //     icon: 'wenben',
    //     tag: 'price',
    //     style: {
    //         parent: '',
    //         name: '',
    //         base: '',
    //         numStr: '',
    //         width: 200,
    //         height: 60,
    //         font: './res/font/bls_pri.ttf',
    //         fontSize: '14',
    //         fontWeight: 400,
    //         lineHeight: '',
    //         letterSpacing: 0,
    //         textAlign: 'left',
    //         longMode: 0,
    //         baseLine: 7,
    //         color: 'rgba(0, 0, 0, 1)',
    //         backgroundColor: 'rgba(255, 255, 255, 0)',
    //         objAlign: 1,
    //         xOffset: 0,
    //         yOffset: 0
    //     },
    // },
    // {
    //     component: 'VText',
    //     label: '胖柚价',
    //     type: 'label',
    //     propValue: '',
    //     icon: 'wenben',
    //     tag: 'price',
    //     style: {
    //         parent: '',
    //         name: '',
    //         base: '',
    //         numStr: '',
    //         width: 200,
    //         height: 60,
    //         font: './res/font/bls_pri.ttf',
    //         fontSize: '14',
    //         fontWeight: 400,
    //         lineHeight: '',
    //         letterSpacing: 0,
    //         textAlign: 'left',
    //         longMode: 0,
    //         baseLine: 7,
    //         color: 'rgba(0, 0, 0, 1)',
    //         backgroundColor: 'rgba(255, 255, 255, 0)',
    //         objAlign: 1,
    //         xOffset: 0,
    //         yOffset: 0
    //     },
    // },
    {
        component: 'Picture',
        label: '图片',
        icon: 'tupian',
        type: 'img',
        tag: 'img',
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
    // {
    //     component: 'Picture',
    //     label: '商品',
    //     icon: 'tupian',
    //     type: 'img',
    //     tag: 'img',
    //     propValue: {
    //         url: require('@/assets/img/pangyou.gif'),
    //         flip: {
    //             horizontal: false,
    //             vertical: false,
    //         },
    //     },
    //     style: {
    //         url: '',
    //         name: '',
    //         parent: '',
    //         width: 300,
    //         height: 200,
    //         borderRadius: '',
    //         objAlign: 1,
    //         xOffset: 0,
    //         yOffset: 0,
    //         rotate: 0
    //     },
    // },
    {
        component: 'RectShape',
        label: '容器',
        propValue: '',
        type: 'cont',
        icon: 'juxing',
        tag: 'normal',
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
            // borderColor: '#000',
            borderWidth: 1,
            backgroundColor: 'rgba(255, 255, 255, 0)',
            // borderStyle: 'solid',
            borderRadius: '',
            // verticalAlign: 'middle',
            objAlign: 1,
            xOffset: 0,
            yOffset: 0
        },
    },
    {
        component: 'LineShape',
        label: '直线',
        propValue: '',
        type: 'line',
        icon: 'zhixian',
        tag: 'normal',
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
    {
        "component": "Group",
        "label": "组合",
        "icon": "zuhe",
        "groupStyle": {},
        "isLock": false,
        "collapseName": "base",
        "style": {
            "rotate": 0,
            "opacity": 1,
            "left": 160,
            "top": 213,
            "width": 429,
            "height": 342,
            "name": "group_0",
            "objAlign": 1,
            "xOffset": 160,
            "yOffset": 213
        },
        "propValue": [
            {
                "groupStyle": {
                    "transform": "rotate(0deg)",
                    "opacity": 1,
                    "name": "cont_1",
                    "width": "100%",
                    "height": "100%",
                    "borderWidth": "1px",
                    "backgroundColor": "rgba(255, 255, 255, 0)",
                    "objAlign": 1,
                    "xOffset": 190,
                    "yOffset": 202,
                    "top": "0%",
                    "left": "0%"
                },
                "isLock": false,
                "collapseName": "base",
                "component": "RectShape",
                "label": "容器",
                "propValue": "",
                "type": "cont",
                "icon": "juxing",
                "tag": "normal",
                "style": {
                    "rotate": 0,
                    "opacity": 1,
                    "name": "cont_1",
                    "width": 429,
                    "height": 342,
                    "borderWidth": 1,
                    "backgroundColor": "rgba(255, 255, 255, 0)",
                    "borderRadius": "",
                    "objAlign": 1,
                    "xOffset": 190,
                    "yOffset": 202,
                    "top": 202,
                    "left": 190
                },
                "id": "pih-dZG1VLmW984Wv5MI8"
            },
            {
                "groupStyle": {
                    "transform": "rotate(0deg)",
                    "opacity": 1,
                    "name": "label_text_0",
                    "str": "label",
                    "width": "46.620046620046615%",
                    "height": "17.543859649122805%",
                    "font": "./res/font/bls.ttf",
                    "fontSize": "14px",
                    "fontWeight": 400,
                    "letterSpacing": "0px",
                    "textAlign": "left",
                    "longMode": 0,
                    "baseLine": 6,
                    "color": "rgba(0, 0, 0, 1)",
                    "backgroundColor": "rgba(255, 255, 255, 0)",
                    "display": "block",
                    "objAlign": 1,
                    "xOffset": 285,
                    "yOffset": 276,
                    "top": "21.637426900584796%",
                    "left": "22.144522144522146%"
                },
                "isLock": false,
                "collapseName": "base",
                "component": "VText",
                "label": "文本",
                "type": "label",
                "propValue": "",
                "icon": "wenben",
                "tag": "normal",
                "style": {
                    "rotate": 0,
                    "opacity": 1,
                    "name": "label_text_0",
                    "str": "label",
                    "width": 200,
                    "height": 60,
                    "font": "./res/font/bls.ttf",
                    "fontSize": 14,
                    "fontWeight": 400,
                    "lineHeight": "",
                    "letterSpacing": 0,
                    "textAlign": "left",
                    "longMode": 0,
                    "baseLine": 6,
                    "color": "rgba(0, 0, 0, 1)",
                    "backgroundColor": "rgba(255, 255, 255, 0)",
                    "display": false,
                    "objAlign": 1,
                    "xOffset": 285,
                    "yOffset": 276,
                    "top": 276,
                    "left": 285
                },
                "id": "JaEdAqlk5zkqhCcpd5Ut8"
            },
            {
                "groupStyle": {
                    "transform": "rotate(0deg)",
                    "opacity": 1,
                    "name": "label_price_1",
                    "numStr": "100",
                    "width": "46.620046620046615%",
                    "height": "17.543859649122805%",
                    "font": "./res/font/bls_pri.ttf",
                    "fontSize": "14px",
                    "fontWeight": 400,
                    "letterSpacing": "0px",
                    "textAlign": "left",
                    "longMode": 0,
                    "baseLine": 7,
                    "color": "rgba(0, 0, 0, 1)",
                    "backgroundColor": "rgba(255, 255, 255, 0)",
                    "display": "block",
                    "objAlign": 1,
                    "xOffset": 231,
                    "yOffset": 336,
                    "top": "39.1812865497076%",
                    "left": "9.557109557109557%"
                },
                "isLock": false,
                "collapseName": "base",
                "component": "VText",
                "label": "价格    ",
                "type": "label",
                "propValue": "",
                "icon": "wenben",
                "tag": "price",
                "style": {
                    "rotate": 0,
                    "opacity": 1,
                    "name": "label_price_1",
                    "numStr": "100",
                    "width": 200,
                    "height": 60,
                    "font": "./res/font/bls_pri.ttf",
                    "fontSize": 14,
                    "fontWeight": 400,
                    "lineHeight": "",
                    "letterSpacing": 0,
                    "textAlign": "left",
                    "longMode": 0,
                    "baseLine": 7,
                    "color": "rgba(0, 0, 0, 1)",
                    "backgroundColor": "rgba(255, 255, 255, 0)",
                    "display": 0,
                    "objAlign": 1,
                    "xOffset": 231,
                    "yOffset": 336,
                    "top": 336,
                    "left": 231
                },
                "id": "LzRf2KsXT6RboGieKwtEv"
            }
        ],
        "type": "group"
    }
]
// let newList = {
//     normal: [],
//     price: [],
//     img: []
// }
for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i]
    item.style = { ...commonStyle, ...item.style }
    list[i] = { ...commonAttr, ...item }

    // switch (item.tag) {
    //     case 'normal':
    //         newList.normal.push(item)
    //         break;
    //     case 'price':
    //         newList.price.push(item)
    //         break;
    //     case 'img':
    //         newList.img.push(item)
    //         break;
    //     default:
    //         break;
    // }
}

export default list
