// import React, { useState, useEffect, Fragment } from 'react';
// import { toast } from 'react-toastify';
// import { RiDeleteBack2Line } from 'react-icons/ri';


// function Wordbook() {
//   const [wordList, setWordList] = useState([]);
//   const [exSentence, setExSentence] = useState([]);   // [{ja, ko}, ...]
//   const [selectedWord, setSelectedWord] = useState(null);
//   const [loadingEx, setLoadingEx] = useState(false);

//   const fetchWordList = async () => {
//     try {
//       const res = await fetch('http://localhost:8080/api/wordbook/list', {
//         credentials: 'include',
//       });
//       const data = await res.json();
//       if (res.ok) setWordList(data);
//       else toast.error('단어 불러오기에 실패');
//     } catch (e) {
//       console.error(e);
//       toast.error('네트워크 오류');
//     }
//   };

//   const makeExSent = async (word) => {
//     setSelectedWord(word);
//     setExSentence([]);
//     setLoadingEx(true);
//     try {
//       const res = await fetch(
//         `http://localhost:8080/api/wordbook/ex?jp=${encodeURIComponent(word)}`,
//         { credentials: 'include' }
//       );
//       const data = await res.json();
//       if (res.ok) setExSentence(data); // ← 배열 [{ja, ko}, ...]
//       else toast.error(data.error || '예문 생성 실패');
//     } catch (e) {
//       console.error(e);
//       toast.error('네트워크 오류');
//     } finally {
//       setLoadingEx(false);
//     }
//   };

//   const handleDelete = async (e, id, jpWord) => {
//     e.stopPropagation(); // 행 클릭으로 예문 펼치는 이벤트 막기

//     if (!window.confirm(`'${jpWord}' 단어를 삭제할까요?`)) return;

//     try {
//         const res = await fetch(`http://localhost:8080/api/wordbook/delete/${id}`, {
//         method: 'DELETE',
//         credentials: 'include',
//         });
//         const data = await res.json();

//         if (res.ok) {
//         // 목록에서 제거
//         setWordList(prev => prev.filter(item => item.id !== id));
//         // 선택된 단어가 삭제된 경우, 하단 예문영역 정리
//         setSelectedWord(prev => (prev === jpWord ? null : prev));
//         setExSentence(prev => (selectedWord === jpWord ? [] : prev));

//         toast.success(data.success || '삭제되었습니다.');
//         } else {
//         toast.error(data.error || '삭제 실패');
//         }
//     } catch (err) {
//         console.error(err);
//         toast.error('네트워크 오류');
//     }
//     };

//   useEffect(() => {
//     fetchWordList();
//   }, []);

//   return (
//     <>
//       <h2 className="mb-4 mt-5">단어장</h2>
//       <div className="table-responsive">
//         <table className="table table-striped table-hover align-middle fs-5">
//           <thead className="table-light">
//             <tr>
//                 <th style={{ width: '35%' }}>일본어</th>
//                 <th style={{ width: '25%' }}>읽는 법</th>
//                 <th style={{ width: '30%' }}>한국어 뜻</th>
//                 <th style={{ width: '10%' }} className="text-end"></th>
//             </tr>
//             </thead>
//             <tbody>
//             {wordList.map((w, i) => (
//                 <Fragment key={w.id ?? `${w.jpWord}-${i}`}>
//                 <tr onClick={() => makeExSent(w.jpWord)} style={{ cursor: 'pointer' }}>
//                     <td className="fw-semibold">{w.jpWord}</td>
//                     <td>{w.jpReading || '-'}</td>
//                     <td>{w.krWord}</td>
//                     <td className="text-end">
//                         <button
//                             type="button"
//                             className="p-0 bg-transparent border-0 shadow-none text-danger"
//                             onClick={(e) => { e.stopPropagation(); handleDelete(e, w.id, w.jpWord); }}
//                             title="삭제"
//                             aria-label="삭제"
//                         >
//                             <RiDeleteBack2Line size={24} />
//                         </button>
//                     </td>
//                 </tr>

//                 {selectedWord === w.jpWord && (
//                     <tr>
//                     <td colSpan={4}>
//                         {loadingEx && <div className="text-muted">예문 생성 중…</div>}
//                         {!loadingEx && exSentence.length > 0 && (
//                         <ul className="mb-0">
//                             {exSentence.map((s, idx) => (
//                             <li key={idx} className="mb-1">
//                                 <div className="fw-semibold">{s.ja}</div>
//                                 <div>{s.jaRd}</div>
//                                 <div className="text-muted">{s.ko}</div>
//                             </li>
//                             ))}
//                         </ul>
//                         )}
//                         {!loadingEx && exSentence.length === 0 && (
//                         <div className="text-muted">예문이 없습니다</div>
//                         )}
//                     </td>
//                     </tr>
//                 )}
//                 </Fragment>
//             ))}
//             </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

// export default Wordbook;

import React, { useState, useEffect, Fragment, useMemo } from 'react';
import { toast } from 'react-toastify';
import { RiDeleteBack2Line } from 'react-icons/ri';

function Wordbook() {
    const [wordList, setWordList] = useState([]);
    const [exSentence, setExSentence] = useState([]);   // [{ja, jaRd, ko}, ...]
    const [selectedWord, setSelectedWord] = useState(null);
    const [loadingEx, setLoadingEx] = useState(false);
    const [filter, setFilter] = useState('');

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
        if (res.ok) setExSentence(data); // ← 배열 [{ja, jaRd, ko}, ...]
        else toast.error(data.error || '예문 생성 실패');
        } catch (e) {
        console.error(e);
        toast.error('네트워크 오류');
        } finally {
        setLoadingEx(false);
        }
    };

    const handleDelete = async (e, id, jpWord) => {
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
    };

    useEffect(() => {
        fetchWordList();
    }, []);

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
        {/* 작은 커스텀 스타일 */}
        <style>{`
            .row-click { cursor: pointer; }
            .examples-box { background: #f8f9fa; border: 1px solid #e9ecef; }
            .icon-btn { padding: 0; background: transparent; border: 0; line-height: 1; }
            .icon-btn:focus { outline: none; box-shadow: none; }
            .list-ja { font-weight: 600; }
            .list-jard { font-size: .95rem; color: #0d6efd; }
            .list-ko { font-size: .95rem; color: #6c757d; }
        `}</style>

        <div
            className="mt-5 mb-3 d-grid"
            style={{ gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}
            >
            {/* 여백 */}
            <div />

            {/* 제목*/}
            <h2 className="mb-0 text-center">단어장</h2>

            {/* 컨트롤러 */}
            <div className="d-flex align-items-center gap-2 justify-content-end">
                <span className="badge text-bg-light">총 {wordList.length}개</span>
                <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-control form-control-sm"
                placeholder="검색 (일본어/읽기/뜻)"
                style={{ width: 220 }}
                />
            </div>
        </div>

        {filtered.length === 0 ? (
            <div className="alert alert-light border">
            저장된 단어가 없거나 검색 결과가 없습니다.
            </div>
        ) : (
            <div className="table-responsive">
            <table className="table table-striped table-hover align-middle fs-5">
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
                                <ul className="list-group list-group-flush">
                                {exSentence.map((s, idx) => (
                                    <li key={idx} className="list-group-item px-0">
                                    <div className="list-ja">{s.ja}</div>
                                    {s.jaRd && <div className="list-jard">{s.jaRd}</div>}
                                    <div className="list-ko">{s.ko}</div>
                                    </li>
                                ))}
                                </ul>
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
