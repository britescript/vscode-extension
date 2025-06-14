import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import which from 'which';

const execAsync = promisify(exec);

export function activate(context: vscode.ExtensionContext) {
    console.log('Britescript extension activated! 🚀');

    // Register commands
    const commands = [
        vscode.commands.registerCommand('britescript.compile', compileFile),
        vscode.commands.registerCommand('britescript.run', runFile),
        vscode.commands.registerCommand('britescript.build', buildProject),
        vscode.commands.registerCommand('britescript.newFile', createNewFile),
    ];

    // Register providers
    const providers = [
        vscode.languages.registerDocumentFormattingEditProvider('britescript', new BritescriptFormattingProvider()),
        vscode.languages.registerCompletionItemProvider('britescript', new BritescriptCompletionProvider(), '.', '|'),
        vscode.languages.registerHoverProvider('britescript', new BritescriptHoverProvider()),
    ];

    // Register file watcher for auto-compile on save
    const saveWatcher = vscode.workspace.onDidSaveTextDocument(onDocumentSave);

    // Add all disposables to context
    context.subscriptions.push(...commands, ...providers, saveWatcher);

    // Show welcome message
    showWelcomeMessage(context);
}

export function deactivate() {}

async function compileFile(uri?: vscode.Uri) {
    const fileUri = uri || vscode.window.activeTextEditor?.document.uri;
    if (!fileUri || (!fileUri.fsPath.endsWith('.bs') && !fileUri.fsPath.endsWith('.bsx'))) {
        vscode.window.showErrorMessage('Please select a .bs or .bsx file to compile');
        return;
    }

    try {
        const britescriptPath = await getBritescriptPath();
        const { stdout, stderr } = await execAsync(`"${britescriptPath}" compile "${fileUri.fsPath}"`);
        
        if (stderr) {
            vscode.window.showErrorMessage(`Compilation failed: ${stderr}`);
            return;
        }

        vscode.window.showInformationMessage(`✅ Compiled successfully: ${path.basename(fileUri.fsPath)}`);
        
        // Optionally show compiled output
        const config = vscode.workspace.getConfiguration('britescript');
        if (config.get('showCompiledOutput')) {
            await showCompiledOutput(fileUri);
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Compilation error: ${error}`);
    }
}

async function runFile(uri?: vscode.Uri) {
    const fileUri = uri || vscode.window.activeTextEditor?.document.uri;
    if (!fileUri || (!fileUri.fsPath.endsWith('.bs') && !fileUri.fsPath.endsWith('.bsx'))) {
        vscode.window.showErrorMessage('Please select a .bs or .bsx file to run');
        return;
    }

    try {
        const britescriptPath = await getBritescriptPath();
        const terminal = vscode.window.createTerminal('Britescript Run');
        terminal.show();
        terminal.sendText(`"${britescriptPath}" run "${fileUri.fsPath}"`);
    } catch (error) {
        vscode.window.showErrorMessage(`Run error: ${error}`);
    }
}

async function buildProject() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
    }

    try {
        const britescriptPath = await getBritescriptPath();
        const terminal = vscode.window.createTerminal('Britescript Build');
        terminal.show();
        terminal.sendText(`cd "${workspaceFolder.uri.fsPath}" && "${britescriptPath}" build`);
    } catch (error) {
        vscode.window.showErrorMessage(`Build error: ${error}`);
    }
}

async function createNewFile() {
    const fileType = await vscode.window.showQuickPick([
        { label: 'Britescript (.bs)', detail: 'Regular Britescript file', value: '.bs' },
        { label: 'Britescript JSX (.bsx)', detail: 'Britescript with JSX support', value: '.bsx' }
    ], {
        placeHolder: 'Select file type to create'
    });

    if (!fileType) return;

    const fileName = await vscode.window.showInputBox({
        prompt: 'Enter the name for your new Britescript file',
        placeHolder: `example${fileType.value}`,
        validateInput: (value) => {
            if (!value) return 'File name is required';
            if (!value.endsWith('.bs') && !value.endsWith('.bsx')) return 'File must have .bs or .bsx extension';
            return null;
        }
    });

    if (!fileName) return;

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found');
        return;
    }

    const filePath = path.join(workspaceFolder.uri.fsPath, fileName);
    const template = getBritescriptTemplate(fileName, fileType.value === '.bsx');

    try {
        await fs.promises.writeFile(filePath, template);
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create file: ${error}`);
    }
}

async function showCompiledOutput(fileUri: vscode.Uri) {
    const tsPath = fileUri.fsPath.replace(/\\.(bs|bsx)$/, '.ts');
    if (fs.existsSync(tsPath)) {
        const document = await vscode.workspace.openTextDocument(tsPath);
        await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
    }
}

async function onDocumentSave(document: vscode.TextDocument) {
    if (!document.fileName.endsWith('.bs') && !document.fileName.endsWith('.bsx')) return;

    const config = vscode.workspace.getConfiguration('britescript');
    if (config.get('autoCompile')) {
        await compileFile(document.uri);
    }
}

async function getBritescriptPath(): Promise<string> {
    const config = vscode.workspace.getConfiguration('britescript');
    const configuredPath = config.get<string>('executable');
    
    if (configuredPath && configuredPath !== 'brite') {
        return configuredPath;
    }

    try {
        return await which('brite');
    } catch {
        throw new Error('Britescript CLI (brite) not found. Please install @britescript/cli or set britescript.executable in settings.');
    }
}

