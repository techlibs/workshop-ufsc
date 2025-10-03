# Creating a mastra workflow requirement collector agent

This request is part of a larger workflow: a meta-agent workflow.

A meta-agent is an AI agent written using mastra framework that creates other mastra based workflows.

## Your task's description

Create a mastra workflow that will work as a requirement collector, which is an AI agent that gather enough information to create a mastra based workflow.

A requirements collector workflow consists in:

1. User inputs a query, asking an agent to create a workflow.
2. The inputs gets evaluated against a list of requirements needed to be filled in order to design the desired workflow.
3. If there are requirements left to be filled, and agent will ask questions to user in order to fill the requirements, one question at a time, for each left blank requirement.
4. When the agent gather enough information for fill all requirements, the interview ends.
5. Then the workflow outputs a JSON structured requirements that will later be used to write the desired mastra code.

## Expected features

- Real web search for context gathering.
- Mastra mcp server and calls to mastra mcp server for mastra specific context.
- Three step based workflow: 1. interview start, where query is analyzed to see how many requirements it fills; 2. an interview process, using multi-turn and human-in-the-loop mastra concepts to keep interview going until all requirements are filled, in which you must use suspend and resume concepts; 3. interview end, returning the structured requirements and all necessary metadata, like contexts from web search results and mastra based guides.
- Text cleaning and parsing for web search results.
- System of agents: agent-as-a-judge, context retriever, user interviewer.
- RAG for reducing context windows and filter information.

## Naming pattern

Name specific features and files for this project with a starting meta-agent-*, since this will further grow to include other workflow features, like plan designer and workflow developer.

Put the core of the requirements collect feature un src/mastra/domains/meta-agent/requirements-collector

## Development process

- Always proceed as instructed in [agents.md](../../../../../mastra-ufsc-server/agents.md).
- Use web search tools to find out how to implement a real web search engine using typescript.
- Consult mastra mcp server in every stage of development.
- 