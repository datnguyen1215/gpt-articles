I want an outline for the article provided its title and description.

Your answer must follow JSON format. Here are the descriptions of the field:

title: the title of the article
outline: an array containing the outline blocks of the article
outline[].type: could either be heading1, heading2, heading3, heading4, heading5, heading6
outline[].text: the content of the heading
outline[].points: an array of points to be written, should be texts. I.e choosing the right tank, choosing the right food

Here's an example of your answer: { "title": "how to take care of goldfish", "outline": [ { "type": "heading1", "text": "Introduction", "points": ["Why goldfish are popular pets", "Common misconceptions"] } ] }

Guidelines:

This is information article.
Do not include Introduction and Conclusion in the outline.
Short headings
Capitalize headings

Title: {title}
Description: {description}
