import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app'
import { fireStore } from '../../firebase';
import Moment from 'moment';
import { Button, Input, Radio, Form, InputNumber, DatePicker, Select, Popconfirm } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import RandomId from '../../functions/RandomId';

import { AuthContext } from '../../context/UserContext';

var len = 10;
var pattern = 'aA0'

const { Option } = Select;

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

const CategoryModal = (props) => {

    const [form] = Form.useForm();
    let { teamName, allData } = useContext(AuthContext)

    const [catagoryArr, setCatagoryArr] = useState(null)

    let id = RandomId(len, pattern);
    

    useEffect(() => {
        if(allData) {
            setCatagoryArr(allData.equipmentCategories)
        }
    }, [allData])

    const changeOption = (e, field) => {
        field.category = e.target.value
        let editedPosition = catagoryArr.indexOf(catagoryArr.find(o => o.uid === field.uid))
        let newArr = catagoryArr
        newArr[editedPosition] = field
        setCatagoryArr(newArr);
    }

    let handleSubmit = (values) => {

            fireStore.collection("Teams").doc(teamName).update({
                equipmentCategories: catagoryArr
            }).then(() => {
                props.close()
                form.resetFields();
            })
    }

    let onFinishFailed = (errorInfo) => {
        console.log('failed ' + errorInfo);
    }

    // let deleteEquipoment = () => {
    //     fireStore.collection("Teams").doc(teamName).get().then((doc) => {
    //         fireStore.collection("Teams").doc(teamName).update({
    //             equipment: firebase.firestore.FieldValue.arrayRemove(doc.data().equipment.find(x => x.uid === props.equipment.uid))
    //         });
    //     })
    //     props.close()
    //     form.resetFields()
    // }

    return (
        <div>
            <Form
                name="basic"
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                hideRequiredMark={true}
                form={form}
            >
                    <Form.List name="options">
                        {(optionFields, { add, remove }) => {
                            optionFields = catagoryArr || []
                            return (
                                <div>
                                    {optionFields.map((field, index) => (
                                        <Form.Item
                                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                            label={index === 0 ? 'Categories' : ''}
                                            required={false}
                                            key={field.uid}
                                        >
                                            <Form.Item
                                                name={optionFields.category}
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        whitespace: true,
                                                        message: "Please input category or delete this field.",
                                                    },
                                                ]}
                                                noStyle
                                            >
                                                <Input placeholder="category" defaultValue={field.category} onChange={(e) => changeOption(e, field)} style={{ width: '60%', marginRight: 8 }} />

                                            </Form.Item>
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                onClick={() => {
                                                    var filtered = catagoryArr.filter((e) => { return e.uid !== field.uid });
                                                    setCatagoryArr(filtered)
                                                }}
                                            />
                                        </Form.Item>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                let newOption = catagoryArr.concat({ uid: id })
                                                setCatagoryArr(newOption)
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

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    {/* {props.equipment ?
                        <Popconfirm
                            title={`Are you sure you wabt to delete ${props.equipment.equipment}`}
                            onConfirm={() => deleteEquipoment()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button style={{ float: 'right' }}>
                                delete
                            </Button>
                        </Popconfirm> : null} */}
                </Form.Item>
            </Form>
            <hr />
        </div>
    );
};

export default CategoryModal; 