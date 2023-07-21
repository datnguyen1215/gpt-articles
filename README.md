# Overview

Simple article generator using GPT.

It will:

1. Generate outline
1. Separate the outlines into multiple sections
1. Generate the sections
1. Generate the FAQs
1. Write the content to `articles/<title>.md`

## Usage

```
npm start
```

#### Parameters

`--title` - The title of the article to generate.

#### Environmental Variables

`OPENAI_KEY` - Your OpenAI API key generated from OpenAI.
