import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app'
import Moment from 'moment';
import { fireStore } from '../../firebase';
import {  Form, Input, Button, TimePicker, Popconfirm } from 'antd';

import { AuthContext } from '../../context/UserContext';

import RandomId from '../../functions/RandomId';

var len = 10;
var pattern = 'aA0'

const { TextArea } = Input;

const CreateEvent = (props) => {

    const [form] = Form.useForm();

    useEffect(() => {

        if (props.eventData) {
            form.setFieldsValue({
                title: props.eventData.title,
                startTime: Moment(props.eventData.startTime, 'HH:mm'),
                endTime: Moment(props.eventData.endTime, 'HH:mm'),
                eventInfo: props.eventData.eventInfo,
                uid: props.eventData.uid 
            })
        } 
    }, [props])

    let onFinish = (values) => {

        let id = props.eventData ? props.eventData.uid : RandomId(len, pattern);

        let eventObj = {
            title: values.title,
            date: props.selectedDay,
            start: props.ISOString,
            startTime: values.startTime.format('HH:mm'),
            endTime: values.endTime.format('HH:mm'),
            eventInfo: values.eventInfo ? values.eventInfo : '',
            uid: id,
            attendees: []
        }

        if (props.eventData) {

            fireStore.collection("Teams").doc(props.teamName).get().then((doc) => {
                let eventsArr = doc.data().events
                let eventsIndex = eventsArr.indexOf(eventsArr.find(o => o.uid === id))
                eventsArr[eventsIndex] = eventObj
                fireStore.collection("Teams").doc(props.teamName).update({
                    "events": eventsArr
                })
            })

        } else {

            fireStore.collection("Teams").doc(props.teamName).update({
                events: firebase.firestore.FieldValue.arrayUnion(eventObj)
            })

        }
        props.close()
        form.resetFields()
    }

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    let deleteEvent = () => {
        fireStore.collection("Teams").doc(props.teamName).get().then((doc) => {
            fireStore.collection("Teams").doc(props.teamName).update({
                events: firebase.firestore.FieldValue.arrayRemove(doc.data().events.find(x => x.uid === props.eventData.uid))
            });
        })
        props.close()
        form.resetFields()
    }

    return (
        <div>
            <h2>CreateEvent Page</h2>
            <br />
            <Form
                // {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                hideRequiredMark={true}
                form={form}
            >
                <Form.Item
                    label="Event Title"
                    name="title"
                    rules={[{ required: true, message: 'Please input event title' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Start Time"
                    name="startTime"
                    rules={[{ required: true, message: 'Please input start time' }]}>
                    <TimePicker format={'HH:mm'}/>
                </Form.Item>

                <Form.Item
                    label="End Time"
                    name="endTime"
                    rules={[{ required: true, message: 'Please input end time' }]}>
                    <TimePicker format={'HH:mm'}/>
                </Form.Item>

                <Form.Item
                    label="Event Info"
                    name="eventInfo"
                    rules={[{ required: false }]}
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <span style={{ float: 'right' }}>
                        {props.eventData ?
                            <Popconfirm
                                title={`Are you sure you wabt to delete ${props.eventData.title}`}
                                onConfirm={() => deleteEvent()}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button>
                                    delete
                                </Button>
                            </Popconfirm> : null}
                        <Button onClick={() => { props.close() }} >
                            Close
                    </Button>
                    </span>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateEvent; 