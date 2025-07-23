import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { RiLogoutBoxLine } from "react-icons/ri";


function NavBar({ userInfo, setUserInfo }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch('http://localhost:8080/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUserInfo(null);
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">NAN</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {userInfo? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold text-decoration-underline" to="/profile">
                    {userInfo.nickname} 님
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" style={{ cursor: "pointer "}} type="button"
                          onClick={handleLogout}>
                    <RiLogoutBoxLine size={20} title="로그아웃"/>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <FaSignInAlt size={20} title="로그인" />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    <FaUserPlus size={20} title="회원가입" />
                  </Link>
                </li>
              </>
            )}

            {/* 추가 메뉴도 이런 식으로 */}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;