function Home({ userInfo }) {
  return (
    <div>
      {userInfo? (
        <>
          <h1>로그인된 홈입니다.</h1>
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