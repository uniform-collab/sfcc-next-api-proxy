const Page = () => {
  return (
    <>
      <h1>Hello</h1>
      <p>This is a tiny SFCC proxy for Next.js</p>
      <p>The following basket requests can be made:</p>
      <ul>
        <li>
          Create empty basket (GET):{" "}
          <pre>http://localhost:3000/api/sfcc/basket/create</pre>
        </li>
        <li>
          Add product to existing basket (GET):{" "}
          <pre>
            http://localhost:3000/api/sfcc/basket/add?basketId=123&productId=25592770M&quantity=1
          </pre>
        </li>
        <li>
          Get basket (GET):
          <pre>http://localhost:3000/api/sfcc/basket/get?basketId=123</pre>
        </li>
        <li>
          Delete basket (GET):
          <pre>http://localhost:3000/api/sfcc/basket/delete?basketId=123</pre>
        </li>
      </ul>
    </>
  );
};

export default Page;
