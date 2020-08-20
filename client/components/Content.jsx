import React, { useState, useEffect } from 'react';
import { Media, Form, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import fileUpload from 'express-fileupload';
import FormData from 'form-data';

export default function Content({ user, content, eventid }) {
  const [cont, setCont] = useState(content);
  const [comment, setComment] = useState('');
  const [fileSelected, setFileSelected] = useState({});

  const deleteContent = (e, id, index) => {
    e.preventDefault();
    axios.delete(`/content/${id}`);
    let start = cont.slice(0, index);
    let end = cont.slice(index + 1);
    setCont([...start, ...end]);
  };
  let messages = [];
  if (cont) {
    messages = cont.map((message, index) => {
      return (
        <div className='messageBox' key={`Content${index}`}>
          <div className='userMessage'>
            <img src={message.profilephoto}></img>
          </div>
          <div
            style={{ width: '100%' }}
            className='message'
            key={`Content${index}`}
          >
            <p className='messageName'>
              {message.firstname} {message.lastname}
            </p>
            {message.content[0] === '/' || message.content.includes('http') ? (
              <Image src={`${message.content}`} rounded fluid />
            ) : (
              <p className='messageText'>{message.content}</p>
            )}
            <p className='messageTime'>{message.time}</p>
            {user.username !== message.username || (
              <div id='deleteUpdate'>
                <button
                  id='delete'
                  onClick={(e) => deleteContent(e, message.contentid, index)}
                >
                  x
                </button>
              </div>
            )}
          </div>
        </div>
      );
    });
  }
  //handles change to comment - updates the state
  const handleChange = (e) => {
    setComment(e.target.value);
  };
  //handles submit event - creates time stamp - does not submit to database....yet
  function handleCommentSubmit(e) {
    e.preventDefault();

    //Add message to back end
    axios
      .post(`/content?userName=${user.username}`, {
        eventid: eventid,
        content: comment,
      })
      .then((resp) => {
        const newMessage = resp.data;
        newMessage.profilephoto = user.profilephoto;
        newMessage.firstname = user.firstname;
        newMessage.lastname = user.lastname;
        setCont([...cont, newMessage]);
        // document.getElementsByName('comment-form')[0].reset();
      });
  }

  const fileUploadHandler = (e) => {
    e.preventDefault();
    console.log(fileSelected, fileSelected.name);
    const formData = new FormData();
    formData.append('image', fileSelected, fileSelected.name);
    formData.append('eventid', eventid);
    const URL = `/content?userName=${user.username}`;
    axios
      .post(URL, formData, {
        headers: {
          accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
        withCredentials: true,
      })
      .then((response) => {
        //handle success
        const newMessage = {
          content: response.data,
          profilephoto: user.profilephoto,
          firstname: user.firstname,
          lastname: user.lastname,
        };
        setCont([...cont, newMessage]);
      })
      .catch((error) => {
        //handle error
      });
  };

  return (
    <div className='eventContent'>
      <h4>Comments</h4>
      <div className='messages'>{messages}</div>
      <Form name='comment-form'>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <Form.Label>Add a Comment:</Form.Label>
          <Form.Control as='textarea' rows='2' onChange={handleChange} />
        </Form.Group>
        <input
          type='file'
          onChange={(e) => setFileSelected(e.target.files[0])}
        />
        {/* <button onClick={(e) => fileUploadHandler(e)}>Upload</button> */}
        <Button
          variant='primary'
          type='submit'
          onClick={(e) => {
            comment === '' ? fileUploadHandler(e) : handleCommentSubmit(e);
          }}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
