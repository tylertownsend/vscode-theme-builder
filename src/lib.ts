import * as fs from 'fs-extra';
import * as path from 'path';


export function create(type: 'style' | 'palette' | 'all') {
  switch (type) {
    case 'style':
      fs.copySync(path.join(__dirname, 'templates/style'), path.join(process.cwd(), 'style/'));
      break;
    case 'palette':
      fs.copySync(path.join(__dirname, 'templates/palette'), path.join(process.cwd(), 'palette/'));
      break;
    default:
      fs.copySync(path.join(__dirname, 'templates/'), process.cwd(), { recursive: true });
  }
}

export function build(palette: any, style: any, name: string, outDir: string, variant?: 'light' | 'dark') {
  ['light', 'dark'].forEach(v => {
    if (variant === undefined || v === variant) {
      const theme = style.createTheme(palette, v);
      const outputPath = path.join(outDir, `${name.toLocaleLowerCase().replace(/\s+/, "-")}-${v}.json`);
      fs.ensureFileSync(outputPath);
      fs.writeJSONSync(outputPath,
        {
          name,
          type: v,
          colors: theme.colors,
          tokenColors: theme.tokenColors,
          semanticHighlighting: theme.semanticHighlighting
        },
        { spaces: 2 }
      );
    }
  });
}

export function printUsage() {
  const indent = (str: string, spaces: number = 8) => ' '.repeat(spaces) + str;
  const usageString = 'Usage: vsctb [--help][command]<options>\n'
    + '\n**To get started quickly, run the prompt by typing only vsctb **\n'
    + '\nThese are the basic commands to run vsctb\n';

  const newCommandString = indent('\n[new]: Create new templates for the theme generator\n', 4)
    + indent('-a --all: (boolean) Generate both the default style and palette templates\n')
    + indent('-s, --style: (boolean) Generate a new style template\n')
    + indent('-p --palette: (boolean) Generate a new palette template\n');

  const createCommandString = indent('\n[create]: Generate new theme\n', 4)
    + indent('-s, --style: (string) The provided style. Can either be a path or a module name\n')
    + indent('-p, --palette: (string) The provided palette. Can either be a path or a module name\n')
    + indent('-n, --name: (string) The name of the generated theme. By default it is the name of the current working directory\n')
    + indent('-v, --variant: (string) Variant of the style. Default is none if only one exists\n')
    + indent('-o, --output: (string) The output directory of the generated theme. Default is "theme" in cwd')

  const outputString = usageString + newCommandString + createCommandString;
  console.log(outputString);
}