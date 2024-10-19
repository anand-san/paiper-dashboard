import { useGetDocuments } from "@/api/useDocuments";

export default function MyFiles() {
  const { isPending, isError, data, error } = useGetDocuments();

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
