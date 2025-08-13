"use client";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuthRedirect = () => {

  const router = useRouter()

  useEffect(() => {
 
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/login");
      }

  }, [redirect]);

  return null;
};
