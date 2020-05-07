import React, { useState, useEffect, useContext } from 'react';
import { Button, Form, DatePicker, TimePicker, Input, Checkbox, Select, message } from 'antd';
import moment from 'moment';

import { AuthContext } from '../../context/UserContext';
const { TextArea } = Input;

const Reports = () => {

    const [form] = Form.useForm();
    let { userInfo, allData, teamName } = useContext(AuthContext)

    const [allMembers, setAllMembers] = useState(null)
    const [allApparatus, setAllApparatus] = useState(null)

    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [costRecoveryTotal, setCostRecoveryTotal] = useState(0)

    useEffect(() => {
        if (userInfo) {
            form.setFieldsValue({
                writtenBy: userInfo.name
            })
        }
        if (allData) {
            let tempMembersArr = []
            let tempApparatusArr = []
            Object.values(allData.members).map((item, i) => {
                tempMembersArr.push(item.name);
            })
            allData.apparatus.map((item, i) => {
                tempApparatusArr.push(item);
            })
            setAllApparatus(tempApparatusArr)
            setAllMembers(tempMembersArr)
        }
    }, [userInfo, allData])

    const handleSubmit = async (values) => {
        form.resetFields()
        message.success('Report Submitted')
        console.log(values);
    }

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    }

    let costRecoveryCal = (item, checked) => {
        let total = 0
        if (checked && item.initialCost) {
            total = item.initialCost
        }
        if (checked && item.hourlyCost) {
            let start = moment(endTime)
            let end = moment(startTime) 
            total = total + ((moment.duration(start.format("HH:mm")).asMinutes()) - (moment.duration(end.format("HH:mm")).asMinutes())) * (item.hourlyCost/60)
        }
        setCostRecoveryTotal(total)
    }

    return (
        <div style={{ margin: '5em' }}>
            <h2>Reports Page</h2>
            <br />
            <Form
                name="basic"
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                hideRequiredMark={true}
                form={form}
            >

                <Form.Item
                    label="Incident Date"
                    name="date"
                    rules={[{ required: true, message: 'Please input incident date' }]}
                >
                    <DatePicker format="MMMM D, YYYY" onChange={(e) => console.log(e)}/>

                </Form.Item>

                <Form.Item
                    label="Report Written By"
                    name="writtenBy"
                    rules={[{ required: true, message: 'Please input name of member writing the report' }]}
                >
                    <Input
                       onChange={(e) => console.log(e.target.value)}
                    />

                </Form.Item>

                <Form.Item
                    label="Incident Location"
                    name="location"
                    rules={[{ required: true, message: 'Please input incident location' }]}
                >
                    <Input
                        onChange={(e) => console.log(e)}
                    />
                    
                </Form.Item>

                <hr style={{ marginTop: '2em',  marginBottom: '2em'}} />

          {/* <Form.Item>
            {getFieldDecorator('newDay', {
              valuePropName: 'checked',
            })(
              <Checkbox onChange={this.multiDay.bind(this)}>Multi-Day Incidnet?</Checkbox>
              )}
          </Form.Item> */}

                <Form.Item
                    label="Activation Time"
                    name="activationTime"
                    rules={[{ required: true, message: 'Please input team activation time' }]}
                >
                    <TimePicker
                        onChange={(e) => setStartTime(e)}
                    />
                </Form.Item>

                <Form.Item
                    label="Arrivial Time"
                    name="arrivialTime"
                    rules={[{ required: true, message: 'Please input team arrivial time' }]}
                >
                    <TimePicker
                        onChange={(e) => console.log(e)}
                    />
                </Form.Item>

                <Form.Item
                    label="In Service Time"
                    name="clearTime"
                    rules={[{ required: true, message: 'Please input in service time' }]}
                >
                    <TimePicker
                        onChange={(e) => setEndTime(e)}
                    />
                </Form.Item>

                <Form.Item
                    label="Requesting Agency"
                    name="requesting"
                    rules={[{ required: true, message: 'Please input the requesting agency' }]}
                >
                    <Input
                        onChange={(e) => console.log(e)}
                    />
                </Form.Item>

                {/* <Form.Item
                    label="requesting"
                    name="Requesting Agency"
                    rules={[{ required: true, message: 'Please input the requesting agency' }]}
                >
                    <Input
                        onChange={(e) => console.log(e)}
                    />
                </Form.Item> */}

                {/* <Form.Item label="Incident Type"
                    name="incidentType"
                    rules={[{ required: true, message: 'Please input incident type' }]}>
                    <Select
                        style={{ width: '50%' }}
                        onChange={this.onChangeSelect.bind(this, 'incidentType')}
                    >
                        <Select.Option value="Water Rescue">Water Rescue</Select.Option>
                        <Select.Option value="Confined Space">Confined Space</Select.Option>
                        <Select.Option value="Rope Rescue">Rope Rescue</Select.Option>
                        <Select.Option value="Trench Rescue">Trench Rescue</Select.Option>
                        <Select.Option value="Building Collapse">Building Collapse</Select.Option>
                        <Select.Option value="Vehicle Extrication">Vehicle Extrication</Select.Option>
                        <Select.Option value="Grain Bin Rescue">Grain Bin Rescue</Select.Option>
                        <Select.Option value="Other">Other</Select.Option>

                    </Select>

                </Form.Item> */}

            <hr style={{ marginTop: '2em',  marginBottom: '2em'}} />

                <Form.Item
                    label="Initial Actions"
                    name="initialActions"
                    rules={[{ required: true, message: 'Please input your initial actions' }]}
                >
                    <TextArea
                        onChange={(e) => console.log(e)}
                    />
                </Form.Item>

                <Form.Item
                    label="Sustained Actions"
                    name="sustainedActions"
                    rules={[{ required: true, message: 'Please input your sustained actions' }]}
                >
                    <TextArea
                        onChange={(e) => console.log(e)}
                    />
                </Form.Item>

                <Form.Item
                    label="Termination"
                    name="termination"
                    rules={[{ required: true, message: 'Please input your termination' }]}
                >
                    <TextArea
                        onChange={(e) => console.log(e)}
                    />
                </Form.Item>

                

          {/* {this.state.members ? <NameForms
            members={this.state.members}
            change={this.change.bind(this)}
            name="presentMembers"
            value={this.state.presentMembers}
          /> : 'loading...'} */}

            <hr style={{ marginTop: '2em',  marginBottom: '2em'}} /> 

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

                <hr style={{ marginTop: '2em', marginBottom: '2em' }} />

                {allApparatus ?
                    <Form.Item
                        name="apparatus"
                        label="Apparatus"
                        rules={[{ required: true, message: 'At least one apparatus must be selected' }]}
                    >
                        <Checkbox.Group >
                            {allApparatus.map((apparati, i) => {
                                return <div key={i}><Checkbox value={apparati.name} onChange={(e) => costRecoveryCal(apparati, e.target.checked)}>
                                    {apparati.name}
                                </Checkbox>
                                </div>
                            })}

                        </Checkbox.Group>
                    </Form.Item>
                    : null}

          <Button htmlType="submit">Next</Button>

        </Form>
        <br />
        <b>Total Cost Recovery: </b> {costRecoveryTotal}
        </div>
    );
};

export default Reports; 