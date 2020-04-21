import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Radio, Col, Checkbox, DatePicker, message, Menu, Dropdown, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons'
import firebase from 'firebase/app'
import Moment from 'moment';
import { fireStore } from '../../firebase';

import RandomId from '../../functions/RandomId';

import { AuthContext } from '../../context/UserContext';
import EditRoster from './EditRoster';

var len = 10;
var pattern = 'aA0'

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

const CreateRoster = () => {

    const [form] = Form.useForm();
    let id = RandomId(len, pattern);

    let { logout, userInfo, teamName, allData } = useContext(AuthContext)

    const [allMembers, setAllMembers] = useState(null)
    const [allRosters, setAllRosters] = useState(null)
    const [selectedRoster, setSelectedRoster] = useState(null)
    const [openRosterModal, setOpenRosterModal] = useState(false)
    const [rosterTypes, setRosterTypes] = useState(null)

    useEffect(() => {
        if (allData) {
            let tempMembersArr = []
            let tempRostersArr = []
            Object.values(allData.members).map((item, i) => {
                tempMembersArr.push(item.name);
            })
            setAllMembers(tempMembersArr)
            Object.values(allData.rosters).map((item, i) => {
                tempRostersArr.push(item);
            })
            setAllRosters(tempRostersArr)
            setRosterTypes(Object.values(allData.rosterTypes)) 
        }
    }, [allData])

    let handleSubmit = (values) => {
        values.uid = id
        values['date'] = values.date.format('MMMM Do YYYY');
        fireStore.collection("Teams").doc(teamName).update({
            rosters: firebase.firestore.FieldValue.arrayUnion(values)
        })
        message.success(`${values.event} has been created`)
        form.resetFields()
    } 

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    let rosterClicked = (roster) => {
        setSelectedRoster(roster)
        setOpenRosterModal(true)
    }
    let closeRosterModal = () => {
        setOpenRosterModal(false) 
        setSelectedRoster(null)
    }

    let menu = () => <Menu>
        {allRosters.map((roster, i) => {
            return <Menu.Item key={i} onClick={() => rosterClicked(roster)}>
                <b>{roster.type} </b>{roster.date + ": " + roster.event}
            </Menu.Item>
        })}
    </Menu>

    return (
        <div style={{ margin: '5em'}}> 
            <h2>Rosters</h2>
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()} style={{ margin: '3em'}}>
                    Past Rosters <DownOutlined />
                </a>
            </Dropdown>
            <br />
            <hr />
            <h2>Create New Roster</h2>
            <Form
                name="basic"
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                hideRequiredMark={true}
                form={form}
                {...formItemLayout}
            >
                <Form.Item
                    label="Event Name"
                    name="event"
                    rules={[{ required: true, message: 'Please input event name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Date"
                    name="date"
                    rules={[{ required: true, message: 'Please input event date' }]}
                >
                    <DatePicker style={{ width: '50%' }} />
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

                {allMembers ?
                    <Form.Item 
                        name="members" 
                        label="Members"
                        rules={[{ required: true, message: 'At least one team member must be selected' }]}
                    >
                        <Checkbox.Group >
                        {allMembers.map((member, i) => {
                            return <div key={i}><Checkbox value={member}>
                            {member}
                        </Checkbox>
                        </div>
                        })}

                        </Checkbox.Group>
                    </Form.Item>
                    : null}

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
              </Button>
                </Form.Item>
            </Form>

{selectedRoster ? 
            <Modal
                title={selectedRoster.event + ': ' + selectedRoster.date}
                visible={openRosterModal}
                onCancel={closeRosterModal}
                footer={null}
                maskClosable={false}
            >
                <EditRoster roster={selectedRoster} allMembers={allMembers} close={closeRosterModal} />
            </Modal>
            : null}
        </div>
    );
};

export default CreateRoster; 