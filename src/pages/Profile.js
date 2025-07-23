import { useEffect } from "react";

function Profile({ userInfo, setUserInfo }) {

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
        <p><button>비밀번호 변경</button></p>
        <button>회원탈퇴</button>
    </div>
}

export default Profile;