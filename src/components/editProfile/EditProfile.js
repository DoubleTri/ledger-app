import React, { useState, useEffect, useContext } from 'react';
import { Button, Col } from 'antd';

import { AuthContext } from '../../context/UserContext';
import { fireStore } from '../../firebase';
import { auth } from 'firebase';
import MemberQualEditFrom from '../memberQualEdit/MemberQualEditForm';

const EditProfile = () => {

    let { teamName, userInfo } = useContext(AuthContext)

    const [member, setMember] = useState(null)
    const [qualArr, setQualArr] = useState(null)

    useEffect(() => {
        if (teamName && userInfo) {
            fireStore.collection("Teams").doc(teamName).onSnapshot((doc) => {
                setQualArr(doc.data().qualifications)
                setMember(doc.data().members[userInfo.uid]);
            })
        }
    }, [teamName, userInfo])

    return (
        <div>
            {member && qualArr ? <div>
                <h2>Edit Profile</h2>
                <br />
                <Col span={18} offset={3}>
                    <MemberQualEditFrom teamName={teamName} member={member} qualArr={qualArr} close={null} source={'editPage'} />
                </Col>
            </div>
                : 'loading....'}    
        </div>
    );
};

export default EditProfile; 