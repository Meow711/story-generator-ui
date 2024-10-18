"use client";

import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/layout';
import { Button } from "@/components/ui/button";

const HomeContent = () => {
  const router = useRouter();
  return <Button onClick={() => router.push("/write")}>Generate your AI story</Button>
}

export default function HomeApp() {
  return (
    <Layout>
      <HomeContent />
    </Layout>
  )
}
