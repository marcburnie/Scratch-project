import React, { useState, useEffect } from 'react';
import { Media, Form, Button } from 'react-bootstrap';
import axios from 'axios';

export default function Content({ user, content, eventid }) {
  const [cont, setCont] = useState(content);
  const [comment, setComment] = useState('');

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
          <div className='message' key={`Content${index}`}>
            <p className='messageName'>
              {message.firstname} {message.lastname}
            </p>
            <p className='messageText'>{message.content}</p>
            <p className='messageTime'>{message.time}</p>
            {user.username !== message.username || (
              <span >
                <Button
                  variant="outline-info"
                  type='submit'
                  size="sm"
                  onClick={(e) => deleteContent(e, message.contentid, index)} className='deleteUpdate'
                >
                  x
                </Button>
              </span>
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
        console.log('NEW MESSAGE: ',newMessage)
        newMessage.profilephoto = user.profilephoto;
        newMessage.firstname = user.firstname;
        newMessage.lastname = user.lastname;
        setCont([...cont, newMessage]);
        document.getElementsByName('comment-form')[0].reset();
      });
  }

  return (
    <div className='eventContent'>
      <h4>Comments</h4>
      <div className='messages'>{messages}</div>
      <Form name='comment-form'>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <Form.Label>Add a Comment:</Form.Label>
          <Form.Control as='textarea' rows='2' onChange={handleChange} />
        </Form.Group>
        <Button
          variant="info"
          type='submit'
          onClick={(e) => {
            handleCommentSubmit(e);
          }}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
}
