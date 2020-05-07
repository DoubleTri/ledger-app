import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app'
import { fireStore } from '../../firebase';
import { Button, Col, Modal, Form, Input, Popconfirm } from 'antd';
import {EditOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/UserContext';
import TrainingCalender from '../trainingCalender/TrainingClaender';

const AnnouncementsList = (props) => {

    const [form] = Form.useForm();

    let { userInfo, teamName } = useContext(AuthContext)

    const [announcements, setAnnouncements] = useState(null)
    const [AnnouncementOpen, setAnnouncementOpen] = useState(false)
    const [announcementToEdit, setAnnpuncementToEdit] = useState(null)


    useEffect(() => {
        if (teamName) {
        fireStore.collection("Teams").doc(teamName).onSnapshot(function(doc) {
            setAnnouncements(doc.data().announcements)
        })
    }
    }, [teamName])

    let handleSubmit = (values) => {
        values['uid'] = announcementToEdit.uid
        values['date'] = announcementToEdit.date
        values['author'] = announcementToEdit.author
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            let announcements = doc.data().announcements
            let announcementIndex = announcements.indexOf(announcements.find(o => o.uid === announcementToEdit.uid))
            announcements[announcementIndex] = values
            fireStore.collection("Teams").doc(teamName).update({
                "announcements": announcements
            })
        })
        closeAnnouncement()
        form.resetFields();
    } 

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    let editModal = (announcement) => {
        form.setFieldsValue({
            announcement: announcement.announcement,
        })
        setAnnpuncementToEdit(announcement)
        setAnnouncementOpen(true)
    }

    let closeAnnouncement = () => {
        setAnnouncementOpen(false)
    }

    let deleteAnnouncement = () => {
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            fireStore.collection("Teams").doc(teamName).update({
                announcements: firebase.firestore.FieldValue.arrayRemove(doc.data().announcements.find(x => x.uid === announcementToEdit.uid))
            });
        })
       closeAnnouncement()
    }
    return (
        <div>
            {announcements && announcements.length > 0 ? 
            <Col xs={{ span: 20, offset: 2 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
                {announcements.map((announcement, i) => {
                    return <div key={i}>
                        <p><b>{announcement.author}</b> : {announcement.date} {userInfo && userInfo.admin ? <EditOutlined onClick={() => editModal(announcement)} /> : null}</p>
                        {announcement.announcement}
                        <hr />
                        <br />
                        </div> 
                })}
            </Col>
            : 'no announcements' }

            <Modal
                title="Edit Announcement"
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
              <span style={{ float: 'right' }}>
                       
                            <Popconfirm
                                title={`Are you sure you wabt to delete this announcement?`}
                                onConfirm={() => deleteAnnouncement()}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button>
                                    delete
                                </Button>
                            </Popconfirm> 
                    </span>
                </Form.Item>
            </Form>
            </Modal> 

        </div>
    );
};

export default AnnouncementsList; 