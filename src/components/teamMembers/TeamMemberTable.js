import React, { useState, useEffect, useContext } from 'react';
import { Button, Table, Modal } from 'antd';
import { CheckCircleTwoTone, CloseOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/UserContext';
import { number } from 'prop-types';
import Percentage from './Percentage';

const TeamMemberTable = () => {

    let { allData } = useContext(AuthContext)

    const [columns, setColumns] = useState(null)
    const [data, setData] = useState(null)
    const [availableFilter, setAvailableFilter] = useState(false)

    const [clickedRosterData, setClickedRosterData] = useState(null)
    const [openAttendenceModal, setOpenAttendenceModal] = useState(null)
    const [clickedRosterTitle, setClickedRosterTitle] = useState(null)

    useEffect(() => {

        if (allData) {

            let columnsArr = []
            let rosterTypesArr = []
            let dataArr = []

            let titleRosterCount = 0

            allData.rosterTypes.map((rosterType) => {

                titleRosterCount = 0

                if (rosterType.shown) {
                    rosterTypesArr.push(rosterType.type)

                    allData.rosters.map((roster) => {
                        if (roster.type === rosterType.type) {
                            titleRosterCount = titleRosterCount + 1
                        }
                    })

                            columnsArr.unshift({
                                title: rosterType.type + ': ' + titleRosterCount,
                                dataIndex: rosterType.type,
                                width: 150,
                            });
                        }
                    })
           
            allData.qualifications.map((qual) => {
                columnsArr.push({
                    title: qual.qualification,
                    dataIndex: qual.qualification,
                    width: 150,
                })
            })

            columnsArr.unshift({
                title: 'Name',
                dataIndex: 'name',
                width: 150,
            });
  
            setColumns(columnsArr)
            
            Object.values(allData.members).map((member) => {
                let dataArrObj = {}
                dataArrObj.key = member.name
                dataArrObj.name = <div onClick={() => console.log(member.name, ' clicked')}>
                        <span style={{ margin: '.2em' }}>{member.available ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseOutlined /> }</span><b>{member.name}</b>
                    </div>

                Object.entries(member).map((item) => {
                    if (typeof item[1] === 'object') {
                        dataArrObj[Object.keys(item[1])] = Object.values(member[item[0]])
                    }
                })

                let rosterCount = 0;
                let timesAttended = []
                let allRostersforType = []

                rosterTypesArr.map((rosterTitle) => {
                    rosterCount = 0
                    timesAttended = []
                    allData.rosters.map((roster) => {
                        if (roster.type === rosterTitle) {
                            rosterCount = rosterCount + 1
                            allRostersforType.push(roster)
                            roster.members.map((rosterMember) => {
                                if (rosterMember === member.name) {
                                    if (rosterCount !== 0) {
                                        timesAttended.push({date: roster.date, event: roster.event})
                                    } 
                                }
                            })
                        }
                        dataArrObj[rosterTitle] = <Percentage 
                            timesAttended={timesAttended} 
                            rosterCount={rosterCount} 
                            rosterTitle={rosterTitle} 
                            allRostersforType={allRostersforType}
                        /> 
                        // dataArrObj[rosterTitle] = <div onClick={() => attendanceClicked(timesAttended, rosterTitle)}>
                        //     {isFinite(timesAttended.length / rosterCount) ? Math.floor((timesAttended.length / rosterCount) * 100) + "%" : '0%'}
                        // </div>
                    })
                })
                return availableFilter ? member.available ? dataArr.push(dataArrObj) : null : dataArr.push(dataArrObj)
            })
            setColumns(columnsArr)
            setData(dataArr)
        }
    }, [allData, availableFilter])

    // let attendanceClicked = (timesAttended, rosterTitle) => {
    //     setClickedRosterTitle(rosterTitle)
    //     setClickedRosterData(timesAttended)
    //     setOpenAttendenceModal(true)
    // }
    let closeAttendenceModal = () => {
        setOpenAttendenceModal(false)
        setClickedRosterData(null)
    }

    let changeAvailableFilter = () => {
        setAvailableFilter(!availableFilter)
    }

    return (
        <div style={{ margin: '2em' }}>
            <h2>TeamMemberTable Page</h2>
            <br />
            <div onClick={() => changeAvailableFilter()} >{availableFilter ? 'Show all members' : 'Only show available members' }</div>
            {columns && data ?  <Table columns={columns} dataSource={data} pagination={false} /> : null}

            {clickedRosterData &&  clickedRosterData.length > 0 && clickedRosterTitle ?
                <Modal
                    title={clickedRosterTitle}
                    visible={openAttendenceModal}
                    onCancel={closeAttendenceModal}
                    footer={null}
                    maskClosable={false}
                >
                {console.log(clickedRosterData)}
                    {clickedRosterData.map((item, k) => {
                        return <div key={k}>{item.event + ': ' + item.date}</div>
                        })
                    }
            </Modal>
                : null}
           
        </div>
    );
};

export default TeamMemberTable; 