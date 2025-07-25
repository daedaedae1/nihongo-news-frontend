import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import 'bootstrap/dist/css/bootstrap.min.css';

function Profile({ userInfo, setUserInfo }) {

    const navigate = useNavigate();
    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/api/dare', {
            method: 'POST',
            credentials: 'include'
        })
        .then(response => response.ok? response.json() : null)
        .then(data => {
            if(data) setUserInfo(data);
        })
        .catch(error => {
            console.error('Fetch error', error);
        });
    }, [setUserInfo]);

    if (!userInfo) 
        return <div>Loading...</div>

    return <div>
        <p>닉네임: <span className="fw-semibold">{userInfo.nickname}</span></p>
        <p>이름:  <span className="fw-semibold">{userInfo.name}</span></p>
        <p>아이디:  <span className="fw-semibold">{userInfo.userid}</span></p>
        <button className="btn btn-outline-primary mb-2" onClick={() => setShowModal1(true)}>회원정보 수정</button>
        <br />
        <p><button className="btn btn-outline-primary mb-2" onClick={() => setShowModal2(true)} >비밀번호 변경</button></p>
        <button type="button" onClick={ async () => {
            if(window.confirm("회원을 탈퇴하시겠습니까?")){
                const response = await fetch('http://localhost:8080/api/delete', {
                    method: 'DELETE',
                    credentials: 'include'
                });
                const data = await response.json();
                if(response.ok) {
                    alert(data.success);
                    setUserInfo(null);
                    navigate('/');
                }
                else {
                    alert(data.error);
                }
            }
        }}>회원탈퇴</button>

        <EditProfileModal show={showModal1} onHide={() => setShowModal1(false)} userInfo={userInfo} setUserInfo={setUserInfo} />
        <ChangePasswordModal show={showModal2} onHide={() => setShowModal2(false)} userInfo={userInfo} setUserInfo={setUserInfo} />
    </div>
}

export default Profile;