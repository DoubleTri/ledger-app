import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app'
import { fireStore } from '../../firebase';
import { Form, Input, Button, Radio, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/UserContext';

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

    let { teamName } = useContext(AuthContext)

    const [selectValue, setSelectValue] = useState(null)
    const [optionsArr, setOptionsArr] = useState([])

    useEffect(() => {
        form.setFieldsValue({
            qualification: props.qualItem ? props.qualItem.qualification : null,
        })
        setOptionsArr([])
        if (props.qualItem && props.qualItem.options) {

            let newOptionsArr = []

            props.qualItem.options.map((item, i) => {
                newOptionsArr.push({name: item, key: i, fieldKey: i, uid: (Math.random() * 100)})

                form.setFieldsValue({
                    [item]: item,
                })
                return null
            })
            setOptionsArr(newOptionsArr)
            setSelectValue(2)
        } else {
            setSelectValue(1)
        }

    }, [props])

    const handleSubmit = (values) => {
console.log(props);
        if (optionsArr) {
            let itemArr = []
            optionsArr.map((item) => {
                console.log(item);
                itemArr.push(item.name)
            })
            values["options"] = itemArr
        }
        if (selectValue === 1) {
            values = {qualification: values.qualification}
        }

        let newQualifications = null;

        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            let oldQualifications = doc.data().qualifications
            let editedQual = oldQualifications.indexOf(oldQualifications.find(o => o.uid === props.qualItem.uid))
            oldQualifications[editedQual] = values
            newQualifications = oldQualifications;
        }).then(() => {
            fireStore.collection("Teams").doc(teamName).update({
                qualifications: newQualifications
            })
            props.close()
        })


    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    const changeOption = (e, field) => {
        field.name = e.target.value
        let editedPosition = optionsArr.indexOf(optionsArr.find(o => o.uid === field.uid))
        let newArr = optionsArr
        newArr[editedPosition] = field
        setOptionsArr(newArr);
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
                        {(optionFields, { add, remove }) => {
                            optionFields = optionsArr || {name: '', key: optionsArr.length,  fieldKey: optionsArr.length, uid: (Math.random() * 100)}
                            return (
                                <div>
                                    {optionFields.map((field, index) => (
                                        <Form.Item
                                            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                            label={index === 0 ? 'Option' : ''}
                                            required={false}
                                            key={field.uid}
                                        >
                                            <Form.Item
                                                name={optionFields.name}
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
                                                <Input placeholder="option" defaultValue={field.name} onChange={(e) => changeOption(e, field)} style={{ width: '60%', marginRight: 8 }} />
                                                
                                            </Form.Item>
                                                <MinusCircleOutlined
                                                    className="dynamic-delete-button"
                                                    onClick={() => {
                                                        console.log(field);
                                                        var filtered = optionsArr.filter((e) => { return e.uid !== field.uid });
                                                        setOptionsArr(filtered)
                                                    }}
                                                />
                                        </Form.Item>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                let newOption = optionsArr.concat({name: '', key: optionsArr.length,  fieldKey: optionsArr.length, uid: (Math.random() * 100)})
                                                setOptionsArr(newOption)
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