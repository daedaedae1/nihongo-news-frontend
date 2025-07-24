import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUserInfo }) {

    const navigate = useNavigate();

    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');

    return (
        // <div>
        //     <form onSubmit={async (event) => {
        //         event.preventDefault();
        //         const response = await fetch('http://localhost:8080/api/login', {
        //             method: 'POST',
        //             credentials: 'include',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify({
        //                 userid: userid,
        //                 password: pwd
        //             }),
        //         });
        //         const data = await response.json();
        //         if (response.ok) {
        //             alert(data.success);
        //             setUserInfo(data);
        //             navigate('/');
        //         } else {
        //             alert(data.error);
        //         }
        //     }}>
        //         <p>아이디 <input type="text" name="id" value={userid} onChange={e => setUserid(e.target.value)} /></p>
        //         <p>비밀번호 <input type="password" name="pwd" value={pwd} onChange={e => setPwd(e.target.value)} /></p>
        //         <p><input type="submit" value="로그인"></input></p>
        //     </form>
        // </div>
        <div className='container mt-5 pt-5 pb-5' style={{backgroundColor: 'white'}}>
            <form onSubmit={async (event) => {
                event.preventDefault();
                const response = await fetch('http://localhost:8080/api/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userid: userid,
                        password: pwd
                    }),
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.success);
                    setUserInfo(data);
                    navigate('/');
                } else {
                    alert(data.error);
                }
            }}>
                <div className='row mb-3 justify-content-center'>
                    <label htmlFor='userid' className='col-sm-2 col-form-label fw-semibold'>아이디</label>
                    <div className='col-md-4 '>
                        <input type='text' className='form-control' id='userid' name="id" value={userid} onChange={e => {setUserid(e.target.value)}} />
                    </div>
                </div>
                <div className='row mb-3 justify-content-center'>
                    <label htmlFor='password' className='col-sm-2 col-form-label fw-semibold'>비밀번호</label>
                    <div className='col-md-4'>
                        <input type='password' className='form-control' id='password' name="pwd" value={pwd} onChange={e => setPwd(e.target.value)} />
                    </div>
                </div>
                <div className='d-grid gap-2 col-4 mt-4 mx-auto'>
                    <input type="submit" className='btn btn-primary' value="로그인"></input>
                </div>
            </form>
        </div>
    );
}

export default Login;