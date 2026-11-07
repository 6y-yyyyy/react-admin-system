import React, { useEffect, useState } from 'react'
import { Col, Row, Card, Table } from 'antd'
import * as Icon from '@ant-design/icons';
import './home.css'
import { getData } from '../../api'
import MyEcharts from '../../Components/Echarts'
//table列的数据
const columns = [
  {
    title: '课程',
    dataIndex: 'name'
  },
  {
    title: '今日购买',
    dataIndex: 'todayBuy'
  },
  {
    title: '本月购买',
    dataIndex: 'monthBuy'
  },
  {
    title: '总购买',
    dataIndex: 'totalBuy'
  }
]

//订单统计的数据
const countData = [
  {
    "name": "今日支付订单",
    "value": 1234,
    "icon": "CheckCircleOutlined",
    "color": "#2ec7c9"
  },
  {
    "name": "今日收藏订单",
    "value": 3421,
    "icon": "ClockCircleOutlined",
    "color": "#ffb980"
  },
  {
    "name": "今日未支付订单",
    "value": 1234,
    "icon": "CloseCircleOutlined",
    "color": "#5ab1ef"
  },
  {
    "name": "本月支付订单",
    "value": 1234,
    "icon": "CheckCircleOutlined",
    "color": "#2ec7c9"
  },
  {
    "name": "本月收藏订单",
    "value": 3421,
    "icon": "ClockCircleOutlined",
    "color": "#ffb980"
  },
  {
    "name": "本月未支付订单",
    "value": 1234,
    "icon": "CloseCircleOutlined",
    "color": "#5ab1ef"
  }
]

//动态获取icon
const iconToElement = (name) => React.createElement(Icon[name])

export default function Home() {
  const userimg = require("../../assets/images/jinx2.jpg")

  //创建Echart响应数据
  const [echartData, setEchartData] = useState({})

  //dom首次渲染完成
  useEffect(() => {
    //这里用到了回调函数，要等首次挂载之后运行useEffect之后才会执行这一步：
    getData().then(({ data }) => {

      const { tableData, orderData, userData, videoData } = data.data
      //因为是回调函数所以这里才可以写在定义setTableData之前
      setTableData(tableData)

      //对于echarts数据的组装
      const order = orderData
      //x轴的数据
      const xData = order.date //['20191001', '20191002', '20191003',...]
      //series数据组装
      const keyArray = Object.keys(order.data[0]) //Object.keys() 返回一个由order.data[0]这个对象的属性名（key值）组成的数组 所以keyArray:['苹果', '小米',...]
      const series = []

      keyArray.forEach(key => {
        series.push({
          name: key,
          data: order.data.map(item => item[key]),
          type: 'line'
        })
      })

      setEchartData({
        order: {
          xData:xData,
          series:series
        },

        user: {
          xData: userData.map(item => item.date),
          series:[
            {
              name:'新增用户',
              data:userData.map(item=>item.new),
              type:'bar'
            },
            {
              name:'活跃用户',
              data:userData.map(item=>item.active),
              type:'bar'
            }
          ]
        },

        video:{
          series:[
            {
              data:videoData,
              type:'pie'
            }
          ]
        }
      })
    })
  }, [])

  //定义table数据
  const [tableData, setTableData] = useState([])

  return (
    <Row className='home'>
      <Col span={8}>
        <Card hoverable>
          <div className='user'>
            <img src={userimg} />
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
        <br />
        <Card hoverable>
          <Table rowKey="name" pagination={false} columns={columns} dataSource={tableData} />
        </Card>
      </Col>
      <Col span={16}>
        <div className='num'>
          {
            countData.map((item, index) => {
              return (
                <Card key={index}>
                  <div className='icon-box' style={{ backgroundColor: item.color }}>
                    {iconToElement(item.icon)}
                  </div>
                  <div className='detail'>
                    <p className='num'>￥{item.value}</p>
                    <p className='txt'>{item.name}</p>
                  </div>
                </Card>
              )
            })
          }
        </div>
        {echartData.order && <MyEcharts chartData={echartData.order} style={{ height: '280px' }} />}
        <div className='graph'>
          {echartData.user && <MyEcharts chartData={echartData.user} style={{ height: '240px',width:'50%' }}/>}
          {echartData.video && <MyEcharts chartData={echartData.video} isAxisChart={false} style={{ height: '260px',width:'50%' }}/>}
        </div>
      </Col>
    </Row>
  )
}
