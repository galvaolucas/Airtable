# Airtable Timeline Component

## What I Like About the Implementation

I believe the core logic is solid, and the component effectively fulfills the desired functionality. It offers a clean, interactive timeline experience with intuitive zooming and inline editing features.

## What I Would Change If I Were to Do It Again / Design Decisions

If I were to revisit this project, I would pay closer attention to the design details. For inspiration, I looked at some Dribbble layouts—particularly this one:  
[Teamwork.com Project Timeline View](https://dribbble.com/shots/25439137-Teamwork-com-Project-Timeline-View)

From a code perspective, I would better separate the logic and helper functions (like date parsing and calculations) for improved maintainability and clarity and also focus on responsiveness.

I focused on implementing the features that could be delivered in the available time: zooming in and out, and the ability to edit timeline items inline. However, very short items don’t yet handle text display well. For these, I would consider adding a modal or popup to display the full content, which I couldn’t implement due to time constraints.

## How I Would Test This If I Had More Time

I would write unit tests to verify lane assignments and ensure that all items, dates, and content render correctly on screen. Additionally, I’d create interaction tests for the zoom buttons to confirm the horizontal scrollbar appears and functions properly, making sure content remains visible and accessible.
ms are on the screen (dates and content). Also click on the zoom buttons and check if the x scroll appears and the content can be scrolled and still be visible.
