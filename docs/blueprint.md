# **App Name**: New TikTok Pixel

## Core Features:

- OAuth Configuration: Input fields for TikTok OAuth configuration: Client Key, Client Secret, Redirect URI, Scope, and State.
- Authorization URL Generation: Generates the TikTok authorization URL using the input parameters and directs the user to it.
- Authorization Code Input: An input field for pasting the Authorization Code obtained after user authorization.
- Access Token Retrieval: Exchanges the Authorization Code for an Access Token via a POST request to TikTok API.
- Pixel Creation Input: Input fields for Advertiser ID and Pixel Name for creating a TikTok Pixel.
- Pixel Creation: Creates a TikTok Pixel using the provided Advertiser ID and Pixel Name via POST request and displays the Pixel ID.

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to reflect the tech-forward nature of API integration and automation.
- Background color: A light, desaturated blue (#E5F6FD) to provide a clean and calming backdrop, ensuring readability and focus on input fields and data.
- Accent color: A contrasting orange (#F07E34) for interactive elements like buttons and links, drawing the user's attention to key actions.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text to offer a modern, clean, and easily readable interface. The typeface should evoke the high-tech API connections which are being automated.
- Use clear, simple icons to represent different actions, such as generating the URL or creating the pixel. The icon set should be designed with consistent styling to align with the overall visual theme of the application.
- A clear and intuitive layout with logical grouping of input fields and action buttons. Use distinct sections for OAuth configuration, authorization process, and pixel creation to guide the user through the workflow step by step.
- Subtle animations on button clicks and data loading to provide feedback and enhance the user experience.