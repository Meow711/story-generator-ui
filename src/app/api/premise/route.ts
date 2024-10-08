import { NextResponse, NextRequest } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

const SCRIPT_ROOT_PATH = process.env.SCRIPT_ROOT_PATH || "";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    // const { premise } = await request.json()

    // if (!premise) {
    //   return NextResponse.json({ error: 'Premise is required' }, { status: 400 })
    // }

    // // Create the content object
    // const content = {
    //   title: {
    //     instruction: `Write a title for a story which is about: ${premise}`,
    //     response_prefix: "Sure, here is a possible title:\n\nTitle:"
    //   },
    //   premise: {
    //     instruction: `Write a premise for a story which is about: ${premise}`,
    //     response_prefix: "Title: {title}\n\nPremise:"
    //   }
    // }

    // const inputJsonContent = JSON.stringify(content, null, 2)
    // const inputJsonPath = path.join(SCRIPT_ROOT_PATH, 'premise/prompts.json')

    // await fs.writeFile(inputJsonPath, inputJsonContent, 'utf-8')

    // // Execute the Python script
    // const { stdout, stderr } = await execAsync(
    //   `python ${path.join(SCRIPT_ROOT_PATH, "premise/generate.py")}`
    // );

    // if (stderr) {
    //   console.error("Error executing Python script:", stderr);
    //   throw new Error("Failed to generate premise");
    // }

    // Read the output file
    const outputPath = path.join(SCRIPT_ROOT_PATH, "output/premise.json");
    const fileContent = await fs.readFile(outputPath, "utf-8");

    // Parse the JSON content
    const jsonContent = JSON.parse(fileContent);

    // Return the result
    return NextResponse.json(jsonContent, { status: 200 });
  } catch (error) {
    console.error("Error in /api/premise:", error);
    return NextResponse.json(
      { error: "Failed to generate premise" },
      { status: 500 }
    );
  }
}
