import React from 'react';
import Markdoc from '@markdoc/markdoc';

const BASE_FRONTMATTER = { markdoc: { title: '' } };


export default function useMarkdocCode(code: string) {
    const ast = React.useMemo(() => Markdoc.parse(code), [code]);
  
    const config = React.useMemo(() => {
      // require here to prevent Webpack Promise issue
      const yaml = require('js-yaml');
  
      let frontmatter = BASE_FRONTMATTER;
      try {
        if (ast.attributes.frontmatter) {
          frontmatter = yaml.load(ast.attributes.frontmatter);
        }
      } catch (error) {
        // pass
      }
  
      return {
        variables: {
          markdoc: {
            frontmatter: frontmatter || BASE_FRONTMATTER
          },
          invalid_code: `\n{% callout %}\nHere!\n`
        },
      };
    }, [ast]);
  
    const content = React.useMemo(
      () => Markdoc.transform(ast, config),
      [ast, config]
    );
  
    const errors = React.useMemo(
      () => Markdoc.validate(ast, config),
      [ast, config]
    );
  
    return { ast, content, config, errors };
  }