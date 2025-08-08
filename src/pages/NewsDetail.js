import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

function NewsDetail() {
    const location = useLocation();
    const news = location.state;
    const [newsDetail, setNewsDetail] = useState({});
    const [krDetail, setKrDetail] = useState(null); // 요약, 본문 번역
    const [krTitle, setKrTitle] = useState("");     // 대제목 번역

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
        try {
        // 요약, 본문 번역
        const fullRes = await fetch("http://localhost:8080/api/gemini/translate/detail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newsDetail),
        });
        if (!fullRes.ok) throw new Error("본문 번역 실패");
        const fullJson = await fullRes.json();
        setKrDetail(fullJson);

        // 제목 번역
        const titleRes = await fetch("http://localhost:8080/api/gemini/translate/text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: news.title }),
        });
        if (!titleRes.ok) throw new Error("제목 번역 실패");
        const titleText = await titleRes.text();
        setKrTitle(titleText);
        } catch (e) {
        console.error(e);
        toast.error('번역 실패');
        }
    };

    return (
        <div style={{ fontSize: "1.1rem", lineHeight: "1.6" }} >
            <h2 style={{ marginBottom: 4 }}>{news.title}</h2>
            {krTitle && (
                <h4 style={{ color: "#2a6", marginTop: 0 }}>{krTitle}</h4>
            )}

            <p className="text-muted">{news.date}</p>
            <img src={news.image} alt={news.title} className="img-fluid rounded" style={{ width: "30%" }} /><br /><br />

            <p className="fw-semibold">{newsDetail.summary}</p>
            <p style={{ color: "#257", marginTop: 0 }} className="fw-semibold">
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
