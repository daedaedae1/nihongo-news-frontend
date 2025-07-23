import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {

    const navigate = useNavigate();

    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');

    const [isAvailable, setIsAvailable] = useState(null);

    const handleCheckId = async () => {
        const response = await fetch('http://localhost:8080/api/check-id?userid=' + encodeURIComponent(userid))
        const data = await response.json();
        if(response.ok) {
            alert(data.success);
            setIsAvailable(true);
        }
        else {
            alert(data.error);
            setIsAvailable(false);
        }
    }

    return (
        <div>
            <form onSubmit={async (event) => {
                event.preventDefault();
                const response = await fetch('http://localhost:8080/api/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        nickname: nickname,
                        userid: userid,
                        password: pwd
                    }),
                });
                const messageData = await response.json();
                if (response.ok) {
                    alert(messageData.success);
                    navigate('/login');
                } else {
                    alert(messageData.error);
                }
            }}>
                <p>이름 <input type="text" name="name" value={name} onChange={e => setName(e.target.value)}/></p>
                <p>닉네임 <input type="text" name="nickname" value={nickname} onChange={e => setNickname(e.target.value)} /></p>
                <p>아이디 <input type="text" name="id" value={userid} onChange={e => {setUserid(e.target.value); setIsAvailable(null);}}  />
                          <button type="button" onClick={handleCheckId} disabled={!userid}>중복확인</button></p>
                <p>비밀번호 <input type="password" name="pwd" value={pwd} onChange={e => setPwd(e.target.value)} /></p>
                <p><input type="submit" value="회원가입" disabled={isAvailable !== true}></input></p>
            </form>
        </div>
    );
}

export default Signup;