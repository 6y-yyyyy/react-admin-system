import React from 'react'
import { Outlet } from 'react-router-dom'
// import { useState } from 'react';
import {
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Tag, theme } from 'antd';
import CommonAside from '../Components/commonAside';
import CommonHeader from '../Components/commonHeader';
import CommonTag from '../Components/commonTag';
import { useSelector } from 'react-redux';

const { Header, Sider, Content } = Layout;

export default function Main() {
  // const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  //获取展开收起的状态
  const collapsed = useSelector(state => state.tab.isCollapse)

  return (
    <Layout className='main-container'>
      <CommonAside collapsed={collapsed} />
      <Layout>
        <CommonHeader collapsed={collapsed} />
        <CommonTag />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
