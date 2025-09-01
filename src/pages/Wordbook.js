import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function Wordbook() {
    const [wordList, setWordList] = useState([]);
    const fetchWordList = async () => {
        const res = await fetch('http://localhost:8080/api/wordbook/list', {
            credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) setWordList(data);
        else toast.error('단어 불러오기에 실패');
    }

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
                <tr key={w.id ?? `${w.jpWord}-${i}`}>
                <td className="fw-semibold">{w.jpWord}</td>
                <td>{w.jpReading || '-'}</td>
                <td>{w.krWord}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </>
    );

}
export default Wordbook;