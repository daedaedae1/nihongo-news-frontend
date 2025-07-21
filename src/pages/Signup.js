import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {

    const navigate = useNavigate();

    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const [name, setName] = useState('');

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
                        userid: userid,
                        password: pwd,
                        name: name
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
                <p>name <input type="text" name="name" value={name} onChange={e => setName(e.target.value)}/></p>
                <p>userid <input type="text" name="id" value={userid} onChange={e => setUserid(e.target.value)} /></p>
                <p>pwd <input type="password" name="pwd" value={pwd} onChange={e => setPwd(e.target.value)} /></p>
                <p><input type="submit" value="회원가입"></input></p>
            </form>
        </div>
    );
}

export default Signup;