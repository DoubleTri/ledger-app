import React, { useState, useEffect, useContext } from 'react';
import { Button, Table, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/UserContext';
import EquipmentModal from './EquipmentModal';

const EquipmentLog = () => {

    let { allData } = useContext(AuthContext)

    const [openEquipmentModal, setOpenEquipmentModal] = useState(false)
    const [data, setData] = useState(null)
    
    const [openEditModal, setOpenEditModal] = useState(false)
    const [equipment, setEquipment] = useState(null)

    useEffect(() => {
        if (allData) {
            let tempArr = []
            allData.equipment.map((item, i) => {
                item.key = i
                item.edit = <EditOutlined onClick={() => { editEquipment(item) }} />
                tempArr.push(item);
            })
            setData(tempArr)
        }
    }, [allData])

    let columns = [
        {
            title: '',
            dataIndex: 'edit',
            key: 'edit',
        },
        {
            title: 'Equipment',
            dataIndex: 'equipment',
            key: 'equipment',
        },
        {
            title: 'Equipment ID#',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Last Checked/Calibrated',
            dataIndex: 'lastCal',
            key: 'lastCal',
        },
        {
            title: 'Next Checked/Calibrated',
            dataIndex: 'nextCal',
            key: 'nextCal',
        },
        {
            title: 'Team Member Contact',
            dataIndex: 'contact',
            key: 'contact',
        },
    ];

    let addEquipment = () => {
        console.log('equipment added');
        setOpenEquipmentModal(true)
    }

    let closeEquipmentModal = () => {
        setOpenEquipmentModal(false)
    }

    let editEquipment = (item) => {
        setEquipment(item)
        setOpenEditModal(true)
    }
    let closeEditModal = () => {
        setEquipment(null)
        setOpenEditModal(false)
    }

    return (
        <div style={{ margin: '2em' }}>
            <h2>Equipment Log Page</h2>
            {columns && data ? <Table columns={columns} dataSource={data} pagination={false} /> : null}
            <br />
            <Button style={{ float: 'left' }} onClick={() => { addEquipment() }}>Add Equipment</Button>

            <Modal
                title="Add Equipment"
                visible={openEquipmentModal}
                onCancel={closeEquipmentModal}
                footer={null}
                maskClosable={false}
            >
                <EquipmentModal close={closeEquipmentModal} />
            </Modal>

            <Modal
                title="Edit Equipment"
                visible={openEditModal}
                onCancel={closeEditModal}
                footer={null}
                maskClosable={false}
            >
                <EquipmentModal equipment={equipment} close={closeEditModal} />
            </Modal>

        </div>
    );
};

export default EquipmentLog; 