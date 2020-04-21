import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app'
import { fireStore } from '../../firebase';
import Moment from 'moment';
import { Button, Input, Radio, Form, DatePicker, Select, Popconfirm } from 'antd';

import RandomId from '../../functions/RandomId';

import { AuthContext } from '../../context/UserContext';

var len = 10;
var pattern = 'aA0'

const { Option } = Select;

const EquipmentModal = (props) => {

    const [form] = Form.useForm();
    let { teamName, allData } = useContext(AuthContext)

    const [memberArr, setMemberArr] = useState(null)

    let id = RandomId(len, pattern);

    useEffect(() => {
        if (props.equipment) {
            form.setFieldsValue({
                equipment: props.equipment.equipment,
                id: props.equipment.id,
                location: props.equipment.location,
                lastCal: Moment(props.equipment.lastCal, 'MMMM Do YYYY'),
                nextCal: Moment(props.equipment.nextCal, 'MMMM Do YYYY'),
                contact: props.equipment.contact,
            })
        }
        if (allData) {
            let tempArr = []
            Object.values(allData.members).map((member) => {
                tempArr.push(member)
            })
            setMemberArr(tempArr)
        }
    }, [teamName, allData, props])

    let handleSubmit = (values) => {

       
        values['lastCal'] = values.lastCal.format('MMMM Do YYYY');
        values['nextCal'] = values.nextCal.format('MMMM Do YYYY');

        if (props.equipment) {
            values['uid'] = props.equipment.uid
            fireStore.collection("Teams").doc(teamName).get().then((doc) => {
                let equipmentArr = doc.data().equipment
                let equipmentIndex = equipmentArr.indexOf(equipmentArr.find(o => o.uid === props.equipment.uid))
                equipmentArr[equipmentIndex] = values
                fireStore.collection("Teams").doc(teamName).update({
                    "equipment": equipmentArr
                })
                props.close()
                form.resetFields();
            }) 
        } else {
            values['uid'] = id
            fireStore.collection("Teams").doc(teamName).update({
                equipment: firebase.firestore.FieldValue.arrayUnion(values)
            }).then(() => {
                props.close()
                form.resetFields();
            })
        }

    }

    let onFinishFailed = (errorInfo) => {
        console.log('failed ' + errorInfo);
    }

    let deleteEquipoment = () => {
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            fireStore.collection("Teams").doc(teamName).update({
                equipment: firebase.firestore.FieldValue.arrayRemove(doc.data().equipment.find(x => x.uid === props.equipment.uid))
            });
        })
        props.close()
        form.resetFields()
    }

    return (
        <div>
            <Form
                name="basic"
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                hideRequiredMark={true}
                form={form}
            >
                <Form.Item
                    label="Equipment"
                    name="equipment"
                    rules={[{ required: true, message: 'Please input equipment name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Equipment ID"
                    name="id"
                    rules={[{ required: false }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Equipment Locaiton"
                    name="location"
                    rules={[{ required: false, message: "Please input equipment's location" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Last Checked/Calibrated"
                    name="lastCal"
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Next Checked/Calibrated"
                    name="nextCal"
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                {memberArr ?
                    <Form.Item
                        label="Team Member Contact"
                        name="contact"
                    >

                        <Select placeholder="Please select person to handle calibration">
                            {memberArr.map((member, i) => {
                                return <Option key={i} value={member.name}>{member.name}</Option>
                            })
                            }
                        </Select>

                    </Form.Item>
                    : 'no team members'}

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    {props.equipment ?
                        <Popconfirm
                            title={`Are you sure you wabt to delete ${props.equipment.equipment}`}
                            onConfirm={() => deleteEquipoment()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button style={{ float: 'right' }}>
                                delete
                            </Button>
                        </Popconfirm> : null}
                </Form.Item>
            </Form>
        </div>
    );
};

export default EquipmentModal; 