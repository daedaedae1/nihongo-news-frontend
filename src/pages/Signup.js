import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
            toast.success(data.success);
            setIsAvailable(true);
        }
        else {
            toast.error(data.error);
            setIsAvailable(false);
        }
    }

    return (
       <div className='container mt-5 pt-5 pb-5' style={{backgroundColor: 'white'}}>
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
                    toast.success(messageData.success);
                    navigate('/login');
                } else {
                    toast.error(messageData.error);
                }
            }}>
                <div className='row mb-3 justify-content-center'>
                    <label htmlFor='userid' className='col-sm-2 col-form-label fw-semibold'>아이디</label>
                    <div className='col-md-4 '>
                        <div className='input-group'>
                            <input type='text' className='form-control' id='userid' name="id" value={userid} onChange={event => {setUserid(event.target.value); setIsAvailable(null);}} 
                                onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} />
                            <button type="button" className='btn btn-outline-secondary' onClick={handleCheckId} disabled={!userid} style={{color: '#000000'}}>중복확인</button>
                        </div>
                    </div>
                </div>
                <div className='row mb-3 justify-content-center'>
                    <label htmlFor='password' className='col-sm-2 col-form-label fw-semibold'>비밀번호</label>
                    <div className='col-md-4'>
                        <input type='password' className='form-control' id='password' name="pwd" value={pwd} onChange={event => setPwd(event.target.value)}
                            onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} />
                    </div>
                </div>
                <div className='row mb-3 justify-content-center'>
                    <label htmlFor='nickname' className='col-sm-2 col-form-label fw-semibold'>닉네임</label>
                    <div className='col-md-4'>
                        <input type='text' className='form-control' id='nickname' name="nickname" value={nickname} onChange={event => setNickname(event.target.value)}
                            onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} />
                    </div>
                </div>
                <div className='row mb-3 justify-content-center'>
                    <label htmlFor='name' className='col-sm-2 col-form-label fw-semibold'>이름</label>
                    <div className='col-md-4'>
                        <input type='text' className='form-control' id='name' name="name" value={name} onChange={event => setName(event.target.value)}
                            onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} />
                    </div>
                </div>
                <div className='d-grid gap-2 col-4 mt-4 mx-auto'>
                    <input type="submit" className='btn btn-primary' value="회원가입" disabled={!userid.trim() || !pwd.trim() || !nickname.trim() || !name.trim() || isAvailable !== true}></input>
                </div>
            </form>
        </div>
    );
}

export default Signup;