function getBritescriptTemplate(fileName: string, isJSX: boolean = false): string {
    const name = path.basename(fileName, path.extname(fileName));
    
    if (isJSX) {
        return `// ${fileName} - Britescript JSX file
// Written in Britescript with JSX! 🚀

import React from 'react';

// Example struct for props
struct ${capitalize(name)}Props {
  title: string;
  count: number;
  children?: React.ReactNode;
}

// Example trait
trait Renderable {
  render(): JSX.Element;
}

// Example implementation
impl Renderable for ${capitalize(name)}Props {
  render() {
    // TODO: Implement render logic
  }
}

// Example React component
export function ${capitalize(name)}Component(props: ${capitalize(name)}Props) {
  let message = "Hello from Britescript JSX!"
  message |> console.log

  return (
    <div>
      <h1>{props.title}</h1>
      <p>Count: {props.count}</p>
      {props.children}
    </div>
  );
}

// Example usage with pipes
let greeting = "Welcome to Britescript JSX!"
greeting |> console.log

export default ${capitalize(name)}Component;
`;
    } else {
        return `// ${fileName} - Britescript file
// Written in Britescript! 🚀

// Example struct
struct ${capitalize(name)}Data {
  id: number;
  name: string;
  value: string;
}

// Example trait
trait Processor {
  process(data: ${capitalize(name)}Data): string;
}

// Example implementation
impl Processor for ${capitalize(name)}Data {
  process(data: ${capitalize(name)}Data) {
    // TODO: Implement processing logic
  }
}

// Example usage with pipes
let message = "Hello from Britescript!"
message |> console.log

// Example data processing
let data = {
  id: 1,
  name: "${name}",
  value: "example"
};

let result = "Processing: " + data.name
result |> console.log
`;
    }
}

function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showWelcomeMessage(context: vscode.ExtensionContext) {
    const hasShownWelcome = context.globalState.get('britescript.hasShownWelcome');
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            'Welcome to Britescript! 🚀 Create beautiful code with traits, structs, and pipes.',
            'Create New File',
            'Documentation'
        ).then(selection => {
            if (selection === 'Create New File') {
                vscode.commands.executeCommand('britescript.newFile');
            } else if (selection === 'Documentation') {
                vscode.env.openExternal(vscode.Uri.parse('https://britescript.dev'));
            }
        });
        context.globalState.update('britescript.hasShownWelcome', true);
    }
}

// Formatting Provider
class BritescriptFormattingProvider implements vscode.DocumentFormattingEditProvider {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        // Basic formatting - could be enhanced with proper Britescript formatter
        const edits: vscode.TextEdit[] = [];
        const text = document.getText();
        
        // Simple indentation fix for struct/trait/impl blocks
        const lines = text.split('\\n');
        let indentLevel = 0;
        const indentSize = options.insertSpaces ? options.tabSize : 1;
        const indentChar = options.insertSpaces ? ' ' : '\\t';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            if (trimmed === '') continue;
            
            if (trimmed.includes('}')) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            const expectedIndent = indentChar.repeat(indentLevel * indentSize);
            const actualIndent = line.match(/^\\s*/)?.[0] || '';
            
            if (actualIndent !== expectedIndent && trimmed) {
                const range = new vscode.Range(
                    new vscode.Position(i, 0),
                    new vscode.Position(i, actualIndent.length)
                );
                edits.push(vscode.TextEdit.replace(range, expectedIndent));
            }
            
            if (trimmed.match(/^(struct|trait|impl)\\b.*\\{$/) || trimmed.includes('{')) {
                indentLevel++;
            }
        }
        
        return edits;
    }
}

// Completion Provider
class BritescriptCompletionProvider implements vscode.CompletionItemProvider {
    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.CompletionItem[] {
        const items: vscode.CompletionItem[] = [];
        
        // Pipe completions
        if (context.triggerCharacter === '|') {
            const pipeItem = new vscode.CompletionItem('|>', vscode.CompletionItemKind.Operator);
            pipeItem.insertText = '> ';
            pipeItem.documentation = 'Pipe operator for functional composition';
            items.push(pipeItem);
        }
        
        // Common pipe functions
        const pipeFunctions = ['console.log', 'trim', 'toLowerCase', 'toUpperCase', 'toString'];
        pipeFunctions.forEach(func => {
            const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
            item.documentation = `Pipe to ${func}`;
            items.push(item);
        });
        
        // Britescript keywords
        const keywords = ['struct', 'trait', 'impl', 'let', 'for', 'as'];
        keywords.forEach(keyword => {
            const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
            items.push(item);
        });
        
        return items;
    }
}

// Hover Provider
class BritescriptHoverProvider implements vscode.HoverProvider {
    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Hover | null {
        const range = document.getWordRangeAtPosition(position);
        if (!range) return null;
        
        const word = document.getText(range);
        
        const hoverTexts: Record<string, string> = {
            'struct': 'Define a data structure with named fields\\n\\n```britescript\\nstruct User {\\n  id: number;\\n  name: string;\\n}\\n```',
            'trait': 'Define a contract that types can implement\\n\\n```britescript\\ntrait Display {\\n  show(): string;\\n}\\n```',
            'impl': 'Implement methods for a struct or trait\\n\\n```britescript\\nimpl Display for User {\\n  show() { /* ... */ }\\n}\\n```',
            'let': 'Create an immutable binding\\n\\n```britescript\\nlet message = "Hello"\\nmessage |> console.log\\n```',
            '|>': 'Pipe operator - passes the left side as argument to the right side function\\n\\n```britescript\\nvalue |> transform |> console.log\\n```'
        };
        
        const hoverText = hoverTexts[word];
        if (hoverText) {
            return new vscode.Hover(new vscode.MarkdownString(hoverText));
        }
        
        return null;
    }
}