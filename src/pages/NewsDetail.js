import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

function NewsDetail() {
    const location = useLocation();
    const news = location.state;
    const [newsDetail, setNewsDetail] = useState([]);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            const response = await fetch(`http://localhost:8080/api/news/detail?url=${encodeURIComponent(news.url)}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if(response.ok) {
                setNewsDetail(data);
            }
            else {
                toast.error('상세보기 실패');
            }
        }
        fetchNewsDetail();
    }, [news.url]);

    return (
        <>
        <div>
            <h2>{news.title}</h2><br />
            <p>{news.date}</p><br />
            <img
                src={news.image} alt={news.title} className="img-fluid rounded"
                style={{ objectFit: "cover", height: "30%", width: "30%" }}
            /><br />
            <p>{newsDetail.summary}</p><br />
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: "1rem" }}>
                {newsDetail.content}
            </pre>
        </div>
        </>
    );
        

}

export default NewsDetail;