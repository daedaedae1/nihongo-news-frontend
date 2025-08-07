import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

function NewsDetail() {
    const location = useLocation();
    const news = location.state;
    const [newsDetail, setNewsDetail] = useState({});
    const [krDetail, setKrDetail] = useState(null); // 전체 번역 결과

    useEffect(() => {
        const fetchNewsDetail = async () => {
            const response = await fetch(`http://localhost:8080/api/news/detail?url=${encodeURIComponent(news.url)}`, {
                credentials: 'include'
            });
            const data = await response.json();
            if(response.ok) {
                setNewsDetail(data);
            } else {
                toast.error('상세보기 실패');
            }
        }
        fetchNewsDetail();
    }, [news.url]);

    const handleTranslate = async () => {
        const response = await fetch("http://localhost:8080/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newsDetail),
        });
        if (response.ok) {
            setKrDetail(await response.json());
        } else {
            toast.error('번역 실패');
        }
    }

    return (
        <div>
            <h2>{news.title}</h2>
            <p>{news.date}</p>
            <img src={news.image} alt={news.title} className="img-fluid rounded" style={{ width: "30%" }} /><br /><br />
            <p>{newsDetail.summary}</p>
            <p style={{ color: "#257", marginTop: 0 }}>
                {krDetail && krDetail.summary}
            </p>
            <br /><br />
            {newsDetail.sections && newsDetail.sections.map((section, idx) => (
                <div key={idx} style={{ marginBottom: "2rem" }}>
                    <h5 style={{ color: "#367" }}>{section.title}</h5>
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{section.body}</pre><br />

                    {krDetail && krDetail.sections && krDetail.sections[idx] && (
                        <>
                            <h5 style={{ color: "#397" }}>{krDetail.sections[idx].title}</h5>
                            <pre style={{ whiteSpace: "pre-wrap", color: "#257" }}>
                                {krDetail.sections[idx].body}
                            </pre>
                        </>
                    )}
                    <hr />
                </div>
            ))}
            <button className="btn btn-primary mb-5" onClick={handleTranslate}>번역하기</button>
        </div>
    );
}

export default NewsDetail;
