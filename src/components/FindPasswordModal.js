import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

function FindPasswordModal({ show, onHide, onVerified, onExited }) {
    const [checkingUserid, setCheckingUserid] = useState('');
    const [checkingName, setCheckingName] = useState('');

    return (
        <Modal show={show} onHide={onHide} centered 
            restoreFocus={false}     // 닫힐 때 포커스 복귀 막기
            onExited={onExited}
        > 
            <Modal.Header closeButton>
                <Modal.Title>비밀번호 찾기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={async event => {
                    event.preventDefault();
                    const response = await fetch('http://localhost:8080/api/find-password', {
                        method: "POST",
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                                checkingUserid: checkingUserid,
                                checkingName: checkingName
                        }),
                    });
                    const data = await response.json();
                    if(response.ok) {
                        toast.success(data.success);
                        onHide();            // 먼저 닫고
                        onVerified?.();      // 부모에게 성공 알리기 (다음 모달 열 준비)
                    }
                    else {
                        toast.error(data.error);
                    }
                }}>
                    <p>아이디: <input type="text" value={checkingUserid} onChange={event => {setCheckingUserid(event.target.value)}}
                        onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} /></p>
                    <p>이름: <input type="text" value={checkingName} onChange={event => {setCheckingName(event.target.value)}}
                        onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} /></p>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-secondary" onClick={onHide}>닫기</button>
                        <button type="submit" className="btn btn-primary" disabled={!checkingUserid?.trim() || !checkingName?.trim()}>찾기</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )

}

export default FindPasswordModal;