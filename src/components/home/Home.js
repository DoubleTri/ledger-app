import React, { useState, useContext } from 'react';
import firebase from 'firebase/app'
import { fireStore } from '../../firebase';
import { Button, Col, Modal, Form, Input } from 'antd';
import {PlusCircleOutlined } from '@ant-design/icons';
import moment, { now } from 'moment';

import { AuthContext } from '../../context/UserContext';
import RandomId from '../../functions/RandomId';
import TrainingCalender from '../trainingCalender/TrainingClaender';
import AnnouncementsList from '../announcements/AnnouncementsList';

var len = 10;
var pattern = 'aA0'

const Home = () => {

    const [form] = Form.useForm();
    let id = RandomId(len, pattern);

    let { userInfo, teamName } = useContext(AuthContext)

    const [AnnouncementOpen, setAnnouncementOpen] = useState(false)

    let closeAnnouncement = () => {
        setAnnouncementOpen(false)
    }

    let handleSubmit = (values) => {
        values['uid'] = id
        values['date'] = moment().format('MMM D, YYYY')
        values['author'] = userInfo.name
        fireStore.collection("Teams").doc(teamName).update({
            announcements: firebase.firestore.FieldValue.arrayUnion(values)
        }).then(() => {
            closeAnnouncement()
            form.resetFields();
        })
    } 

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }
 
    return (
        <div>
            <h2>Home Page</h2>
            <br />
            <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }} style={{ marginTop: '3em', marginBottom: '1em' }} >
                <b style={{ fontSize: '18px' }}>
                    Announcements 
                    {userInfo && userInfo.admin ? 
                        <PlusCircleOutlined style={{ marginLeft: '1em' }} onClick={() => setAnnouncementOpen(true)} /> 
                    : null} 
                </b>
                <AnnouncementsList />
            </Col>
            <br />
            <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }} style={{ marginTop: '1em', marginBottom: '3em' }} >
                <b style={{ fontSize: '18px' }}>Upcoming Events/Trainings</b>
                <TrainingCalender homePage={true} />
            </Col>


            <Modal
                title="Add an Announcement"
                visible={AnnouncementOpen}
                onCancel={closeAnnouncement}
                footer={null}
                maskClosable={false}
            >
            <Form
                name="basic"
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                hideRequiredMark={true}
                form={form}
            >
                <Form.Item
                    label="Announcement"
                    name="announcement"
                    rules={[{ required: true, message: "Please input an announcement" }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
              </Button>
              {/* <span style={{ float: 'right' }}>
                        {props.emailGroupToEdit ?
                            <Popconfirm
                                title={`Are you sure you wabt to delete ${props.emailGroupToEdit.title}`}
                                onConfirm={() => deleteEmailGroup()}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button>
                                    delete
                                </Button>
                            </Popconfirm> : null}
                    </span> */}
                </Form.Item>
            </Form>
            </Modal> 
        </div>
    );
};

export default Home; 