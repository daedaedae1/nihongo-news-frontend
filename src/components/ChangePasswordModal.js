import { useState, useEffect } from 'react';
import { Modal } from "react-bootstrap";
import { toast } from 'react-toastify';

function ChangePasswordModal({ show, onHide }) {
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');

    useEffect(() => {
        if(show) {
            setNewPwd('');
            setConfirmPwd('');
        }
    }, [show])

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>비밀번호 변경</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={async event => {
                    event.preventDefault();
                    if(newPwd !== confirmPwd) {
                        toast.error('비밀번호가 일치하지 않습니다!');
                    }
                    else {
                        const response = await fetch('http://localhost:8080/api/update-password', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                newPassword: newPwd
                            }),
                        });
                        const data = await response.json();
                        if(response.ok) {
                            toast.success(data.success);
                            onHide();
                        }
                        else {
                            toast.error(data.error);
                        }
                    }
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