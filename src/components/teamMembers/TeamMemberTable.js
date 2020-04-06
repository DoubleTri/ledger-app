import React, { useState, useEffect, useContext } from 'react';
import { Button, Table } from 'antd';

import { AuthContext } from '../../context/UserContext';

const TeamMemberTable = () => {

    let { allData } = useContext(AuthContext)

    const [columns, setColumns] = useState(null)
    const [data, setData] = useState(null)

    useEffect(() => {

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
                dataArrObj.name = member.name
                Object.entries(member).map((item) => {
                    if (typeof item[1] === 'object') {
                        dataArrObj[Object.keys(item[1])] = Object.values(member[item[0]])
                    }
                })
                dataArr.push(dataArrObj);
            })
            setColumns(columnsArr)
            setData(dataArr)
        }
    }, [allData])

    return (
        <div>
            <h2>TeamMemberTable Page</h2>
            <br />
            {columns && data ?  <Table columns={columns} dataSource={data} pagination={false} /> : console.log('loading')}
           
        </div>
    );
};

export default TeamMemberTable; 