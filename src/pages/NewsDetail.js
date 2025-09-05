import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect, useRef } from 'react';

function NewsDetail() {
  const location = useLocation();
  const news = location.state;

  const [newsDetail, setNewsDetail] = useState({});
  const [krDetail, setKrDetail] = useState(null);
  const [krTitle, setKrTitle] = useState("");

  const [titleTokens, setTitleTokens] = useState(null);
  const [summaryTokens, setSummaryTokens] = useState(null);
  const [sectionTokens, setSectionTokens] = useState([]); // [{ titleTokens, bodyTokens }, ...]

  const [popup, setPopup] = useState({ open: false, x: 0, y: 0, token: null });
  const containerRef = useRef(null);

  // 단어(원형) → 한국어 캐시 & 로딩
  const [koCache, setKoCache] = useState({});         // { lemmaJA: "한국어" }
  const [koLoading, setKoLoading] = useState(false);

  const openPopup = (e, token) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left ?? 0);
    const y = e.clientY - (rect?.top ?? 0);
    setPopup({ open: true, x, y, token });
  };
  const closePopup = () => setPopup({ open: false, x: 0, y: 0, token: null });

  // pos의 대분류 선택
  const posHead = (pos) => {
    if (Array.isArray(pos)) return pos[0] || "";
    return String(pos || "").split("-")[0];
  };
  
  // 색상
  const posBg = (pos) => {
    const head = posHead(pos);
    // if (head === "名詞") return "#d6ecff";   
    // if (head === "動詞") return "#ffe9cc";   
    // if (head === "形容詞") return "#e6ffcc"; 
    // if (head === "形状詞") return "#f0f8e6"; 
    // if (head === "助詞") return "#f0e6ff";   
    // if (head === "接続詞") return "#ffe6f0"; 
    return "transparent";
  };

  // 원형 읽기 우선 저장: 다르면 baseReading, 같으면 reading
  const readingToStore = (t) => {
    const r  = (t?.reading || "").trim();
    const br = (t?.baseReading || "").trim(); // 원형의 읽기
    if (br && br !== r) return br;
    return r;
  };

  // 토큰화 함수
  const analyzeText = async (text) => {
    if (!text || !text.trim()) return [];
    const response = await fetch('http://localhost:8080/api/sudachi/tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('형태소 분석 실패');
    return response.json();
  };

  // 원형(없으면 표면형) 구하기
  const lemmaOf = (t) => {
    const surf = (t?.surface || "").trim();
    const base = (t?.base || "").trim();
    return base || surf;
  };

  // 유니크 원형 목록 수집
  const gatherUniqueLemmaTokens = () => {
    const uniq = new Map();
    const push = (arr) => {
      if (!arr) return;
      for (const t of arr) {
        const base = (t?.base || t?.surface || "").trim();
        if (!base) continue;
        if (!uniq.has(base)) uniq.set(base, { surface: t.surface, base, pos: t.pos, reading: t.reading });
      }
    };
    if (titleTokens) push(titleTokens);
    if (summaryTokens) push(summaryTokens);
    for (const sec of sectionTokens || []) {
      push(sec?.titleTokens);
      push(sec?.bodyTokens);
    }
    return Array.from(uniq.values());
  };

  // 배치로 원형→한국어 미리 받아오기 (Gemini)
  const prefetchLemmaKorean = async () => {
    try {
      const items = gatherUniqueLemmaTokens();
      if (!items.length) return;
      const res = await fetch("http://localhost:8080/api/gemini/translate/lemmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(items), // JpToken 배열 그대로 전송
      });
      if (!res.ok) throw new Error("배치 레마 번역 실패");
      const map = await res.json(); // { baseJA: "한국어" }
      if (map && typeof map === 'object') {
        setKoCache(prev => ({ ...prev, ...map }));
      }
    } catch (e) {
      console.error(e);
      toast.error("단어 번역(배치) 실패");
    }
  };

  // 원형 번역 가져오기 (캐시 사용) — 단건 폴백
  const fetchKoForLemma = async (lemma, pos) => {
    if (!lemma) return "";
    if (koCache[lemma]) return koCache[lemma];
    setKoLoading(true);
    try {
      // 단건일 때도 배치 엔드포인트 재사용
      const payload = [{ surface: lemma, base: lemma, reading: "", pos: pos || "" }];
      const res = await fetch("http://localhost:8080/api/gemini/translate/lemmas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("단어 번역 실패");
      const map = await res.json();
      const ko = map?.[lemma] || "";
      setKoCache(prev => ({ ...prev, [lemma]: ko }));
      return ko;
    } catch (e) {
      console.error(e);
      toast.error("단어 번역 실패");
      return "";
    } finally {
      setKoLoading(false);
    }
  };

  // 뉴스 전체 한글로 번역
  const handleTranslate = async () => {
    try {
      toast.success("번역 중입니다.");
      // 본문 번역
      const fullRes = await fetch("http://localhost:8080/api/gemini/translate/detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsDetail),
      });
      if (!fullRes.ok) throw new Error("본문 번역 실패");
      const fullJson = await fullRes.json();
      setKrDetail(fullJson);
      // 대제목 번역
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

  // 토큰 렌더러
  const renderTokens = (tokens) => (
    <span style={{ fontSize: "1.05rem", lineHeight: 1.8 }}>
      {tokens.map((t, i) => (
        <span
          key={i}
          className="jp-token"
          onClick={(e) => openPopup(e, t)}
          style={{
            fontSize: 19,
            borderRadius: 4,
            cursor: "pointer",
            background: posBg(t.pos),
          }}
          title={t.reading || t.base}
        >
          {t.surface}
        </span>
      ))}
    </span>
  );

  const handleSaveClick = async () => {
    if (!popup?.token) return;
    const lemma   = lemmaOf(popup.token);               // 원형(없으면 표면형)
    const reading = readingToStore(popup.token);        // ← 여기서 선택된 읽기
    const ko      = koCache[lemma] || "";

    try {
      const res = await fetch("http://localhost:8080/api/wordbook/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          jpWord: lemma,
          jpReading: reading,
          krWord: ko
        })
      });
      const data = await res.json();
      if (res.ok) toast.success(data.success);
      else toast.error(data.error);
    } catch (e) {
        console.error(e);
        toast.error("네트워크 에러");
    }

  }

  // 뉴스 불러오기
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/news/detail?url=${encodeURIComponent(news.url)}`,
          { credentials: 'include' }
        );
        const data = await response.json();
        if (!response.ok) throw new Error();
        setNewsDetail(data);
      } catch {
        toast.error('상세보기 실패');
      }
    })();
  }, [news.url]);

  // 제목/요약/본문 자동 토큰화
  useEffect(() => {
    (async () => {
      try {
        // 제목
        const tt = await analyzeText(news?.title || "");
        setTitleTokens(tt);

        // 요약
        const st = await analyzeText(newsDetail?.summary || "");
        setSummaryTokens(st);

        // 섹션
        const secs = newsDetail?.sections || [];
        const results = await Promise.all(
          secs.map(async (sec) => {
            const [tTokens, bTokens] = await Promise.all([
              analyzeText(sec.title || ""),
              analyzeText(sec.body  || ""),
            ]);
            return { titleTokens: tTokens, bodyTokens: bTokens };
          })
        );
        setSectionTokens(results);
      } catch (e) {
        console.error(e);
        toast.error('어휘 분석 실패');
      }
    })();
  }, [news.title, newsDetail.summary, newsDetail.sections]);

  // 토큰들이 준비되면 한 번만 선번역
  useEffect(() => {
    if (!titleTokens && !summaryTokens && !(sectionTokens && sectionTokens.length)) return;
    prefetchLemmaKorean();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [titleTokens, summaryTokens, sectionTokens]);

  // 팝업이 열릴 때, 해당 토큰의 "원형" 번역을 미리 가져오기 (폴백용)
  useEffect(() => {
    if (!popup.open || !popup.token) return;
    const lemma = lemmaOf(popup.token);
    if (!lemma || koCache[lemma]) return;
    fetchKoForLemma(lemma, popup.token.pos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popup.open, popup.token]);

  return (
    <div ref={containerRef} style={{ fontSize: "1.1rem", lineHeight: "1.6", position: "relative" }}>
      {/* 대제목 */}
      <h4 style={{ marginBottom: 4 }}>
        {titleTokens ? renderTokens(titleTokens) : news.title}
      </h4>
      {/* 대제목(한국어 번역) */}
      {krTitle && (
        <h4 style={{ color: "#2a6", marginTop: 0, fontSize: "1.35rem" }}>
          {krTitle}
        </h4>
      )}

      <p className="text-muted">{news.date}</p>
      <img src={news.image} alt={news.title} className="img-fluid rounded" style={{ width: "30%" }} /><br /><br />

      {/* 요약 */}
      <p className="fw-semibold">
        {summaryTokens ? renderTokens(summaryTokens) : newsDetail.summary}
      </p>
      {/* 요약(한국어 번역) */}
      <p style={{ color: "#257", marginTop: 0, fontSize: "1.1rem" }} className="fw-semibold">
        {krDetail && krDetail.summary}
      </p>
      <hr />

      {/* 본문 */}
      <br /><br />
      {newsDetail.sections && newsDetail.sections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: "2rem" }}>
          {/* 섹션 제목 */}
          <h5 style={{ color: "#367" }}>
            {sectionTokens[idx]?.titleTokens?.length
              ? sectionTokens[idx].titleTokens.map((t, i) => (
                <span
                  key={i}
                  className="jp-token"
                  onClick={(e) => openPopup(e, t)}
                  style={{
                    borderRadius: 4,
                    cursor: "pointer",
                    background: posBg(t.pos),
                  }}
                  title={t.reading || t.base}
                >
                {t.surface}
                </span>
              ))
            : section.title}
          </h5>

          {/* 섹션 본문 */}
          {sectionTokens[idx]?.bodyTokens?.length
          ? <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
              {renderTokens(sectionTokens[idx].bodyTokens)}
            </pre>
          : <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
              {section.body}
            </pre>
          }
          {/* 본문 섹션(한국어 번역) */}
          {krDetail && krDetail.sections && krDetail.sections[idx] && (
            <>
              <h5 style={{ color: "#397", fontSize: "1.2rem" }}>
                {krDetail.sections[idx].title}
              </h5>
              <pre style={{ whiteSpace: "pre-wrap", color: "#257", fontSize: "1.1rem", lineHeight: 1.9 }}>
                {krDetail.sections[idx].body}
              </pre>
            </>
          )}
          <hr />
      </div>
      ))}

      {/* 미니 팝업 */}
      {popup.open && popup.token && (
        <div
          style={{
            position: "absolute",
            left: popup.x,
            top: popup.y + 12,
            transform: "translate(-50%, 0)",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "10px 12px",
            boxShadow: "0 8px 24px rgba(0,0,0,.12)",
            zIndex: 10,
            minWidth: 240,
            maxWidth: 320,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ fontWeight: 700, marginBottom: 6 }}>{popup.token.surface}</div>
          <div style={{ fontSize: 13, color: "#555" }}>
            품사: {popup.token.pos || "-"}<br />
            읽기: {popup.token.reading || "-"}<br />
            원형: {popup.token.base || "-"}
          </div>

          {/* 한국어 뜻 (원형 기준) */}
          <div style={{ fontSize: 14, marginTop: 8 }}>
            <div style={{ color: "#999", marginBottom: 2 }}>한국어 뜻</div>
            {(() => {
              const lemma = lemmaOf(popup.token);
              const ko = koCache[lemma];
              if (ko) {
                const surface = (popup.token.surface || "").trim();
                const base = (popup.token.base || "").trim();
                const showLemmaBadge = base && base !== surface;
                return (
                  <span>
                    {ko}
                    {showLemmaBadge && <span style={{ color: "#999" }}> ({base} 원형)</span>}
                  </span>
                );
              }
              if (koLoading) return <em>불러오는 중…</em>;
              return <span style={{ color: "#bbb" }}>단어 클릭 시 자동 번역됩니다</span>;
            })()}
          </div>
          
          <div className="d-flex justify-content-end gap-2 mt-2">
            <button className="btn btn-sm btn-outline-success" onClick={handleSaveClick}>저장</button>
            <button className="btn btn-sm btn-outline-secondary" onClick={closePopup}>닫기</button>
          </div>
        </div>
      )}

      {/* 팝업 바깥 클릭 닫기 */}
      {popup.open && (
        <div onClick={closePopup} style={{ position: "fixed", inset: 0, zIndex: 5 }} />
      )}

      <div className="d-flex flex-column align-items-center gap-3 my-4">
        {/* 번역 버튼 */}
        <button className="btn btn-primary" onClick={handleTranslate}>번역하기</button>
        <button
          className="btn btn-outline-success" style={{ flex: 1 }}
          onClick={async (event) => {
            event.preventDefault();
            const response = await fetch("http://localhost:8080/api/bookmark/save", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(news),
              }
            );
            const data = await response.json();
            if (response.ok) toast.success(data.success);
            else toast.error(data.error);
          }}
        >북마크</button>
      </div>
    </div>
  );
}

export default NewsDetail;
