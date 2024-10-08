import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

const SCRIPT_ROOT_PATH = process.env.SCRIPT_ROOT_PATH || "/";

export async function POST() {
  try {
    // Execute the Python script
    const { stdout, stderr } = await execAsync(
      `python ${path.join(SCRIPT_ROOT_PATH, "plan/generate.py")}`
    );

    if (stderr) {
      console.error("Error executing Python script:", stderr);
      throw new Error("Failed to generate plan");
    }

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
