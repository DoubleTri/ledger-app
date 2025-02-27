import React, { useState, useEffect, useContext } from 'react';
import { Link } from "react-router-dom";
import moment from 'moment';
import { fireStore } from '../../firebase';
import firebase from 'firebase/app'
import { Button, Drawer, Switch, Col, Modal, DatePicker } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/UserContext';

const Header = () => {

    let { logout, userInfo, teamName } = useContext(AuthContext)

    const [openDrawer, setOpenDrawer] = useState(false)
    const [memberAvailable, setMemberAvailable] = useState(false)
    const [availableModal, setAvailbleModal] = useState(false)
    const [date, setDate] = useState(null)

    useEffect(() => {
        if (userInfo) {
            setMemberAvailable(userInfo.available)
        }
    }, [userInfo])

    let availbleChange = (e) => {
        setMemberAvailable(e)
        let path = 'members.' + userInfo.uid + '.available'
        fireStore.collection("Teams").doc(teamName).update({
            [path]: e
        }).then(() => {
            let path = 'members.' + userInfo.uid + '.availableDate'
            fireStore.collection("Teams").doc(teamName).update({
                [path]: firebase.firestore.FieldValue.delete()
            })
        })
        if (!e) {
            setAvailbleModal(true)
        }
    }

    let closeDrawer = () => {
        setOpenDrawer(false)
    }

    let closeAvailableModal = () => {
        setAvailbleModal(false)
    }

    let submitDate = () => {
        let path = 'members.' + userInfo.uid + '.availableDate'
        fireStore.collection("Teams").doc(teamName).update({
            [path]: date
        })
    }

//TODO move all this styling to css file
    var style = {
        backgroundColor: "#F8F8F8",
        borderTop: "1px solid #E7E7E7",
        textAlign: "center",
        padding: "20px",
        position: "relative",
        overflow: 'hidden',
        left: "0",
        bottom: "0",
        height: "5.5em",
    }

    var phantom = {
        width: "100%",
        display: 'block'
    }

    return (
        <div >

            <header style={style}>
            
                {userInfo ? <div style={{ float: 'left', width: '10em'}}><MenuUnfoldOutlined onClick={() => setOpenDrawer(true)} /></div> : null }

                <h3><span style={{ textAlign: 'center', position: 'relative' }}>{teamName ? teamName : 'Ledger Responder Software' }</span>

                    {userInfo ?

                        <div style={{ float: 'right', width: '10em'}}>

                            <div>{userInfo.name}</div>
                            <div><Switch style={{ backgroundColor: memberAvailable ? 'green' : 'lightGray' }} checked={memberAvailable} onChange={(e) => availbleChange(e)} />
                            <span style={{ fontSize: '.75em' , margin: '0.5em'}}>{memberAvailable ? 'available' : 'NOT available'}</span></div> 
                            
                        </div> 

                    : null}

                </h3>

            </header>

            <Drawer
                title="Menu"
                placement={'left'}
                closable={false}
                onClose={closeDrawer}
                visible={openDrawer}
            >
                <p><Link onClick={closeDrawer} className='linkText' to='/'>Home</Link></p>
                <p><Link onClick={closeDrawer} className='linkText' to='/edit-profile'>Edit Profile</Link></p>
                <p><Link onClick={closeDrawer} className='linkText' to='/team-members'>Team Members</Link></p>
                <p><Link onClick={closeDrawer} className='linkText' to='/equipment-log'>Equipment Log</Link></p>
                <p><Link onClick={closeDrawer} className='linkText' to='/calender'>Training/Evnets Calender</Link></p>
                <p><Link onClick={closeDrawer} className='linkText' to='/rosters'>Team Rosters</Link></p>
                <p><Link onClick={closeDrawer} className='linkText' to='/reports'>Reports</Link></p>
                <p><Link onClick={closeDrawer} className='linkText' to='/group-email'>Group Email</Link></p>
              
                {userInfo && userInfo.admin ? <p><Link onClick={closeDrawer} className='linkText' to='/admin-options'>Admin Options</Link></p> : null}

                <Button type="link" onClick={logout}>
                    Logout
                </Button>

            </Drawer>

            <Modal
                title="New Email Group"
                visible={availableModal}
                onCancel={closeAvailableModal}
                footer={null}
                maskClosable={false}
            >
                <p>When will you be available again?</p> 
                <DatePicker placeholder="Select Next Week Ending" format="YYYY-MM-DD HH:mm:ss" showTime={{ defaultValue: moment('00:00', 'HH:mm') }} onChange={(e) => setDate(moment(e).format("MM-DD-YYYY HH:mm"))} />
                <br />
                <div>
                    <span style={{ float: 'left' }}><Button onClick={submitDate}>Submit Return Date/Time</Button></span>
                    <span style={{ float: 'right' }}><Button>Skip</Button></span>
                </div>
            </Modal>

        </div>
    )
}


export default Header;