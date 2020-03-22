import React, { useState, useContext } from 'react';
// import { Link } from 'react-router-dom'
import { auth } from '../../firebase';
import { Form, Input, Button, Checkbox } from 'antd';

import { AuthContext } from '../../context/UserContext';

const Login = () => {

    const [show, setShow] = useState(false)

    let { logout } = useContext(AuthContext)

    const handleSubmit = (values) => {
        const promise = auth.signInWithEmailAndPassword(values.email, values.password);
        promise.catch(e => e ? alert(e.message) : null);
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
    <Form
      name="basic"
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
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
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

      <Form.Item >
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      </Form.Item>

    </Form>

  );
};

export default Login; 