import { useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FindUseridModal from '../components/FindUseridModal';
import FindPasswordModal from '../components/FindPasswordModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

function Login({ setUserInfo }) {

    const navigate = useNavigate();

    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');

    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const pwdRef = useRef(null);    // 비밀번호 input 포커스용
    const [shouldFocusPwd, setShouldFocusPwd] = useState(false);

    const [showChangePwd, setShowChangePwd] = useState(false);
    const [openChangeAfterFind, setOpenChangeAfterFind] = useState(false);

    const handleFoundUserid = (uid) => {    // 모달에서 받은 아이디 처리
        setUserid(uid);
        setShouldFocusPwd(true);     // 모달 닫힌 뒤 포커스할지 표시
        setShowModal1(false);        // 모달 닫기
    };

    const handleModalExited = () => {   // 비밀번호 포커스 (모달이 살라진 뒤 포커스 가능)
        if (shouldFocusPwd) {
        pwdRef.current?.focus();
        setShouldFocusPwd(false);
        }
    };

    // FindPasswordModal에서 성공시 호출됨
    const handleFindVerified = () => {
        setOpenChangeAfterFind(true);  // 다음 모달 열 준비
        setShowModal2(false);         // 먼저 닫기
    };

    // FindPasswordModal이 완전히 닫힌 뒤 호출됨
    const handleFindExited = () => {
        if (openChangeAfterFind) {
        setShowChangePwd(true);      // 비밀번호 변경 모달 열기
        setOpenChangeAfterFind(false);
        }
    };

    return (
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
                    toast.success(data.success);
                    setUserInfo(data);
                    navigate('/');
                } else {
                    toast.error(data.error);
                }
            }}>
                <div className='row mb-3 justify-content-center'>
                    <label htmlFor='userid' className='col-sm-2 col-form-label fw-semibold'>아이디</label>
                    <div className='col-md-4 '>
                        <input type='text' className='form-control' id='userid' name="id" value={userid} onChange={event => {setUserid(event.target.value)}}
                            onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} />
                    </div>
                </div>
                <div className='row mb-3 justify-content-center'>
                    <label htmlFor='password' className='col-sm-2 col-form-label fw-semibold'>비밀번호</label>
                    <div className='col-md-4'>
                        <input ref={pwdRef} type='password' className='form-control' id='password' name="pwd" value={pwd} onChange={event => setPwd(event.target.value)}
                            onKeyDown={e => {if (e.key === ' ') {e.preventDefault();}}} />
                    </div>
                </div>
                <div className='d-grid gap-2 col-4 mt-4 mx-auto'>
                    <input type="submit" className='btn btn-primary' value="로그인"></input>
                </div>
            </form>
            <br />
            <button className="btn btn-sm" type="button" onClick={() => setShowModal1(true)}>아이디 찾기</button>
            <button className="btn btn-sm" type="button" onClick={() => setShowModal2(true)}>비밀번호 찾기</button>

            <FindUseridModal 
                show={showModal1} 
                onHide={() => setShowModal1(false)}
                onFound={handleFoundUserid} // 콜백 전달
                onExited={handleModalExited}
            />
            <FindPasswordModal 
                show={showModal2}
                onHide={() => setShowModal2(false)}
                onVerified={handleFindVerified}
                onExited={handleFindExited}
            />
            <ChangePasswordModal
                show={showChangePwd}
                onHide={() => setShowChangePwd(false)}
            />
        </div>
    );
}

export default Login;