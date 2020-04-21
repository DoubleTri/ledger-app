import React, { useState, useEffect, useContext } from 'react';
import { Button, Dropdown, Menu, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import { AuthContext } from '../../context/UserContext';
import { send } from 'q';

const GroupEmail = () => {

    let { allData, userInfo } = useContext(AuthContext)

    const [emailGroups, setEmailGroups] = useState(null)
    const [chosenGroup, setChosenGroup] = useState(null)
    const [subject, setSubject] = useState(null)
    const [text, setText] = useState(null)

    useEffect(() => {
        if(allData) {
            setEmailGroups(allData.emailGroups)
        }
    }, [allData])

    var modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link']
        ]
    }

    var formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link',
    ]

    let menu = () => <Menu>
        {emailGroups.map((group, i) => {
            return <Menu.Item key={i} onClick={() => {setChosenGroup(group)}}>
                {group.name}
            </Menu.Item>
        })}
    </Menu>

    let send = async () => {
        let emailObj = {}
        let emailArr = []
        if (setChosenGroup, subject, text) {
            await chosenGroup.members.map((name) => {
                emailArr.push(Object.values(allData.members).find(o => o.name === name).email) 
            })
            emailObj['subject'] = subject
            emailObj['text'] = text
            emailObj['from'] = userInfo.name
            emailObj['recipeants'] = emailArr
            console.log(emailObj);
        } 
    }

    return (
        <div style={{ margin: '3em' }} >
            <h2>Group Email Page</h2>
            <br />
    
                <div style={{ marginBottom: '3em' }} >
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            Choose a recipient group <DownOutlined />
                        </a>
                    </Dropdown>
                    {chosenGroup ? <span style={{ marginLeft: '3em' }}><b>To:</b> {chosenGroup.name}</span> : null}
                </div>
                <Input placeholder="Subject" style={{ maringBottom: '3em' }} onChange={(e) => setSubject(e.target.value) } /> 
            <ReactQuill
                onChange={(e) => setText(e)}
                modules={modules}
                formats={formats}
                style={{ height: "500px", marginBottom: "5em", marginTop: '3em' }}
            />
            {chosenGroup && subject && text ? <Button style={{ float: 'right' }} onClick={() => send()}>Send</Button> : null} 
        </div>
    );
};

export default GroupEmail; 