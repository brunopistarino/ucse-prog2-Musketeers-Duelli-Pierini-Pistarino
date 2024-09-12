interface Props {
  error: string;
}

export default function ErrorPage({ error }: Props) {
  return (
    <div className="flex items-center justify-center h-full flex-col gap-4 p-8">
      <p className="text-4xl font-semibold text-gray-500">Ocurrió un error</p>
      <p>{error}</p>
    </div>
  );
}
