import React, { useState, useEffect } from 'react';
import Event from './Event.jsx';
import { faImages } from '@fortawesome/free-solid-svg-icons';

export default function EventsFeed(props) {
  let events = [];
  //creates events for each event in feed
  if (props.events && Object.keys(props.events).length > 0) {
    events = props.events.map((event, index) => {
      const images = event.content.filter(cont => cont.content[0] === '/' || cont.content.includes('http')).map(cont => cont.content);
      return (
        <Event
          {...event}
          userUpdate={props.userUpdate}
          key={`EventsFeed${index}`}
          // Functionality for removing events
          addEvent={props.addEvent}
          user={props.user}
          id={index}
          setEvents={props.setEvents}
          events={props.events}
          images={images}
        />
      );
    });
  }
  return <div className='events'>{events}</div>;
}
