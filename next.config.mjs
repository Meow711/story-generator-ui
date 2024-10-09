/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: false,
    images: {
        domains: ["nft1000.oss-cn-beijing.aliyuncs.com"]
    }
};

export default nextConfig;
