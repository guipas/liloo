import { string } from "@oclif/command/lib/flags";

export default function cleanString (str: string) {
  const replacements: [string | RegExp, string][] = [
    [/\n+$/, ''],
    // ['\\033c', '']
  ];

  let cleanedString = str.toString();
  for (const replacement of replacements) {
    cleanedString = cleanedString.replace(...replacement);
  }

  return cleanedString;
}