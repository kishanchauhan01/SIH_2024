import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const phoneticCode = (title) => {
    return new Promise((resolve, reject) => {
        // Spawn a Python process and send the data to it
        const pythonScriptPath = join(__dirname, 'main.py')

        const pythonProcess = spawn("python", [pythonScriptPath]);

        // Send the user input to the Python process
        pythonProcess.stdin.write(title);
        pythonProcess.stdin.end();

        // Capture the result from Python
        let result = "";
        pythonProcess.stdout.on("data", (data) => {
            result += data.toString();
        });

        pythonProcess.stdout.on("end", () => {
            try {
                resolve(result.trim());
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                reject("Failed to parse Python output");
            }
        });

        pythonProcess.stderr.on("data", (data) => {
            console.error(`Python error: ${data}`);
            reject(`Python error: ${data}`);
        });
    });
};

export default phoneticCode;
