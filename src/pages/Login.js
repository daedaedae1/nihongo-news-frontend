import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
    const User = {
        email: 'abc@naver.com',
        pw: 'qwe123'
    };
    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');

    return (
        <div>
            <form onSubmit={async (event) => {
                event.preventDefault();
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: userid,
                        password: pwd
                    })
                });
                if (response.ok) {
                    alert('로그인 성공!');
                } else {
                    alert('로그인 실패!');
                }
            }}>
                <p>id <input type="text" name="id" value={userid} onChange={e => setUserid(e.target.value)} /></p>
                <p>pwd <input type="password" name="pwd" value={pwd} onChange={e => setPwd(e.target.value)} /></p>
                <p><input type="submit" value="로그인"></input></p>
            </form>
        </div>
    );
}

export default Login;