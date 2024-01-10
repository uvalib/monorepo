import {
  BasePromptTemplate,
  BaseStringPromptTemplate,
  renderTemplate
} from "langchain/prompts";

export class CustomPromptTemplateForLibrary extends BaseStringPromptTemplate {
  constructor(args) {
    super({ inputVariables: args.inputVariables });
    this.template = args.template;
    this.tools = args.tools;
  }

  format(input) {
    const intermediateSteps = input.intermediate_steps;
    const agentScratchpad = intermediateSteps.reduce(
      (thoughts, { action, observation }) =>
        `${thoughts}${action.log}\nObservation: ${observation}\nThought:\n`,
      ""
    );
    input["agent_scratchpad"] = agentScratchpad;

    const toolStrings = this.tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join("\n");
    input["tools"] = toolStrings;

    const toolNames = this.tools.map((tool) => tool.name).join("\n");
    input["tool_names"] = toolNames;

    const newInput = { ...input };
    return Promise.resolve(renderTemplate(this.template, "f-string", newInput));
  }

  partial(_values) {
    throw new Error("Method not implemented.");
  }

  _getPromptType() {
    return "custom_prompt_template_for_library";
  }

  serialize() {
    throw new Error("Not implemented");
  }
}
