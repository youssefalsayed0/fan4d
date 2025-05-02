"use server";

import { JSON_HEADER } from "@/lib/constants/api.constant";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache"; // ✅ Import this

const BASE_URL = process.env.NEXT_PUBLIC_API;

export const addToCart = async (formData: FormData) => {
  const tokenCookie = cookies().get("next-auth.session-token")?.value;
  const token = await decode({
    token: tokenCookie,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  // إرسال الطلب
  const response = await fetch(BASE_URL + "/cart/add", {
    method: "POST",
    body: formData,
    headers: {
      ...JSON_HEADER,
      Authorization: `Bearer ${token?.token}`,
    },
  });

  const payload = await response.json();

if (!response.ok) {
  console.error("خطأ في الاستجابة من السيرفر:", payload);
  return payload; // ✅ throw plain object instead of Error instance
}

  revalidatePath("/shopping-cart"); // 👈 Re-renders the /cart page on next visit or navigation
  return payload;
};
