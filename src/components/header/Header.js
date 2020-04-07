import React, { useState, useContext } from 'react';
import { Link } from "react-router-dom";
import { Button, Drawer } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/UserContext';

const Header = () => {

    let { logout, userInfo, teamName } = useContext(AuthContext)

    const [openDrawer, setOpenDrawer] = useState(false)

    let closeDrawer = () => {
        setOpenDrawer(false)
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
        <div style={phantom}>

            <header style={style}>
            
                {userInfo ? <div style={{ float: 'left'}}><MenuUnfoldOutlined onClick={() => setOpenDrawer(true)} /></div> : null }

                <h3>{teamName ? teamName : 'Ledger Responder Software' }

                    {userInfo ?

                        <div style={{ float: 'right'}}>

                            <div>{userInfo.name}</div>

                            <Button type="link" onClick={logout}>
                                Logout
                            </Button>
                            
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
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p><Link onClick={closeDrawer} className='linkText' to='/edit-profile'>Edit Profile</Link></p>
                <p><Link onClick={closeDrawer} className='linkText' to='/team-members'>Team Members</Link></p>
                <p><Link onClick={closeDrawer} className='linkText' to='/calender'>Training/Evnets Calender</Link></p>
              
                {userInfo && userInfo.admin ? <p><Link onClick={closeDrawer} className='linkText' to='/admin-options'>Admin Options</Link></p> : null}

            </Drawer>

        </div>
    )
}


export default Header;