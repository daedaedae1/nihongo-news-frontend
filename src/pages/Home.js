import { useState, useEffect } from 'react';

function Home({ userInfo }) {

  const [newsList, setNewsList] = useState([]);

  const fetchNewsList = async () => {
    const response = await fetch('http://localhost:8080/api/news/list');
    const data = await response.json(); 
    console.log('받아온 데이터', data);
    setNewsList(data);
  }

  useEffect(() => {
    fetchNewsList();
  }, []);

  return (
    <div>
      {userInfo? (
        <>
          <h1>로그인된 홈입니다.</h1>
          {newsList.map((news, idx) => (
            <ul>
              <li key={idx}>
                <h3>{news.title}</h3>
                <a href={news.url} target="_blank" rel="noopener noreferrer">{news.url}</a><br />
                <img src={news.image} alt={news.title} width={100} /><br />
                <span>{news.date}</span>
              </li>
            </ul>
          ))}
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