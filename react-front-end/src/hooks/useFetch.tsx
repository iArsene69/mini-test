import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

async function getData(url: string) {
  const res = await axios.get(`${BASE_URL}${url}`).then((res) => res.data);
  return res.data;
}

export default function useFetch(url: string, key: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [key],
    queryFn: async () => await getData(url),
  });

  return { data, isLoading, error, refetch };
}
