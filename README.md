# AI Summarizer Plugin for Vencord

## Description
The AI Summarizer plugin uses Chrome's local AI (window.ai) to summarize Discord messages. It adds a "Summarize" button to messages, which when clicked, generates a concise summary of the message content.

## Disclaimer
This uses a local API so no network requests are made from this.
This plugin only works on the web currently with a chrome dev browser.

## How It Works
1. The plugin integrates with Chrome's local AI API (window.ai).
2. When you click the "Summarize" button on a message, the plugin sends the message content to the AI.
3. The AI processes the message and returns a summarized version.
4. The summary appears as gray text below the original message.

## Enabling window.ai
To use this plugin, you need to enable and set up window.ai in Chrome:

1. Download and install [Chrome Dev](https://www.google.com/chrome/dev/) (development version).
2. Go to `chrome://flags` in your browser.
3. Enable "Prompt API for Gemini Nano".
4. Enable "Enables optimization guide on device" with "ByPassPerfRequirement".
5. Go to `chrome://components` and update "Optimization Guide On Device Model" (approximately 1.5GB).
6. Restart Chrome if needed until all components are visible and updated.

## Plugin Settings
You can customize the summarization prompt in the plugin settings:

1. Open Vencord settings.
2. Navigate to the AI Summarizer plugin settings.
3. Modify the "Custom prompt" field to change how the AI summarizes messages.

## Installation
To install this custom plugin in Vencord, please follow the instructions in the [Vencord documentation for custom plugins](https://docs.vencord.dev/installing/custom-plugins/).

## Troubleshooting
If you see a message saying "AI service is not available" when trying to summarize, make sure you've followed the "Enabling window.ai" steps above. If issues persist, try restarting your browser or checking for updates to Chrome Dev.

## Plans
I am working on aother plugin called "AITools" which will have many other AI tools. As well as making this plugin work on the Desktop app instead of only in browser.