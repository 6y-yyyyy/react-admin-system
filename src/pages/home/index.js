import React from 'react'
import { Col, Row, Card } from 'antd'
import './home.css'

export default function Home() {
  const userimg = require("../../assets/images/jinx2.jpg")
  return (
    <Row className='home'>
      <Col span={8}>
        <Card hoverable>
          <div className='user'>
            <img src={userimg}/>
            <div className='userinfo'>
              <p className='name'>Admin</p>
              <p className='access'>超级管理员</p>
            </div>
          </div>
          <div className='login-info'>
            <p>上次登录时间<span>2026-11-4</span></p>
            <p>上次登录地点<span>广东</span></p>
          </div>
        </Card>
      </Col>
      <Col span={16}></Col>
    </Row>
  )
}