import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Bookmark() {
  const navigate = useNavigate();
  const [bookmarkList, setBookmarkList] = useState([]);

  const fetchBookmarkList = async () => {
    const response = await fetch('http://localhost:8080/api/bookmark/list', {
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) setBookmarkList(data);
    else toast.error('북마크 불러오기 실패');
  };

  useEffect(() => {
    fetchBookmarkList();
  }, []);

  return (
    <div className="mt-5">
      <div className="container">
        <h2 className="mb-4">북마크</h2>

        {bookmarkList.length === 0 ? (
          <div className="alert alert-light border">저장된 북마크가 없습니다.</div>
        ) : (
          <div className="row">
            {bookmarkList.map((news, idx) => (
              <div className="col-md-6 mb-4" key={idx}>
                <div className="card shadow-sm h-100">
                  <div className="row g-0 h-100">
                    <div className="col-4">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="img-fluid rounded-start w-100 h-100"
                        style={{ objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div className="col-8">
                      <div className="card-body d-flex flex-column justify-content-between h-100">
                        <h5 className="card-title mb-2">{news.title}</h5>
                        <p className="card-text mb-1">
                          <small className="text-muted">{news.date}</small>
                        </p>

                        <div className="mb-2 d-grid">
                          <button
                            className="btn btn-primary btn-sm w-100"
                            onClick={(event) => {
                              event.preventDefault();
                              navigate('/news', { state: news });
                            }}
                          >
                            상세보기
                          </button>
                        </div>

                        <div className="d-flex gap-2">
                          <a
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-warning btn-sm"
                            style={{ flex: 1 }}
                          >
                            기사 보러가기
                          </a>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            style={{ flex: 1 }}
                            onClick={async (event) => {
                              event.preventDefault();
                              const response = await fetch(
                                'http://localhost:8080/api/bookmark/delete',
                                {
                                  method: 'DELETE',
                                  credentials: 'include',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(news),
                                }
                              );
                              const data = await response.json();
                              if (response.ok) {
                                toast.success(data.success);
                                fetchBookmarkList();
                              } else {
                                toast.error(data.error);
                              }
                            }}
                          >
                            북마크 삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmark;