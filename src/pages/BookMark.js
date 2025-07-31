import { useState, useEffect } from 'react';

function Bookmark() {

    const [bookmarkList, setBookmarkList] = useState([]);

    const fetchBookmarkList = async () => {
        const response = await fetch('http://localhost:8080/api/bookmark/list', {
            credentials: 'include'
        });
        const data = await response.json();
        if(response.ok) {
            setBookmarkList(data);
        }
        else {
            alert('북마크 불러오기 실패');
        }
    }

    useEffect(() => {
        fetchBookmarkList();
      }, []);

    return (
    <>
        <h2 className="mb-4 mt-5">NHK 최신 뉴스</h2>
          <div className="row">
            {bookmarkList.map((news, idx) => (
              <div className="col-md-6 mb-4" key={idx}>
                <div className="card shadow-sm h-100">
                  <div className="row g-0">
                    <div className="col-4">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="img-fluid rounded-start"
                        style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                      />
                    </div>
                    <div className="col-8">
                      <div className="card-body d-flex flex-column justify-content-between h-100">
                        <h5 className="card-title mb-2">{news.title}</h5>
                        <p className="card-text mb-1"><small className="text-muted">{news.date}</small></p>
                        <a href={news.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm mb-2">
                          기사 보러가기
                        </a>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={async event => {
                            event.preventDefault();
                            const response = await fetch('http://localhost:8080/api/bookmark/delete', {
                              method: 'DELETE',
                              credentials: 'include',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(news)
                            });
                            const data = await response.json();
                            if (response.ok) {
                                alert(data.success);
                                fetchBookmarkList();
                            }
                            else alert(data.error);
                          }}
                        >북마크 삭제</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
    )

}

export default Bookmark;