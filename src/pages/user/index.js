import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Table, Popconfirm, Modal, InputNumber, Select, DatePicker } from 'antd'
import './user.css'
import { getUser, addUser, editUser, delUser } from '../../api'
import Title from 'antd/es/skeleton/Title'
import { render } from '@testing-library/react'
import { useForm } from 'antd/es/form/Form'
import { number } from 'echarts'
import dayjs from 'dayjs'

export default function User() {
  const [listData, setListData] = useState({ name: '' })   // 搜索参数
  const [tableData, setTableData] = useState([])            // 表格数据
  const [modalType, setModalType] = useState(0)             // 0=新增 1=编辑
  const [isModalOpen, setIsModalOpen] = useState(false)     // 弹窗开/关
  const [form] = useForm()                                  // 表单遥控器

  //新增/编辑按钮
  const handleClick = (type, rowData) => {
    setIsModalOpen(!isModalOpen)
    if (type === 'add') {
      setModalType(0)
    } else {
      setModalType(1)
      //深拷贝，把rowData先转换成JSON字符串然后再转成js数据，这样cloneData和rowData指向的就不是同一个对象
      const cloneData = JSON.parse(JSON.stringify(rowData))
      //把后端返回的字符串转成 dayjs 对象
      cloneData.birth = dayjs(cloneData.birth)
      //表单数据回填
      form.setFieldsValue(cloneData)
    }
  }

  // 提交搜索：把关键字存进 listData
  const handleFinish = (e) => {
    // 只更新状态，不直接查数据——查数据交给下面的 useEffect
    setListData({
      name: e.keyword
    })
  }
  // listData变化后重新查数据（覆盖搜索 + 页面初次加载）
  // 注意：不能直接在 handleFinish 里调 getTableData，
  // 因为 setListData 是异步的，此刻 listData 还是旧值，查不到新关键字
  useEffect(() => {
    getTableData()
  }, [listData])

  //删除
  const handleDelete = ({ id }) => {
    delUser({ id }).then(() => {   //delUser({ id }) = "调用删除接口，传一个内容为{ id: 当前id值 }的对象过去"
      getTableData()
    })
  }

  const getTableData = () => {
    getUser(listData).then(({ data }) => {
      setTableData(data.list)
    })
  }

  //弹窗确定
  const handleOk = () => {
    //表单校验，validateFields()会把表单里所有字段的值收集起来，打包成一个对象返回
    form.validateFields().then((val) => {
      //日期参数，把表单里的dayjs对象转成字符串发给后端 这里后端接口要的是 'YYYY-MM-DD'这样的字符串，所以必须.format()
      //至于这里val.birth为什么是dayjs对象而不是字符串，是因为birth这个字段绑的是<DatePicker>，而 DatePicker的value天生就是dayjs对象
      val.birth = dayjs(val.birth).format('YYYY-MM-DD')
      console.log(val.birth, 'newval');
      //调接口
      if (modalType) { //编辑
        editUser(val).then(() => {
          handleCancel()
          getTableData()
        })
      } else {
        addUser(val).then(() => {
          handleCancel()
          getTableData()
        })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  //弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false)
    //清空表单内容
    form.resetFields()
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

      <Table style={{marginTop:'10px'}} columns={columns} dataSource={tableData} rowKey={'id'} />
      <Modal //弹出一个对话框，里面放着下面的Form表单
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

          {/* 当type是‘编辑’时出现这个隐藏表单来存id值，至于
          value值是谁填进去的：是调用 form.setFieldsValue(cloneData)时，
          Form 会拿 cloneData 里的每个键，
          去和它管理着的每个 Form.Item 的 name 做匹配 */}
          {
            modalType === 1 &&
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          }

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
