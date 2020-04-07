import React, { useState, useEffect, useContext } from 'react';
import { fireStore } from '../../firebase';
import FullCalendar from 'fullcalendar-reactwrapper';
import { Button, Col, Modal } from 'antd';

import '../../../node_modules/fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';

import CreateEvent from './CreateEvent';
import EventModal from './EventModal';

import { AuthContext } from '../../context/UserContext';

const TrainingCalender = () => {

    let { teamName, userInfo } = useContext(AuthContext)

    const [events, setEvents] = useState(null)

    const [openDayModal, setOpenDayModal] = useState(false)
    const [selectedDay, setSelectedDay] = useState(null)
    const [ISOString, setISOString] = useState(null)

    const [openEventModal, setOpenEventModal] = useState(false)
    const [eventData, setEventData] = useState(null)
    const [openEditEventModal, setOpenEditEventModal] = useState(false)
    const [userAttending, setUserAttending] = useState(false)
    const [attendeeArr, setAttendeeArr] = useState(null)

    useEffect(() => {
        if (teamName) {
            fireStore.collection("Teams").doc(teamName).onSnapshot((snap) => {
                setEvents(snap.data().events);
            })
        } 
    }, [teamName])


    let clickedDay = (date) => {
        setSelectedDay(date.format("dddd, MMMM D, YYYY"));
        setISOString(date.toISOString());
        setOpenDayModal(true)
    }
    let closeDayModal = () =>{
        setOpenDayModal(false)
        setSelectedDay(null)
    }


    let clickedEvent = (calEvent) => {
        setEventData(calEvent);
        setISOString(calEvent.start.toISOString());
        setSelectedDay(calEvent.start.format("dddd, MMMM D, YYYY"));
        setOpenEventModal(true)
        setAttendeeArr(calEvent.attendees)
        calEvent.attendees.forEach((item) => {
            if (item === userInfo.name) {
                setUserAttending(true)
            } 
        })
    } 
    let closeEventModal = () => {
        setOpenEventModal(false)
        setEventData(null)
        setUserAttending(false)
    }  

    let editEvent = () => {
        setOpenEventModal(false)
        setOpenEditEventModal(true)
    }
    let closeEditEventModal = () => {
        setOpenEditEventModal(false)
        setISOString(null);
        setSelectedDay(null);
        setEventData(null)
    }

    let attending = () => {
        setUserAttending(true)
        let tempArr = attendeeArr
        tempArr.push(userInfo.name);
        setAttendeeArr(tempArr)
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            let eventsArr = doc.data().events
            let eventsIndex = eventsArr.indexOf(eventsArr.find(o => o.uid === eventData.uid))
            eventsArr[eventsIndex].attendees.push(userInfo.name)
            fireStore.collection("Teams").doc(teamName).update({
                "events": eventsArr
            })
        })
        //closeEventModal()
    }
    let notAttending = () => {
        setUserAttending(false)
        var index = attendeeArr.indexOf(userInfo.name);
        if (index !== -1) {
            let tempArr = attendeeArr
            tempArr.splice(index, 1);
            setAttendeeArr(tempArr)
        }
        fireStore.collection("Teams").doc(teamName).get().then((doc) => {
            let eventsArr = doc.data().events
            let eventsIndex = eventsArr.indexOf(eventsArr.find(o => o.uid === eventData.uid))
            var index = eventsArr[eventsIndex].attendees.indexOf(userInfo.name);
            if (index !== -1) eventsArr[eventsIndex].attendees.splice(index, 1);
            fireStore.collection("Teams").doc(teamName).update({
                "events": eventsArr
            })
        })
    }

    return (
        <div>
            <h2>Training Calender Page</h2>
            <div>
                <Col xs={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }} style={{ marginTop: '5em', marginBottom: '5em' }} >
                    <FullCalendar
                        id="calendar"
                        header={{
                            left: 'prev,next today myCustomButton',
                            center: 'title',
                            right: 'month,listYear'
                        }}
                        defaultDate={new Date()}
                        navLinks={true} // can click day/week names to navigate views
                        editable={false}
                        displayEventTime={false}
                        dayClick={userInfo && userInfo.admin ? (date) => clickedDay(date) : null}
                        eventClick={(calEvent) => clickedEvent(calEvent)}
                        eventLimit={true} // allow "more" link when too many events
                        events={events}

                    />

                    {/* Day */}
                    <Modal
                        title={selectedDay}
                        visible={openDayModal}
                        onCancel={closeDayModal}
                        footer={null}
                    >
                        <CreateEvent
                            ISOString={ISOString}
                            close={closeDayModal}
                            teamName={teamName}
                            selectedDay={selectedDay}
                        />
                    </Modal>

                    {/* Events  */}
                    {eventData ?
                        <Modal
                            title={eventData.title}
                            visible={openEventModal}
                            closable={false}
                            footer={null}
                        >
                        <div><b>Date: </b>{eventData.date}</div>
                        <div><b>Start Time: </b>{eventData.startTime} <b>End Time: </b>{eventData.endTime}</div>
                        <div><b>Event Info: </b>{eventData.eventInfo}</div>
                        <div><b>Attendees:</b>{userAttending ? ' You are scheduled to attend' : null}
                            <EventModal attendeeArr={attendeeArr} />
                        </div>
  
                        <div>
                            <Button onClick={closeEventModal}>Close</Button>
                            {userInfo.admin ? <Button onClick={editEvent}>Edit</Button> : null}
                            {userAttending ? <Button onClick={() => notAttending()}>I am NOT attending</Button> : <Button onClick={() => attending()}>I am attending</Button> }
                        </div>
                        </Modal>
                        : null}

                    {eventData ?
                        <Modal
                            title={`Edit: ${eventData.title}`}
                            visible={openEditEventModal}
                            closable={false}
                            footer={null}
                        >
                            <CreateEvent
                                ISOString={ISOString}
                                close={closeEditEventModal}
                                teamName={teamName}
                                selectedDay={selectedDay}
                                eventData={eventData}
                            />
                        </Modal>
                        : null}
                </Col>
            </div>
            <br />
        </div>
    );
};

export default TrainingCalender; 