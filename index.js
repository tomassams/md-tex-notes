const chokidar = require("chokidar");
const path = require("path");
const childProcess = require("child_process");
const fs = require("fs");

const spawn = childProcess.spawn;
const exec = childProcess.exec;

/**
 * File watcher
 */
const watcher = chokidar.watch("**/*.md", {
    ignored: [
        /(^|[\/\\])\../, // ignore dotfiles
        "node_modules",
    ],
    persistent: true,
});

/**
 * Create a folder path if it does not already exist
 */
const createFolderIfNotExists = (path) => {
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
    });
};

/**
 * Compile file from .md to .pdf
 */
const compileMarkdownToPdf = (changed) => {
    const inputDir = path.parse(changed).dir;
    const inputFile = path.parse(changed).name;

    const saveDir = inputDir.replace("markdown", "pdf");
    const savePath = path.join(saveDir, `${inputFile}.pdf`);

    createFolderIfNotExists(saveDir);
    runPandoc(changed, savePath);
};

/**
 * Run pandoc exec to do the actual compiling
 */
const runPandoc = (inputPath, outputPath) => {
    console.log(`Starting compiling of ${inputPath} into ${outputPath} ...`);

    exec("where pandoc", (err, stdout) => {
        if (err || !stdout) {
            throw err || new Error("Cant find pandoc. Make sure its installed");
        }

        let pandocPath = stdout.substr(0, stdout.length - 1);
        let pandoc = exec(
            `"${pandocPath}" ${inputPath} -o ${outputPath} --citeproc --pdf-engine=xelatex`,
            (err, stdout) => {
                if (err) {
                    throw err;
                }

                console.log("Conversion complete!");
            }
        );
    });
};

/**
 * Start listening for file changes
 */
watcher
    .on("change", (path) => compileMarkdownToPdf(path))
    .on("error", (error) => console.log(`Watcher error: ${error}`))
    .on("ready", () => console.log("Watcher active! Will auto-compile when changes are detected in the ./markdown directory."));
