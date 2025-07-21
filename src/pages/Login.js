import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');

    return (
        <div>
            <form onSubmit={async (event) => {
                event.preventDefault();
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: userid,
                        password: pwd
                    }),
                });
                const messageData = await response.json();
                if (response.ok) {
                    alert(messageData.success);
                    navigate('/');
                } else {
                    alert(messageData.error);
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