import { Highlight } from 'prism-react-renderer';
import React, { FC } from 'react';
import PrismCore from 'react-prism-editor';
import { useApp } from '../contexts/app';
//import vsDark from 'prism-react-renderer/themes/vsDark';
//import vsLigth from 'prism-react-renderer/themes/vsLight';
import Prism from 'prismjs/components/prism-core';

export interface EditorProps {
  id?: string
  value: string;
  language?: string;
  readonly: boolean;
  width?: number;
  height?: number;
  onChange?: (value: string) => void;
}

const Editor: FC<EditorProps> = (props) => {
  const { id, value, language, readonly, width, height, onChange } = props;
  const app = useApp();

  let theme = 'default';
  //let highlightTheme = vsLigth;
  if (app.theme === 'dark') {
    theme = 'tomorrow';
    //highlightTheme = vsDark;
  } else if (app.theme === 'sepia') {
    theme = 'solarizedlight';
    //highlightTheme = vsLigth;
  }

  //quick fix :
  //need to remove :
  // - this part
  // - prism-react-renderer dependency
  // - dev @types/prismjs dependency
  //as ReactPrismEditor has a css gutter issue when lineNumber = false
  //cf https://github.com/lumia2046/react-prism-editor/pull/9
  if(readonly === true) {
    return (
      <Highlight
        prism={Prism}
        code={value}
        language="jsx"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    )
  }

  return (
    <PrismCore
      id={id}
      style={{
        height: height ? height + 'px' : '100%',
        width: width ? width + 'px' : '100%',
      }}
      language={language ?? 'html'}
      theme={theme}
      code={value}
      lineNumber={/*readonly !== true && */language && language !== 'html'}
      readOnly={/*readonly === true*/ false}
      clipboard={false}
      changeCode={(value: string) => {
        onChange?.(value);
      }}
    />
  );
};

export default Editor;
