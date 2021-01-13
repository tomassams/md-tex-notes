# md-tex-notes

A note-taking workflow combining writing quick and easy Markdown notes with a LaTeX look and feel.

## setup

- node
- pandoc
- texlive
- vscode + pandoc citer plugin + pandoc markdown preview

## usage

Markdown is placed in the `markdown` folder, while the compiled pdfs are put in the `pdf` folder.  
The scripts support nested folders and will maintain the same folder structure between the two.

To compile everything in the markdown folder:

```sh
npm run build
```

To watch for changes and auto-compile on file save:

```sh
npm run watch
```

TeX Live supports hot-reloading the PDF when it changes:
```sh
texworks filename.pdf
```
