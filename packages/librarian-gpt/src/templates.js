/**
 * Define a Custom Prompt Template for Library Context
 */
import {
    BasePromptTemplate,
    BaseStringPromptTemplate,
    SerializedBasePromptTemplate,
    StringPromptValue,
    renderTemplate,
  } from "langchain/prompts";
  import { AgentStep, InputValues, PartialValues } from "langchain/schema";
  import { Tool } from "langchain/tools";
  
  export class CustomPromptTemplateForLibrary extends BaseStringPromptTemplate {
    // The template to use
    template: string;
    // The list of library tools available
    tools: Tool[];
  
    constructor(args: {
      tools: Tool[];
      inputVariables: string[];
      template: string;
    }) {
      super({ inputVariables: args.inputVariables });
      this.tools = args.tools;
      this.template = args.template;
    }
  
    format(input: InputValues): Promise<string> {
      // Format intermediate steps
      const intermediateSteps = input.intermediate_steps as AgentStep[];
      const agentScratchpad = intermediateSteps.reduce(
        (thoughts, { action, observation }) =>
          thoughts +
          [action.log, `\nObservation: ${observation}`, "Thought:"].join("\n"),
        ""
      );
      input["agent_scratchpad"] = agentScratchpad;
  
      // Create a tools variable from the list of library tools
      const toolStrings = this.tools
        .map((tool) => `${tool.name}: ${tool.description}`)
        .join("\n");
      input["tools"] = toolStrings;
      // Create a list of tool names
      const toolNames = this.tools.map((tool) => tool.name).join("\n");
      input["tool_names"] = toolNames;
      
      const newInput = { ...input };
      /** Format the template. */
      return Promise.resolve(renderTemplate(this.template, "f-string", newInput));
    }
    partial(
      _values: PartialValues
    ): Promise<BasePromptTemplate<any, StringPromptValue, any>> {
      throw new Error("Method not implemented.");
    }
  
    _getPromptType(): string {
      return "custom_prompt_template_for_library";
    }
  
    serialize(): SerializedBasePromptTemplate {
      throw new Error("Not implemented");
    }
  }
  