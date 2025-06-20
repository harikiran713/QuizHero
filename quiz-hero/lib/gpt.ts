import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category = "",
  output_value_only = false,
  model = "gpt-3.5-turbo",
  temperature = 1,
  num_tries = 3,
  verbose = false
): Promise<any> {
  const isListInput = Array.isArray(user_prompt);
  const hasDynamicElements = /<.*?>/.test(JSON.stringify(output_format));
  const hasListOutput = /\[.*?\]/.test(JSON.stringify(output_format));

  let errorMsg = "";

  for (let attempt = 1; attempt <= num_tries; attempt++) {
    let outputFormatPrompt = `\nYou are to output ${
      hasListOutput ? "an array of objects in" : ""
    } the following in JSON format: ${JSON.stringify(output_format)}.\nDo not put quotation marks or escape character \\ in the output fields.`;

    if (hasListOutput) {
      outputFormatPrompt += `\nIf an output field is a list, classify output into the best element.`;
    }

    if (hasDynamicElements) {
      outputFormatPrompt += `\nText enclosed in < and > indicates content you must generate. Example input: Go to <location>. Example output: Go to the garden.\nFor keys like {'<location>': 'desc'}, replace <location> with actual value: {school: 'desc'}.`;
    }

    if (isListInput) {
      outputFormatPrompt += `\nGenerate an array of JSON, one per input.`;
    }

    try {
      const response = await openai.createChatCompletion({
        temperature,
        model,
        messages: [
          {
            role: "system",
            content: system_prompt + outputFormatPrompt + errorMsg,
          },
          {
            role: "user",
            content: isListInput ? JSON.stringify(user_prompt) : String(user_prompt),
          },
        ],
      });

      let rawOutput = response.data.choices[0].message?.content ?? "";

      // Replace single quotes with double quotes safely
      rawOutput = rawOutput.replace(/'/g, '"');

      // Fix improperly escaped content without replacing valid quotation
      rawOutput = rawOutput.replace(/(\w)"(\w)/g, "$1'$2");

      if (verbose) {
        console.log("---- Prompt Sent to OpenAI ----");
        console.log(system_prompt + outputFormatPrompt + errorMsg);
        console.log("\nUser prompt:", user_prompt);
        console.log("\nGPT raw response:", rawOutput);
      }

      let parsedOutput = JSON.parse(rawOutput);

      // Normalize to list for processing
      if (!Array.isArray(parsedOutput)) {
        parsedOutput = [parsedOutput];
      }

      // Validate each output item
      for (let i = 0; i < parsedOutput.length; i++) {
        const item = parsedOutput[i];

        for (const key in output_format) {
          if (/<.*?>/.test(key)) continue;

          if (!(key in item)) {
            throw new Error(`Missing key '${key}' in output object`);
          }

          if (Array.isArray(output_format[key])) {
            const allowed = output_format[key] as string[];

            // Auto-correct output if it is a list
            if (Array.isArray(item[key])) {
              item[key] = item[key][0];
            }

            if (!allowed.includes(item[key]) && default_category) {
              item[key] = default_category;
            }

            if (typeof item[key] === "string" && item[key].includes(":")) {
              item[key] = item[key].split(":")[0];
            }
          }
        }

        // Output only the values if needed
        if (output_value_only) {
          parsedOutput[i] = Object.values(item);
          if (parsedOutput[i].length === 1) {
            parsedOutput[i] = parsedOutput[i][0];
          }
        }
      }

      return isListInput ? parsedOutput : parsedOutput[0];
    } catch (err) {
      errorMsg = `\n\nPrevious Result: ${errorMsg}\nGPT Output: ${err instanceof Error ? err.message : String(err)}`;
      console.error(`Attempt ${attempt} failed with error:\n`, err);
    }
  }

  console.warn("All attempts failed. Returning empty array.");
  return [];
}
