"use client";

import { useRouter } from 'next/router';

export default function HomeApp() {
  const router = useRouter();
  router.replace("/write")
  return null
}
