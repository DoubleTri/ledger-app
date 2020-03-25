import React, { useState, useContext } from 'react';
import { Form, Input, Button, Checkbox, Col, Switch } from 'antd';

import { NewMemberFunction } from '../../functions/NewMemberFunction'

import { AuthContext } from '../../context/UserContext';

const NewTeamMember = (props) => {

    const [form] = Form.useForm();

    let { teamName } = useContext(AuthContext)

    const handleSubmit = (values) => {
        if (!values.admin) {
            values.admin = false
        }
        values['dbKey'] = teamName
        NewMemberFunction(values);
        props.close()
        form.resetFields();
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

  return (
      <Col span={20} offset={1}>
          <Form
              name="basic"
              onFinish={handleSubmit}
              onFinishFailed={onFinishFailed}
              hideRequiredMark={true}
          >
              <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please input new team member's name" }]}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please input new team member's email" }]}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: "Please create a password for the new team member"  }]}
              >
                  <Input />
              </Form.Item>

              <Form.Item label="Admin" name="admin" >
                  <Switch />
              </Form.Item>

              <Form.Item >
                  <Button type="primary" htmlType="submit">
                      Submit
              </Button>
              </Form.Item>

          </Form>
      </Col>
  );
};

export default NewTeamMember; 