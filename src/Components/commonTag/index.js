import React, { useEffect } from 'react'
import { Tag, Space } from 'antd'
import config from '../../config'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { closeTab, selectMenuList } from '../../store/reducer/tab'
import { useDispatch } from 'react-redux'
import './index.css'

export default function CommonTag() {
    const tabList = useSelector(state => state.tab.tabList)
    const currentMenu = useSelector(state => state.tab.currentMenu)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { pathname } = useLocation() //从路由信息对象里取出postname，如地址 localhost:3000/user → pathname 是 '/user'
    console.log('@', pathname);

    useEffect(() => {
        const page = config
            .flatMap(item => item.children || [item]) //得到的是一个装着‘菜单对象’的数组
            .find(item => item.path === pathname) //找到路径与当前URL相同的页面
        if (page) {
            //从取到的page对象里取出三个属性
            const { path, name, label } = page
            //然后把这三个值交给redux,把当前选中的page对象更新为currentMenu
            dispatch(selectMenuList({ path, name, label })) //selectMenuList({ path, name, label })：用这些值创建对象，再传进去
        }
    }, [pathname, dispatch]) //依赖dispatch是因为:当Effect用到了“组件内部取得或定义的函数”，通常就应该把它列为依赖

    const handleClose = (tag, index) => {
        const length = tabList.length - 1 //最后一个标签的下标

        // 删除前，先确定接下来选中哪个标签
        const nextTag = index === length
            ? tabList[index - 1]
            : tabList[index + 1]

        dispatch(closeTab(tag))
        handleChange(nextTag)
    }
    
    //点击tag
    const handleChange = (tag) => {
        dispatch(selectMenuList(tag))
        navigate(tag.path)
    }

    //tag的显示
    const setTag = (isActive, item, index) => {
        return (
            isActive ?
                <Tag color="#55acee" key={item.name} closeIcon={item.name != 'home'} onClose={() => handleClose(item, index)}>{item.label}</Tag>
                :
                <Tag onClick={() => { handleChange(item) }} key={item.name}>{item.label}</Tag>
        )
    }
    return (
        <Space className='common-tag' size={[8, 8]} wrap> {/* size={[8, 8]} → 水平间距 8px，垂直间距 8px */}
            {
                currentMenu.name && tabList.map((item, index) => {
                    return setTag(
                        item.path === currentMenu.path, //这里返回布尔值给isActive判断是否高亮
                        item,
                        index
                    )
                })
            }
        </Space>
    )
}
