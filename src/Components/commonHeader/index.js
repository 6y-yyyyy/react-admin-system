import React from 'react'
import { Button, Layout, Avatar, Dropdown } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons'
import './index.css'
import { useDispatch } from 'react-redux';
import {collapseMenu} from '../../store/reducer/tab'
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export default function CommonHeader({ collapsed }) {
    const navigate = useNavigate()
    //登出
    const logout = () => {
        //清楚token
        localStorage.removeItem('token')
        navigate('/login')
    }

    const items = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer">
                    个人中心
                </a>
            ),
        },
        {
            key: '2',
            label: (
                <a onClick={() => logout()} target="_blank" rel="noopener noreferrer">
                    退出
                </a>
            ),
        }
    ];

    //创建dispatch
    const dispatch = useDispatch()

    //点击展开收起按钮
    const setCollapsed = () => {
        console.log(collapsed);
        dispatch(collapseMenu())
    }
    return (
        <Header className='header-container'>
            <Button
                type="text"
                icon={
                    <MenuFoldOutlined />
                }
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 32,
                    backgroundColor: '#fff'
                }}
                onClick={() => setCollapsed()}
            />
            <Dropdown menu={{ items }}>
                <Avatar size={36} src={<img src={require("../../assets/images/jinx2.jpg")} />} />
            </Dropdown>
        </Header>
    )
}
