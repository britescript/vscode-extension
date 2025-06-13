# Change Log

All notable changes to the Britescript VS Code extension will be documented in this file.

## [0.1.0] - 2024-01-15

### Added
- 🎉 Initial release of Britescript VS Code extension
- 🎨 Complete syntax highlighting for Britescript language
  - Structs, traits, impl blocks
  - Pipe operators and chains  
  - Let bindings and generics
  - Mixed Britescript + TypeScript support
- 📝 Intelligent code completion
  - Britescript keywords and constructs
  - Pipe operator auto-completion
  - Common pipe function suggestions
- 🔧 Built-in commands
  - Compile file to TypeScript (`Ctrl+Shift+C`)
  - Run Britescript files (`Ctrl+Shift+R`)
  - Build entire projects (`Ctrl+Shift+B`)
  - Create new Britescript files with templates
- 📦 Comprehensive code snippets
  - Struct, trait, and impl snippets
  - Pipe operation patterns
  - Generic type definitions
  - Function templates
- 🎨 Custom themes
  - Britescript Dark theme
  - Britescript Light theme
- 🎯 Beautiful icons
  - Lightbulb icons with "b" branding
  - Consistent light/dark theme support
- ⚙️ Configuration options
  - Auto-compile on save
  - Custom CLI executable path
  - Show compiled output toggle
  - Format on save support
- 🔍 Language features
  - Hover information for keywords
  - Smart bracket matching
  - Code folding support
  - Auto-indentation rules
- 🎯 Project integration
  - Workspace-aware operations
  - Integration with `brite` CLI
  - Support for `bunfig.toml` configuration
  - Context menu actions for .bs files

### Technical Details
- Built with TypeScript and VS Code Extension API
- Supports VS Code 1.75.0 and higher (automatic activation events)
- Uses Bun for all build scripts and development workflow
- Includes comprehensive TextMate grammar for syntax highlighting
- Provides formatting, completion, and hover providers
- Integrates with external Britescript CLI for compilation

### Coming Soon
- Enhanced diagnostics and error reporting
- Advanced code formatting
- Refactoring support
- Debugging integration
- IntelliSense for Britescript libraries