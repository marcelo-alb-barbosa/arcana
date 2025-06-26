function Error({ statusCode }) {
  return (
    <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center p-4">
      <h1 className="font-cinzel text-4xl text-blood-red mb-4">
        {statusCode
          ? `Error ${statusCode}`
          : 'An error occurred'}
      </h1>
      <p className="text-aged-bone">
        {statusCode
          ? `A server-side error occurred.`
          : 'A client-side error occurred.'}
      </p>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error