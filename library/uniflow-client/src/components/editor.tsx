import React, { FC } from 'react';
import ReactPrismEditor from 'react-prism-editor';
import { useApp } from '../contexts/app';

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
  if (app.theme === 'dark') {
    theme = 'tomorrow';
  } else if (app.theme === 'sepia') {
    theme = 'solarizedlight';
  }

  return (
    <ReactPrismEditor
      id={id}
      style={{
        height: height ? height + 'px' : '100%',
        width: width ? width + 'px' : '100%',
      }}
      language={language ?? 'html'}
      theme={theme}
      code={value}
      lineNumber={readonly !== true && language && language !== 'html'}
      readOnly={readonly === true}
      clipboard={false}
      changeCode={(value: string) => {
        onChange?.(value);
      }}
    />
  );
};

export default Editor;
