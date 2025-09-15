import React, { useState, useEffect, Fragment, useMemo, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { RiDeleteBack2Line } from 'react-icons/ri';

function Wordbook() {
  const [wordList, setWordList] = useState([]);
  const [exSentence, setExSentence] = useState([]);   // [{ja, jaRd, ko}, ...]
  const [selectedWord, setSelectedWord] = useState(null);
  const [loadingEx, setLoadingEx] = useState(false);
  const [filter, setFilter] = useState('');

  // 최근 요청한 단어/AbortController 저장
  const lastReqRef = useRef(null);
  const abortRef = useRef(null);

  const fetchWordList = useCallback(async () => {
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
  }, []);

  const makeExSent = useCallback(async (word) => {
    // 같은 행 다시 클릭 시 토글(접기)
    if (selectedWord === word && !loadingEx) {
      setSelectedWord(null);
      setExSentence([]);
      return;
    }

    setSelectedWord(word);
    setExSentence([]);
    setLoadingEx(true);

    // 이전 요청 중단
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    lastReqRef.current = word;

    try {
      const res = await fetch(
        `http://localhost:8080/api/wordbook/ex?jp=${encodeURIComponent(word)}`,
        { credentials: 'include', signal: controller.signal }
      );
      const data = await res.json();

      // 다른 단어로 클릭이 바뀐 경우 결과 무시
      if (lastReqRef.current !== word) return;

      if (res.ok) {
        const arr = Array.isArray(data) ? data : [];
        setExSentence(arr);
      } else {
        toast.error(data?.error || '예문 생성 실패');
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error(e);
        toast.error('네트워크 오류');
      }
    } finally {
      if (lastReqRef.current === word) setLoadingEx(false);
    }
  }, [selectedWord, loadingEx]);

  const handleDelete = useCallback(async (e, id, jpWord) => {
    e.stopPropagation(); // 행 클릭으로 예문 펼치는 이벤트 막기
    if (!window.confirm(`'${jpWord}' 단어를 삭제할까요?`)) return;

    try {
      const res = await fetch(`http://localhost:8080/api/wordbook/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        setWordList((prev) => prev.filter((item) => item.id !== id));
        setSelectedWord((prev) => (prev === jpWord ? null : prev));
        setExSentence((prev) => (selectedWord === jpWord ? [] : prev));
        toast.success(data.success || '삭제되었습니다.');
      } else {
        toast.error(data.error || '삭제 실패');
      }
    } catch (err) {
      console.error(err);
      toast.error('네트워크 오류');
    }
  }, [selectedWord]);

  useEffect(() => {
    fetchWordList();
    // 언마운트 시 진행 중 예문 요청 중단
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [fetchWordList]);

  const filtered = useMemo(() => {
    const q = filter.trim();
    if (!q) return wordList;
    return wordList.filter(
      (w) =>
        (w.jpWord && w.jpWord.includes(q)) ||
        (w.krWord && w.krWord.includes(q)) ||
        (w.jpReading && w.jpReading.includes(q))
    );
  }, [wordList, filter]);

  return (
    <>
      {/* 미세 스타일 */}
      <style>{`
        .row-click { cursor: pointer; }
        .examples-box { background: #f8f9fa; border: 1px solid #e9ecef; }
        .icon-btn { padding: 0; background: transparent; border: 0; line-height: 1; cursor: pointer; }
        .icon-btn:focus { outline: none; box-shadow: none; }
        thead.table-light th { position: sticky; top: 0; z-index: 1; }
      `}</style>

      {/* 타이틀 + 컨트롤러 */}
      <div
        className="mt-5 mb-3 d-grid"
        style={{ gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}
      >
        <div />
        <h2 className="mb-0 text-center">단어장</h2>
        <div className="d-flex align-items-center gap-2 justify-content-end pe-4">
          <span className="badge text-bg-light">총 {wordList.length}개</span>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-control form-control-sm"
            placeholder="검색 (일본어/읽기/뜻)"
            style={{ width: 220 }}
          />
          {filter && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setFilter('')}
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* 테이블 영역 */}
      {filtered.length === 0 ? (
        <div className="alert alert-light ms-4 me-4 border">
          저장된 단어가 없거나 검색 결과가 없습니다.
        </div>
      ) : (
        <div className="table-responsive ms-4 me-4 mb-4 border border-2 rounded-3">
          <table className="table table-hover mb-0 align-middle fs-5">
            <thead className="table-light">
              <tr>
                <th style={{ width: '35%' }}>일본어</th>
                <th style={{ width: '25%' }}>읽는 법</th>
                <th style={{ width: '30%' }}>한국어 뜻</th>
                <th style={{ width: '10%' }} className="text-end"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w, i) => (
                <Fragment key={w.id ?? `${w.jpWord}-${i}`}>
                  <tr
                    role="button"
                    className={`row-click ${selectedWord === w.jpWord ? 'table-primary' : ''}`}
                    onClick={() => makeExSent(w.jpWord)}
                  >
                    <td className="fw-semibold">{w.jpWord}</td>
                    <td>
                      {w.jpReading ? (
                        <span className="badge text-bg-secondary">{w.jpReading}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>{w.krWord}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="icon-btn text-danger"
                        onClick={(e) => handleDelete(e, w.id, w.jpWord)}
                        title="삭제"
                        aria-label="삭제"
                      >
                        <RiDeleteBack2Line size={22} />
                      </button>
                    </td>
                  </tr>

                  {selectedWord === w.jpWord && (
                    <tr>
                      <td colSpan={4}>
                        <div className="examples-box rounded p-3">
                          {loadingEx && (
                            <div className="d-flex align-items-center gap-2 text-muted">
                              <div className="spinner-border spinner-border-sm" role="status" />
                              <span>예문 생성 중…</span>
                            </div>
                          )}

                          {!loadingEx && exSentence.length > 0 && (
                            <>
                              <div className="mb-2 small text-muted">
                                예문 {exSentence.length}개
                              </div>
                              <ul className="list-group list-group-flush">
                                {exSentence.map((s, idx) => (
                                  <li key={idx} className="list-group-item px-0">
                                    <div className="fw-semibold">{s.ja}</div>
                                    {s.jaRd && (
                                      <div style={{ color: '#0d6efd' }}>{s.jaRd}</div>
                                    )}
                                    <div className="text-muted">{s.ko}</div>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}

                          {!loadingEx && exSentence.length === 0 && (
                            <div className="text-muted">예문이 없습니다</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Wordbook;
