import { useState } from 'react';
import { Modal } from "react-bootstrap";

function ChangePasswordModal({ show, onHide, userInfo, setUserInfo }) {
    const [newUserInfo, setNewUserInfo] = useState(userInfo);
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>비밀번호 변경</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={event => {
                    event.preventDefault();
                }}>
                    <p>새 비밀번호: <input type="password" value={newPwd} onChange={event => {setNewPwd(event.target.value)}}
                        onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} /></p>
                    <p>비밀번호 확인: <input type="password" value={confirmPwd} onChange={event => {setConfirmPwd(event.target.value)}}
                        onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} /></p>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-secondary" onClick={onHide}>닫기</button>
                        <button type="submit" className="btn btn-primary" disabled={!newPwd?.trim() || !confirmPwd?.trim()}>수정</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );

}

export default ChangePasswordModal;