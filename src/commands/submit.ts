"use strict";

import * as vscode from "vscode";
import { leetCodeManager } from "../leetCodeManager";
import { leetCodeBinaryPath } from "../shared";
import { executeCommand } from "../utils/cpUtils";
import { DialogType, promptForOpenOutputChannel, promptForSignIn, showResultFile } from "../utils/uiUtils";

export async function submitSolution(channel: vscode.OutputChannel, uri?: vscode.Uri): Promise<void> {
    if (!leetCodeManager.getUser()) {
        promptForSignIn();
        return;
    }

    let filePath: string;
    if (uri) {
        filePath = uri.fsPath;
    } else {
        const textEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        if (!textEditor) {
            return;
        }
        if (!textEditor.document.save()) {
            vscode.window.showWarningMessage("Please save the solution file first.");
            return;
        }
        filePath = textEditor.document.uri.fsPath;
    }

    try {
        const result: string = await executeCommand(channel, "node", [leetCodeBinaryPath, "submit", filePath]);
        await showResultFile(result);
    } catch (error) {
        await promptForOpenOutputChannel("Failed to submit the solution. Please open the output channel for details.", DialogType.error, channel);
    }
}
