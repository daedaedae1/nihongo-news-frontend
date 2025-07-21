import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MyApp</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarNav">
          <ul className="navbar-nav ms-auto">
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
            {/* 추가 메뉴도 이런 식으로 */}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;