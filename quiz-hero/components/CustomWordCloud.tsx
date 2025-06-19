"use client";

import D3WordCloud from "react-d3-cloud";

export default function CustomWordCloud() {
  const data = [
    { text: "React", value: 100 },
    { text: "JavaScript", value: 80 },
    { text: "Frontend", value: 60 },
    { text: "WordCloud", value: 70 },
    { text: "D3", value: 50 },
    { text: "Visualization", value: 40 },
    { text: "UI", value: 30 },
    { text: "HTML", value: 35 },
    { text: "CSS", value: 25 },
    { text: "Node", value: 45 },
    { text: "Web", value: 65 },
    { text: "OpenAI", value: 20 },
    { text: "Code", value: 55 },
    { text: "npm", value: 15 },
    { text: "GitHub", value: 33 },
    { text: "Developer", value: 48 },
    { text: "Tech", value: 38 },
    { text: "QuizHero", value: 10 },
  ];

  const fontSizeMapper = (word: { value: number }) =>
    Math.log2(word.value) * 5 + 16;

  return (
    <D3WordCloud
      height={550}
      data={data}
      font="Times"
      fontSize={fontSizeMapper}
      rotate={0}
      padding={10}
    />
  );
}
