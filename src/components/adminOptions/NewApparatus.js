import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app'
import { fireStore } from '../../firebase';
import { Form, Input, Button, Checkbox, Col, Switch, InputNumber, Popconfirm } from 'antd';

import RandomId from '../../functions/RandomId';
import { AuthContext } from '../../context/UserContext';

var len = 10;
var pattern = 'aA0'

const NewApparatus = (props) => {

    const [form] = Form.useForm();
    let id = RandomId(len, pattern);
    let { teamName } = useContext(AuthContext)

    useEffect(() => {
        if (props.apparatusToEdit) {
            form.setFieldsValue({
                name: props.apparatusToEdit.name,
                initialCost: props.apparatusToEdit.initialCost,
                hourlyCost: props.apparatusToEdit.hourlyCost
            })
        }
    }, [props])

    const handleSubmit = (values) => {
        if (!values.initialCost) {
            values.initialCost = 0
        }
        if (!values.hourlyCost) {
            values.hourlyCost = 0
        }

        if (props.apparatusToEdit) {

            fireStore.collection("Teams").doc(teamName).get().then((doc) => {
                let apparatusArr = doc.data().apparatus
                let apparatusIndex = apparatusArr.indexOf(apparatusArr.find(o => o.uid === props.apparatusToEdit.uid))
                apparatusArr[apparatusIndex] = values
                fireStore.collection("Teams").doc(teamName).update({
                    "apparatus": apparatusArr
                })
                props.close()
                form.resetFields();
            })

        } else {

            values['uid'] = id
            fireStore.collection("Teams").doc(teamName).update({
                apparatus: firebase.firestore.FieldValue.arrayUnion(values)
            }).then(() => {
                props.close()
                form.resetFields();
            })
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    let deleteApparatus = () => {
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            fireStore.collection("Teams").doc(teamName).update({
                apparatus: firebase.firestore.FieldValue.arrayRemove(doc.data().apparatus.find(x => x.uid === props.apparatusToEdit.uid))
            });
        })
        props.close()
        form.resetFields()
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
                  label="Apparatus Name"
                  name="name"
                  rules={[{ required: true, message: "Please input apparatus name" }]}
              >
                  <Input />
              </Form.Item>

              <br />
              <hr />
              <br />
              <h3>Cost Recovery</h3>
              (optional)
              <Form.Item
                  label="Initial Cost"
                  name="initialCost"
                  rules={[{ required: false }]}
              >
                  <InputNumber />
              </Form.Item>

              <Form.Item
                  label="Hourly Cost"
                  name="hourlyCost"
                  rules={[{ required: false }]}
              >
                  <InputNumber />
              </Form.Item>

              <Form.Item >
                  <Button type="primary" htmlType="submit">
                      Submit
              </Button>
              <span style={{ float: 'right' }}>
                        {props.apparatusToEdit ?
                            <Popconfirm
                                title={`Are you sure you wabt to delete ${props.apparatusToEdit.name}`}
                                onConfirm={() => deleteApparatus()}
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
      </Col>
  );
};

export default NewApparatus; 