import React, { useState, useEffect, useContext } from 'react';
import firebase from 'firebase/app'
import { fireStore } from '../../firebase';
import { Button, Row, Col, Modal, Input, Switch, Popconfirm } from 'antd';
import { EditOutlined, FundViewOutlined } from '@ant-design/icons'

import { AuthContext } from '../../context/UserContext';
import NewQualification from './NewQualification';
import EditQualification from './EditQualification';
import NewTeamMember from './NewTeamMember';
import MemberQualEditFrom from '../memberQualEdit/MemberQualEditForm';
import NewEmailGroupComponent from './NewEmailGroupComponent';

const { Search } = Input;

const AdminOptions = () => {

    const [openQualification, setOpenQualification] = useState(false)
    const [openEditQualification, setOpenEditQualification] = useState(false)
    const [qualItem, setQualItem] = useState(null)
    const [qualArr, setQualArr] = useState(null)

    const [openNewTeamMember, setOpenNewTeamMember] = useState(false)
    const [openEditTeamMember, setOpenEditTeamMember] = useState(false)
    const [teamMemberItem, setTeamMemberItem] = useState(null)
    const [teamMemberArr, setTeamMemberArr] = useState(null)

    const [rosterTypes, setRosterTypes] = useState(null)
    const [newRosterType, setNewRosterType] = useState(false)
    const [newToggle, setNewToggle] = useState(false)
    const [newRosterTitle, setNewRosterTitle] = useState(null)
    const [editRosterType, setEditRosterType] = useState(false)
    const [typeBeingEdited, setTypeBeingEdited] = useState(null)

    const [emailGroups, setEmailGroups] = useState(null)
    const [emailGroupModal, setEmailGroupModal] = useState(false)
    const [emailGroupToEdit, setEmailGroupToEdit] = useState(null)
    const [editEmailGroupModal, setEditEmailGroupModal] = useState(false)

    let { teamName } = useContext(AuthContext)

    useEffect(() => {
        if (teamName) {
        fireStore.collection("Teams").doc(teamName).onSnapshot(function(doc) {
            setQualArr(doc.data().qualifications)
            setTeamMemberArr(Object.values(doc.data().members))
            setRosterTypes(doc.data().rosterTypes)
            setEmailGroups(doc.data().emailGroups)
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

// -----------------------------------------------

    let submitRosterType = () => {
        if (newRosterTitle) {
            fireStore.collection("Teams").doc(teamName).update({
                rosterTypes: firebase.firestore.FieldValue.arrayUnion({type: newRosterTitle, shown: newToggle})
            }).then(() => {
                setNewRosterType(false)
                setNewRosterTitle(null)
            })
        } else {
            setNewRosterType(false)
            setNewRosterTitle(null)
            setNewToggle(false)
        }
    }

    let editType = (item) => {
        setTypeBeingEdited(item)
        setNewRosterTitle(item.type)
        setNewToggle(item.shown)
    }

    let closeTypeEdit = () => {
        setTypeBeingEdited(null)
        setNewRosterTitle(null)
        setNewToggle(false)
    }

    let submitRosterTypeEdit = (k) => {
        rosterTypes[k] = {type: newRosterTitle, shown: newToggle}
        fireStore.collection("Teams").doc(teamName).update({
            "rosterTypes": rosterTypes
        })
        setTypeBeingEdited(null)
        setNewRosterType(false)
        setNewRosterTitle(null)
        setNewToggle(false)
    }

    let deleteRosterType = (item, k) => {
        fireStore.collection("Teams").doc(teamName).update({
            rosterTypes: firebase.firestore.FieldValue.arrayRemove(rosterTypes.find(x => x.type === item.type))
        });
        setTypeBeingEdited(null)
        setNewRosterTitle(null)
        setNewToggle(false)
    }

// -----------------------------------------------

    let openNewEmailGroup = () => {
        setEmailGroupModal(true)
    }
    let closeEmailGroupModal = () => {
        setEmailGroupModal(false)
    }
    let editEmailGroup = (item) => {
        setEmailGroupToEdit(item);
        setEditEmailGroupModal(true)
    }
    let closeEditEmailGroup = (item) => {
        setEditEmailGroupModal(false)
        setEmailGroupToEdit(null);
    }

    return ( 
        <div style={{ textAlign: 'left', margin: '5em'}}>

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
                : null}

            <br />
            <hr />
            <br />

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

            <h3>Roster Types</h3>
            <Button onClick={() => setNewRosterType(true)}>Create New Roster Type</Button>
            <br />
            {newRosterType ? 
                <div>
                    <Input style={{ width: '40%', marginTop: '2em' }} onChange={(e) => setNewRosterTitle(e.target.value)} placeholder="enter new roster type" />
                    <br />
                    Calculate Attendance? <Switch checkedChildren="Yes" unCheckedChildren="No" onChange={(e) => setNewToggle(e)} />
                    <br />
                    <Button onClick={() => submitRosterType()}>Submit</Button>
                </div>
                : null }
            {rosterTypes ?
                rosterTypes.map((item, k) => {
                    return <li key={k} style={{ margin: '1em' }}>
                    {typeBeingEdited && typeBeingEdited.type === item.type ? 

                    <div><Input style={{ width: '40%', marginTop: '2em' }} onChange={(e) => setNewRosterTitle(e.target.value)} defaultValue={item.type} />
                    <span style={{ margin: '1em' }}>Calculate Attendance? <Switch defaultChecked={item.shown} checkedChildren="Yes" unCheckedChildren="No" onChange={(e) => setNewToggle(e)} /></span>
                    <Button onClick={() => submitRosterTypeEdit(k)}>Submit</Button>
                        <Button onClick={() => closeTypeEdit()}>Close</Button>
                        <Popconfirm
                                title={`Are you sure you wabt to delete ${item}`}
                                onConfirm={() => deleteRosterType(item, k)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button>Delete</Button>
                            </Popconfirm> 
                        </div>
                        : 
                        <Row>
                            <Col span={1}>{item.shown ? <FundViewOutlined /> : null}</Col> 
                            <Col span={7}>{item.type}</Col>
                            <Col span={3}><EditOutlined onClick={() => editType(item)} /></Col>
                        </Row>
                    }
                    </li>
                })
                : null}

            <br />
            <hr />
            <br />

            <h3>Email Groups</h3>
            <Button onClick={() => openNewEmailGroup()}>Create New Email Group</Button>
            {emailGroups ?
                emailGroups.map((item, k) => {
                    return <li key={k} style={{ margin: '1em' }}>
                        <Row>
                            <Col span={7}>{item.name}</Col>
                            <Col span={3}><EditOutlined onClick={() => editEmailGroup(item)} /></Col>
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

<Modal
                title="New Email Group"
                visible={emailGroupModal}
                onCancel={closeEmailGroupModal}
                footer={null}
                maskClosable={false}
            >
                <NewEmailGroupComponent allMembers={teamMemberArr} close={closeEmailGroupModal}/>
            </Modal>

            <Modal
                title="Edit Email Group"
                visible={editEmailGroupModal}
                onCancel={closeEditEmailGroup}
                footer={null}
                maskClosable={false}
            >
                <NewEmailGroupComponent allMembers={teamMemberArr} emailGroupToEdit={emailGroupToEdit} close={closeEditEmailGroup}/>
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