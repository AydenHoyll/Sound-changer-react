import React from "react";
import { Typography } from "antd";

export const HelpPage = () => {
  return (
    <>
      <Typography.Title level={2}>Help</Typography.Title>
      <Typography.Paragraph className="pb-5 contacts">
        <Typography.Title level={3}>How to write rules: </Typography.Title>
        <Typography.Text className="contacts">
          <ul>
            <li>
              General pattern for the rules is target/replacement/environment
            </li>
          </ul>
          However, there are categories where one can establish their own
          variable such as CC=ck (consonant cluster), so we may have the
          following rule:
          <br />
          a/e/_CC which means a turns into e before consonant cluster CC,
          <br />
          For instance, <strong>Jacke => Jecke</strong>
          <br />
          One can do as many variables as they please with a limitation that
          variables name has to be a letter (or two letters)
          <br />
          Let's review the default categories:
          <ul>
            <li>V=aeiou - stands for vowels </li>
            <li> L=āēīōū - stands for shortened vowels</li>
            <li>C=ptcqbdgmnlrhs defines the consonants used in the language</li>
            <li> S=ptc defines voiceless stops</li>
            <li> Z=bdg defines voiced stops</li>
          </ul>
        </Typography.Text>
      </Typography.Paragraph>

      <Typography.Paragraph className="pb-5">
        <Typography.Title level={3}>Upload/Download</Typography.Title>
        <Typography.Text className="contacts">
          You can upload .txt files with words <br /> <strong>Note:</strong>to
          avoid errors each word in the file should start with a new line
        </Typography.Text>
      </Typography.Paragraph>

      <Typography.Paragraph className="pb-5">
        <Typography.Title level={3}>Short cut for rules:</Typography.Title>
        <Typography.Text className="contacts">
          There always must be an environment for the correct work of this app.
          If you want the change to be unconditional just leave an underline_
          <ul>
            <li>
              Metathesis: nt/\\/_ (nt is the cluster being changed _ signifies
              environment)
            </li>
            <li>
              Epenthesis: /j/_kt (j is what is inserted) and _kt is the
              environment
            </li>
            <li>Standard replacement a/o/_e (a changes to o before e)</li>
            <li>
              Grouped categories Nonce categories can be defined either in the
              target (first part of the rule) or environment (last part), by
              enclosing the alternatives within brackets. Examples:
              <br />
              k/s/_[ie] k is changed to s before i or e
            </li>
            <li>
              Deletion: s//_# (s is deleted at the end of the word), likewise
              s//_ s is deleted everywhere
            </li>
          </ul>
        </Typography.Text>
      </Typography.Paragraph>
    </>
  );
};
