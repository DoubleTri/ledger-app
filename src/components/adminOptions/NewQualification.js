import React, { useState, useContext } from 'react';
import firebase from 'firebase/app'
import { fireStore } from '../../firebase';
import { Form, Input, Button, Radio, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import RandomId from '../../functions/RandomId';
import { AuthContext } from '../../context/UserContext';

var len = 10;
var pattern = 'aA0'

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
    },
};

const NewQualification = (props) => {

    const [form] = Form.useForm();
    let id = RandomId(len, pattern);

    let { teamName } = useContext(AuthContext)

    const [selectValue, setSelectValue] = useState(1)

    const handleSubmit = (values) => {

        values['uid'] = id
        fireStore.collection("Teams").doc(teamName).update({
            qualifications: firebase.firestore.FieldValue.arrayUnion(values)
        }).then(() =>{
            props.close()
            form.resetFields();
        })
        
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            Object.entries(doc.data().members).map((item) => {
                fireStore.collection("Teams").doc(teamName).set({
                    members: {
                        [item[0]] : { [id] : {
                            [values.qualification]: null
                            }
                        }
                    }
                }, {merge: true})
            })
        })
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
                form={form}
            >
                <Form.Item
                    label="Qualification"
                    name="qualification"
                    rules={[{ required: true, message: 'Please input qualification name' }]}
                >
                    <Input />
                </Form.Item>

                <Radio.Group onChange={(e) => setSelectValue(e.target.value)} value={selectValue}>
                    <Form.Item
                        rules={[{ required: false }]}
                    >
                        <Radio value={1}>Text Input</Radio>
                        <Radio value={2}>Preselected</Radio>
                    </Form.Item>
                </Radio.Group>

                {selectValue === 2 ?

                    <Form.List name="options">
                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                    {fields.map((field, index) => (
                                        <Form.Item
                                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                            label={index === 0 ? 'Option' : ''}
                                            required={false}
                                            key={field.key}
                                        >
                                            <Form.Item
                                                {...field}
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: "Please input option or delete this field.",
                                                    },
                                                ]}
                                                noStyle
                                            >
                                                <Input placeholder="option" style={{ width: '60%', marginRight: 8 }} />
                                            </Form.Item>
                                            {fields.length > 1 ? (
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => {
                                                        remove(field.name);
                                                    }}
                                                />
                                            ) : null}
                                        </Form.Item>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                add();
                                            }}
                                            style={{ width: '60%' }}
                                        >
                                            <PlusOutlined /> Add option
                            </Button>
                                    </Form.Item>
                                </div>
                            );
                        }}
                    </Form.List>

                    : null}

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
              </Button>
                </Form.Item>
            </Form>
        </Col>
    );
};

export default NewQualification; 