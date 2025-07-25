import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

function EditProfileModal({ show, onHide, userInfo, setUserInfo }) {
    const [newUserInfo, setNewUserInfo] = useState(userInfo);
    useEffect(() => {
        if (show) setNewUserInfo(userInfo);
    }, [show, userInfo])

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>회원정보 수정</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={async event => {
                    event.preventDefault();
                    const response = await fetch('http://localhost:8080/api/update', {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify(newUserInfo),
                    });
                    const data = await response.json();
                    if(response.ok) {
                        setUserInfo(newUserInfo);
                        alert(data.success);
                        onHide();
                    }
                    else{
                        alert(data.error);
                    }
                }}>
                    <p>닉네임: <input type="text" value={newUserInfo.nickname ?? ""} onChange={event => {
                        setNewUserInfo({ ...newUserInfo, nickname: event.target.value})}}
                        onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} /></p>
                    <p>이름: <input type="text" value={newUserInfo.name ?? ""} onChange={event => {
                        setNewUserInfo({ ...newUserInfo, name: event.target.value })}}
                        onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} /></p>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-secondary" onClick={onHide}>닫기</button>
                        <button type="submit" className="btn btn-primary" disabled={!newUserInfo.nickname?.trim() || !newUserInfo.name?.trim()}>수정</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default EditProfileModal;