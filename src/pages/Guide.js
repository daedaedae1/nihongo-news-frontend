    import { Link } from "react-router-dom";
    import {
    RiNewspaperLine,
    RiTranslate2,
    RiBookmarkLine,
    RiBook2Line,
    RiLoginCircleLine,
    RiInformationLine,
    RiLightbulbLine,
    } from "react-icons/ri";

    function Guide({ userInfo }) {
    return (
        <div className="container-xxl px-3 px-sm-4 px-md-5 my-4 my-md-5">
            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4 p-md-5">
                <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                    <div>
                    <h1 className="h3 fw-bold mb-2">NAN 사용 가이드</h1>
                    <p className="text-muted mb-0">
                        NHK 뉴스 원문을 형태소 단위로 쪼개서 단어 팝업/저장/예문, 전체 번역, 북마크까지 한 번에!
                    </p>
                    </div>
                    <div className="d-flex gap-2">
                    <Link className="btn btn-primary" to="/">
                        <RiNewspaperLine className="me-1" /> 뉴스 보러가기
                    </Link>

                    {userInfo && (
                        <>
                        <Link className="btn btn-outline-success" to="/bookmark">
                            <RiBookmarkLine className="me-1" /> 북마크
                        </Link>
                        <Link className="btn btn-outline-secondary" to="/wordbook">
                            <RiBook2Line className="me-1" /> 단어장
                        </Link>
                        </>
                    )}
                    </div>
                </div>

                {!userInfo && (
                    // <div className="alert alert-info d-flex align-items-center justify-content-center text-center gap-2 mt-3 mb-0 ">
                    //     <RiLoginCircleLine size={20} className="" />
                    //     <div>
                    //         <strong>로그인이 필요합니다.</strong>
                    //         <div className="small mb-0">
                    //         미로그인 상태에선 상세보기/북마크/단어 기능이 비활성화됩니다.
                    //         </div>
                    //     </div>
                    // </div>

                    <div className="alert alert-info d-flex align-items-start gap-2 mt-3 mb-0 ps-4"> 
                    <RiLoginCircleLine size={20} className="mt-1" /> 
                    <div> 
                        <strong>로그인이 필요합니다.</strong> 
                        <div className="small mb-0"> 미로그인 상태에선 상세보기/북마크/단어 기능이 비활성화됩니다. </div> 
                    </div> 
                    </div>
                )}
                </div>
            </div>

            {/* 빠른 시작 */}
            <div className="card border-0 shadow-sm rounded-4 mt-4">
                <div className="card-body p-4 p-md-5">
                <h2 className="h5 fw-bold mb-3">빠른 시작</h2>
                <ol className="mb-0 ps-3">
                    <li className="mb-2">
                    <strong>홈</strong>에서 NHK 뉴스 목록(이미지 · 제목 · 업로드 시간)을 확인합니다.
                    </li>
                    <li className="mb-2">
                    <strong>로그인</strong> 후 <strong>상세보기</strong>로 들어가면 요약 및 기사 내용을 확인할 수 있어요.
                    </li>
                    <li className="mb-2">
                    단어를 <strong>클릭</strong>하면 팝업으로 <em>품사/읽기/원형/한국어 뜻</em>이 나옵니다.
                    </li>
                    <li className="mb-2">
                    팝업의 <strong>저장</strong>을 누르면 단어장이 채워지고, 단어장에선 단어를 눌러 <em>예문(일본어/읽기/한국어)</em>을
                    볼 수 있어요.
                    </li>
                    <li className="mb-2">
                    <strong>번역하기</strong> 버튼으로 기사 전체(제목/본문)를 한국어로 번역합니다.
                    </li>
                    <li>
                    마음에 드는 기사는 <strong>북마크</strong>로 저장하고, 나중에 북마크 페이지에서 다시 확인하세요.
                    </li>
                </ol>
                </div>
            </div>

            {/* Features */}
            <div className="row g-4 mt-1">
                <div className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <RiNewspaperLine size={22} />
                        <h3 className="h6 fw-bold mb-0">뉴스 목록 & 상세보기</h3>
                    </div>
                    <ul className="mb-0 ps-3">
                        <li>홈에서 NHK 탑 뉴스를 카드 형태로 제공합니다.</li>
                        <li>상세보기에서 일본어 원문을 토큰 단위로 나눕니다.</li>
                        <li>토큰을 클릭하면 품사/읽기/원형/한국어 뜻 팝업이 열립니다.</li>
                    </ul>
                    </div>
                </div>
                </div>

                <div className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <RiTranslate2 size={22} />
                        <h3 className="h6 fw-bold mb-0">번역</h3>
                    </div>
                    <ul className="mb-0 ps-3">
                        <li>단어 번역: 팝업에서 자동으로 한국어 뜻을 확인.</li>
                        <li>전체 번역: 버튼 한 번으로 제목/본문을 한국어로 변환.</li>
                        <li>원문 줄바꿈을 최대한 보존해 읽기 흐름을 유지합니다.</li>
                    </ul>
                    </div>
                </div>
                </div>

                <div className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <RiBookmarkLine size={22} />
                        <h3 className="h6 fw-bold mb-0">북마크</h3>
                    </div>
                    <ul className="mb-0 ps-3">
                        <li>관심 기사를 북마크로 저장.</li>
                        <li>북마크 페이지에서 빠르게 재접근/삭제 가능합니다.</li>
                        <li>단, 기사가 삭제된 경우 접근이 어려울 수 있습니다.</li>
                    </ul>
                    </div>
                </div>
                </div>

                <div className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <RiBook2Line size={22} />
                        <h3 className="h6 fw-bold mb-0">단어장 & 예문</h3>
                    </div>
                    <ul className="mb-0 ps-3">
                        <li>저장된 단어를 표로 확인(일본어/읽기/한국어).</li>
                        <li>단어 행을 클릭하면 예문(일본어/읽기/한국어)을 표시.</li>
                        <li>개별 단어 삭제 기능을 지원합니다.</li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>

            {/* Tips & Notes */}
            <div className="row g-4 mt-1">
                <div className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <RiLightbulbLine size={22} />
                        <h3 className="h6 fw-bold mb-0">사용 팁</h3>
                    </div>
                    <ul className="mb-0 ps-3">
                        <li>동사 저장 시 원형 읽기가 다르면 원형 읽기를 우선 저장합니다.</li>
                        <li>같은 단어는 사용자별로 중복 저장되지 않도록 처리됩니다.</li>
                    </ul>
                    </div>
                </div>
                </div>

                <div className="col-lg-6">
                <div className="card h-100 border-0 shadow-sm rounded-4">
                    <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <RiInformationLine size={22} />
                        <h3 className="h6 fw-bold mb-0">안내</h3>
                    </div>
                    <ul className="mb-0 ps-3">
                        <li>미로그인 상태에서는 상세보기/북마크/단어 저장이 제한됩니다.</li>
                        <li>요청이 많을 경우 번역 API 레이트 리밋에 걸릴 수 있어요.</li>
                        <li>잠시 후 다시 시도하거나, 동일 기사에선 중복 호출을 피해주세요.</li>
                    </ul>
                    </div>
                </div>
                </div>
            </div>

            {/* CTA */}
            <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
                <Link className="btn btn-primary" to="/">
                <RiNewspaperLine className="me-1" />
                뉴스 보러가기
                </Link>
                {userInfo && (
                    <>
                    <Link className="btn btn-outline-success" to="/bookmark">
                        <RiBookmarkLine className="me-1" /> 북마크
                    </Link>
                    <Link className="btn btn-outline-secondary" to="/wordbook">
                        <RiBook2Line className="me-1" /> 단어장
                    </Link>
                    </>
                )}
            </div>
        </div>
    );
    }

    export default Guide;
