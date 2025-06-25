# Configuración del Editor

## Visual Studio Code

### Extensiones Recomendadas

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-eslint",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### Configuración de Workspace

```json
{
  "typescript.preferences.quoteStyle": "single",
  "typescript.preferences.semicolons": "remove",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  }
}
```

## WebStorm/IntelliJ IDEA

### Configuración de Prettier

1. Go to `File` → `Settings` → `Languages & Frameworks` → `JavaScript` → `Prettier`
2. Set Prettier package path to `node_modules/prettier`
3. Check "On save" and "On code reformat"

### Configuración de ESLint

1. Go to `File` → `Settings` → `Languages & Frameworks` → `JavaScript` → `Code Quality Tools` → `ESLint`
2. Select "Automatic ESLint configuration"
3. Check "Run eslint --fix on save"

## Vim/Neovim

### Plugins Recomendados

```lua
-- init.lua
require('packer').startup(function(use)
  use 'jose-elias-alvarez/null-ls.nvim'
  use 'MunifTanjim/prettier.nvim'
  use 'mfussenegger/nvim-lint'
  use 'nvim-treesitter/nvim-treesitter'
end)
```

### Configuración de Prettier

```lua
local prettier = require("prettier")

prettier.setup({
  bin = 'prettier',
  filetypes = {
    "css", "graphql", "html", "javascript", "javascriptreact",
    "json", "less", "markdown", "scss", "typescript", "typescriptreact",
    "yaml",
  },
})
```

## Configuración General

### EditorConfig

```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2
```

### Git Hooks

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn lint-staged

# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

yarn commitlint --edit $1
```
