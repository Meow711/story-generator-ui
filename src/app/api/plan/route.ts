import { NextResponse, NextRequest } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

const SCRIPT_ROOT_PATH = process.env.SCRIPT_ROOT_PATH || "/";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    // const { title, premise } = await request.json()

    // if (!premise || !title) {
    //   return NextResponse.json({ error: 'title and premise is required' }, { status: 400 })
    // }

    // generate new premise file
    // const inputJsonContent = JSON.stringify({ title, premise }, null, 2);
    // const inputJsonPath = path.join(SCRIPT_ROOT_PATH, 'output/premise.json');
    // await fs.writeFile(inputJsonPath, inputJsonContent, 'utf-8')

    // Execute the Python script
    const { stdout, stderr } = await execAsync(
      `cd ${SCRIPT_ROOT_PATH} && python ${path.join(SCRIPT_ROOT_PATH, "plan/generate.py")}`
    );

    // if (stderr) {
    //   console.error("Error executing Python script:", stderr);
    //   throw new Error("Failed to generate plan");
    // }

    // Read the output file
    const outputPath = path.join(SCRIPT_ROOT_PATH, "output/plan.json");
    const fileContent = await fs.readFile(outputPath, "utf-8");

    // Parse the JSON content
    const jsonContent = JSON.parse(fileContent);

    // Return the result
    return NextResponse.json(jsonContent, { status: 200 });
  } catch (error) {
    console.error("Error in /api/plan:", error);
    return NextResponse.json(
      { error: "Failed to generate plan" },
      { status: 500 }
    );
  }
}
