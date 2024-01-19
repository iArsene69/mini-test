import DataTable from "./DataTable";
import { columns } from "./Columns";
import useFetch from "@/hooks/useFetch";
import TableSkeleton from "./table-skeleton";

export default function TablePage() {
  const { data, isLoading, error } = useFetch("/employees", "employees");

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
