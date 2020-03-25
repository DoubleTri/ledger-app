import React, { useState, useContext } from 'react';
// import { Link } from 'react-router-dom'
import { auth } from '../../firebase';
import { Form, Input, Button, Checkbox, Col } from 'antd';

import { AuthContext } from '../../context/UserContext';

const Login = () => {

    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)

    const handleSubmit = (values) => {
        setLoading(true)
        const promise = auth.signInWithEmailAndPassword(values.email, values.password).then(() => setLoading(false))
        promise.catch(e => e ? [alert(e.message), setLoading(false)] : null)
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    // const forgotPassword = () => {
    //     var emailAddress = logInObj.passwordChange

    //     auth.sendPasswordResetEmail(emailAddress).then(function () {
    //         setShow(false)
    //         alert('Please check your email for password reset instructions')
    //     }).catch(function (error) {
    //         if (error.code === 'auth/user-not-found') {
    //             alert(emailAddress + ' is not on file')
    //         } else {
    //             alert(error.message)
    //         }
    //     })
    // }

  return (
      <Col style={{ marginTop: '10em' }} span={12} offset={6}>
          <Form
              name="basic"
              onFinish={handleSubmit}
              onFinishFailed={onFinishFailed}
              hideRequiredMark={true}
          >
              <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: 'Please input your email' }]}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password' }]}
              >
                  <Input.Password />
              </Form.Item>

              <Form.Item >
                  <Button type="primary" loading={loading} htmlType="submit">
                      Submit
                    </Button>
              </Form.Item>

          </Form>
      </Col>

  );
};

export default Login; 