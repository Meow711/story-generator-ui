import { NextRequest, NextResponse } from 'next/server'

const GENERATE_URL = 'https://aigc.tokenso.com/api/aigc/job'
const STATUS_URL = 'https://aigc.tokenso.com/api/aigc/job/status'

async function checkJobStatus(jobId: string): Promise<string[]> {
    const response = await fetch(`${STATUS_URL}?job_id=${jobId}`, {
        headers: {
            "x-api-key": process.env.AIGC_KEY || "dev_user"
        }
    })
    if (!response.ok) {
        throw new Error('Failed to check job status')
    }
    const data = await response.json()

    console.log("job data", data)


    if (data.code !== 0) {
        throw new Error(data.msg || 'Unknown error occurred')
    }

    if (data.data.job_status === 'success') {
        return data.data.results[0]
    }

    if (data.data.job_status !== 'processing') {
        throw new Error(data.data.reason)
    }

    // If job is still processing, wait and check again
    await new Promise(resolve => setTimeout(resolve, 3000))
    return checkJobStatus(jobId)
}

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json()

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
        }

        // Generate image
        const generateResponse = await fetch(GENERATE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "x-api-key": process.env.AIGC_KEY || "dev_user"
            },
            body: JSON.stringify({
                prompt,
                "negative_prompt": "",
                "job_type": "text2img",
                "img_link": "",
                "priority": 1,
                "description": "",
                "job_style": "normal",
                "model": "FLUX"
            }),
        })

        if (!generateResponse.ok) {
            throw new Error('Failed to generate image')
        }

        const generateData = await generateResponse.json()
        console.log("generateData", generateData)


        if (generateData.code !== 0) {
            throw new Error(generateData.msg || 'Unknown error occurred')
        }

        const jobId = generateData.data.job_id

        // Check job status
        const result = await checkJobStatus(jobId)

        // test
        // const result = "https://nft1000.oss-cn-beijing.aliyuncs.com/sd_output/txt2img/2024-10-09/t2i-2024-10-09-20-58-41-73608359-2277-4b9c-a9f2-65f7ef33c112-0.png"

        return NextResponse.json({ result })
    } catch (error) {
        console.error('Error in generate_image API:', error)
        return NextResponse.json(
            { error: 'An error occurred while generating the image' },
            { status: 500 }
        )
    }
}