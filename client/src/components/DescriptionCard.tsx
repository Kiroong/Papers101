import * as d3 from "d3";
import { Card, CardBody, Text } from "grommet";
import React from "react";

interface Props {
  description: string;
  tagColors: { [tag: string]: string };
}

const DescriptionCard: React.FC<Props> = ({ description, tagColors }) => {
  let marked = description;
  const tags = Object.keys(tagColors);
  const DELIM0 = "<DELIM0>";
  const DELIM1 = "<DELIM1>";
  tags.forEach((tag) => {
    marked = marked.replace(
      new RegExp(tag, "g"),
      `${DELIM0}${DELIM1}${tag}${DELIM0}`
    );
  });
  const tokens = marked.split(DELIM0).filter((t) => t.length);
  return (
    <Text as="p" wordBreak="break-all">
      {tokens.map((token, i) =>
        token.startsWith(DELIM1) ? (
          <Text
            key={i}
            as="span"
            style={{
              backgroundColor: d3
                .color(tagColors[token.slice(DELIM1.length)])
                ?.brighter().brighter() as any,
            }}
          >
            {token.slice(DELIM1.length)}
          </Text>
        ) : (
          <Text key={i} as="span">
            {token}
          </Text>
        )
      )}
    </Text>
  );
};

export default DescriptionCard;
