
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuthRedirect = () => {
  // const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // router.push('/login');
      redirect('/login')
    }
  }, [redirect]);

  return null;
};