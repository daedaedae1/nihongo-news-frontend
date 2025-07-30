import { useState, useEffect } from 'react';

function Home({ userInfo }) {

  const [newsList, setNewsList] = useState([]);

  const fetchNewsList = async () => {
    const response = await fetch('http://localhost:8080/api/news/list');
    const data = await response.json(); 
    setNewsList(data);
  }

  useEffect(() => {
    fetchNewsList();
  }, []);

  return (
    <div className='mt-5'>
      {userInfo? (
        <>
          <ul>
            {newsList.map((news, idx) => (
              <li key={idx}>
                <h3>{news.title}</h3>
                <a href={news.url} target="_blank" rel="noopener noreferrer">{news.url}</a><br />
                <img src={news.image} alt={news.title} width={100} /><br />
                <span>{news.date}</span>
                <button onClick={async event => {
                  event.preventDefault();
                  const response = await fetch('http://localhost:8080/api/news/save', {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(newsList[idx])
                });
                if (response.ok) {
                    alert('ok');
                } else {
                    alert('no k');
                }

                }}>저장입니다</button>
              </li>
            ))}
          </ul>
          <button className="btn btn-outline-success mb-2" onClick={event => {
            event.preventDefault();
            fetchNewsList();
          }}>새로고침</button>
        </>
      ) : (
        <>
          <h1>홈입니다.</h1>
        </>
      )}
    </div>
  );
}

export default Home;