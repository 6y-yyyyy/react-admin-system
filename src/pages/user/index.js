import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Table, Popconfirm, Modal, InputNumber, Select, DatePicker } from 'antd'
import './user.css'
import { getUser } from '../../api'
import Title from 'antd/es/skeleton/Title'
import { render } from '@testing-library/react'
import { useForm } from 'antd/es/form/Form'
import { number } from 'echarts'

export default function User() {
  // 查询条件状态，保存发送给接口的搜索参数。
  const [listData, setListData] = useState({
    name: ''
  })
  //tableData：表格数据状态，保存接口返回的用户数组。
  const [tableData, setTableData] = useState([])
  // 弹窗类型状态：0 表示新增用户，1 表示编辑用户，初始为新增
  const [modalType, setModalType] = useState(0)
  //判断弹窗是否打开
  const [isModalOpen, setIsModalOpen] = useState(false)
  //创建Form实例
  const [form] = useForm()

  //新增/编辑按钮
  const handleClick = (type, rowData) => {
    setIsModalOpen(!isModalOpen)
    if (type == 'add') {
      setModalType(0)
    } else {
      setModalType(1)
    }
  }

  //提交
  const handleFinish = (e) => {
    setListData({
      name: e.keyword
    })
    console.log(e);
  }

  //删除
  const handleDelete = (rowData) => {

  }

  const getTableData = () => {
    getUser(listData).then(({ data }) => {
      setTableData(data.list)
    })
  }

  //弹窗确定
  const handleOk = () => {
    setIsModalOpen(false)
  }

  //弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name'
    },
    {
      title: '年龄',
      dataIndex: 'age'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: (val) => {
        return val ? '女' : '男'
      }
    },
    {
      title: '出生日期',
      dataIndex: 'birth'
    },
    {
      title: '地址',
      dataIndex: 'addr'
    },
    {
      title: '操作',
      render: (rowData) => {
        return (
          <div className='flex-box'>
            <Button style={{ marginRight: '5px' }} onClick={() => handleClick('edit', rowData)}>编辑</Button>
            <Popconfirm
              title="提示"
              description="此操作将删除用户,是否继续？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => handleDelete(rowData)}
            >
              <Button type='primary' danger>删除</Button>
            </Popconfirm>
          </div >
        )
      }
    }
  ]

  useEffect(() => {
    //调用后端接口获取用户列表数据
    getTableData()
  }, [])

  return (
    <div className='user'>
      <div className='flex-box space-between'>
        <Button type='primary' onClick={() => handleClick('add')}>+新增</Button>

        {/* 第一张：搜索表单 */}
        <Form layout='inline' onFinish={handleFinish}>
          <Form.Item name="keyword">
            <Input placeholder='请输入用户名' />
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' type='primary'>搜索</Button>
          </Form.Item>
        </Form>
      </div>
      <Table columns={columns} dataSource={tableData} rowKey={'id'} />
      <Modal
        open={isModalOpen}
        title={modalType ? '编辑用户' : '新增用户'}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        {/* 第二张：新增/编辑弹窗中的表单 */}
        <Form
          form={form}
          labelCol={{ span: 6 }}//占24份中的6份，即标签区域宽度占25%
          wrapperCol={{ span: 18 }}
          labelAlign='left'
        >
          <Form.Item
            label='姓名'
            name='name'
            rules={[
              {
                required: true,
                message: '请输入姓名'
              }
            ]}
          >
            <Input placeholder='请输入姓名'></Input>
          </Form.Item>

          <Form.Item
            label='年龄'
            name='age'
            rules={[
              {
                required: true,
                message: '请输入年龄'
              },
              {
                type: 'number',
                message: '年龄必须是数字'
              }
            ]}
          >
            <InputNumber placeholder='请输入年龄'></InputNumber>
          </Form.Item>

          <Form.Item
            label='性别'
            name='sex'
            rules={[
              {
                required: true,
                message: '性别是必选'
              }
            ]}
          >
            <Select
              placeholder="请选择性别"
              options={[
                { value: 0, label: '男' },
                { value: 1, label: '女' }
                //value是实际保存的值，刚好对应表格里的显示逻辑： return val ? '女' : '男'
              ]}
            />
          </Form.Item>

          <Form.Item
            label='出生日期'
            name='birth'
            rules={[
              {
                required: true,
                message: '请选择出生日期'
              }
            ]}
          >
            <DatePicker
              placeholder="请选择" format="YYYY/MM/DD"
            />
          </Form.Item>

          <Form.Item
            label='地址'
            name='addr'
            rules={[
              {
                required: true,
                message: '请填写地址'
              }
            ]}
          >
            <Input placeholder='请填写地址'></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
