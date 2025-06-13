# Britescript for VS Code

Beautiful language support for Britescript - the language with traits, structs, and clean syntax that compiles to TypeScript.

## Features

### 🎨 **Syntax Highlighting**
- Complete syntax highlighting for Britescript keywords (`struct`, `trait`, `impl`, `let`)
- Special highlighting for pipe operators (`|>`) and pipe chains
- Support for mixed Britescript + TypeScript/JavaScript code
- Custom color themes optimized for Britescript

### 📝 **Intelligent Code Completion**
- Auto-completion for Britescript keywords and constructs
- Pipe operator suggestions
- Common pipe function completions (`console.log`, `trim`, etc.)

### 🔧 **Built-in Commands**
- **Compile File** (`Ctrl+Shift+C`): Compile `.bs` files to TypeScript
- **Run File** (`Ctrl+Shift+R`): Execute Britescript files directly
- **Build Project** (`Ctrl+Shift+B`): Build entire Britescript projects
- **New File**: Create new `.bs` files with helpful templates

### 📦 **Code Snippets**
Accelerate development with pre-built snippets:
- `struct` - Create struct definitions
- `trait` - Create trait definitions  
- `impl` - Create implementation blocks
- `pipe` - Multi-line pipe chains
- `let` - Let bindings with pipes
- And many more...

### 🎯 **Project Integration**
- Auto-detection of Britescript projects
- Integration with `brite` CLI commands
- Workspace-aware build and run operations
- Support for `bunfig.toml` configuration
- Beautiful lightbulb icons for .bs files

### ⚙️ **Customizable Settings**
- Auto-compile on save
- Show compiled TypeScript output
- Custom CLI executable path
- Format on save support

## Installation

1. Install the extension from the VS Code Marketplace
2. Install the Britescript CLI: `bun install -g @britescript/cli`
3. Start writing beautiful Britescript code with the iconic lightbulb! 💡🚀

## Quick Start

1. **Create a new Britescript file:**
   - Use `Ctrl+Shift+P` → "Britescript: New File"
   - Or create a file with `.bs` extension

2. **Write some Britescript code:**
   ```britescript
   struct User {
     name: string;
     email: string;
   }

   trait Greeter {
     greet(user: User): string;
   }

   impl Greeter for User {
     greet(user: User) {
       let message = "Hello, " + user.name + "!"
       message |> console.log
     }
   }
   ```

3. **Compile and run:**
   - Right-click → "Compile to TypeScript" 
   - Or press `Ctrl+Shift+C`

## Commands

| Command | Keybinding | Description |
|---------|------------|-------------|
| Britescript: Compile | `Ctrl+Shift+C` | Compile current .bs file to TypeScript |
| Britescript: Run | `Ctrl+Shift+R` | Execute current .bs file |
| Britescript: Build | `Ctrl+Shift+B` | Build entire project |
| Britescript: New File | - | Create new .bs file with template |

## Extension Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `britescript.executable` | `"brite"` | Path to Britescript CLI |
| `britescript.autoCompile` | `false` | Auto-compile on save |
| `britescript.showCompiledOutput` | `true` | Show TypeScript output after compile |
| `britescript.enableDiagnostics` | `true` | Enable compiler diagnostics |
| `britescript.formatOnSave` | `false` | Format files on save |

## Themes

The extension includes two custom themes optimized for Britescript:
- **Britescript Dark** - Dark theme with vibrant Britescript syntax colors
- **Britescript Light** - Light theme with clear syntax distinction

Enable via `Preferences: Color Theme` → "Britescript Dark/Light"

## Language Features

### Syntax Support
- ✅ **Structs** - Data type definitions
- ✅ **Traits** - Interface contracts  
- ✅ **Impl blocks** - Method implementations
- ✅ **Let bindings** - Immutable variables
- ✅ **Pipe operations** - Functional composition
- ✅ **Generics** - Type parameters
- ✅ **Mixed syntax** - TypeScript/JavaScript interop

### Smart Features
- **Bracket matching** for `{}`, `[]`, `()`, `<>`
- **Auto-closing pairs** for quotes and brackets
- **Comment toggling** with `//` and `/* */`
- **Code folding** for blocks and regions
- **Indentation rules** for clean code structure

## Examples

### Struct with Pipes
```britescript
struct Message {
  content: string;
  timestamp: number;
}

let msg = {
  content: "Hello World",
  timestamp: Date.now()
}

msg.content
  |> trim
  |> toUpperCase  
  |> console.log
```

### Trait Implementation
```britescript
trait Serializable {
  serialize(): string;
}

impl Serializable for Message {
  serialize() {
    return JSON.stringify(this);
  }
}
```

### Generic Structs
```britescript
struct Container<T> {
  value: T;
  metadata: string;
}

struct Result<T, E> {
  success: boolean;
  data?: T;
  error?: E;
}
```

## Troubleshooting

### CLI Not Found
If you see "Britescript CLI not found":
1. Install the CLI: `bun install -g @britescript/cli`
2. Or set custom path in settings: `britescript.executable`

### Compilation Errors
- Check that your `.bs` file has valid Britescript syntax
- View Problems panel (`Ctrl+Shift+M`) for detailed errors
- Ensure all dependencies are installed

### File Association
If `.bs` files don't open with Britescript syntax:
1. Right-click file → "Open With..." → "Britescript"
2. Or add to VS Code settings:
   ```json
   "files.associations": {
     "*.bs": "britescript"
   }
   ```

## Contributing

Found a bug or want to contribute? 
- [GitHub Repository](https://github.com/britescript/vscode-extension)
- [Report Issues](https://github.com/britescript/vscode-extension/issues)

## Development

### Prerequisites
- **Bun**: `curl -fsSL https://bun.sh/install | bash`
- **VS Code**: Latest version with extension development support

### Setup
```bash
git clone https://github.com/britescript/vscode-extension
cd vscode-extension
./scripts/dev.sh          # Install deps and compile
```

### Testing
1. Open project in VS Code
2. Press `F5` to launch Extension Development Host
3. Open `examples/example.bs` to test syntax highlighting
4. Use `Ctrl+Shift+P` → "Britescript" to test commands

### Build Scripts (using Bun)
```bash
bun run compile     # Compile TypeScript
bun run watch       # Watch and recompile
bun run test        # Run tests
bun run package     # Create .vsix package
```

## Links

- 📖 [Britescript Documentation](https://britescript.dev)
- 🛠️ [Britescript CLI](https://github.com/britescript/cli)
- 💬 [Community Discord](https://discord.gg/britescript)

---

**Happy coding with Britescript!** 🚀✨