import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown";
import "codemirror/addon/selection/mark-selection";
import "../lib/markdoc.js";
import "../lib/style.css";

import React, { useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";

import { FieldExtensionSDK } from "@contentful/app-sdk";
import { useFieldValue, useSDK } from "@contentful/react-apps-toolkit";

import useMarkdocCode from "../lib/useMarkdocCode";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const [jsonValue, setValue] = useFieldValue<any>(
    sdk.ids.field,
    sdk.field.locale
  );

  const { ast, content, config, errors } = useMarkdocCode(
    jsonValue ? jsonValue.raw : jsonValue || ""
  );

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, []);

  const onBeforeChange = React.useCallback(
    (editor: any, meta: any, code: string) =>
      setValue({
        raw: code,
        ast,
        renderableTree: content,
      }),
    []
  );

  return (
    <>
      <CodeMirror
        onBeforeChange={onBeforeChange}
        value={jsonValue ? jsonValue.raw : jsonValue}
        options={{
          mode: "markdoc",
          lineNumbers: true,
          lineWrapping: true,
          styleSelectedText: true,
          theme: "material",
        }}
      />
      {/* <pre>{JSON.stringify(jsonValue, null, 0)}</pre> */}
    </>
  );
};

export default Field;
