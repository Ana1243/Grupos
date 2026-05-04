# Reuniões Semanais — Guia de instalação

## O que vais ter no final
- **index.html** → página pública (formulário para alunos, acedida via QR code)
- **admin.html** → painel privado com password (só para organizadores)
- Dados guardados automaticamente numa folha Google Sheets

---

## Passo 1 — Criar a base de dados (Google Sheets + Apps Script)

1. Vai a **sheets.google.com** e cria uma folha nova (pode ter qualquer nome)
2. No menu superior: **Extensões → Apps Script**
3. Apaga tudo o que está no editor e cola o conteúdo do ficheiro `apps-script.gs`
4. Clica em **Guardar** (ícone de disquete)
5. Clica em **Implementar → Nova implementação**
6. Em "Tipo": seleciona **Web app**
7. Em "Executar como": **Eu**
8. Em "Quem tem acesso": **Qualquer pessoa**
9. Clica em **Implementar**
10. Copia o **URL da web app** que aparece (algo como `https://script.google.com/macros/s/XXXX/exec`)

---

## Passo 2 — Configurar os ficheiros HTML

### No ficheiro `index.html`:
- Procura a linha: `const SCRIPT_URL = 'COLE_AQUI_O_URL_DO_APPS_SCRIPT';`
- Substitui `COLE_AQUI_O_URL_DO_APPS_SCRIPT` pelo URL copiado no Passo 1

### No ficheiro `admin.html`:
- Procura: `const ADMIN_PASSWORD = 'DEFINE_AQUI_A_TUA_PASSWORD';`
- Define uma password à tua escolha (ex: `'reunioes2025'`)
- Procura: `const SHEET_URL = 'COLE_AQUI_O_URL_DO_APPS_SCRIPT';`
- Cola o mesmo URL do Apps Script

---

## Passo 3 — Publicar no GitHub Pages (grátis, para sempre)

1. Cria uma conta em **github.com** (grátis)
2. Clica em **New repository** (botão verde)
3. Dá um nome (ex: `reunioes-semanais`)
4. Seleciona **Public**
5. Clica em **Create repository**
6. Clica em **uploading an existing file**
7. Arrasta os ficheiros `index.html` e `admin.html`
8. Clica em **Commit changes**
9. Vai a **Settings → Pages**
10. Em "Source": seleciona **Deploy from a branch → main → / (root)**
11. Clica em **Save**

Após ~1 minuto, a tua página estará em:
```
https://SEU_UTILIZADOR.github.io/NOME_DO_REPO/
```

O painel admin estará em:
```
https://SEU_UTILIZADOR.github.io/NOME_DO_REPO/admin.html
```

---

## Passo 4 — Criar o QR Code

1. Vai a **qr-code-generator.com** (ou qualquer gerador grátis)
2. Cola o URL do teu `index.html` no GitHub Pages
3. Descarrega o QR code como PNG ou SVG
4. Imprime e coloca onde quiseres!

---

## Resumo dos URLs

| Página | Link |
|--------|------|
| Formulário (alunos) | `https://SEU_UTILIZADOR.github.io/NOME_DO_REPO/` |
| Painel admin | `https://SEU_UTILIZADOR.github.io/NOME_DO_REPO/admin.html` |
| Google Sheets | Abre diretamente no teu Google Drive |

---

## Notas importantes

- Os dados são guardados **instantaneamente** no Google Sheets quando alguém submete
- Podes ver os dados no Sheets **e** no painel admin (atualiza a página para ver novos)
- O CSV exportado abre no Excel ou Google Sheets
- A password do admin está no código HTML — não é ultra-segura, mas serve perfeitamente para este uso
- Não há custos de alojamento — GitHub Pages e Google são gratuitos
