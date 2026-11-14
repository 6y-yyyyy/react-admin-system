import React from 'react'
import MenuConfig from '../../config'
import * as Icon from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectMenuList } from '../../store/reducer/tab';

const { Header, Sider, Content } = Layout;

//动态获取icon
const iconToElement = (name) => React.createElement(Icon[name])

//处理菜单的数据
const items = MenuConfig.map((icon) => {
    //没有子菜单
    const child = {
        key: icon.path,
        icon: iconToElement(icon.icon),
        label: icon.label
    }
    //有子菜单
    if (icon.children) {
        child.children = icon.children.map(item => {
            return {
                key: item.path,
                label: item.label
            }
        })
    }
    return child
})

export default function CommonAside({ collapsed }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const currentMenu = useSelector(state => state.tab.currentMenu) //读取并订阅 Redux 中的 currentMenu。这个数据变化后，侧栏组件会重新渲染，拿到新的值。

    //添加数据到store
    const setTabList = (val) => {
        dispatch(selectMenuList(val)) // selectMenuList(val) ：创建 action，把 val 放进 payload
    }
    //点击菜单
    const selectMenu = (e) => {   /* Menu组件会传入一个包含点击信息的对象，其中key是路径，例如key: '/mall' */
        let data
        MenuConfig.forEach(item => {
            //找到当前的数据
            if (item.path === e.keyPath[e.keyPath.length - 1]) {
                data = item
                //如果有二级菜单
                if (e.keyPath.length > 1) {
                    data = item.children.find(child => {
                        return child.path === e.key
                    })
                }
            }
        })
        setTabList({
            path: data.path,
            name: data.name,
            label: data.label
        }) //里面这个对象就是39行的val
        navigate(e.key)
    }

    return (
        <Sider trigger={null} collapsed={collapsed} >
            <h3 className="app-name">{collapsed ? '后台' : '通用后台管理系统'}</h3>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[currentMenu.path]}
                items={items}
                style={{
                    height: '100%'
                }}
                onClick={selectMenu}
            />
        </Sider>
    )
}
