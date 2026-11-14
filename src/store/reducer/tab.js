import { createSlice } from "@reduxjs/toolkit";

const tabSlice = createSlice({
    name: 'tab',
    initialState: {
        isCollapse: false,
        tabList: [
            {
                path: '/home',
                name: 'home',
                label: '首页'
            }
        ],
        currentMenu: {
            path: '/home',
            name: 'home',
            label: '首页'
        }
    },
    reducers: {
        /*  切换侧栏的展开、收起状态 */
        collapseMenu: state => {
            state.isCollapse = !state.isCollapse
        },

        /* 更新‘当前选中’的菜单，非首页菜单若尚未存在于标签列表中，则添加标签 */
        selectMenuList: (state, { payload: val }) => {
            //点击任何页面，都先更新当前选中项，包括首页
            state.currentMenu = val

            if (val.name !== 'home') {
                //如果已经存在的tag就不需要添加。此外，findIndex 会依次检查数组元素，找到第一个符合条件的元素后，返回它的下标；一个都找不到，就返回 -1
                const result = state.tabList.findIndex(
                    item => item.name === val.name
                )

                if (result === -1) {
                    state.tabList.push(val)
                }
            }
        },

        /* 从标签列表中指定标签，首页不能删除 */
        closeTab: (state, { payload: value }) => {
            const res = state.tabList.findIndex(
                item => item.name === value.name
            )

            if (res !== -1 && value.name !== 'home') {
                state.tabList.splice(res, 1) //res是要删除的对象的索引，1是删除个数
            }
        }
    }
})

//createSlice 会根据我们写的“处理函数”（如collapseMenu），
// 自动生成配套的“动作创建函数” ：tabSlice.actions.collapseMenu
export const { collapseMenu, selectMenuList, closeTab } = tabSlice.actions
export default tabSlice.reducer