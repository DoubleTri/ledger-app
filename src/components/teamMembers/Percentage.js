import React, { useState, useEffect, useContext } from 'react';
import { Button, Modal } from 'antd';

import { AuthContext } from '../../context/UserContext';

const Percentage = (props) => {

    const [clickedRosterData, setClickedRosterData] = useState(null)
    const [openAttendenceModal, setOpenAttendenceModal] = useState(null)
    const [clickedRosterTitle, setClickedRosterTitle] = useState(null)

    useEffect(() => {
        // console.log(props.allRostersforType);
    }, [])

    let attendanceClicked = () => {
        console.log(props.allRostersforType);
        setClickedRosterTitle(props.rosterTitle)
        setClickedRosterData(props.timesAttended)
        setOpenAttendenceModal(true)
    }
    let closeAttendenceModal = () => {
        setOpenAttendenceModal(false)
        setClickedRosterData(null)
    }

    return (
        <div>
            <div onClick={() => attendanceClicked()}>
                {isFinite(props.timesAttended.length / props.rosterCount) ? Math.floor((props.timesAttended.length / props.rosterCount) * 100) + "%" : '0%'}
            </div>

            {clickedRosterData ?
                <Modal
                    title={props.rosterTitle}
                    visible={openAttendenceModal}
                    onCancel={closeAttendenceModal}
                    footer={null}
                    maskClosable={false}
                >
                    {clickedRosterData.map((item, k) => {
                        return <div key={k}>{item.event + ': ' + item.date}</div>
                    })
                    }
                </Modal>
                : null}
               

        </div>
    );
};

export default Percentage; 