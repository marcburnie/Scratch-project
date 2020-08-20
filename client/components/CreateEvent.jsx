import React, { useState, useEffect } from 'react';
import { GoogleComponent } from 'react-google-location';
import DateTimePicker from 'react-datetime-picker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearchPlus } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button, Form, Card } from 'react-bootstrap';

export default function CreateEvent({ addEvent, updatingEvent, eventIndex }) {
  /* Form data */
  const initialFormData = Object.freeze({
    eventtitle: '',
    eventlocation: '',
    eventdetails: '',
  });

  const [formData, updateFormData] = React.useState(initialFormData);
  const [dateTime, onChange] = useState(new Date());
  const [show, setShow] = useState(false);
  //handles any change tot he form and updates the state
  const handleChange = (e) => {
    if (e.place) {
      return updateFormData({
        ...formData,
        eventlocation: e.place,
      });
    } else
      return updateFormData({
        ...formData,
        // Trimming any whitespace
        [e.target.name]: e.target.value.trim(),
      });
  };
  //handles submit event - create date and time and append to the event object
  const handleSubmit = (e, newEvent) => {
    console.log(formData);
    const eventdate = dateTime.toDateString();
    let time = dateTime.toTimeString();
    let eventstarttime = time.split(' ')[0];
    // ... submit to API or something
    addEvent({ ...formData, eventdate, eventstarttime }, newEvent, eventIndex);

    handleClose();
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let newEvent = true;
  let buttonTitle = 'Add Event';
  let formTitle = 'Create New Event';
  let cardClass = 'cardContainer';
  if (updatingEvent) {
    newEvent = false;
    buttonTitle = '';
    formTitle = 'Update Event';
    cardClass = 'cardContainer-small';
  }

  return (
    <div>
      <div className={cardClass} onClick={handleShow}>
      <i className="fas fa-edit" ></i>
        <p>{buttonTitle}</p>
      </div>
      
      <Modal show={show} onHide={handleClose} animation={true}>
        <Modal.Header closeButton>
          <Modal.Title>{formTitle}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group controlId='formEventTitle'>
              <Form.Label>Event Title</Form.Label>
              <Form.Control
                name='eventtitle'
                onChange={handleChange}
                required
                type='text'
                placeholder='Enter title'
              />
            </Form.Group>

            <Form.Group controlId='formEventLocation'>
              <Form.Label>Location</Form.Label>

              <GoogleComponent
                apiKey={process.env.REACT_APP_PLACES_API}
                language={'en'}
                country={'country:us'}
                coordinates={true}
                name='eventlocation'
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId='formEventDescription'>
              <Form.Label>Event Description</Form.Label>
              <Form.Control
                name='eventdetails'
                onChange={handleChange}
                required
                as='textarea'
                placeholder='Enter description'
              />
            </Form.Group>

            <Form.Group controlId='formEventDescription'>
              <Form.Label>Start Date & Time</Form.Label>
              <DateTimePicker onChange={onChange} value={dateTime} />
            </Form.Group>

            <Button
              variant='info'
              type='submit'
              onClick={(e) => {
                handleSubmit(e, newEvent);
              }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
