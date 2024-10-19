import { useGetUsers } from "@/api/useUserQuery";

export default function Profile() {
  const { isPending, isError, data, error } = useGetUsers();

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
