import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app'
import { fireStore, auth } from '../../firebase';
import 'firebase/functions';
import { Form, Input, Button, Select, Switch, Popconfirm, message} from 'antd';

const MemberQualEditFrom = (props) => {
    
    const [form] = Form.useForm();

    const [memberEmail, setMemberEmail] = useState(null)
    
    useEffect(() => {
        if (props.member) {
            form.setFieldsValue({
                admin: props.member.admin,
                name: props.member.name,
                email: props.member.email
            })
            setMemberEmail(props.member.email)
        }
    }, [props])

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

    const openDeleteNotification = () => {
        console.log(props.member.uid);
        if (auth.currentUser.uid !== props.member.uid) {

            fireStore.collection("Teams").doc(props.teamName).update({
                uids: firebase.firestore.FieldValue.arrayRemove(props.member.uid)
            })

            let path = 'members.' + props.member.uid 
            fireStore.collection("Teams").doc(props.teamName).update({
                [path]: firebase.firestore.FieldValue.delete()
            })

            var deleteUser = firebase.functions().httpsCallable('deleteUser');
            deleteUser({ uid: props.member.uid});

        } else {
            message.error('You cannot delete yourself')
        }
        props.close()
    }

    const onFinish = values => {
        let basicInfo = {}
        Object.entries(values).map((value) => {
            if (value[0] === 'name' || value[0] === 'email' || value[0] === 'admin' ) {
                basicInfo[value[0]] = value[1]
            } else if (value[1]) {
                Object.entries(props.member).map((changedObj) => {
                    if (typeof changedObj[1] === 'object' && Object.keys(changedObj[1])[0] === value[0]) {
                        let path = 'members.' + props.member.uid + '.' + changedObj[0]
                        fireStore.collection("Teams").doc(props.teamName).update({
                            [path]: {
                                [Object.keys(changedObj[1])[0]]: value[1]
                            }
                        })
                    }
                });
            }
        })
        if (basicInfo.email !== memberEmail) {
            var updateEmail = firebase.functions().httpsCallable('updateEmail');
            updateEmail({ uid: props.member.uid, email: basicInfo.email}).then(() => {
                console.log('auth email updated');
                Object.entries(basicInfo).map((item) => {
                    let path = 'members.' + props.member.uid + '.' + item[0]
                    fireStore.collection("Teams").doc(props.teamName).update({
                        [path]: item[1]
                    })
                });
            }).catch((error) => {
                message.error(error.message);
            })
        } else {
            Object.entries(basicInfo).map((item) => {
                let path = 'members.' + props.member.uid + '.' + item[0]
                fireStore.collection("Teams").doc(props.teamName).update({
                    [path]: item[1]
                })
            });
        }
        if (props.source === 'adminEdit') {
            props.close()
            form.resetFields();
        } else {
            message.success('Your profile has been updated')
        } 
    };

    let generateForm = (member, qualArr) => {
        return qualArr.map((qualItem, k) => {
            if (qualItem.options) {
                return member ? <Form.Item key={k} name={qualItem.qualification} label={qualItem.qualification}>
                    <Select defaultValue={Object.values(member[qualItem.uid])}>
                        {qualItem.options.map((option, l) => {
                            return <Select.Option key={l} value={option}>{option}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                    : null
            } else {
                return member ? <Form.Item key={k} name={qualItem.qualification} label={qualItem.qualification} >
                    <Input defaultValue={Object.values(member[qualItem.uid])} />
                </Form.Item>
                    : null
            }
        })
    }

    return (
        <Form form={form} name="nest-messages" onFinish={onFinish} >

            {props.member ? <div>

                <Form.Item name='name' label='Name' >
                    <Input />
                </Form.Item>

                <Form.Item name='email' label='Email'  rules={[{ type: 'email' }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="admin" label="Admin" valuePropName="checked" >
                    <Switch />
                </Form.Item>

            </div>
        
        : null}

            <hr />

            {generateForm(props.member, props.qualArr)}
            <Form.Item >
                <Button type="primary" htmlType="submit">
                    Submit
          </Button>

          {props.member ?
                        <Popconfirm
                            title={`Are you sure you want to delete ${props.member.name}?`}
                            onConfirm={openDeleteNotification}
                            //onCancel={cancel}
                            okText="Delete"
                            cancelText="Cancel"
                        >
                        {props.source !== 'editPage' ?  <Button type="danger" style={{ float: 'right' }}>
                                Delete
                        </Button> : null}
                        </Popconfirm>
                        : null}
            </Form.Item>
        </Form>
    );
};

export default MemberQualEditFrom; 