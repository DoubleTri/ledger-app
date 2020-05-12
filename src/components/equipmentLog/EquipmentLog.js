import React, { useState, useEffect, useContext } from 'react';
import { Button, Table, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { AuthContext } from '../../context/UserContext';
import EquipmentModal from './EquipmentModal';
import CategoryModal from './CategoryModal';

const EquipmentLog = () => {

    let { allData, userInfo } = useContext(AuthContext)

    const [openEquipmentModal, setOpenEquipmentModal] = useState(false)
    const [data, setData] = useState(null)
    
    const [openEditModal, setOpenEditModal] = useState(false)
    const [equipment, setEquipment] = useState(null)

    const [openCategories, setOpenCategories] = useState(false)
    const [catagoryArr, setCatagoryArr] = useState(null)

    useEffect(() => {
        if (allData) {
            setCatagoryArr(allData.equipmentCategories)
            let tempArr = []
            allData.equipment.map((item, i) => {
                item.key = i
                item.edit = <EditOutlined onClick={() => { editEquipment(item) }} />
                tempArr.push(item);
            })
            setData(tempArr)
        }
    }, [allData])

    let getFilters = () => {
        let tempArr = []
        if (catagoryArr) {
            catagoryArr.map((item) => {
                tempArr.push({ text: item.category, value: item.category })
            })
        }
        return tempArr
    }
    

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
            title: 'Category',
            dataIndex: 'category',
            filters: getFilters(),
            onFilter: (value, record) => record.category === value,
            key: 'category',
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
        {
            title: 'Cost Recovery',
            children: [
                {
                    title: 'Initial Cost',
                    dataIndex: 'initialCost',
                    key: 'initialCost',
                },
                {
                    title: 'Hourly Cost',
                    dataIndex: 'hourlyCost',
                    key: 'hourlyCost',
                },
            ]
        },
        {
            title: 'Date of Purchase',
            dataIndex: 'purchase',
            key: 'purchase',
        },
    ];

    let addEquipment = () => {
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

    let createCategory = () => {
        setOpenCategories(true)
    }
    let closeCategoriesModal = () => {
        setOpenCategories(false)
    }

    return (
        <div style={{ margin: '2em' }}>
            <h2>Equipment Log Page</h2>

            {userInfo && userInfo.admin ? <div style={{ margin: '1em' }}>
                    <Button onClick={() => { addEquipment() }}>Add Equipment</Button>
                    <Button style={{ marginLeft: '2em' }} onClick={() => { createCategory() }}>Create Equipment Category</Button>
                </div>
            : null}

            {columns && data ? <Table columns={columns} dataSource={data} pagination={false} /> : null}
            <br />

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

            <Modal
                title="Equipment Categories"
                visible={openCategories}
                onCancel={closeCategoriesModal}
                footer={null}
                maskClosable={false}
            >
                <CategoryModal close={closeCategoriesModal} />
            </Modal>

        </div>
    );
};

export default EquipmentLog; 