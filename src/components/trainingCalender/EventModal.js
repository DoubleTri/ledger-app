import React from 'react';

const EventModal = (props) => {

    return (
        <div>
            {props.attendeeArr && props.attendeeArr.length ? props.attendeeArr.map((attendee, i) => {
                return <li style={{ marginLeft: '1em' }} key={i}>{attendee}</li>
            }) : null}
        </div>
    );
};

export default EventModal; 