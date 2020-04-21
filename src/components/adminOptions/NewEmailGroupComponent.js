import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app'
import { fireStore } from '../../firebase';
import { Button, Form, Checkbox, Input, Popconfirm } from 'antd';

import RandomId from '../../functions/RandomId';
import { AuthContext } from '../../context/UserContext';

var len = 10;
var pattern = 'aA0'

const NewEmailGroupComponent = (props) => {

    const [form] = Form.useForm();
    let id = RandomId(len, pattern);

    let { teamName } = useContext(AuthContext)

    useEffect(() => {
        if (props.emailGroupToEdit) {
            form.setFieldsValue({
                name: props.emailGroupToEdit.name,
                members: props.emailGroupToEdit.members
            })
        }
    }, [props])

    const handleSubmit = (values) => {

        if (props.emailGroupToEdit) {

            fireStore.collection("Teams").doc(teamName).get().then((doc) => {
                let emailGroupArr = doc.data().emailGroups
                let emailGroupIndex = emailGroupArr.indexOf(emailGroupArr.find(o => o.uid === props.emailGroupToEdit.uid))
                emailGroupArr[emailGroupIndex] = values
                fireStore.collection("Teams").doc(teamName).update({
                    "emailGroups": emailGroupArr
                })
                props.close()
                form.resetFields();
            })

        } else {

            values['uid'] = id
            fireStore.collection("Teams").doc(teamName).update({
                emailGroups: firebase.firestore.FieldValue.arrayUnion(values)
            }).then(() => {
                props.close()
                form.resetFields();
            })
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    const deleteEmailGroup = () => {
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            fireStore.collection("Teams").doc(teamName).update({
                emailGroups: firebase.firestore.FieldValue.arrayRemove(doc.data().emailGroups.find(x => x.uid === props.emailGroupToEdit.uid))
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
                    label="Email Group Name"
                    name="name"
                    rules={[{ required: true, message: "Please input email group's name" }]}
                >
                    <Input />
                </Form.Item>

                {props.allMembers ?
                    <Form.Item 
                        name="members" 
                        label="Members"
                        rules={[{ required: true, message: 'At least one team member must be selected' }]}
                    >
                        <Checkbox.Group >
                        {props.allMembers.map((member, i) => {
                            return <div key={i}><Checkbox value={member.name}>
                            {member.name}
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
              <span style={{ float: 'right' }}>
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
                    </span>
                </Form.Item>
            </Form>

        </div>
    );
};

export default NewEmailGroupComponent; 