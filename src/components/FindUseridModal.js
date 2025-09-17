import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

function FindUseridModal({ show, onHide, onFound, onExited }) {
    const [checkingName, setCheckingName] = useState('');
    const [checkingNick, setCheckingNick] = useState('');

    useEffect(() => {
        if(show) {
            setCheckingName('');
            setCheckingNick('');
        }
    }, [show])

    return (
        <Modal show={show} onHide={onHide} centered 
            restoreFocus={false}     // 모달 닫힌 뒤 버튼으로 포커스 복귀 방지
            onExited={onExited}      // 완전히 닫힌 시점 콜백
        >
            <Modal.Header closeButton>
                <Modal.Title>아이디 찾기</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={async event => {
                    event.preventDefault();
                    const response = await fetch('http://localhost:8080/api/find-userid', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                                checkingName: checkingName,
                                checkingNick: checkingNick
                        }),
                    });
                    const data = await response.json();
                    if(response.ok) {
                        toast.success(data.success);
                        onFound?.(data.userid); // 부모에게 전달
                        onHide();     
                    }
                    else {
                        toast.error(data.error);
                    }
                }}>
                    <p>이름: <input type="text" value={checkingName} onChange={event => {setCheckingName(event.target.value)}}
                        onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} /></p>
                    <p>닉네임: <input type="text" value={checkingNick} onChange={event => {setCheckingNick(event.target.value)}}
                        onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} /></p>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button type="button" className="btn btn-secondary" onClick={onHide}>닫기</button>
                        <button type="submit" className="btn btn-primary" disabled={!checkingName?.trim() || !checkingNick?.trim()}>찾기</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    )

}

export default FindUseridModal;