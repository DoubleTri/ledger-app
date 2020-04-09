import React, { useState, useEffect, useContext } from 'react';
import { Button, Table } from 'antd';
import { CheckCircleTwoTone, CloseOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/UserContext';

const TeamMemberTable = () => {

    let { allData } = useContext(AuthContext)

    const [columns, setColumns] = useState(null)
    const [data, setData] = useState(null)
    const [availableFilter, setAvailableFilter] = useState(false)

    useEffect(() => {
        console.log(availableFilter);
        if (allData) {

            let columnsArr = []
            let dataArr = []
           
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
                return availableFilter ? member.available ? dataArr.push(dataArrObj) : null : dataArr.push(dataArrObj)
            })
            setColumns(columnsArr)
            setData(dataArr)
        }
    }, [allData, availableFilter])

    let changeAvailableFilter = () => {
        setAvailableFilter(!availableFilter)
    }

    return (
        <div style={{ margin: '2em' }}>
            <h2>TeamMemberTable Page</h2>
            <br />
            <div onClick={() => changeAvailableFilter()} >{availableFilter ? 'Show all members' : 'Only show available members' }</div>
            {columns && data ?  <Table columns={columns} dataSource={data} pagination={false} /> : null}
           
        </div>
    );
};

export default TeamMemberTable; 