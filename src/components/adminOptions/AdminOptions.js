import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import { Button, Row, Col, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons'

import { AuthContext } from '../../context/UserContext';
import NewQualification from './NewQualification';
import EditQualification from './EditQualification';
import NewTeamMember from './NewTeamMember';
import MemberQualEditFrom from '../memberQualEdit/MemberQualEditForm';

const AdminOptions = () => {

    const [openQualification, setOpenQualification] = useState(false)
    const [openEditQualification, setOpenEditQualification] = useState(false)
    const [qualItem, setQualItem] = useState(null)
    const [qualArr, setQualArr] = useState(null)

    const [openNewTeamMember, setOpenNewTeamMember] = useState(false)
    const [openEditTeamMember, setOpenEditTeamMember] = useState(false)
    const [teamMemberItem, setTeamMemberItem] = useState(null)
    const [teamMemberArr, setTeamMemberArr] = useState(null)
    

    let { teamName } = useContext(AuthContext)

    useEffect(() => {
        if (teamName) {
        fireStore.collection("Teams").doc(teamName).onSnapshot(function(doc) {
            setQualArr(doc.data().qualifications)
            setTeamMemberArr(Object.values(doc.data().members))
        })
    }
    }, [teamName])

    let closeQualification = () => {
        setOpenQualification(false)
    }

    let editQualification = (item) => {
        setQualItem(item)
        setOpenEditQualification(true)
    }

    let closeEditQualification = () => {
        setQualItem(null)
        setOpenEditQualification(false)
    }

// -----------------------------------------------

    let closeNewTeamMembe = () => {
        setOpenNewTeamMember(false)
    }

    let editTeamMember = (item) => {
        setTeamMemberItem(item)
        setOpenEditTeamMember(true)
    }

    let closeEditTeamMember = () => {
        setQualItem(null)
        setTeamMemberItem(null)
        setOpenEditTeamMember(false)
    }



    return ( 
        <div style={{ textAlign: 'left', margin: '5em'}}>

            <h3>Team Member Qualifications</h3>
            <Button onClick={() => setOpenQualification(true)}>Create New Qualification</Button>
            {qualArr ?
                qualArr.map((item, k) => {
                    return <li key={k} style={{ margin: '1em' }}>
                        <Row>
                            <Col span={7}>{item.qualification}</Col>
                            <Col span={3}><EditOutlined onClick={() => editQualification(item)} /></Col>
                        </Row>
                    </li>
                })
            : null }

            <br />
            <hr />
            <br />

            <h3>Team Members</h3>
            <Button onClick={() => setOpenNewTeamMember(true)}>Create New Team Member</Button>
            {teamMemberArr ?
                teamMemberArr.map((item, k) => {
                    return <li key={k} style={{ margin: '1em' }}>
                        <Row>
                            <Col span={7}>{item.name}</Col>
                            <Col span={3}><EditOutlined onClick={() => editTeamMember(item)} /></Col>
                        </Row>
                    </li>
                })
            : null }

{/*--------------------------------------------------------------------- */}

            <Modal
                title="New Qualification"
                visible={openQualification}
                onCancel={closeQualification}
                footer={null}
                maskClosable={false}
            >
                <NewQualification close={closeQualification} />
            </Modal>

            <Modal
                title="Edit Qualification"
                visible={openEditQualification}
                onCancel={closeEditQualification}
                footer={null}
                maskClosable={false}
            >
                <EditQualification close={closeEditQualification} qualItem={qualItem} />
            </Modal>

{/*--------------------------------------------------------------------- */}

            <Modal
                title="New Team Member"
                visible={openNewTeamMember}
                onCancel={closeNewTeamMembe}
                footer={null}
                maskClosable={false}
            >
                <NewTeamMember close={closeNewTeamMembe} />
            </Modal>

            <Modal
                title="Edit Team Member"
                visible={openEditTeamMember}
                onCancel={closeEditTeamMember}
                footer={null}
                maskClosable={false}
            >
                <MemberQualEditFrom teamName={teamName} member={teamMemberItem} qualArr={qualArr} close={closeEditTeamMember} source={'adminEdit'} />
            </Modal>

{/*--------------------------------------------------------------------- */}

        </div>
  );
};

export default AdminOptions; 

/* TODO 

DONE!!  When qual is created, update all members
DONE!!  When qual is edited, update all members
DONE!!  When member is created, he's populated with current qual list
Admin can edit individual members
Members can edit themselves

*/