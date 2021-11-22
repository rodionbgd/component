export default class TemplateManager {
  // eslint-disable-next-line class-methods-use-this
  replaceCondition(
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

  replaceLoopVariables(
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
      template = this.replaceCondition(
        template,
        item[0],
        currentIndex,
        item[1]
      );
    });
    const indexRegex = /{{if (\w+)?Index (\d+)}}(.+?){{endif}}/g;
    template.replace(indexRegex, (templateMatch, groupValue1, groupValue2) => {
      template = this.replaceCondition(
        template,
        /{{if (\w+)?Index \w+}}(.+?){{endif}}/g,
        currentIndex,
        Number(groupValue2)
      );
      return template;
    });
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

  replaceVariablesValues(templateIn: string, data: any) {
    let template = templateIn;
    template = this.removeNewLine(template);
    template = template.replace(
      /{{if (\w+)}}(.+?){{endif}}/g,
      (templateMatch, groupValue1, groupValue2) => {
        if (Object.hasOwnProperty.call(data, groupValue1)) {
          return this.replaceVariablesValues(groupValue2, data);
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

  // eslint-disable-next-line class-methods-use-this
  removeNewLine(template: string) {
    return template.replace(/(\n)/g, () => "");
  }

  replaceLoops(templateIn: string, data: any) {
    let template = templateIn;
    template = this.removeNewLine(template);
    return template.replace(
      /{{for (\w+) as (\w+)}}(.+?){{endfor}}/g,
      (templateMatch, prop, propAlias, subTuple) => {
        let outputString = "";
        data[prop].forEach((item: any, i: number) => {
          outputString += this.replaceLoopVariables(
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
}
