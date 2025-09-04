import React, { useState, useEffect, Fragment } from 'react';
import { toast } from 'react-toastify';

function Wordbook() {
  const [wordList, setWordList] = useState([]);
  const [exSentence, setExSentence] = useState([]);   // [{ja, ko}, ...]
  const [selectedWord, setSelectedWord] = useState(null);
  const [loadingEx, setLoadingEx] = useState(false);

  const fetchWordList = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/wordbook/list', {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) setWordList(data);
      else toast.error('단어 불러오기에 실패');
    } catch (e) {
      console.error(e);
      toast.error('네트워크 오류');
    }
  };

  const makeExSent = async (word) => {
    setSelectedWord(word);
    setExSentence([]);
    setLoadingEx(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/wordbook/ex?jp=${encodeURIComponent(word)}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (res.ok) setExSentence(data); // ← 배열 [{ja, ko}, ...]
      else toast.error(data.error || '예문 생성 실패');
    } catch (e) {
      console.error(e);
      toast.error('네트워크 오류');
    } finally {
      setLoadingEx(false);
    }
  };

  useEffect(() => {
    fetchWordList();
  }, []);

  return (
    <>
      <h2 className="mb-4 mt-5">단어장</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle fs-5">
          <thead className="table-light">
            <tr>
              <th style={{ width: '35%' }}>일본어</th>
              <th style={{ width: '25%' }}>읽는 법</th>
              <th style={{ width: '40%' }}>한국어 뜻</th>
            </tr>
          </thead>
          <tbody>
            {wordList.map((w, i) => (
              <Fragment key={w.id ?? `${w.jpWord}-${i}`}>
                <tr onClick={() => makeExSent(w.jpWord)} style={{ cursor: 'pointer' }}>
                  <td className="fw-semibold">{w.jpWord}</td>
                  <td>{w.jpReading || '-'}</td>
                  <td>{w.krWord}</td>
                </tr>

                {selectedWord === w.jpWord && (
                  <tr>
                    <td colSpan={3}>
                      {loadingEx && <div className="text-muted">예문 생성 중…</div>}
                      {!loadingEx && exSentence.length > 0 && (
                        <ul className="mb-0">
                          {exSentence.map((s, idx) => (
                            <li key={idx} className="mb-1">
                              <div className="fw-semibold">{s.ja}</div>
                              <div className="">{s.jaRd}</div>
                              <div className="text-muted">{s.ko}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                      {!loadingEx && exSentence.length === 0 && (
                        <div className="text-muted">예문이 없습니다</div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Wordbook;
