import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

export default function useMutate(url: string, method: string) {
  const { isPending, isSuccess, error, mutate } = useMutation({
    mutationFn: (data) => {
      return axios({
        method,
        url: `${BASE_URL}${url}`,
        data,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });

  return { isPending, isSuccess, error, mutate };
}
