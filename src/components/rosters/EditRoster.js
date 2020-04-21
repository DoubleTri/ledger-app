import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Radio, Col, Checkbox, DatePicker, message, Menu, Dropdown, Popconfirm } from 'antd';
import { DownOutlined } from '@ant-design/icons'
import firebase from 'firebase/app'
import Moment from 'moment';
import { fireStore } from '../../firebase';

import { AuthContext } from '../../context/UserContext';

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

const EditRoster = (props) => {

    const [form] = Form.useForm();
    let { logout, userInfo, teamName, allData } = useContext(AuthContext)

    const [rosterTypes, setRosterTypes] = useState(null)
 
    useEffect(() => {
        form.setFieldsValue({
            event: props.roster.event,
            date: Moment(props.roster.date, 'MMMM Do YYYY' ),
            type: props.roster.type,
            members: props.roster.members
        })
        setRosterTypes(Object.values(allData.rosterTypes)) 
    }, [])

    let handleSubmit = (values) => {
        
        values['date'] = values.date.format('MMMM Do YYYY');
        
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            let rosterArr = doc.data().rosters
            let rosterIndex = rosterArr.indexOf(rosterArr.find(o => o.uid === props.roster.uid))
            rosterArr[rosterIndex] = values
            fireStore.collection("Teams").doc(teamName).update({
                "rosters": rosterArr
            })
        })

        message.success(`${values.event} has been updated`)
        props.close()
        form.resetFields()
    } 

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    const deleteRoster = () => {
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            fireStore.collection("Teams").doc(teamName).update({
                rosters: firebase.firestore.FieldValue.arrayRemove(doc.data().rosters.find(x => x.uid === props.roster.uid))
            });
        })
        props.close()
        form.resetFields()
        message.success(`${props.roster.event} has been deleted`)
    }

    return (
        <div>
            <h2>Edit Roster Page</h2>
            <br />
            <Form
                name="basic"
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                hideRequiredMark={true}
                form={form}
                //{...formItemLayout}
            >
                <Form.Item
                    label="Event Name"
                    name="event"
                    rules={[{ required: true, message: 'Please input event name' }]}
                >
                    <Input disabled={!userInfo.admin} />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please input event date' }]}
                >
                    <DatePicker style={{ width: '50%' }} disabled={!userInfo.admin}/>
                </Form.Item>

                {rosterTypes ?
                    <Form.Item
                        name="type"
                        label="Type of Event"
                        rules={[{ required: true, message: 'Please input the type of event' }]}
                    >
                        <Radio.Group>
                            {rosterTypes.map((roster, k) => {
                                return <Radio key={k} value={roster.type}>{roster.type}</Radio>
                            })}
                        </Radio.Group>
                    </Form.Item>
                    : null}

                <Form.Item
                    name="members"
                    label="Members"
                    //rules={[{ required: true, message: 'At least one team member must be selected' }]}
                >
                    <Checkbox.Group disabled={!userInfo.admin}>
                        {props.allMembers.map((member, i) => {
                            return <div key={i}><Checkbox value={member}>
                                {member}
                            </Checkbox>
                            </div>
                        })}

                    </Checkbox.Group>
                </Form.Item>

                <Form.Item >
                    {userInfo.admin ? <div>
                        < Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <span style={{ float: 'right' }}>
                            <Popconfirm
                                title={`Are you sure you wabt to delete ${props.roster.event}`}
                                onConfirm={() => deleteRoster()}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button>
                                    delete
                            </Button>
                            </Popconfirm>
                        </span>
                        </div>
                    : null }
                </Form.Item>
            </Form>
            
        </div>
    );
};

export default EditRoster; 