export default function TemplateManager() {
  function replaceCondition(
    template: string,
    regex: RegExp,
    currentIndex: number,
    conditionIndex: number
  ) {
    return template.replace(
      regex,
      (templateMatch, groupValue1, groupValue2) => {
        if (
          (currentIndex === conditionIndex &&
            groupValue1 &&
            groupValue1.toLowerCase() === "not") ||
          (!groupValue1 && currentIndex !== conditionIndex)
        ) {
          return "";
        }
        return groupValue2;
      }
    );
  }

  function replaceLoopVariables(
    templateIn: string,
    data: any,
    prop: string,
    currentIndex: number,
    length: number
  ) {
    if (!prop || currentIndex === undefined || !length) {
      return "";
    }
    let template = templateIn;
    const regexArr: [RegExp, number][] = [
      [/{{if (\w+)?IsLast}}(.+?){{endif}}/g, length - 1],
      [/{{if (\w+)?IsFirst}}(.+?){{endif}}/g, 0],
    ];
    regexArr.forEach((item) => {
      template = replaceCondition(template, item[0], currentIndex, item[1]);
    });
    const indexRegex = /{{if (\w+)?Index (\d+)}}(.+?){{endif}}/g;
    template.replace(indexRegex, (templateMatch, groupValue1, groupValue2) => {
      template = replaceCondition(
        template,
        /{{if (\w+)?Index \w+}}(.+?){{endif}}/g,
        currentIndex,
        Number(groupValue2)
      );
      return template;
    });
    if (typeof data !== "object") {
      return template.replace(
        /{{(\w+)}}/g,
        (templateMatch, groupValue1, groupValue) => {
          if (groupValue) {
            return data;
          }
          return "";
        }
      );
    }
    return template.replace(
      /{{(\w+)[.](\w+)}}/g,
      (templateMatch, groupValue1, groupValue2) => {
        if (groupValue1 !== prop) {
          return "";
        }
        if (Object.hasOwnProperty.call(data, groupValue2)) {
          return data[groupValue2];
        }
        return "";
      }
    );
  }

  function removeNewLine(template: string) {
    return template.replace(/(\n)/g, () => "");
  }

  function replaceLoops(templateIn: string, data: any) {
    let template = templateIn;
    template = removeNewLine(template);
    return template.replace(
      /{{for (\w+) as (\w+)}}(.+?){{endfor}}/g,
      (templateMatch, prop, propAlias, subTuple) => {
        let outputString = "";
        data[prop].forEach((item: any, i: number) => {
          outputString += replaceLoopVariables(
            subTuple,
            item,
            propAlias,
            i,
            data[prop].length
          );
        });
        return outputString;
      }
    );
  }

  function renderTemplate(templateIn: string, data: any) {
    let template = replaceLoops(templateIn, data);
    template = removeNewLine(template);
    template = template.replace(
      /{{if (\w+)}}(.+?){{endif}}/g,
      (templateMatch, groupValue1, groupValue2) => {
        if (Object.hasOwnProperty.call(data, groupValue1)) {
          return renderTemplate(groupValue2, data);
        }
        return "";
      }
    );
    return template.replace(/{{(\w+)}}/g, (templateMatch, groupValue) => {
      if (Object.hasOwnProperty.call(data, groupValue)) {
        return data[groupValue];
      }
      return "";
    });
  }

  return {
    renderTemplate,
    replaceLoops,
    replaceLoopVariables,
  };
}
