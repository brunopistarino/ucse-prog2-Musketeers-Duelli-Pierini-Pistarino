export default function ErrorPage({ error }) {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-4 p-8">
      <p className="text-4xl font-semibold text-gray-500">Ocurrió un error</p>
      <ul>
        {error?.msg.map((msg) => (
          <li key={msg.msg_id}>
            {msg.msg_id} - {msg.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
